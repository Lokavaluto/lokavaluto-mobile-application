import { Component, Prop, Watch } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import { ComponentIds } from './App';
import InteractiveMap from './InteractiveMap';
import { mdiFontFamily, subtitleColor } from '../variables';
import { $tc } from '../helpers/locale';
import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { PullToRefresh } from '@akylas/nativescript-pulltorefresh';

@Component({
    components: {}
})
export default class SendReceiveWindow extends PageComponent {
    mdiFontFamily = mdiFontFamily;
    subtitleColor = subtitleColor;
    @Prop({ default: 0 }) startPageIndex: number;
    pageIndex = 0;
    totalSold: number = 0;
    symbol: string = 'U';

    historyLoaded = false;

    mounted(): void {
        super.mounted();
        try {
            console.log('mounted');
            this.pageIndex = this.startPageIndex;
            this.refresh();
        } catch (err) {
            console.error(err);
        }
    }
    destroyed(): void {
        super.destroyed();
    }

    @Watch('pageIndex')
    onPageIndexChange() {
        if (this.pageIndex === 2 && !this.historyLoaded) {
            this.refreshHistory();
        }
    }

    transactions = null;

    get pullRefresh() {
        return this.getRef<PullToRefresh>('pullRefresh');
    }
    async refreshHistory() {
        const pullRefresh = this.pullRefresh;
        try {
            // if (pullRefresh) {
            //     pullRefresh.refreshing = true;
            // }
            const serverTransactions = await this.$authService.lokAPI.getTransactions();
            this.transactions = serverTransactions
                .filter((t) => !!t)
                .map((transaction) => ({
                    amount: transaction.amount,
                    currency: transaction.currency,
                    date: transaction.curredatency,
                    description: transaction.description,
                    id: transaction.id,
                    kind: transaction.kind,
                    related: transaction.related,
                    relatedKind: transaction.relatedKind,
                    relatedUser: transaction.relatedUser
                }));
            console.log('this.transactions', this.transactions, typeof this.transactions[0].amount);
        } catch (error) {
            this.showError(error);
        } finally {
            if (pullRefresh) {
                pullRefresh.refreshing = false;
            }
        }
    }

    async refresh() {
        console.log('refresh');
        try {
            let totalSold = 0;
            const accounts = await this.$authService.lokAPI.getAccounts();
            for (let index = 0; index < accounts.length; index++) {
                totalSold += parseFloat(await accounts[index].getBalance());
            }
            this.symbol = await accounts[0].getSymbol();
            this.totalSold = totalSold;
        } catch (error) {
            this.showError(error);
        }
    }

    async goToSend() {
        try {
            const component = (await import('~/common/components/UserPicker')).default;
            const recipient = await this.$showModal(component, {
                props: {
                    pro: true,
                    title: $tc('pick_a_recipient'),
                    canScanQrCode: true,
                    modal: true
                },
                fullscreen: true
            });
            if (!recipient) {
                return;
            }
            const component2 = (await import('~/common/components/SendAmountWindow')).default;
            this.navigateTo(component2, {
                props: {
                    recipient
                }
            });
        } catch (error) {
            this.showError(error);
        }
    }

    async payWithSearch() {
        try {
            const component = (await import('~/common/components/UserPicker')).default;
            const recipient = await this.$showModal(component, {
                props: {
                    pro: false,
                    title: $tc('pick_a_recipient'),
                    canScanQrCode: true,
                    modal: true
                },
                fullscreen: true
            });
            if (!recipient) {
                return;
            }
            const component2 = (await import('~/common/components/SendAmountWindow')).default;
            this.navigateTo(component2, {
                props: {
                    recipient
                }
            });
        } catch (error) {
            this.showError(error);
        }
    }
    async payWithQrcode() {
        try {
            const result = await this.$scanQRCode(true);
            if (result) {
                showSnack({ message: result });
            }
        } catch (error) {
            this.showError(error);
        }
    }
}
