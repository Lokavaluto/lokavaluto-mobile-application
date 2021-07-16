<template>
    <GridLayout columns="*,*" rows="auto,auto" padding="16">
        <NSImg
            width="80"
            height="80"
            verticalAlignment="top"
            :image="user.image"
            backgroundColor="black"
            stretch="aspectFill"
            noCache
            borderColor="white"
            borderWidth="2"
            borderRadius="40"
            horizontalAlignment="left"
        />
        <Label colSpan="2" class="mdi" :text="user.name" fontSize="24" verticalAlignment="center" marginLeft="100" horizontalAlignment="left" />
        <ButtonWithIcon row="1" :vertical="true" variant="text" icon="mdi-star" :text="$tc('add_to_favorites')" color="#F4BA40" />
        <ButtonWithIcon row="1" :vertical="true" col="1" variant="text" icon="mdi-account-circle" :text="$tc('show_profile')" @tap="showUserProfile" />
    </GridLayout>
</template>

<script src="./UserDetailsBottomSheet.ts" />
