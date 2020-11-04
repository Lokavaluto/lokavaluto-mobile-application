import { TWEEN } from '@nativescript-community/tween';
import { MapPosVector } from '@nativescript-community/ui-carto/core';
import { GeoJSONVectorTileDataSource } from '@nativescript-community/ui-carto/datasources';
import { PersistentCacheTileDataSource } from '@nativescript-community/ui-carto/datasources/cache';
import { HTTPTileDataSource } from '@nativescript-community/ui-carto/datasources/http';
import { LocalVectorDataSource } from '@nativescript-community/ui-carto/datasources/vector';
import { RasterTileLayer } from '@nativescript-community/ui-carto/layers/raster';
import { VectorElementEventData, VectorLayer, VectorTileEventData, VectorTileLayer } from '@nativescript-community/ui-carto/layers/vector';
import { Projection } from '@nativescript-community/ui-carto/projections';
import { CartoMap } from '@nativescript-community/ui-carto/ui';
import { setShowDebug, setShowError, setShowInfo, setShowWarn } from '@nativescript-community/ui-carto/utils';
import { Point } from '@nativescript-community/ui-carto/vectorelements/point';
import { Polygon } from '@nativescript-community/ui-carto/vectorelements/polygon';
import { MBVectorTileDecoder } from '@nativescript-community/ui-carto/vectortiles';
import { Color } from '@nativescript/core/color';
import { Folder, knownFolders, path } from '@nativescript/core/file-system';
import { FeatureCollection, Point as GeoJSONPoint } from 'geojson';
import { Component, Prop } from 'vue-property-decorator';
import { GeoHandler, GeoLocation, UserLocationdEvent, UserLocationdEventData } from '../handlers/GeoHandler';
import { User } from '../services/AuthService';
import { DEV_LOG } from '../utils/logging';
import BaseVueComponent from './BaseVueComponent';
const GeoJSON = require('geojson');

// const perimeterGeoJSON = require('~/assets/perimeter.json');

interface GeoJSONProperties {
    name: string;
    id: string;
}

const LOCATION_ANIMATION_DURATION = 300;

@Component({})
export default class MapComponent extends BaseVueComponent {
    _cartoMap: CartoMap<LatLonKeys> = null;
    mapProjection: Projection = null;
    rasterLayer: RasterTileLayer = null;
    lastUserLocation: GeoLocation;
    _localVectorDataSource: LocalVectorDataSource<LatLonKeys>;
    localVectorLayer: VectorLayer;
    userBackMarker: Point<LatLonKeys>;
    userMarker: Point<LatLonKeys>;
    accuracyMarker: Polygon;
    // sessionLine: Line;
    isUserFollow = true;
    static _geoHandler: GeoHandler;

    _localVectorTileDataSource: GeoJSONVectorTileDataSource;
    localVectorTileLayer: VectorTileLayer;
    ignoreStable = false;

    get geoHandler() {
        if (!MapComponent._geoHandler) {
            MapComponent._geoHandler = new GeoHandler();
        }
        return MapComponent._geoHandler;
    }

    // @Prop() session: Session;
    // @Prop({ default: false }) readonly licenseRegistered!: boolean;
    @Prop({ default: false }) readonly showLocationButton!: boolean;
    @Prop({ default: 16 }) readonly zoom!: number;
    @Prop({ default: 1 }) readonly layerOpacity!: number;
    @Prop() readonly vectorTileClicked!: Function;

    get cartoMap() {
        return this._cartoMap;
    }
    get userFollow() {
        return this.isUserFollow;
    }
    set userFollow(value: boolean) {
        if (value !== undefined && value !== this.isUserFollow) {
            this.isUserFollow = value;
        }
    }
    destroyed() {
        super.destroyed();
        this.geoHandler.off(UserLocationdEvent, this.onLocation, this);
    }
    mounted() {
        super.mounted();
        this.geoHandler.on(UserLocationdEvent, this.onLocation, this);
    }
    onMapReady(e) {
        const cartoMap = (this._cartoMap = e.object as CartoMap<LatLonKeys>);

        setShowDebug(DEV_LOG);
        setShowInfo(DEV_LOG);
        setShowWarn(DEV_LOG);
        setShowError(true);

        this.mapProjection = cartoMap.projection;

        const options = cartoMap.getOptions();
        options.setWatermarkScale(0);
        // options.setWatermarkPadding(toNativeScreenPos({ x: 80, y: 0 }));
        options.setRestrictedPanning(true);
        options.setSeamlessPanning(true);
        options.setEnvelopeThreadPoolSize(2);
        options.setTileThreadPoolSize(2);
        options.setZoomGestures(true);
        options.setRotatable(true);

        cartoMap.setZoom(this.zoom, 0);
        cartoMap.setFocusPos({ lat: 45, lon:6 }, 0);

        // options.setDrawDistance(8);
        // if (appSettings.getString('mapFocusPos')) {
        //     console.log('saved focusPos', appSettings.getString('mapFocusPos'));
        //     cartoMap.setFocusPos(JSON.parse(appSettings.getString('mapFocusPos')), 0);
        // }

        const cacheFolder = Folder.fromPath(path.join(knownFolders.documents().path, 'carto_cache'));
        const dataSource = new PersistentCacheTileDataSource({
            dataSource: new HTTPTileDataSource({
                minZoom: 1,
                subdomains: 'abc',
                maxZoom: 20,
                url: 'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
            }),
            capacity: 300 * 1024 * 1024,
            databasePath: path.join(cacheFolder.path, 'cache.db')
        });
        this.rasterLayer = new RasterTileLayer({
            zoomLevelBias: 1,
            opacity: this.layerOpacity,
            dataSource
        });
        cartoMap.addLayer(this.rasterLayer);

        // this.getOrCreateLocalVectorTileLayer();
        // this.ignoreStable = true;
        // this.localVectorTileDataSource.setLayerGeoJSON(1, perimeterGeoJSON);

        console.log('onMapReady', this.zoom, cartoMap.zoom, cartoMap.focusPos, 0);
        // setTimeout(() => {
        // perms
        // .request('storage')
        // .then(status => {
        // console.log('on request storage', status, this.actionBarButtonHeight, !!this._cartoMap);
        // if (status === 'authorized') {
        // this.$packageService.start();
        // this.setMapStyle(appSettings.getString('mapStyle', 'alpimaps.zip'));
        // this.runOnModules('onMapReady', this, cartoMap);
        // cartoMap.requestRedraw();
        // console.log('onMapReady', 'done');
        // } else {
        //     return Promise.reject(status);
        // }
        // })
        // .catch(err => console.error(err));
        // }, 0);
        // this.updateSession();
        // if (this.sessionLine) {
        //     const zoomBounds = this.sessionLine.getBounds();
        //     const zoomLevel = getBoundsZoomLevel(zoomBounds, { width: screen.mainScreen.widthDIPs, height: screen.mainScreen.heightDIPs });
        //     cartoMap.setZoom(Math.min(zoomLevel, 18), 0);
        //     cartoMap.setFocusPos(getCenter(zoomBounds.northeast, zoomBounds.southwest), 0);
        // }
        this.$emit('mapReady', e);
    }
    onMapMove(e) {
        this.userFollow = !e.data.userAction;
        // console.log('onMapMove',this._cartoMap.zoom, this._cartoMap.focusPos);
        this.$emit('mapMove', e);
    }
    onMapStable(e) {
        // this.log('onMapStable', this.ignoreStable);
        if (this.ignoreStable) {
            this.ignoreStable = false;
            return;
        }
        this.$emit('mapStable', e);
    }
    onMapIdle(e) {
        this.$emit('mapIdle', e);
    }
    onMapClicked(e) {
        this.$emit('mapClicked', e);
    }

    getCirclePoints(loc: Partial<GeoLocation>) {
        const EARTH_RADIUS = 6378137;
        const centerLat = loc.lat;
        const centerLon = loc.lon;
        const radius = loc.horizontalAccuracy;
        const N = Math.min(radius * 8, 100);

        const points = new MapPosVector();

        for (let i = 0; i <= N; i++) {
            const angle = (Math.PI * 2 * (i % N)) / N;
            const dx = radius * Math.cos(angle);
            const dy = radius * Math.sin(angle);
            const lat = centerLat + (180 / Math.PI) * (dy / EARTH_RADIUS);
            const lon = centerLon + ((180 / Math.PI) * (dx / EARTH_RADIUS)) / Math.cos((centerLat * Math.PI) / 180);
            points.add({ lat, lon } as any);
        }

        return points;
    }

    get localVectorDataSource() {
        if (!this._localVectorDataSource && this._cartoMap) {
            this._localVectorDataSource = new LocalVectorDataSource({ projection: this.mapProjection });
        }
        return this._localVectorDataSource;
    }
    getOrCreateLocalVectorLayer() {
        if (!this.localVectorLayer && this._cartoMap) {
            this.localVectorLayer = new VectorLayer({ visibleZoomRange: [0, 24], dataSource: this.localVectorDataSource });
            // this.localVectorLayer.setVectorElementEventListener(null);
            // this.localVectorLayer.setVectorElementEventListener(this);

            // always add it at 1 to respect local order
            this._cartoMap.addLayer(this.localVectorLayer);
        }
    }
    getOrCreateLocalVectorTileLayer() {
        if (!this.localVectorTileLayer && this._cartoMap) {
            const decoder = new MBVectorTileDecoder({
                style: 'voyager',
                liveReload: TNS_ENV !== 'production',
                dirPath: '~/assets/styles/lokavaluto'
            });
            const layer = (this.localVectorTileLayer = new VectorTileLayer({
                preloading: true,
                dataSource: this.localVectorTileDataSource,
                decoder
            }));

            layer.setVectorTileEventListener(this);
            // always add it at 1 to respect local order
            this._cartoMap.addLayer(layer);
        }
        return this.localVectorTileLayer;
    }

    get localVectorTileDataSource() {
        if (!this._localVectorTileDataSource && this._cartoMap) {
            this._localVectorTileDataSource = new GeoJSONVectorTileDataSource({
                minZoom: 0,
                maxZoom: 24
            });
            this._localVectorTileDataSource.createLayer('lokavaluto');
        }
        return this._localVectorTileDataSource;
    }
    addGeoJSONPoints(points: User[]) {
        const geojson = GeoJSON.parse(points, {
            Point: ['coords.partner_latitude', 'coords.partner_longitude'],
            include: ['name', 'id']
        }) as FeatureCollection<GeoJSONPoint, GeoJSONProperties>;
        geojson.features.forEach(f => (f.properties.id = f.properties.id + ''));
        // geojson.features.unshift(perimeterGeoJSON.features[0]);
        this.getOrCreateLocalVectorTileLayer();
        this.ignoreStable = true;
        this.localVectorTileDataSource.setLayerGeoJSON(1, geojson);
    }
    onVectorElementClicked(data: VectorElementEventData<LatLonKeys>) {
        const { clickType, position, elementPos, metaData, element } = data;
        // console.log('onVectorElementClicked');
        Object.keys(metaData).forEach(k => {
            metaData[k] = JSON.parse(metaData[k]);
        });
        this.$emit('elementClick', position, metaData);
    }
    onVectorTileClicked(data: VectorTileEventData) {
        this.$emit('tileElementClick', data);
        // this.log('onVectorTileClicked', this.vectorTileClicked);
        if (this.vectorTileClicked) {
            return this.vectorTileClicked(data);
        }
        return true;
    }
    updateUserLocation(geoPos: GeoLocation) {
        if (
            !this._cartoMap ||
            (this.lastUserLocation &&
                this.lastUserLocation.lat === geoPos.lat &&
                this.lastUserLocation.lon === geoPos.lon &&
                this.lastUserLocation.horizontalAccuracy === geoPos.horizontalAccuracy)
        ) {
            this.lastUserLocation = geoPos;
            return;
        }

        const position = {
            lat: geoPos.lat,
            lon: geoPos.lon,
            horizontalAccuracy: geoPos.horizontalAccuracy
        };
        console.log('updateUserLocation', position, geoPos, this.userFollow);
        if (this.userMarker) {
            const currentLocation = {
                lat: this.lastUserLocation.lat,
                lon: this.lastUserLocation.lon,
                horizontalAccuracy: this.lastUserLocation.horizontalAccuracy
            };
            new TWEEN.Tween(currentLocation)
                .to(
                    {
                        lat: position.lat,
                        lon: position.lon,
                        horizontalAccuracy: position.horizontalAccuracy
                    },
                    LOCATION_ANIMATION_DURATION
                )
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(newPos => {
                    this.userBackMarker.position = newPos;
                    this.userMarker.position = newPos;
                    this.accuracyMarker.positions = this.getCirclePoints(newPos);
                })
                .start(0);
        } else {
            this.getOrCreateLocalVectorLayer();
            // const projection = this.mapView.projection;

            this.accuracyMarker = new Polygon({
                positions: this.getCirclePoints(geoPos),
                styleBuilder: {
                    size: 16,
                    color: new Color(70, 14, 122, 254),
                    lineStyleBuilder: {
                        color: new Color(150, 14, 122, 254),
                        width: 1
                    }
                }
            });
            this.localVectorDataSource.add(this.accuracyMarker);

            this.userBackMarker = new Point({
                position,
                styleBuilder: {
                    size: 17,
                    color: '#ffffff'
                }
            });
            this.localVectorDataSource.add(this.userBackMarker);
            this.userMarker = new Point({
                position,
                styleBuilder: {
                    size: 14,
                    color: '#0e7afe'
                }
            });
            this.localVectorDataSource.add(this.userMarker);
            // this.userBackMarker.position = position;
            // this.userMarker.position = position;
        }
        if (this.userFollow) {
            this._cartoMap.setZoom(Math.max(this._cartoMap.zoom, 16), position, LOCATION_ANIMATION_DURATION);
            this._cartoMap.setFocusPos(position, LOCATION_ANIMATION_DURATION);
        }
        this.lastUserLocation = geoPos;
    }
    onLocation(data: UserLocationdEventData) {
        if (data.error) {
            console.log(data.error);
            return;
        }
        // const { android, ios, ...toPrint } = data.location;
        console.log('onLocation', data.location);
        this.updateUserLocation(data.location);
    }
    // onServiceLoaded(bluetoothHandler, geoHandler: GeoHandler) {
    //     this.geoHandlerOn(UserLocationdEvent, this.onLocation, this);
    // }
    askUserLocation() {
        this.userFollow = true;
        return this.geoHandler.enableLocation(false).then(() => this.geoHandler.getLocation());
    }

    // updateSession() {
    //     if (!this.session || !this._cartoMap) {
    //         return;
    //     }
    //     if (!this.sessionLine) {
    //         this.sessionLine = new Line({
    //             positions: [],
    //             styleBuilder: {
    //                 color: 'orange',
    //                 joinType: LineJointType.ROUND,
    //                 endType: LineEndType.ROUND,
    //                 clickWidth: 20,
    //                 width: 10
    //             }
    //         });
    //         this.getOrCreateLocalVectorLayer();
    //         this.localVectorDataSource.add(this.sessionLine);
    //     }
    //     this.sessionLine.positions = this.session.locs.map(l => ({ lat: l.lat, lon: l.lon }));
    // }
    // @Watch('session', { deep: true })
    // onSessionUpdated(s: Session) {
    //     // console.log('onSessionUpdated', s);
    //     this.updateSession();

    //     // this.log('createPolyline', JSON.stringify(result));
    // }
}
