<template>
    <BasePage id="home" :title="$t('home')" showMenuIcon>
        <MapComponent :isUserInteractionEnabled="false" />

        <StackLayout class="flatCardView" elevation="10" borderRadius="20" margin="0 40 50 40" v-if="!currentlyLoggedIn" verticalAlignment="bottom">
            <CanvasLabel height="100" padding="20">
                <CGroup :color="colorAccent" lineHeight="30">
                    <CSpan text="mdi-check" color="#46B020" fontSize="22" :fontFamily="mdiFontFamily" verticalTextAlignment="center" />
                    <CSpan :text="' ' + $tc('apy_my_purchases')" fontSize="16" fontWeight="bold" verticalTextAlignment="center" />
                    <CSpan :text="'\n' + 'mdi-check'" color="#46B020" fontSize="22" :fontFamily="mdiFontFamily" verticalTextAlignment="center" />
                    <CSpan :text="' ' + $tc('send_request_money')" fontSize="16" fontWeight="bold" verticalTextAlignment="center" />
                </CGroup>
            </CanvasLabel>
            <Button shape="round" :text="$t('login')" @tap="goToLogin" margin="0" elevation="0" dynamicElevationOffset="0" />
        </StackLayout>
        <StackLayout class="flatCardView" elevation="10" borderRadius="20 20 0 0" margin="0 40 0 40" v-if="currentlyLoggedIn" verticalAlignment="bottom" padding="24 16 24 16">
            <GridLayout columns="*,*" rows="auto,auto,auto">
                <Label>
                    <Span :text="$tc('balance')" fontSize="14" />
                    <Span :text="'\n' + ' '" fontSize="24" />
                    <Span :text="totalSold | currency" fontSize="24" />
                    <Span :text="' ' + symbol" fontSize="24" />
                </Label>
                <Button col="1" variant="text" :text="$tc('credit')" horizontalAlignment="right" />
                <ButtonWithIcon colSpan="2" row="1" icon="mdi-qrcode-scan" :text="$tc('pay_my_purchases')" />
                <ButtonWithIcon variant="text" colSpan="2" row="2" icon="mdi-swap-horizontal" :text="$tc('send_ask')" />
                <!-- <CanvasLabel height="100" padding="20">
                <CGroup :color="colorAccent" lineHeight="30">
                    <CSpan text="mdi-check" color="#46B020" fontSize="22" :fontFamily="mdiFontFamily"  verticalTextAlignment="center"/>
                    <CSpan :text="' ' + $tc('apy_my_purchases')" fontSize="16" fontWeight="bold"   verticalTextAlignment="center" />
                    <CSpan :text="'\n' + 'mdi-check'" color="#46B020" fontSize="22" :fontFamily="mdiFontFamily"  verticalTextAlignment="center"/>
                    <CSpan :text="' ' + $tc('send_request_money')" fontSize="16" fontWeight="bold"  verticalTextAlignment="center"/>
                </CGroup>
            </CanvasLabel>
            <Button shape="round" :text="$t('login')" @tap="goToLogin" margin="0" elevation="0" dynamicElevationOffset="0"/> -->
            </GridLayout>
        </StackLayout>
    </BasePage>
</template>

<script lang="ts" src="./Home.ts" />
