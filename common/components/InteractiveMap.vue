<template>
    <BottomSheet :opacity="opacity" :panGestureOptions="bottomSheetPanGestureOptions" :steps="bottomSheetSteps" v-model="bottomSheetStepIndex" @close="unselectItem">
        <MapComponent
            ref="mapComp"
            rowSpan="2"
            :isUserInteractionEnabled="isUserInteractionEnabled"
            showLocationButton="true"
            @mapReady="onMapReady"
            @mapStable="onMapStable"
            @elementClick="onElementClick"
            :vectorTileClicked="onVectorTileClicked"
            @mapClicked="onMapClicked"
        />
        <GridLayout verticalAlignment="bottom" :translateY="-bottomSheetTranslation" :opacity="scrollingWidgetsOpacity">
            <Button v-show="locationButton" @tap="askUserLocation" class="floating-btn" margin="8" text="mdi-crosshairs-gps" horizontalAlignment="right" verticalAlignment="bottom" />
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
        <MapBottomSheet ~bottomSheet :height="bottomSheetHeight" :items="shownUsers" :selectedPageIndex="selectedItemIndex" />
        <MDActivityIndicator v-show="loading" row="1" :busy="{ loading }" verticalAlignment="center" horizontalAlignment="center" />
    </BottomSheet>
</template>

<script lang="ts" src="./InteractiveMap.ts" />
