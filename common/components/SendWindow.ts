import { Component, Prop } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import { ComponentIds } from './App';
import InteractiveMap from './InteractiveMap';
import { mdiFontFamily } from '../variables';
import { $tc } from '../helpers/locale';

@Component({
    components: {}
})
export default class SendWindow extends PageComponent {
    mdiFontFamily = mdiFontFamily;

    mounted(): void {
        super.mounted();
    }
    destroyed(): void {
        super.destroyed();
    }

    async searchPro() {
        try {
            const component = (await import('~/common/components/UserPicker')).default;
            const recipient = await this.$showModal(component, {
                props: {
                    pro: true,
                    title: $tc('pick_a_recipient')
                },
                fullscreen: true
            });
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
    async searchIndividual() {
        try {
            const component = (await import('~/common/components/UserPicker')).default;
            const recipient = await this.$showModal(component, {
                props: {
                    pro: false,
                    title: $tc('pick_a_recipient')
                },
                fullscreen: true
            });
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

    async scanQRCode() {}
}
