import { HandlerType, Manager, PanGestureHandler } from '@nativescript-community/gesturehandler';
import { CollectionView } from '@nativescript-community/ui-collectionview';
import Vue from 'nativescript-vue';
import { Component } from 'vue-property-decorator';
import BaseVueComponent from '../BaseVueComponent';
import BottomSheetHolder, { PAN_GESTURE_TAG } from './BottomSheetHolder';
export const NATIVE_GESTURE_TAG = 4;

@Component({})
export default class BottomSheetBase extends BaseVueComponent {
    constructor() {
        super();
    }

    isListViewAtTop = true;
    isScrollEnabled = true;
    set scrollEnabled(value) {
        if (value !== this.isScrollEnabled) {
            // console.log('set scrollEnabled', value);
            this.isScrollEnabled = value;
        }
    }
    get scrollEnabled() {
        return this.isScrollEnabled;
    }
    get listViewAtTop() {
        return this.isListViewAtTop;
    }
    set listViewAtTop(value) {
        if (value !== this.isListViewAtTop) {
            this.isListViewAtTop = value;
            // console.log('set listViewAtTop ', value);
            this.$emit('listViewAtTop', value);
        }
    }
    holder: BottomSheetHolder;
    panGestureHandler: PanGestureHandler;
    get listView() {
        return this.$refs['listView'] && (this.$refs['listView'].nativeView as CollectionView);
    }
    // get graphView() {
    //     return this.$refs['graphView'] && (this.$refs['graphView'].nativeView as RadCartesianChart);
    // }
    mounted() {
        super.mounted();

        let parent: Vue = this;
        while (parent !== null && !(parent instanceof BottomSheetHolder)) {
            parent = parent.$parent as any;
        }
        const listView = this.listView;
        // console.log('mounted', !!parent, !!listView);
        if (parent instanceof BottomSheetHolder) {
            this.holder = parent;
            parent.setBottomSheet(this);
        }
        if (global.isIOS && listView && !!this.holder) {
            const manager = Manager.getInstance();
            const gestureHandler = manager.createGestureHandler(HandlerType.NATIVE_VIEW, NATIVE_GESTURE_TAG, {
                disallowInterruption: true,
                simultaneousHandlers: [PAN_GESTURE_TAG]
            });
            gestureHandler.attachToView(this.listView);
        }
    }

    reset() {
        this.listViewAtTop = true;
        this.scrollEnabled = true;
    }

    onListViewScroll(args) {
        // console.log('onListViewScroll', this.isScrollEnabled , this.holder.isPanning, this.listViewAtTop, args.scrollOffset);
        if (!this.isScrollEnabled) {
            return;
        }
        if (!this.listViewAtTop && args.scrollOffset <= 0) {
            this.listViewAtTop = true;
        } else if (this.listViewAtTop && args.scrollOffset > 0) {
            // console.log('listViewAtTop', this.listViewAtTop);
            this.listViewAtTop = false;
        }
    }
}
