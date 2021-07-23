import { View } from '@nativescript/core/ui/core/view';
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout';
import { Component, Prop, Watch } from 'vue-property-decorator';
import Profile from './Profile';
import { User } from '../services/AuthService';
import BottomSheetBase from './BottomSheet/BottomSheetBase';
import BaseVueComponent from './BaseVueComponent';
import { Directions } from 'nativescript-directions';
import { $tc } from '../helpers/locale';
import { colorPrimary } from '../variables';
const directions = new Directions();

export const BOTTOMSHEET_HEIGHT = 200;

function getViewTop(view: View) {
    if (global.isAndroid) {
        return (view.nativeView as android.view.View).getTop();
    } else {
        return (view.nativeView as UIView).frame.origin.y;
    }
}

@Component({
    components: {}
})
export default class MapBottomSheet extends BaseVueComponent {
    colorPrimary = colorPrimary;
    @Prop() items: User[];
    @Prop() height: number;
    @Prop() selectedPageIndex = 0;
    innerSelectedPageIndex = 0;

    @Watch('selectedPageIndex')
    onSelectedPageIndex() {
        this.innerSelectedPageIndex = this.selectedPageIndex;
    }
    showProfile(item: User) {
        this.navigateTo(Profile, {
            props: {
                propUserProfile: item,
                editable: false
            }
        });
    }
    async navigateToItem(item: User) {
        try {
            const available = await directions.available();
            if (available) {
                directions.navigate({
                    to: {
                        lat: item.partner_latitude,
                        lng: item.partner_longitude
                    }
                });
            } else {
                throw new Error($tc('no_map_app'));
            }
        } catch (error) {
            this.showError(error);
        }
    }

    mounted() {
        super.mounted();
        // this.holder.$on('scroll', this.onScroll);
    }
    destroyed() {
        super.destroyed();
    }
}
