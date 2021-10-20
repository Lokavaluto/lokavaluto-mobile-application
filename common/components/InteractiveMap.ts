import { ClickType, MapBounds, MapPos } from '@nativescript-community/ui-carto/core';
import { VectorTileEventData } from '@nativescript-community/ui-carto/layers/vector';
import { CartoMap } from '@nativescript-community/ui-carto/ui';
import * as appSettings from '@nativescript/core/application-settings';
import { isMainThread } from '@nativescript/core/utils';
import { throttle } from 'helpful-decorators';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { User } from '../services/AuthService';
import BaseVueComponent from './BaseVueComponent';
import BottomSheetHolder, { BottomSheetHolderScrollEventData } from './BottomSheet/BottomSheetHolder';
import FilterCategories from './FilterCategories';
import MapBottomSheet from './MapBottomSheet';
import MapComponent from './MapComponent';

let categories = [];

@Component({
    components: {
        MapComponent,
        MapBottomSheet,
        BottomSheetHolder
    }
})
export default class InteractiveMap extends BaseVueComponent {
    _cartoMap: CartoMap<LatLonKeys>;
    currentBounds: MapBounds<LatLonKeys>;
    selectedItem: User = null;
    selectedItemIndex: number = 0;
    bottomSheetStepIndex = 0;
    bottomSheetTranslation = 0;
    bottomSheetPercentage = 0;
    shownUsers: User[] = [];
    loading = false;
    mapCategories = null;
    mapFilterSlugs: number[] = [];
    bottomSheetHeight = 200;
    bottomSheetSteps = [0, 200];
    bottomSheetPanGestureOptions = { minDist: 70 };

    @Prop({ default: 1 }) opacity: number;
    @Prop({ default: false }) locationButton: boolean;
    @Prop({ default: true }) isUserInteractionEnabled: boolean;
    @Prop({ default: true }) loadCategories: boolean;

    get scrollingWidgetsOpacity() {
        if (this.bottomSheetPercentage <= 0.5) {
            return 1;
        }
        return 4 * (2 - 2 * this.bottomSheetPercentage) - 3;
    }
    onBottomSheetScroll(e: BottomSheetHolderScrollEventData) {
        this.bottomSheetTranslation = e.height;
        this.bottomSheetPercentage = e.percentage;
    }

    get mapComp() {
        return this.$refs['mapComp'] as MapComponent;
    }

    get cartoMap() {
        return this.mapComp.cartoMap;
    }
    mounted() {
        super.mounted();
        this.mapFilterSlugs = [];
        if (this.loadCategories) {
            if (!this.mapCategories) {
                this.$authService.categories().then((r) => {
                    this.mapCategories = categories = r;
                    console.log('mapCategories', this.mapCategories);
                });
            }
        }
    }
    destroyed() {
        super.destroyed();
    }
    // map: Mapbox;
    onMapReady(e) {}
    onLayoutChange() {
        // sometimes onMapStable is not called at first so we need this
        // to make sure the map refreshes
        if (!this.currentBounds && this._cartoMap) {
            // we need to delay a bit or the map wont have its size
            setTimeout(() => {
                const map = this._cartoMap;
                this.currentBounds = new MapBounds(map.screenToMap({ x: this.nativeView.getMeasuredWidth(), y: 0 }), map.screenToMap({ x: 0, y: this.nativeView.getMeasuredHeight() }));
                this.refresh(this.currentBounds);
            }, 10);
        }
    }

    onMapClicked(e) {
        // console.log('onMapClicked', !!this._cartoMap, !!this.currentBounds);
        this.bottomSheetStepIndex = 0;
    }
    onMapStable(e) {
        // console.log('onMapStable', !!this._cartoMap, !!this.currentBounds);
        const map = e.object as CartoMap<LatLonKeys>;
        const currentBounds = new MapBounds<LatLonKeys>(map.screenToMap({ x: this.nativeView.getMeasuredWidth(), y: 0 }), map.screenToMap({ x: 0, y: this.nativeView.getMeasuredHeight() }));
        // console.log('onMapStable', currentBounds);
        if (!this.currentBounds || !currentBounds.equals(this.currentBounds)) {
            this.currentBounds = currentBounds;
            this.refresh(currentBounds);
        }
    }

    onElementClick(...args) {}

    onVectorTileClicked(data: VectorTileEventData) {
        console.log('onVectorTileClicked', data);
        const { clickType, position, featureLayerName, featureData, featurePosition } = data;
        if (clickType === ClickType.SINGLE) {
            // const map = this._cartoMap;
            const user = this.shownUsers.find((u) => u.id + '' === (featureData.id as any));
            if (user === this.selectedItem) {
                return false;
            } else if (user) {
                this.selectItem(user);
            } else {
                this.bottomSheetStepIndex = 0;
            }
        }
        return true;
    }
    @throttle(2000)
    refresh(mapBounds: MapBounds<LatLonKeys>) {
        this.loading = true;
        this.$authService
            .getUsersForMap(mapBounds, this.mapFilterSlugs)
            .then((r) => {
                console.log('received', r.length, 'users for map');
                this.shownUsers = r;
                if (r.length > 0) {
                    // const geojson = GeoJSON.parse(r, { Point: ['address.lat', 'address.lon'], include: ['name', 'id'] });
                    this.mapComp.addGeoJSONPoints(r);
                    // this.ignoreStable = true;
                    // this.mapComp.localVectorTileDataSource.setLayerGeoJSON(1, geojson);
                }
            })
            .catch(this.showError)
            .finally(() => {
                this.loading = false;
            });
    }
    selectItem(item: User) {
        this.selectedItem = item;
        this.selectedItemIndex = this.shownUsers.indexOf(item);
        console.log('selectItem', this.selectedItemIndex);
        this.cartoMap.setFocusPos(
            {
                lat: item.partner_latitude,
                lon: item.partner_longitude
            },
            200
        );
        this.mapComp.localVectorTileLayer.getTileDecoder().setStyleParameter('selected_id', item.id + '');
        this.bottomSheetStepIndex = 1;
    }
    async unselectItem() {
        if (!!this.selectedItem) {
            this.mapComp.localVectorTileLayer.getTileDecoder().setStyleParameter('selected_id', '');

            this.bottomSheetStepIndex = 0;
            this.selectedItem = null;
        }
    }
    @Watch('bottomSheetStepIndex')
    onBottomSheetStepIndexChange() {
        console.log('onBottomSheetStepIndexChange', this.bottomSheetStepIndex);
        if (this.bottomSheetStepIndex === 0) {
            this.unselectItem();
        }
    }
    askUserLocation() {
        return this.mapComp.askUserLocation();
    }

    selectCategories() {
        if (this.mapCategories) {
            this.$showBottomSheet(FilterCategories, {
                closeCallback: () => {
                    this.refresh(this.currentBounds);
                },
                ignoreTopSafeArea: true,
                trackingScrollView: 'trackingScrollView',
                props: {
                    categories: this.mapCategories,
                    filterSlugs: this.mapFilterSlugs
                }
            });
        }
    }
}
