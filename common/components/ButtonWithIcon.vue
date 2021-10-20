<template>
    <Button @tap="$emit('tap', $event)" textAlignment="center" verticalTextAlignment="center" padding="7 15 0 15" ios:padding="7 15 3 15" :color="color">
        <Span :fontSize="vertical ? 14 : 26" :fontFamily="mdiFontFamily" :text="icon" :visibility="icon ? 'visible' : 'collapsed'" verticalTextAlignment="center" />
        <Span :text="(vertical ? '\n' : '  ') + text" :textTransform="textTransform" verticalTextAlignment="center" :fontSize="vertical ? 12 : 16" />
    </Button>
</template>
<script lang="ts">
import { Color } from '@nativescript/core';
import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';
import { appFontFamily, colorAccent, mdiFontFamily } from '../variables';

@Component({})
export default class ButtonWithIcon extends Vue {
    mdiFontFamily = mdiFontFamily;
    appFontFamily = appFontFamily;
    colorAccent = colorAccent;
    @Prop({ type: String, default: 'uppercase' }) textTransform: string;
    @Prop({ type: String }) text: string;
    @Prop({ type: String }) icon: string;
    @Prop() color: string | Color;
    @Prop({ type: Boolean, default: false }) vertical: boolean;
}
</script>
