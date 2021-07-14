import { TextField } from '@nativescript-community/ui-material-textfield';
import { Component, Prop } from 'vue-property-decorator';
import { $tc } from '../helpers/locale';
import { Benificiary, Roles, User } from '../services/AuthService';
import { backgroundColor, colorPrimary, subtitleColor, textColor } from '../variables';
import PageComponent from './PageComponent';

interface Recipient extends User {
    isFavorite?: boolean;
}

@Component({})
export default class UserPicker extends PageComponent {
    backgroundColor = backgroundColor;
    subtitleColor = subtitleColor;
    textColor = textColor;
    colorPrimary = colorPrimary;
    @Prop({ default: () => [] }) favorites: User[];
    @Prop({ default: true }) pro: boolean;
    @Prop({ default: $tc('pick_a_recipient') }) title: string;

    selectionIndex: number = 0;

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

    constructor() {
        super();
        // this.beneficiaries = this.$authService.beneficiaries;
    }
    updateFilteredItems() {
        if (this.selectionIndex === 1) {
            this.filteredDataItems = this._dataItems.filter((s) => s.isFavorite === true);
        } else {
            this.filteredDataItems = this._dataItems;
        }
    }
    destroyed() {
        super.destroyed();
    }
    mounted() {
        super.mounted();
        this.buildHistoryFavs();
    }
    async buildHistoryFavs() {
        try {
            const historyAndFavsItems = [];
            const history = this.$authService.recipientHistory;
            const favorites = this.$authService.recipientfavorites?.slice(0);
            if (history) {
                for (let index = 0; index < history.length; index++) {
                    const data = history[index];
                    let isFavorite = false;
                    const favIndex = favorites ? favorites.findIndex((f) => f.id === data.id) : -1;
                    if (favIndex >= 0) {
                        favorites.splice(favIndex, 1);
                        isFavorite = true;
                    }
                    const recipients = await this.$authService.lokAPI.makeRecipient(history[index]);
                    recipients.forEach((r) => {
                        r['isHistory'] = true;
                        r['isFavorite'] = isFavorite;
                        historyAndFavsItems.push(r);
                    });
                }
            }
            if (favorites) {
                for (let index = 0; index < favorites.length; index++) {
                    const recipients = await this.$authService.lokAPI.makeRecipient(favorites[index]);
                    recipients.forEach((r) => {
                        r['isFavorite'] = true;
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
        console.log('close');
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
    onTextChange(e) {
        const query = e.value;
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
    chooseRecipient(item: Recipient) {
        const history = this.$authService.recipientHistory || [];
        if (history.findIndex((h) => h.id === item.id) === -1) {
            history.push(item.jsonData);
            this.$authService.recipientHistory = history;
        }
        this.$modal.close(item);
    }
}
