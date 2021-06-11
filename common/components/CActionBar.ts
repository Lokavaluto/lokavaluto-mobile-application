import { Component, Prop } from 'vue-property-decorator';
import { actionBarHeight, appFontFamily, colorPrimary } from '../variables';
import BaseVueComponent from './BaseVueComponent';

@Component({})
export default class ActionBar extends BaseVueComponent {
    @Prop({
        default: null,
        type: String
    })
    public title: string;
    public appFontFamily = appFontFamily;
    public colorPrimary = colorPrimary;

    @Prop({ default: actionBarHeight, type: Number })
    public height: number;

    @Prop({ default: null, type: String })
    public subtitle: string;

    @Prop({ default: false, type: Boolean })
    public showMenuIcon: boolean;

    @Prop({ default: false, type: Boolean })
    public modalWindow: boolean;

    // @Prop({ default: false })
    public canGoBack = false;

    @Prop({ default: true, type: Boolean })
    public showLogo: boolean;

    get menuIcon() {
        if (this.modalWindow) {
            return 'mdi-close';
        }
        if (this.canGoBack) {
            return global.isIOS ? 'mdi-chevron-left' : 'mdi-arrow-left';
        }
        return 'mdi-menu';
    }
    get menuIconVisible() {
        return this.modalWindow || this.canGoBack || this.showMenuIcon;
    }

    get titleFontSize() {
        return Math.min(this.height, 90);
    }

    mounted() {
        setTimeout(() => {
            this.canGoBack = this.$getAppComponent().canGoBack();
        }, 0);
    }
    onMenuIcon() {
        if (this.modalWindow && this.$modal) {
            this.$modal.close();
        } else {
            this.$getAppComponent().onMenuIcon();
        }
    }
}
