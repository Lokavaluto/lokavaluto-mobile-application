<template>
    <BasePage id="home" showMenuIcon @navigatedTo="onNavigatedTo">
        <InteractiveMap id="homeMap" :isUserInteractionEnabled="true" :loadCategories="false" />
        <GridLayout @tap="goToMap" />

        <MDCardView elevation="10" borderRadius="25" margin="0 40 50 40" v-show="!currentlyLoggedIn" verticalAlignment="bottom">
            <StackLayout>
                <Label padding="20" @tap="() => {}" :color="colorAccent" lineHeight="10" textWrap="true">
                    <!-- <CGroup :color="colorAccent" lineHeight="30"> -->
                    <Span text="mdi-check" :color="colorPrimary" fontSize="22" :fontFamily="mdiFontFamily" verticalTextAlignment="center" />
                    <Span :text="' ' + $tc('apy_my_purchases')" :color="colorAccent" fontSize="16" fontWeight="bold" verticalTextAlignment="center" />
                    <Span :text="'\n' + 'mdi-check'" :color="colorPrimary" fontSize="22" :fontFamily="mdiFontFamily" verticalTextAlignment="center" />
                    <Span :text="' ' + $tc('send_request_money')" :color="colorAccent" fontSize="16" fontWeight="bold" verticalTextAlignment="center" />
                    <!-- </CGroup> -->
                </Label>
                <Button :text="$t('login')" @tap="goToLogin" margin="0" elevation="0" dynamicElevationOffset="0" />
            </StackLayout>
        </MDCardView>
        <MDCardView elevation="10" shape="homeCard" margin="0 40 0 40" v-show="currentlyLoggedIn" verticalAlignment="bottom" @tap="() => {}">
            <GridLayout columns="*,*" rows="auto,auto,auto" padding="24 16 24 16">
                <Label>
                    <Span :text="$tc('balance')" fontSize="14" />
                    <Span :text="'\n' + ' '" fontSize="24" />
                    <Span :text="totalSold | currency" fontSize="24" />
                    <Span :text="' ' + symbol" fontSize="24" />
                </Label>
                <Button col="1" variant="text" :text="$tc('credit')" horizontalAlignment="right" @tap="goToCredit" />
                <ButtonWithIcon colSpan="2" row="1" icon="mdi-qrcode-scan" :text="$tc('pay_my_purchases')" @tap="goToPay" />
                <ButtonWithIcon colSpan="2" row="2" icon="mdi-swap-horizontal" :text="$tc('send_request')" @tap="goToSendRequest" />
            </GridLayout>
        </MDCardView>
    </BasePage>
</template>

<script lang="ts" src="./Home.ts" />
