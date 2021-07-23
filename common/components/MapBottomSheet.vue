<template>
    <GridLayout ref="bottomSheet" :height="height">
        <Pager :items="items" v-model="innerSelectedPageIndex" peaking="20">
            <v-template>
                <GridLayout padding="0 10 0 5">
                    <GridLayout backgroundColor="white" borderRadius="20 20 0 0" rows="84,*" columns="*,*">
                        <NSImg backgroundColor="black" borderRadius="20 20 0 0" colSpan="2" />
                        <Label color="white" colSpan="2" :text="item.name" verticalTextAlignment="bottom" padding="0 15 4 15" fontSize="24" />
                        <Label :color="colorPrimary" row="1" colSpan="2" :text="item.opening_time" verticalTextAlignment="top" padding="4 15 0 15" fontSize="13" />
                        <ButtonWithIcon row="1" icon="mdi-directions" :text="$tc('route')" @tap="navigateToItem(item)" verticalAlignment="bottom" />
                        <Button variant="text" row="1" col="1" :text="$tc('more_info')" @tap="showProfile(item)" verticalAlignment="bottom" marginBottom="10" marginRight="15" />
                    </GridLayout>
                </GridLayout>
            </v-template>
        </Pager>
    </GridLayout>
</template>
<script lang="ts" src="./MapBottomSheet.ts" />
