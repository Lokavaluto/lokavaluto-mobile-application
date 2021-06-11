<template>
    <BottomSheet :opacity="opacity" @layoutChanged="onLayoutChange" :panGestureOptions="{ bottomSheetPanGestureOptions }" :steps="[0, 80]" :stepIndex="bottomSheetStepIndex">
        <MapComponent
            ref="mapComp"
            rowSpan="2"
            showLocationButton="true"
            @mapReady="onMapReady"
            @mapStable="onMapStable"
            @elementClick="onElementClick"
            :vectorTileClicked="onVectorTileClicked"
            @mapClicked="onMapClicked"
        />
        <GridLayout verticalAlignment="bottom" :translateY="-bottomSheetTranslation" :opacity="scrollingWidgetsOpacity">
            <Button @tap="askUserLocation" class="floating-btn" margin="8" text="mdi-crosshairs-gps" horizontalAlignment="right" verticalAlignment="bottom" />
            <Button
                @tap="selectCategories"
                v-show="mapCategories && mapCategories.length > 0"
                class="floating-btn"
                backgroundColor="white"
                :color="colorAccent"
                margin="8"
                text="mdi-filter"
                horizontalAlignment="left"
                verticalAlignment="bottom"
            />
        </GridLayout>
        <MapBottomSheet ~bottomSheet :item="selectedItem" />
        <MDActivityIndicator v-show="loading" row="1" :busy="{ loading }" verticalAlignment="center" horizontalAlignment="center" />
    </BottomSheet>
</template>

<script lang="ts" src="./InteractiveMap.ts" />
