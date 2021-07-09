import { Screen } from '@nativescript/core/platform';
import { ad } from '@nativescript/core/utils/utils';
import { off as appOff, on as appOn, ios as iosApp, launchEvent } from '@nativescript/core/application';
import CSSLoader from '~/common/variables.module.scss';
import { Color } from '@nativescript/core/color';

const locals = CSSLoader.locals;
// console.log('loading variables', locals);
export const colorPrimary: Color = new Color(locals.colorPrimary);
export const colorAccent: Color = new Color(locals.colorAccent);
export const colorPrimaryDark: Color = new Color(locals.colorPrimaryDark);
export const backgroundColor: Color = new Color(locals.backgroundColor);
export const subtitleColor: Color = new Color(locals.subtitleColor);
export const listBorderColor: Color = new Color(locals.listBorderColor);
export const iconColor: Color = new Color(locals.iconColor);
export const textColor: Color = new Color(locals.textColor);
export const latoFontFamily: string = locals.latoFontFamily;
export const appFontFamily: string = locals.appFontFamily;
export const mdiFontFamily: string = locals.mdiFontFamily;
export const actionBarHeight: number = parseFloat(locals.actionBarHeight);
export const statusBarHeight: number = parseFloat(locals.statusBarHeight);
export const actionBarButtonHeight: number = parseFloat(locals.actionBarButtonHeight);
export const screenHeightDips = Screen.mainScreen.heightDIPs;
export const screenWidthDips = Screen.mainScreen.widthDIPs;
export let navigationBarHeight: number = parseFloat(locals.navigationBarHeight);

if (global.isAndroid) {
    const context: android.content.Context = ad.getApplicationContext();
    const hasPermanentMenuKey = android.view.ViewConfiguration.get(context).hasPermanentMenuKey();
    if (hasPermanentMenuKey) {
        navigationBarHeight = 0;
    }
} else {
    navigationBarHeight = 0;
    const onAppLaunch = function () {
        navigationBarHeight = iosApp.window.safeAreaInsets.bottom;
        appOff(launchEvent, onAppLaunch);
    };
    appOn(launchEvent, onAppLaunch);
}
