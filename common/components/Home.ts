import { NavigatedData } from '@nativescript/core';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import { AccountInfoEventData, LoggedinEvent, LoggedoutEvent } from '../services/AuthService';
import { mdiFontFamily } from '../variables';
import { ComponentIds } from './App';
import CreditAccount from './CreditAccount';
import MapComponent from './MapComponent';
import PageComponent from './PageComponent';

@Component({
    components: {
        MapComponent
    }
})
export default class Home extends PageComponent {
    navigateUrl = ComponentIds.Situation;
    amountError: string = null;
    mdiFontFamily = mdiFontFamily;
    totalSold: number = 0;
    constructor() {
        super();
        // this.showMenuIcon = true;
    }

    public currentlyLoggedIn = Vue.prototype.$authService.isLoggedIn();

    mounted(): void {
        super.mounted();
        this.$authService.on(LoggedinEvent, this.onLoggedIn, this);
        this.$authService.on(LoggedoutEvent, this.onLoggedOut, this);
    }
    destroyed(): void {
        super.destroyed();
        this.$authService.on(LoggedinEvent, this.onLoggedIn, this);
        this.$authService.on(LoggedoutEvent, this.onLoggedOut, this);
    }
    onLoggedIn(e?) {
        this.currentlyLoggedIn = true;
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
        this.loading = false;
    }
    async refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
        }
        this.loading = true;
        try {
            await this.$authService.getAccounts();
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

    goToLogin() {
        this.$getAppComponent().goToLogin();
    }
}
