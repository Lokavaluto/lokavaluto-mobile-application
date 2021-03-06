import { TextField } from '@nativescript-community/ui-material-textfield';
import { android as androidApp } from '@nativescript/core/application';
import { CoreTypes } from '@nativescript/core';
import { Component, Prop } from 'vue-property-decorator';
import { QrCodeTransferData } from '../services/AuthService';
import { parseUrlScheme } from '../utils/urlscheme';
import { QRCodeDataEvent, off as appOff, on as appOn } from './App';
import TransferComponent from './TransferComponent';

@Component({})
export default class Floating extends TransferComponent {
    @Prop() closeCb: Function;

    mounted() {
        super.mounted();
        appOn(QRCodeDataEvent, this.onQrCodeDataEvent, this);
    }

    destroyed() {
        appOff(QRCodeDataEvent, this.onQrCodeDataEvent, this);
        super.destroyed();
    }

    onAmountTFLoaded(e) {
        this.setTextField(e.object);
    }

    async close() {
        await this.hideFloatingWindow();
        (this as any).closeCb();
    }

    async showFloatingWindow() {
        return this.nativeView.animate({ target: this.nativeView, opacity: 1, scale: { x: 1, y: 1 }, duration: 300, curve: CoreTypes.AnimationCurve.spring }).then(() => {
            const textField = this.$refs.amountTF.nativeView as TextField;
            if (!this.amount) {
                setTimeout(() => {
                    textField.requestFocus();
                }, 100);
            }
        });
    }
    async hideFloatingWindow() {
        return this.nativeView.animate({ target: this.nativeView, scale: { x: 0.7, y: 0.7 }, opacity: 0, duration: 100 });
    }

    loaded = false;
    onFloatingLoaded() {
        // we need this for the view to resize with keyboard
        // https://github.com/mikepenz/MaterialDrawer/issues/95#issuecomment-78678669
        this.nativeView.nativeViewProtected.setFitsSystemWindows(true);
        this.onLoaded();
        this.loaded = true;
        if (this.receivedQrCodeData) {
            this.handleFloatingQRData(this.receivedQrCodeData);
            this.receivedQrCodeData = null;
        } else if (this.qrCodeData) {
            this.showFloatingWindow();
        } else {
            // try {
            this.$scanQRCode(true)
                .then((result) => {
                    if (!result) {
                        this.close();
                    }
                    const parsed = parseUrlScheme(result);
                    if (!parsed) {
                        return;
                    }
                    if (parsed.command === 'transfer') {
                        this.handleFloatingQRData(parsed.data);
                    }
                })
                .catch((err) => {
                    this.showError(err).then(() => {
                        this.close();
                    });
                });
            // const result = await this.$scanQRCode();

            // }
        }
    }

    receivedQrCodeData: QrCodeTransferData;
    handleFloatingQRData(data: QrCodeTransferData) {
        if (data) {
            if (this.loaded) {
                this.handleQRData(data);
                this.showFloatingWindow();
            } else {
                this.receivedQrCodeData = data;
            }
        }
    }
    async showTransactionDone(amount, recipient) {
        android.widget.Toast.makeText(androidApp.context, this.$t('transaction_done', amount, recipient), android.widget.Toast.LENGTH_SHORT).show();
    }
    async onBackButton() {
        await this.hideFloatingWindow();
        (this as any).close();
    }
}
