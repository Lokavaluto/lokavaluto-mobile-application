<template>
    <GridLayout class="actionBar" columns="auto,*, auto" rows="auto,auto" :themed="themed">
        <!-- <StackLayout col="1" colSpan="3" orientation="horizontal" :height="height"> -->
        <StackLayout verticalAlignment="center" col="1" colSpan="2" rowSpan="2">
            <Label class="actionBarTitle" v-if="title" :text="title | capitalize" :themed="themed" />
            <Label :visibility="!!subtitle ? 'visible' : 'collapse'" class="actionBarSubtitle" :text="subtitle" :themed="themed" />
        </StackLayout>
        <!-- </StackLayout> -->
        <ContentView colSpan="3" rowSpan="2">
            <slot name="title">
                <Label
                    v-if="!!showLogo && !title"
                    :fontFamily="appFontFamily"
                    :fontSize="titleFontSize"
                    :maxFontSize="titleFontSize"
                    :minFontSize="1"
                    class="actionBarLogo"
                    :themed="themed"
                    verticalTextAlignment="center"
                    text="app-full_logo"
                    :autoFontSize="true"
                    @tap="$emit('titleTap', $event)"
                />
            </slot>
        </ContentView>
        <slot row="1" colSpan="3" name="subView" />

        <StackLayout orientation="horizontal" col="2" verticalAlignment="top" :height="height">
            <slot name="rightButtons" />
        </StackLayout>
        <StackLayout col="0" verticalAlignment="top" orientation="horizontal">
            <Button variant="text" v-show="menuIconVisible" class="actionBarButton" :text="menuIcon" @tap="onMenuIcon" :themed="themed" />
            <slot name="leftButtons" />
        </StackLayout>
        <!-- <StackLayout col="2" orientation="horizontal"> -->
        <!-- </StackLayout> -->
        <!-- <ContentView > -->
        <!-- </ContentView> -->
    </GridLayout>
</template>

<script lang="ts" src="./CActionBar.ts" />
