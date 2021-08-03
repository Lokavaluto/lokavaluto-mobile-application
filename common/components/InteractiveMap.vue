<template>
    <BottomSheet :opacity="opacity" :panGestureOptions="bottomSheetPanGestureOptions" :steps="bottomSheetSteps" v-model="bottomSheetStepIndex" @close="unselectItem" @layoutChanged="onLayoutChange">
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
        <scrollview verticalAlignment="top" height="40" orientation="horizontal" marginTop="5" :scrollBarIndicatorVisible="false" v-show="mapCategories && mapCategories.length > 0">
            <stacklayout orientation="horizontal">
                <label
                    v-for="option in mapCategories"
                    :key="option.id"
                    :rippleColor="colorAccent"
                    :text="option.name"
                    margin="0 5 0 5"
                    padding="5 15 5 15"
                    backgroundColor="white"
                    borderRadius="20"
                    verticalTextAlignment="center"
                    fontSize="14"
                />
            </stacklayout>
        </scrollview>
        <GridLayout verticalAlignment="bottom" :translateY="-bottomSheetTranslation" :opacity="scrollingWidgetsOpacity" isPassThroughParentEnabled>
            <ButtonWithIcon v-show="locationButton" @tap="askUserLocation" :text="$tc('geolocate_me')" margin="8" icon="mdi-crosshairs-gps" horizontalAlignment="center" verticalAlignment="bottom" />
            <!-- <Button
                @tap="selectCategories"
                v-show="mapCategories && mapCategories.length > 0"
                class="floating-btn"
                backgroundColor="white"
                :color="colorAccent"
                margin="8"
                text="mdi-filter"
                horizontalAlignment="left"
                verticalAlignment="bottom"
            /> -->
        </GridLayout>
        <MapBottomSheet ~bottomSheet :height="bottomSheetHeight" :items="shownUsers" :selectedPageIndex="selectedItemIndex" />
        <MDActivityIndicator v-show="loading" row="1" :busy="{ loading }" verticalAlignment="center" horizontalAlignment="center" />
    </BottomSheet>
</template>

<script lang="ts" src="./InteractiveMap.ts" />
