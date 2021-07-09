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
                            <Button shape="round" padding="10 20 10 20" variant="outline" :text="$tc('details')" />
                            <Button shape="round" padding="10 20 10 20" :text="$tc('credit')" />
                        </StackLayout>
                        <PullToRefresh ref="pullRefresh" @refresh="refreshHistory" row="2">
                            <CollectionView :items="transactions" :itemIdGenerator="(item, i) => i" rowHeight="70">
                                <v-template>
                                    <GridLayout columns="50,*" padding="5 25 4 0">
                                        <StackLayout col="1" verticalAlignment="center">
                                            <Label :fontSize="17" :text="item.name" textWrap="true" verticalTextAlignment="bottom">
                                                <Span :text="item.amount.split('.')[0]" verticalTextAlignment="bottom" />
                                                <Span text="," fontSize="14" verticalTextAlignment="bottom" />
                                                <Span :text="item.amount.split('.')[1]" fontSize="14" verticalTextAlignment="bottom" />
                                                <Span :text="' ' + symbol" verticalTextAlignment="bottom" />
                                            </Label>
                                            <Label :fontSize="14" :text="item.jsonData.relatedUser.display" :color="subtitleColor" paddingTpo="2" />
                                        </StackLayout>
                                        <Label col="1" :fontSize="12" :text="item.date | dateRelative" :color="subtitleColor" textAlignment="right" verticalTextAlignment="top" />
                                        <AbsoluteLayout colSpan="2" verticalAlignment="bottom" backgroundColor="#ECECEC" height="1" marginLeft="10" />
                                    </GridLayout>
                                </v-template>
                            </CollectionView>
                        </PullToRefresh>
                    </GridLayout>
                </PagerItem>
            </Pager>
        </GridLayout>
    </BasePage>
</template>

<script lang="ts" src="./SendReceiveWindow.ts" />
