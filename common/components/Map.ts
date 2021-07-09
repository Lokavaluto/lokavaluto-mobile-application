import { Component } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import { ComponentIds } from './App';
import InteractiveMap from './InteractiveMap';
import Vue, { NativeScriptVue, NavigationEntryVue } from 'nativescript-vue';
import { mdiFontFamily } from '../variables';

@Component({
    components: {
        InteractiveMap
    }
})
export default class Map extends PageComponent {
    navigateUrl = ComponentIds.Map;
    mdiFontFamily = mdiFontFamily;

    mounted(): void {
        super.mounted();
    }
    destroyed(): void {
        super.destroyed();
    }

    goToLogin() {
        this.$getAppComponent().goToLogin();
    }
}
