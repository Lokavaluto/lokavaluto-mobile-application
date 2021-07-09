<template>
    <BasePage id="sendreceive" :title="$t('bank')" showMenuIcon actionBarThemed :actionBarElevation="0">
        <GridLayout rows="auto,*">
            <TabsBar :options="[$tc('pay_my_purchases'), $tc('send_request'), $tc('my_account')]" :selected="pageIndex" @changed="pageIndex = $event" />

            <Pager v-model="pageIndex" row="1">
                <PagerItem>
                    <StackLayout rows="auto,auto,auto">
                        <Label horizontalAlignment="center" margin="30 0 30 0">
                            <Span :text="$tc('balance') + '\n'" fontSize="14" />
                            <Span :text="' '" fontSize="36" />
                            <Span :text="totalSold | currency" fontSize="36" />
                            <Span :text="' ' + symbol" fontSize="36" />
                        </Label>
                        <ButtonWithIcon row="1" icon="mdi-qrcode-scan" :text="$tc('pay_with_qrcode')" @tap="payWithQrcode" />
                        <Label :text="$tc('or')" margin="10" verticalTextAlignment="center" textAlignment="center" />
                        <ButtonWithIcon variant="outline" row="2" icon="mdi-magnify" :text="$tc('search_by_location')" @tap="payWithSearch" />
                    </StackLayout>
                </PagerItem>
                <PagerItem>
                    <GridLayout rows="auto,auto,auto">
                        <Label horizontalAlignment="center" margin="30 0 30 0">
                            <Span :text="$tc('balance') + '\n'" fontSize="14" />
                            <Span :text="' '" fontSize="36" />
                            <Span :text="totalSold | currency" fontSize="36" />
                            <Span :text="' ' + symbol" fontSize="36" />
                        </Label>
                        <ButtonWithIcon row="1" icon="mdi-arrow-right-bold" :text="$tc('send')" @tap="goToSend" />
                        <ButtonWithIcon variant="outline" row="2" icon="mdi-arrow-left-bold" :text="$tc('request')" />
                    </GridLayout>
                </PagerItem>
                <PagerItem>
                    <GridLayout rows="auto,auto,*">
                        <Label horizontalAlignment="center" margin="30 0 30 0">
                            <Span :text="$tc('global_balance') + '\n'" fontSize="14" />
                            <Span :text="' '" fontSize="36" />
                            <Span :text="totalSold | currency" fontSize="36" />
                            <Span :text="' ' + symbol" fontSize="36" />
                        </Label>
                        <StackLayout row="1" orientation="horizontal" horizontalAlignment="center">
                            <Button variant="outline" :text="$tc('details')" />
                            <Button :text="$tc('credit')" />
                        </StackLayout>
                    </GridLayout>
                </PagerItem>
            </Pager>
        </GridLayout>
    </BasePage>
</template>

<script lang="ts" src="./SendReceiveWindow.ts" />
