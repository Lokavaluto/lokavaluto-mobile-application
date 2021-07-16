<template>
    <BasePage id="profile" @navigatedTo="onNavigatedTo" :actionBarShowLogo="false" :title="title">
        <StackLayout slot="actionBarRightButtons" verticalAlignment="center" orientation="horizontal">
            <Button variant="text" class="icon-btn" v-show="!editing" text="mdi-qrcode" @tap="toggleQRCode()" />
            <Button variant="text" class="icon-btn" v-show="editable && canSave" text="mdi-content-save" @tap="saveProfile()" />
            <!-- <Button variant="text" class="icon-btn" v-show="editable" :text="editing ? 'mdi-close-circle' : 'mdi-pencil'" @tap="switchEditing()" /> -->
        </StackLayout>
        <ScrollView>
            <StackLayout>
                <GridLayout rows="150,20">
                    <NSImg stretch="aspectFill" noCache backgroundColor="black" />
                    <NSImg
                        rowSpan="2"
                        width="80"
                        height="80"
                        verticalAlignment="bottom"
                        :iamge="userProfile.image"
                        backgroundColor="white"
                        stretch="aspectFill"
                        noCache
                        borderColor="white"
                        borderWidth="2"
                        borderRadius="40"
                    />
                </GridLayout>
                <Label row="2" fontSize="18" margin="20" fontWeight="bold" class="roboto" textAlignment="center" :text="userProfile.name" @longPress="copyText(userProfile.name)" />
                <StackLayout v-if="myProfile" borderTopColor="#E5E5E5" borderTopWidth="1" margin="0 16 0 16">
                    <GridLayout borderBottomColor="#E5E5E5" borderBottomWidth="1">
                        <ButtonWithIcon variant="text" color="black" icon="mdi-magnify" :text="$tc('contacts')" @tap="showContacts" />
                    </GridLayout>
                    <GridLayout borderBottomColor="#E5E5E5" borderBottomWidth="1">
                        <ButtonWithIcon variant="text" color="black" icon="mdi-cogs" :text="$tc('settings')" @tap="showSettings" />
                    </GridLayout>
                    <GridLayout borderBottomColor="#E5E5E5" borderBottomWidth="1">
                        <ButtonWithIcon variant="text" color="red" icon="mdi-logout" :text="$tc('logout')" @tap="logout" />
                    </GridLayout>
                </StackLayout>
                <ButtonWithIcon variant="outline" v-if="!myProfile" marginTop="30" icon="mdi-star" :text="$tc('add_to_favorites')" @tap="toggleFavorite" />
                <ButtonWithIcon v-if="!myProfile" icon="mdi-arrow-right-bold" :text="$tc('send_money')" @tap="sendMoney" />
            </StackLayout>
        </ScrollView>
    </BasePage>
</template>

<script lang="ts" src="./Profile.ts" />
