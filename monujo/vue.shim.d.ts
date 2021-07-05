import Vue from 'vue';
import AuthService from '~/common/services/AuthService';
import SecurityService from '~/common/services/SecurityService';
import CrashReportService from '~/common/services/CrashReportService';
// import { ToastDuration, ToastPosition } from 'nativescript-toasty';
import App from '~/common/components/App';

declare module 'vue/types/vue' {
    // 3. Declare augmentation for Vue
    interface Vue {
        $authService: AuthService;
        $securityService: SecurityService;
        $crashReportService: CrashReportService;
        $t: (s: string, ...args) => string;
        $tc: (s: string, ...args) => string;
        $tu: (s: string, ...args) => string;
        $alert(message: string);
        $setAppComponent(comp: App);
        $getAppComponent(): App;
        $scanQRCode(manualHandle?: boolean): Promise<string>;
    }
}
