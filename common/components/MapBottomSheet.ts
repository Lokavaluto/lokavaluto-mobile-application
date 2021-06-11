import { View } from '@nativescript/core/ui/core/view';
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout';
import { Component, Prop } from 'vue-property-decorator';
import Profile from './Profile';
import { User } from '../services/AuthService';
import BottomSheetBase from './BottomSheet/BottomSheetBase';
import BaseVueComponent from './BaseVueComponent';

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
    @Prop() item: User;

    showProfile(item: User) {
        console.log('showProfile', item);
        this.navigateTo(Profile, {
            transition: {
                name: 'slide'
                // duration:2000
            },
            props: {
                propUserProfile: item,
                editable: false
            }
        });
    }

    mounted() {
        super.mounted();
        // this.holder.$on('scroll', this.onScroll);
    }
    destroyed() {
        super.destroyed();
    }
}
