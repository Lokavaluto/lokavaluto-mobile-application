import { TextField } from '@nativescript-community/ui-material-textfield';
import { Component, Prop } from 'vue-property-decorator';
import { $tc } from '../helpers/locale';
import { Benificiary, ProfileEvent, ProfileEventData, Roles, User } from '../services/AuthService';
import { backgroundColor, colorPrimary, subtitleColor, textColor } from '../variables';
import PageComponent from './PageComponent';

interface Recipient extends User {}

@Component({})
export default class UserPicker extends PageComponent {
    backgroundColor = backgroundColor;
    subtitleColor = subtitleColor;
    textColor = textColor;
    colorPrimary = colorPrimary;
    @Prop({ default: () => [] }) favorites: User[];
    @Prop({ default: true }) pro: boolean;
    @Prop({ default: false }) modal: boolean;
    @Prop({ default: $tc('pick_a_recipient') }) title: string;

    selectionIndex: number = 0;

    @Prop({ default: false }) canScanQrCode: boolean;
    @Prop({ default: false }) clickToShowProfile: boolean;

    _dataItems: Recipient[] = [];
    filteredDataItems: Recipient[] = [];
    historyAndFavsItems: Recipient[] = [];

    get dataItems() {
        return this._dataItems;
    }
    set dataItems(value) {
        this._dataItems = value;
        this.updateFilteredItems();
    }
    updateFilteredItems() {
        if (this.selectionIndex === 1) {
            this.filteredDataItems = this._dataItems.filter((s) => s.is_favorite === true);
        } else {
            this.filteredDataItems = this._dataItems.slice(0);
        }
    }
    destroyed() {
        super.destroyed();
        this.$authService.off(ProfileEvent, this.onProfileUpdate, this);
    }
    mounted() {
        super.mounted();
        this.$authService.on(ProfileEvent, this.onProfileUpdate, this);
        this.buildHistoryFavs();
    }
    onProfileUpdate(event: ProfileEventData) {
        const id = event.data.id;
        const isFavorite = event.data.is_favorite;
        const index = this.historyAndFavsItems.findIndex((f) => f.id === id);
        const index2 = this._dataItems.findIndex((f) => f.id === id);
        console.log('onProfileUpdate', id, isFavorite, index, index2);
        if (isFavorite) {
            if (index < 0) {
                this.historyAndFavsItems.push(event.data);
            } else {
                this.historyAndFavsItems[index].is_favorite = isFavorite;
            }
        } else {
            if (index >= 0) {
                this.historyAndFavsItems.splice(index, 1);
            }
        }
        if (index2 >= 0) {
            this._dataItems[index2].is_favorite = isFavorite;
        }
        this.updateFilteredItems();
    }
    async buildHistoryFavs() {
        try {
            const historyAndFavsItems = [];
            const history = this.$authService.recipientHistory;
            const favorites = this.$authService.recipientfavorites?.slice(0);
            console.log('history', history);
            console.log('favorites', favorites);
            if (history) {
                for (let index = 0; index < history.length; index++) {
                    const data = history[index];
                    let is_favorite = false;
                    const favIndex = favorites ? favorites.findIndex((f) => f.id === data.id) : -1;
                    if (favIndex >= 0) {
                        favorites.splice(favIndex, 1);
                        is_favorite = true;
                    }
                    // const recipients = await this.$authService.lokAPI.makeRecipient(history[index]);
                    const recipients = history[index];
                    recipients.forEach((r) => {
                        r['isHistory'] = true;
                        // r['is_favorite'] = is_favorite;
                        historyAndFavsItems.push(r);
                    });
                }
            }
            if (favorites) {
                for (let index = 0; index < favorites.length; index++) {
                    // const recipients = await this.$authService.lokAPI.makeRecipient(favorites[index]);
                    const recipients = [favorites[index]];
                    recipients.forEach((r) => {
                        // r['is_favorite'] = true;
                        historyAndFavsItems.push(r);
                    });
                }
            }
            this.dataItems = this.historyAndFavsItems = historyAndFavsItems;
        } catch (error) {
            this.showError(error);
        }
    }

    onTFLoaded() {
        this.textField.requestFocus();
    }
    close() {
        this.$modal.close();
    }

    get textField() {
        return this.getRef('textField');
    }
    hasFocus = false;
    onFocus(e) {
        this.hasFocus = true;
        // if (this.currentSearchText && this.searchResultsCount === 0) {
        //     this.instantSearch(this.currentSearchText);
        // }
    }
    searchAsTypeTimer;
    onBlur(e) {
        this.hasFocus = false;
    }
    onTabSelectionChanged(index) {
        this.selectionIndex = index;
        this.updateFilteredItems();
    }
    async searchUsers(query: string) {
        this.loading = true;
        const regexp = new RegExp(query, 'i');
        const items = [];
        if (this.historyAndFavsItems) {
            this.historyAndFavsItems.forEach((b) => {
                if (regexp.test(b.name) || regexp.test(b.email) || regexp.test(b.phone) || regexp.test(b.mobile)) {
                    items.push(b);
                }
            });
        }
        try {
            const users = await this.$authService.getUsers({
                query
            });
            users.forEach((u) => {
                if (items.findIndex((i) => i.id === u.id) === -1) {
                    items.push(u);
                }
            });
        } catch (error) {
            this.showError(error);
        } finally {
            this.loading = false;
            this.dataItems = items;
        }
    }
    currentQueryText = null;

    clearSearch() {
        this.currentQueryText = null;
        this.textField.clearFocus();
    }
    onTextChange(e) {
        const query = (this.currentQueryText = e.value);
        if (this.searchAsTypeTimer) {
            clearTimeout(this.searchAsTypeTimer);
            this.searchAsTypeTimer = null;
        }
        if (query && query.length > 2) {
            this.searchAsTypeTimer = setTimeout(() => {
                this.searchAsTypeTimer = null;
                this.searchUsers(query);
            }, 500);
        } else {
            const items = [];
            if (this.historyAndFavsItems) {
                this.historyAndFavsItems.forEach((b) => {
                    // if (regexp.test(b.name) || regexp.test(b.email) || regexp.test(b.phone) || regexp.test(b.mobile)) {
                    items.push(b);
                    // }
                });
            }
            this.dataItems = items;
        }
        // this.currentSearchText = query;
    }

    async showUserDetails(item: Recipient) {
        try {
            const component = (await import('~/common/components/UserDetailsBottomSheet')).default;
            this.$showBottomSheet(component, {
                props: {
                    user: item
                }
            });
        } catch (err) {
            this.showError(err);
        }
    }
    async showSettings(item: Recipient) {
        try {
            const component = (await import('~/common/components/Settings')).default;
            this.$showBottomSheet(component);
        } catch (err) {
            this.showError(err);
        }
    }
    chooseRecipient(item: Recipient) {
        if (this.clickToShowProfile) {
            this.showUserDetails(item);
            return;
        }
        const history = this.$authService.recipientHistory || [];
        if (history.findIndex((h) => h.id === item.id) === -1) {
            history.push(item.jsonData);
            this.$authService.recipientHistory = history;
        }
        this.$modal.close(item);
    }
}
