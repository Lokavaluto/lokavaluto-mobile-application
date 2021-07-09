<template>
    <GridLayout
        orientation="horizontal"
        justifyContent="spaceBetween"
        width="100%"
        :backgroundColor="backgroundColor"
        :height="height"
        :elevation="elevation"
        :columns="Array(options.length).fill('*').join(',')"
    >
        <GridLayout v-for="(option, index) in options" :key="option.text || option" @tap="$emit('changed', index)" :rippleColor="textColor" :col="index">
            <Label
                :fontSize="fontSize"
                :color="textColor"
                lineBreak="none"
                :horizontalAlignment="centered ? 'center' : undefined"
                textWrap="true"
                textAlignment="center"
                verticalTextAlignment="center"
                :opacity="selected === index ? 1 : 0.7"
                :borderBottomColor="borderColor"
                :borderBottomWidth="selected === index ? 3 : 0"
                padding="0 10 0 10"
                :fontWeight="selected === index ? 'bold' : 'normal'"
            >
                <FormattedString>
                    <Span
                        :fontFamily="mdiFontFamily"
                        :visibility="!!option.icon ? 'visible' : 'collapsed'"
                        :text="option.icon ? option.icon + ' ' : ''"
                        :color="selected === index ? option.iconSelectedColor : option.iconColor"
                    />
                    <Span :text="option.text || option" />
                </FormattedString>
            </Label>
        </GridLayout>
    </GridLayout>
</template>
<script lang="ts">
import { Color } from '@nativescript/core';
import Vue from 'nativescript-vue';

import { Component, Prop } from 'vue-property-decorator';
import { actionBarHeight, colorAccent, colorPrimary, mdiFontFamily, textColor } from '../variables';

@Component({})
export default class TabsBar extends Vue {
    colorAccent = colorAccent;
    colorPrimary = colorPrimary;
    mdiFontFamily = mdiFontFamily;
    actionBarHeight = actionBarHeight;
    @Prop({})
    public options: string[];

    @Prop({ default: 0 }) public selected: number;
    @Prop({ default: 15 }) public fontSize: number;
    @Prop({ default: 3 }) public elevation: number;
    @Prop({ default: () => colorPrimary }) public backgroundColor: string | Color;
    @Prop({ default: 'white' }) public textColor: string | Color;
    @Prop({ default: () => colorAccent }) public borderColor: string | Color;
    @Prop({ default: actionBarHeight }) public height: number;
    @Prop({ default: false }) public centered: boolean;
}
</script>
