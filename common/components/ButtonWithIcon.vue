<template>
    <Button @tap="$emit('tap', $event)" textAlignment="center" verticalTextAlignment="center" paddingTop="7" :color="color" ios:paddingBottom="3">
        <Span :fontSize="vertical ? 14 : 26" :fontFamily="mdiFontFamily" :text="icon" :visibility="icon ? 'visible' : 'collapsed'" verticalAlignment="center" />
        <Span :text="(vertical ? '\n' : '  ') + text" :textTransform="textTransform" verticalAlignment="center" :fontSize="vertical ? 12 : 17" />
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
    @Prop({ type: String, default:'uppercase' }) textTransform: string;
    @Prop({ type: String }) text: string;
    @Prop({ type: String }) icon: string;
    @Prop() color: string | Color;
    @Prop({ type: Boolean, default: false }) vertical: boolean;
}
</script>
