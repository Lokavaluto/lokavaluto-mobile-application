import { Component } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import { ComponentIds } from './App';
import InteractiveMap from './InteractiveMap';
import MapComponent from './MapComponent';
import { mdiFontFamily } from '../variables';

@Component({
    components: {
        MapComponent,
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
