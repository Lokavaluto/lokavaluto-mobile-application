<template>
    <BasePage id="home" showMenuIcon @navigatedTo="onNavigatedTo">
        <InteractiveMap id="homeMap" :isUserInteractionEnabled="true" :loadCategories="false" />
        <GridLayout @tap="goToMap" />

        <StackLayout class="flatCardView" elevation="10" borderRadius="25" margin="0 40 50 40" v-show="!currentlyLoggedIn" verticalAlignment="bottom">
            <CanvasLabel height="100" padding="20" @tap="() => {}">
                <CGroup :color="colorAccent" lineHeight="30">
                    <CSpan text="mdi-check" :color="colorPrimary" fontSize="22" :fontFamily="mdiFontFamily" verticalTextAlignment="center" />
                    <CSpan :text="' ' + $tc('apy_my_purchases')" fontSize="16" fontWeight="bold" verticalTextAlignment="center" />
                    <CSpan :text="'\n' + 'mdi-check'" :color="colorPrimary" fontSize="22" :fontFamily="mdiFontFamily" verticalTextAlignment="center" />
                    <CSpan :text="' ' + $tc('send_request_money')" fontSize="16" fontWeight="bold" verticalTextAlignment="center" />
                </CGroup>
            </CanvasLabel>
            <Button :text="$t('login')" @tap="goToLogin" margin="0" elevation="0" dynamicElevationOffset="0" />
        </StackLayout>
        <StackLayout class="flatCardView" elevation="10" borderRadius="25 25 0 0" margin="0 40 0 40" v-show="currentlyLoggedIn" verticalAlignment="bottom" padding="24 16 24 16" @tap="() => {}">
            <GridLayout columns="*,*" rows="auto,auto,auto">
                <Label>
                    <Span :text="$tc('balance')" fontSize="14" />
                    <Span :text="'\n' + ' '" fontSize="24" />
                    <Span :text="totalSold | currency" fontSize="24" />
                    <Span :text="' ' + symbol" fontSize="24" />
                </Label>
                <Button col="1" variant="text" :text="$tc('credit')" horizontalAlignment="right" />
                <ButtonWithIcon colSpan="2" row="1" icon="mdi-qrcode-scan" :text="$tc('pay_my_purchases')" @tap="goToPay" />
                <ButtonWithIcon variant="text" colSpan="2" row="2" icon="mdi-swap-horizontal" :text="$tc('send_request')" @tap="goToSendRequest" />
            </GridLayout>
        </StackLayout>
    </BasePage>
</template>

<script lang="ts" src="./Home.ts" />
