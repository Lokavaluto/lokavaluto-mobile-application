<template>
    <GridLayout ref="bottomSheet" backgroundColor="red" height="80">
        <ListItem v-if="!!item" :showBottomLine="false" :avatar="item.image" :title="item.name" :subtitle="item.excerpt" rightButton="mdi-chevron-right" @tap="showProfile(item)" />
    </GridLayout>
</template>
<script lang="ts" src="./MapBottomSheet.ts" />
