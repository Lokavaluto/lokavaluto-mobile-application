<template>
    <CartoMap ref="mapView" zoom="16" @mapReady="onMapReady" @mapMoved="onMapMove" @mapStable="onMapStable" @mapClicked="onMapClicked" :useTextureView="true"/>
</template>

<script lang="ts" src="./MapComponent.ts" />
