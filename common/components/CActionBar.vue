<template>
    <GridLayout class="actionBar" columns="auto,*, auto" rows="auto,auto">
        <!-- <StackLayout col="1" colSpan="3" orientation="horizontal" :height="height"> -->
        <StackLayout verticalAlignment="center" col="1" colSpan="3" :height="height">
            <Label class="actionBarTitle" v-if="title" :text="title | capitalize" />
            <Label :visibility="!!subtitle ? 'visible' : 'collapse'" class="actionBarSubtitle" :text="subtitle" />
        </StackLayout>
        <!-- </StackLayout> -->
        <ContentView colSpan="3" :height="height">
            <slot name="title">
                <Label
                    v-if="!!showLogo && !title"
                    :fontFamily="appFontFamily"
                    :fontSize="titleFontSize"
                    :color="primaryColor"
                    text="app-full_logo"
                    textAlignment="center"
                    verticalAlignment="center"
                    @tap="$emit('titleTap', $event)"
                />
            </slot>
        </ContentView>
        <slot row="1" colSpan="3" name="subView" />

        <StackLayout orientation="horizontal" col="2" verticalAlignment="top" :height="height">
            <slot name="rightButtons" />
        </StackLayout>
        <StackLayout col="0" verticalAlignment="top" :height="height" orientation="horizontal">
            <Button verticalAlignment="top" variant="flat" v-show="menuIconVisible" class="icon-btn" :text="menuIcon" @tap="onMenuIcon" />
            <slot name="leftButtons" />
        </StackLayout>
        <!-- <StackLayout col="2" orientation="horizontal"> -->
        <!-- </StackLayout> -->
        <!-- <ContentView > -->
        <!-- </ContentView> -->
    </GridLayout>
</template>

<script lang="ts" src="./CActionBar.ts" />
