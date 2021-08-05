<template>
    <BasePage id="send" :title="$t('credit_my_account')" showMenuIcon actionBarThemed>
        <GridLayout>
            <StackLayout padding="20">
                <StackLayout rows="auto,auto,auto">
                    <Label horizontalAlignment="center" margin="0 0 30 0">
                        <Span :text="$tc('actual_balance') + '\n'" fontSize="14" />
                        <Span :text="' '" fontSize="36" />
                        <Span :text="totalSold | currency" fontSize="36" />
                        <Span :text="' ' + symbol" fontSize="36" />
                    </Label>
                </StackLayout>
                <Label :text="$tc('amount_to_credit')" fontSize="25" margin="10" />
                <TextField
                    textAlignment="right"
                    class="input"
                    fontWeight="bold"
                    ref="amountTF"
                    floating="false"
                    fontSize="36"
                    keyboardType="number"
                    digits="0123456789.,"
                    returnKeyType="done"
                    errorColor="white"
                    @loaded="onAmountTFLoaded"
                    @textChange="validateAmount"
                />
                <Button col="1" :text="$tc('next')" @tap="submit" />
            </StackLayout>
            <AWebView
                ref="webView"
                :src="creditUrl"
                :visibility="showWebView ? 'visible' : 'hidden'"
                @loadStarted="onUrlLoadStarted"
                @loadFinished="onUrlLoadFinished"
                domStorage
                supportZoom="false"
            />
            <MDActivityIndicator v-show="loading" row="1" :busy="{ loading }" verticalAlignment="center" horizontalAlignment="center" />
        </GridLayout>
    </BasePage>
</template>

<script lang="ts" src="./CreditAmountWindow.ts" />
