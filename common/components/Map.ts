import { Component } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import { ComponentIds } from './App';
import InteractiveMap from './InteractiveMap';
import Vue, { NativeScriptVue, NavigationEntryVue } from 'nativescript-vue';
import { LoggedinEvent, LoggedoutEvent } from '../services/AuthService';
import { mdiFontFamily } from '../variables';

@Component({
    components: {
        InteractiveMap
    }
})
export default class Map extends PageComponent {
    navigateUrl = ComponentIds.Map;
    mdiFontFamily = mdiFontFamily;
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

    goToLogin() {
        this.$getAppComponent().goToLogin();
    }
}
