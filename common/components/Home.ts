import { showSnack } from '@nativescript-community/ui-material-snackbar';
import { NavigatedData } from '@nativescript/core';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { AccountInfoEvent, AccountInfoEventData, LoggedinEvent, LoggedoutEvent } from '../services/AuthService';
import { colorPrimary, mdiFontFamily } from '../variables';
import { ComponentIds } from './App';
import CreditAccount from './CreditAccount';
import InteractiveMap from './InteractiveMap';
import PageComponent from './PageComponent';

@Component({
    components: {
        InteractiveMap
    }
})
export default class Home extends PageComponent {
    navigateUrl = ComponentIds.Situation;
    amountError: string = null;
    mdiFontFamily = mdiFontFamily;
    colorPrimary = colorPrimary;
    totalSold: number | string = '-';
    symbol: string = 'U';
    constructor() {
        super();
        // this.showMenuIcon = true;
    }

    public currentlyLoggedIn = Vue.prototype.$authService.isLoggedIn();

    mounted(): void {
        super.mounted();
        this.$authService.on(LoggedinEvent, this.onLoggedIn, this);
        this.$authService.on(LoggedoutEvent, this.onLoggedOut, this);
        this.$authService.on(AccountInfoEvent, this.onAccountsData, this);
    }
    destroyed(): void {
        super.destroyed();
        this.$authService.off(LoggedinEvent, this.onLoggedIn, this);
        this.$authService.off(LoggedoutEvent, this.onLoggedOut, this);
        this.$authService.off(AccountInfoEvent, this.onAccountsData, this);
    }
    onLoggedIn(e?) {
        this.currentlyLoggedIn = true;
        // we need to enforce a refresh here to ensure lokapi works correctly
        this.refresh();
    }
    onLoggedOut() {
        this.currentlyLoggedIn = false;
    }

    get isPro() {
        return this.$authService.isProUser();
    }

    onLoaded() {}

    async onNavigatedTo(args: NavigatedData) {
        const loggedInOnStart = this.$authService.isLoggedIn();
        // console.log('onNavigatedTo', loggedInOnStart);
        if (!args.isBackNavigation && loggedInOnStart) {
            this.refresh();
        }
        // console.log('onNavigatedTo', loggedInOnStart, new Error().stack);
        if (loggedInOnStart) {
            // if (!this.$securityService.passcodeSet()) {
            //     try {
            //         await this.$securityService.createPasscode(this);
            //     } catch (err) {
            //         this.showError(err);
            //         this.$authService.logout();
            //     }
            // }
            if (WITH_PUSH_NOTIFICATIONS && !args.isBackNavigation) {
                this.$getAppComponent().registerForPushNotifs();
            }
        }
    }

    onAccountsData(e: AccountInfoEventData) {
        // this.totalSold = e.data.;
        this.updateBalance(e.data);
        this.loading = false;
    }

    async updateBalance(accounts) {
        let totalSold = 0;
        for (let index = 0; index < accounts.length; index++) {
            totalSold += parseFloat(await accounts[index].getBalance());
        }
        this.totalSold = totalSold;
        this.symbol = await accounts[0].getSymbol();
    }
    async refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        this.loading = true;
        try {
            const accounts = await this.$authService.getAccounts();
            await this.updateBalance(accounts);
        } catch (err) {
            this.showError(err);
        } finally {
            this.loading = false;
        }
    }
    onNavigatingTo() {
        // if (isAndroid) {
        //     const page = this.page
        //     // page.androidStatusBarBackground = null;
        //     // page.androidStatusBarBackground = new Color(this.colorPrimaryDark);
        // }
    }
    creditAccount() {
        // this.openLink(CREDIT_URL);

        this.navigateTo(CreditAccount);
        // .then(r => {})
        // .catch(this.showError);
    }

    async goToLogin() {
        try {
            await this.$getAppComponent().goToLogin();
        } catch (error) {
            this.showError(error);
        }
    }
    async goToSendRequest() {
        try {
            this.$getAppComponent().navigateToUrl(ComponentIds.SendReceive, {
                props: {
                    startPageIndex: 1
                }
            });
        } catch (error) {
            this.showError(error);
        }
    }
    async goToPay() {
        try {
            const result = await this.$scanQRCode(true);
            if (result) {
                showSnack({ message: result });
            }
        } catch (error) {
            this.showError(error);
        }
    }
    async goToCredit() {
        try {
            this.$getAppComponent().navigateToUrl(ComponentIds.Credit, {
            });
        } catch (error) {
            this.showError(error);
        }
    }
    async goToMap() {
        console.log('goToMap    ');
        try {
            await this.$getAppComponent().navigateToUrl(ComponentIds.Map);
        } catch (error) {
            this.showError(error);
        }
    }
}
