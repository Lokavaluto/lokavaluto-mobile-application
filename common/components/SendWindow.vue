<template>
    <BasePage id="send" :title="$t('send_money')" showMenuIcon actionBarThemed>
        <GridLayout rows="auto,auto,auto,*" padding="10">
            <Label :text="$tc('who_to_send_money_to')" opacity="0.6" fontSize="16" textAlignment="center" margin="10" />
            <Button variant="outline" row="1" :text="$tc('to_a_pro')" @tap="searchPro" margin="10" />
            <Button variant="outline" row="2" :text="$tc('to_an_individual')" @tap="searchIndividual" margin="10" />
            <Button variant="text" row="3" :height="null" class="mdi" fontSize="100" text="mdi-qrcode-scan" @tap="scanQRCode" />
        </GridLayout>
    </BasePage>
</template>

<script lang="ts" src="./SendWindow.ts" />
