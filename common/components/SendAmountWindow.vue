<template>
    <BasePage id="send" :title="$t('send_money')" showMenuIcon actionBarThemed>
        <StackLayout padding="20">
            <Label :text="$tc('recipient')" fontSize="25" color="#A0A0A0" />
            <GridLayout columns="auto,*,auto" height="48" borderRadius="24" borderWidth="1" borderColor="#F1F1F1" margin="20 0 20 0">
                <Label
                    class="mdi"
                    marginLeft="5"
                    borderRadius="20"
                    borderWidth="1"
                    color="#888888"
                    borderColor="#888888"
                    fontSize="24"
                    textAlignment="center"
                    verticalTextAlignment="center"
                    text="mdi-account"
                    v-show="!recipient.image"
                    width="40"
                    height="40"
                />
                <Label col="1" :text="recipient && recipient.name" fontSize="18" margin="10" color="#A3A3A3" verticalTextAlignment="center" />
                <Label col="2" text="mdi-check" :color="colorPrimary" fontSize="22" :fontFamily="mdiFontFamily" verticalTextAlignment="center" marginRight="10" />
            </GridLayout>
            <Label :text="$tc('amount')" fontSize="25" margin="10" />
            <TextField
                textAlignment="right"
                class="input"
                fontWeight="bold"
                ref="amountTF"
                fontSize="36"
                :hint="$tc('amount')"
                keyboardType="number"
                digits="0123456789.,"
                returnKeyType="done"
                errorColor="white"
                @loaded="onAmountTFLoaded"
                @textChange="validateAmount"
            />
            <GridLayout columns="*,auto" v-show="!!amount" rows="auto">
                <TextField :hint="$tc('add_optional_text')" placeholderColor="#BBBBBB" backgroundColor="#ECECEC" verticalAlignment="center" margin="0 10 0 10" borderRadius="20"/>
                <Button col="1" :text="$tc('next')" @tap="submit"/>
            </GridLayout>
        </StackLayout>
    </BasePage>
</template>

<script lang="ts" src="./SendAmountWindow.ts" />
