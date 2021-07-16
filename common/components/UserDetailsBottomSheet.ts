import { openUrl } from '@nativescript/core/utils/utils';
import { Component, Prop } from 'vue-property-decorator';
import BaseVueComponent from './BaseVueComponent';
import { User } from '../services/AuthService';
import { ComponentIds } from './App';

@Component
export default class UserDetailsBottomSheet extends BaseVueComponent {
    @Prop() user: User;
    mounted() {
        super.mounted();
    }
    destroyed() {
        super.destroyed();
    }
    onShownInBottomSheet() {}
    async showUserProfile() {
        this.$closeBottomSheet();
        const component = (await import('~/common/components/Profile')).default;
        this.$navigateTo(component, {
            props: {
                propUserProfile: this.user
            }
        });
    }

    async toggleFavorite() {
        try {
            this.user = await this.$authService.toggleFavorite(this.user);
        } catch (error) {
            this.showError(error);
        }
    }
}
