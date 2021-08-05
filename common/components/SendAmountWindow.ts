import { Component, Prop } from 'vue-property-decorator';
import PageComponent from './PageComponent';
import { ComponentIds } from './App';
import InteractiveMap from './InteractiveMap';
import { colorPrimary, mdiFontFamily } from '../variables';
import { $tc } from '../helpers/locale';
import { Benificiary, Roles, User } from '../services/AuthService';
import { TextField } from '@nativescript-community/ui-material-textfield';
import { NoNetworkError } from '../services/NetworkService';
import { Vibrate } from 'nativescript-vibrate';
import Vue from 'vue';

import { t as LokAPIType } from '~/lokapi/src/index';

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const amountRegexp = /^\d*([,\.]\d{0,2})?$/;

@Component({
    components: {}
})
export default class SendAmountWindow extends PageComponent {
    @Prop() recipient: LokAPIType.IRecipient;
    @Prop({ default: () => Vue.prototype.$authService.accounts[0] }) account: any;
    amount: number = 0;
    mdiFontFamily = mdiFontFamily;
    colorPrimary = colorPrimary;
    ignoreNextTextChange = false;
    oldAmountStr = null;
    description = null;
    get amountTF() {
        return this.getRef<TextField>('amountTF');
    }
    mounted(): void {
        super.mounted();
    }
    destroyed(): void {
        super.destroyed();
    }

    onAmountTFLoaded(e) {
        const textField = e.object as TextField;
        textField.requestFocus();
        if (global.isIOS) {
            textField.nativeTextViewProtected.keyboardType = 8;
        }
    }
    setTextFieldValue(value, tf?: TextField) {
        const amountTF = tf || this.amountTF;
        if (amountTF) {
            this.ignoreNextTextChange = true;
            amountTF.text = value;
            amountTF.setSelection(value.length);
        }
    }
    validateAmount({ value, object }, forceSetText = false) {
        if (this.ignoreNextTextChange) {
            this.ignoreNextTextChange = false;
            return;
        }
        if (!value) {
            this.amount = 0;
            return;
        }
        if (!amountRegexp.test(value)) {
            // we need to delay a bit for the cursor position to be correct
            setTimeout(() => this.setTextFieldValue(this.oldAmountStr, object), 0);
            return;
        }
        const realvalue = parseFloat(value.replace(/,/g, '.')) || 0;
        const realvalueStr = (this.oldAmountStr = realvalue + '');
        this.amount = realvalue;
        if (forceSetText) {
            this.setTextFieldValue(realvalueStr, object);
        }
    }

    async submit() {
        if (!this.amount) {
            return;
        }
        if (!this.$authService.connected) {
            return this.showError(new NoNetworkError());
        }
        try {
            let r;
            if (!FAKE_ALL) {
                this.showLoading(this.$t('loading'));
                r = await this.$authService.transfer(this.account, this.recipient, this.amount, this.description);
                this.hideLoading();
            }

            this.close();
            this.$getAppComponent().navigateBackToRoot();
            this.showTransactionDone(r);
            new Vibrate().vibrate(500);
        } catch (err) {
            this.showError(err);
        } finally {
            this.hideLoading();
        }
    }
    async showTransactionDone(payment: LokAPIType.IPayment) {
        // await timeout(700);
        try {
            const component = (await import('~/common/components/TransferConfirmation')).default;
            this.$showBottomSheet(component, {
                props: {
                    account: this.account,
                    recipient: this.recipient,
                    amount: this.amount,
                    description: this.description
                }
            });
        } catch (err) {
            this.showError(err);
        }
    }
}
