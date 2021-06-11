<template>
    <BasePage id="map" :title="$t('map')" showMenuIcon>
        <InteractiveMap />

        <MDCardView class="flatCardView" shape="round" elevation="6" margin="30 30 80 30" v-if="!currentlyLoggedIn" verticalAlignment="bottom">
            <Button shape="round" :text="$t('login')" @tap="goToLogin" />
        </MDCardView>
    </BasePage>
</template>

<script lang="ts" src="./Map.ts" />
