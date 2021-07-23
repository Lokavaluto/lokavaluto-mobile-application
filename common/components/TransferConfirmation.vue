<template>
    <!-- <Frame> -->
    <!-- <BasePage modal backgroundColor="transparent" actionBarHidden> -->
    <StackLayout padding="30 30 0 30" rows="*,*,*" height="400">
        <!-- <StackLayout verticalAlignment="center"> -->
        <Label :text="$tc('transaction_done')" textAlignment="center" fontSize="20" />
        <Label text="mdi-check" :color="colorPrimary" fontSize="50" :fontFamily="mdiFontFamily" textAlignment="center" />
        <!-- </StackLayout> -->
        <!-- <StackLayout row="1" verticalAlignment="center"> -->
        <Label :text="$tc('recipient')" fontSize="16" color="#A0A0A0" textAlignment="center" marginTop="20" />
        <Label
            class="mdi"
            marginTop="5"
            borderRadius="44"
            borderWidth="1"
            color="#888888"
            borderColor="#888888"
            fontSize="50"
            textAlignment="center"
            verticalTextAlignment="center"
            text="mdi-account"
            v-show="!recipient.image"
            width="88"
            height="88"
        />
        <Label :text="recipient.name" fontSize="24" fontWeight="bold" textAlignment="center" marginTop="10" />
        <!-- </StackLayout> -->
        <!-- <StackLayout row="2" verticalAlignment="center"> -->
        <Label :text="$tc('amount')" fontSize="16" color="#A0A0A0" textAlignment="center" marginTop="30" />
        <Label textAlignment="center" fontSize="40" fontWeight="bold">
            <Span :text="amount | currency" />
            <Span :text="' ' + symbol" />
        </Label>
        <!-- </StackLayout> -->
    </StackLayout>
    <!-- </BasePage> -->
    <!-- </Frame> -->
</template>

<script lang="ts" src="./TransferConfirmation.ts" />
