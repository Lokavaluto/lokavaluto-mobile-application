<template>
    <Frame>
        <BasePage showMenuIcon modal actionBarThemed :title="title">
            <MDActivityIndicator slot="actionBarRightButtons" v-show="loading" busy class="activity-indicator" />
            <GridLayout class="pageContent" rows="auto,auto,8,*">
                <GridLayout columns="auto,*,auto,auto,auto" height="50" margin="10 16 10 16" borderRadius="25" borderWidth="1" borderColor="#F2F2F2" padding="0 10 0 10">
                    <Label color="gray" class="label-icon-btn" text="mdi-magnify" verticalAlignment="center" />
                    <TextField
                        col="1"
                        class="input"
                        :hint="$tc('user_search_hint')"
                        autocorrect="false"
                        autocapitalizationType="none"
                        floating="false"
                        fontSize="17"
                        variant="none"
                        ref="textField"
                        width="100%"
                        color="black"
                        verticalAlignment="center"
                        @focus="onFocus"
                        @blur="onBlur"
                        @textChange="onTextChange"
                        paddingRight="5"
                        @loaded="onTFLoaded"
                    />
                    <Button v-if="canScanQrCode" col="2" variant="text" class="icon-btn" text="mdi-qrcode-scan" />
                    <Button v-show="!!currentQueryText" col="3" variant="text" class="icon-btn" text="mdi-close" />
                </GridLayout>
                <TabsBar
                    row="1"
                    :height="40"
                    :elevation="0"
                    :options="[$tu('all'), { text: $tu('favorites'), icon: 'mdi-star', iconColor: '#D8D8D8', iconSelectedColor: '#F4BA40' }]"
                    :selected="selectionIndex"
                    @changed="onTabSelectionChanged"
                    :centered="true"
                    :backgroundColor="backgroundColor"
                    :textColor="textColor"
                    :borderColor="colorPrimary"
                />
                <AbsoluteLayout row="2" backgroundColor="#F2F2F2" />
                <Label />
                <CollectionView row="3" rowHeight="70" :items="filteredDataItems">
                    <v-template>
                        <GridLayout columns="30,60,*, auto" @tap="chooseRecipient(item)" :rippleColor="colorPrimary">
                            <Label :visibility="item.isFavorite ? 'visible' : 'hidden'" class="mdi" text="mdi-star" color="#F4BA40" />
                            <Label
                                col="1"
                                :visibility="item.isHistory ? 'visible' : 'hidden'"
                                class="mdi"
                                text="mdi-history"
                                backgroundColor="#D8D8D8"
                                color="#636363"
                                width="40"
                                fontSize="24"
                                textAlignment="center"
                                verticalTextAlignment="center"
                                height="40"
                                borderRadius="20"
                            />
                            <StackLayout col="2" verticalAlignment="center">
                                <Label :fontSize="17" :text="item.name" textWrap="true" verticalTextAlignment="top" maxLines="2" lineBreak="end" />
                                <Label :fontSize="14" :text="item | address" :color="subtitleColor" :maxLines="1" lineBreak="end" />
                            </StackLayout>
                            <Button v-if="!clickToShowProfile" col="3" variant="text" class="icon-btn" text="mdi-dots-vertical" @tap="showUserDetails(item)" />
                            <AbsoluteLayout col="2" colSpan="2" verticalAlignment="bottom" backgroundColor="#ECECEC" height="1" />
                        </GridLayout>
                    </v-template>
                </CollectionView>
            </GridLayout>
        </BasePage>
    </Frame>
</template>

<script lang="ts" src="./UserPicker.ts" />
