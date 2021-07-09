import CrashReportService from '~/common/services/CrashReportService';
const crashReportService = new CrashReportService();
// start it as soon as possible
crashReportService.start();
import Vue from 'nativescript-vue';
Vue.prototype.$crashReportService = crashReportService;

// import * as trace from '@nativescript/core/trace';
// trace.addCategories(trace.categories.ViewHierarchy);
// trace.addCategories(trace.categories.VisualTreeEvents);
// trace.addCategories(trace.categories.Navigation);
// trace.addCategories(trace.categories.NativeLifecycle);
// trace.addCategories(trace.categories.Transition);
// trace.enable();

// import { init } from '@nativescript-community/push';
// init();

import MixinsPlugin from '~/common/vue.mixins';
Vue.use(MixinsPlugin);

import ViewsPlugin from '~/common/vue.views';
Vue.use(ViewsPlugin);

import FiltersPlugin from '~/common/vue.filters';
Vue.use(FiltersPlugin);

import PrototypePlugin from '~/common/vue.prototype';
Vue.use(PrototypePlugin);

Vue.config.silent = true;
Vue.config['debug'] = false;

global.URLSearchParams = require('urlsearchparams').URLSearchParams;
console.log('global.URLSearchParams', global.URLSearchParams);

function throwVueError(err) {
    crashReportService.showError(err);
}
setMapPosKeys('lat', 'lon');
setGeoLocationKeys('lat', 'lon');

Vue.config.errorHandler = (e, vm, info) => {
    if (e) {
        console.log('[Vue]', `[${info}]`, e);
        setTimeout(() => throwVueError(e), 0);
    }
};

Vue.config.warnHandler = function (msg, vm, trace) {
    console.warn(msg, trace);
};

import { colorAccent, colorPrimary } from '~/common/variables';
import { themer } from '@nativescript-community/ui-material-core';
if (global.isIOS) {
    themer.setPrimaryColor(colorAccent);
    themer.setAccentColor(colorPrimary);
}

themer.createShape('main', {
    cornerFamily: 'rounded' as any,
    cornerSize: {
        value: 20,
        unit: 'dip'
    }
});
themer.createShape('round', {
    cornerFamily: 'rounded' as any,
    cornerSize: {
        value: 0.5,
        unit: '%'
    }
});

import App from '~/common/components/App';
import { setMapPosKeys } from '@nativescript-community/ui-carto/core/index.common';
import { setGeoLocationKeys } from '@nativescript-community/gps';
import { Application } from '@nativescript/core';
new Vue({
    render: (h) => h(App)
}).$start();
