<template>
    <BasePage id="map" :title="$t('map')" showMenuIcon>
        <InteractiveMap :locationButton="true" />
    </BasePage>
</template>

<script lang="ts" src="./Map.ts" />
