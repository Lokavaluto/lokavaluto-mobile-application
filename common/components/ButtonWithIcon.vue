<template>
    <Button @tap="$emit('tap', $event)" paddingTop="6">
        <Span fontSize="26" :fontFamily="mdiFontFamily" :text="icon" :visibility="icon ? 'visible' : 'collapsed'" verticalAlignment="center" />
        <Span :text="('  ' + text) | uppercase" verticalAlignment="center" />
    </Button>
</template>
<script lang="ts">
import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';
import { appFontFamily, colorAccent, mdiFontFamily } from '../variables';

@Component({})
export default class ButtonWithIcon extends Vue {
    mdiFontFamily = mdiFontFamily;
    appFontFamily = appFontFamily;
    colorAccent = colorAccent;
    @Prop({ type: String }) text: string;
    @Prop({ type: String }) icon: string;
}
</script>
