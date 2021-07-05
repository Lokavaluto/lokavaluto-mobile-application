<template>
    <BasePage id="map" :title="$t('map')" showMenuIcon>
        <InteractiveMap />

        <StackLayout class="flatCardView" elevation="10" borderRadius="20" margin="30 30 80 30" v-if="!currentlyLoggedIn" verticalAlignment="bottom">
            <!-- <StackLayout> -->
            <CanvasLabel height="100" padding="20">
                <CGroup :color="colorAccent" lineHeight="30">
                    <CSpan text="mdi-check" color="#46B020" fontSize="22" :fontFamily="mdiFontFamily"  verticalTextAlignment="center"/>
                    <CSpan :text="' ' + $tc('apy_my_purchases')" fontSize="16" fontWeight="bold"   verticalTextAlignment="center" />
                    <CSpan :text="'\n' + 'mdi-check'" color="#46B020" fontSize="22" :fontFamily="mdiFontFamily"  verticalTextAlignment="center"/>
                    <CSpan :text="' ' + $tc('send_request_money')" fontSize="16" fontWeight="bold"  verticalTextAlignment="center"/>
                </CGroup>
            </CanvasLabel>
            <Button shape="round" :text="$t('login')" @tap="goToLogin" margin="0" elevation="0" dynamicElevationOffset="0"/>
            <!-- </StackLayout> -->
        </StackLayout>
        <StackLayout class="flatCardView" elevation="10" borderRadius="20" margin="30 30 80 30" v-if="currentlyLoggedIn" verticalAlignment="bottom">
            <!-- <StackLayout> -->
            <!-- <CanvasLabel height="100" padding="20">
                <CGroup :color="colorAccent" lineHeight="30">
                    <CSpan text="mdi-check" color="#46B020" fontSize="22" :fontFamily="mdiFontFamily"  verticalTextAlignment="center"/>
                    <CSpan :text="' ' + $tc('apy_my_purchases')" fontSize="16" fontWeight="bold"   verticalTextAlignment="center" />
                    <CSpan :text="'\n' + 'mdi-check'" color="#46B020" fontSize="22" :fontFamily="mdiFontFamily"  verticalTextAlignment="center"/>
                    <CSpan :text="' ' + $tc('send_request_money')" fontSize="16" fontWeight="bold"  verticalTextAlignment="center"/>
                </CGroup>
            </CanvasLabel>
            <Button shape="round" :text="$t('login')" @tap="goToLogin" margin="0" elevation="0" dynamicElevationOffset="0"/> -->
            <!-- </StackLayout> -->
        </StackLayout>
    </BasePage>
</template>

<script lang="ts" src="./Map.ts" />
