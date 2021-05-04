<template>
    <BasePage id="map" :title="$t('map')" showMenuIcon>
        <InteractiveMap />

        <StackLayout class="flatCardView" elevation="6" height="50" margin="30" v-if="!currentlyLoggedIn" verticalAlignment="bottom">
            <Button :text="$t('login')" @tap="goToLogin" />
        </StackLayout>
    </BasePage>
</template>

<script lang="ts" src="./Map.ts" />
