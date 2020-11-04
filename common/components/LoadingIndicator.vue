<template>
    <GridLayout rows="auto,auto" columns="auto,*" padding="20">
        <MDActivityIndicator col="0" busy />
        <Label col="1" paddingLeft="15" fontSize="16" verticalAlignment="middle" textWrap />
        <MDProgress row="1" colSpan="2" maxValue="100" :color="accentColor" />
    </GridLayout>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import Vue from 'nativescript-vue';
import { accentColor } from '~/common/variables';
@Component({})
export default class LoadingIndicator extends Vue {
    accentColor = accentColor;
}
</script>
