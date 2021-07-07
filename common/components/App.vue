<template>
    <Page ref="page" @navigatingTo="onNavigatingTo" actionBarHidden="true" @loaded="onLoaded">
        <Drawer ref="drawer">
            <GridLayout ~leftDrawer rows="auto,*,auto" height="100%" width="80%" backgroundColor="white">
                <GridLayout v-if="userProfile" height="130" padding="15 15 5 15" borderBottomWidth="1" borderBottomColor="#E0E0E0" rows="50,4,*,*" columns="50,*" marginBottom="4">
                    <Button variant="flat" class="menu-btn" row="0" col="1" horizontalAlignment="right" text="mdi-logout" @tap="onTap('logout')" />
                    <Label class="mdi" borderRadius="25" borderWidth="1" color="#888" borderColor="#888" fontSize="40" textAlignment="center" text="mdi-account" v-show="!userProfile.image" />
                    <NSImg :src="userProfile.image" v-show="!!userProfile.image" noCache />
                    <Label row="2" colSpan="2" fontSize="20" fontWeight="500" verticalAlignment="bottom" :text="userProfile.name" />
                    <Label row="3" colSpan="2" fontSize="15" color="#686868" verticalAlignment="top" :text="userProfile.email" />
                </GridLayout>
                <GridLayout v-if="!userProfile" height="150" padding="15 15 5 15" borderBottomWidth="1" borderBottomColor="#E0E0E0" marginBottom="4" columns="50,*">
                    <Label :fontFamily="appFontFamily" colSpan="2" fontSize="40" :color="themeColor" text="app-full_logo" textAlignment="center" verticalAlignment="top" verticalTextAlignment="top" />
                    <Label
                        class="mdi"
                        borderRadius="20"
                        borderWidth="1"
                        :color="themeColor"
                        :borderColor="themeColor"
                        fontSize="30"
                        width="40"
                        height="40"
                        marginBottom="10"
                        textAlignment="center"
                        text="mdi-account"
                        verticalTextAlignment="center"
                        verticalAlignment="bottom"
                    />
                    <Button col="1" :text="$t('login')" @tap="goToLogin" verticalAlignment="bottom" />
                </GridLayout>
                <ScrollView row="1" @tap="noop">
                    <StackLayout ref="menu" @tap="noop">
                        <GridLayout v-for="item in menuItems" :key="item.url" columns="50, *" class="menu" :active="isActiveUrl(item.url)" @tap="onNavItemTap(item.url)">
                            <Label col="0" class="menuIcon" :text="item.icon" verticalAlignment="center" :active="activatedUrl === item.url" />
                            <Label col="1" class="menuText" :text="item.title | capitalize" verticalAlignment="center" :active="activatedUrl === item.url" />
                        </GridLayout>
                    </StackLayout>
                </ScrollView>
                <GridLayout columns="*,auto" row="2" width="100%" class="menuInfos menuButtons">
                    <Label :text="'App version: ' + (appVersion || '')" padding="10 0 10 0" verticalTextAlignment="center" />
                    <!-- <Button variant="flat" text="mdi-email" @tap="onTap('sendFeedback')" /> -->
                    <Button col="1" variant="flat" v-if="$crashReportService.sentryEnabled" text="mdi-bug" @tap="onTap('sendBugReport')" />
                </GridLayout>
            </GridLayout>
            <!-- <GridLayout> -->
            <Frame ~mainContent ref="innerFrame" id="innerFrame">
                <Home />
            </Frame>
            <!-- <Label :text="$t('no_network_desc')"  verticalAlignment="bottom" textAlignment="center" color="white" backgroundColor="red" padding="10"/> -->
            <!-- </GridLayout> -->
        </Drawer>
    </Page>
</template>

<script lang="ts" src="./App.ts" />
