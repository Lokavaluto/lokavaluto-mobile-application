import { numberProperty, objectProperty, stringProperty } from './BackendService';
import { EventData } from '@nativescript/core/data/observable';
import dayjs from 'dayjs';
import { MapBounds } from '@nativescript-community/ui-carto/core';
import { FakeError, HTTPError, HttpRequestOptions, NetworkService, base64Encode } from './NetworkService';
import { ImageAsset } from '@nativescript/core/image-asset';
import { ImageSource } from '@nativescript/core/image-source';
import { alert, login } from '@nativescript-community/ui-material-dialogs';
import { $t, $tc, $tt, $tu } from '../helpers/locale';
import * as https from '@nativescript-community/https';

import { LokAPIAbstract, e as LokAPIExc, t as LokAPIType } from '~/lokapi/src/index';

import { getString, remove as removeSetting, setString } from '@nativescript/core/application-settings';

class PersistentStore implements LokAPIType.IPersistentStore {
    get(key: string, defaultValue?: string): string {
        return getString('lokapi_' + key, defaultValue);
    }
    set(key: string, value: string): void {
        setString('lokapi_' + key, value);
    }
    del(key: string): void {
        removeSetting(key);
    }
}

class NativeLokAPI extends LokAPIAbstract {
    constructor(host: string, dbName: string, private apiService: AuthService) {
        super(host, dbName);
    }
    httpRequest = async (opts: LokAPIType.coreHttpOpts) => this.apiService.lokAPIRequest(opts);
    base64Encode = base64Encode;
    persistentStore = new PersistentStore();
}

export const LoggedinEvent = 'loggedin';
export const LoggedoutEvent = 'loggedout';
export const AccountInfoEvent = 'accountinfo';
export const UserProfileEvent = 'userprofile';
export const ProfileEvent = 'profile';
export const UserNeedsPasswordChangeEvent = 'userneedspasswordchange';

export interface NominatimAddress {
    city?: string;
    village?: string;
    city_district: string;
    country: string;
    country_code: string;
    house_number: string;
    neighbourhood: string;
    postcode: string;
    pedestrian?: string;
    street?: string;
    road?: string;
    state: string;
    suburb: string;
}
export interface NominatimResult {
    address: NominatimAddress;
    boundingbox: string[];
    class: string;
    display_name: string;
    importance: number;
    lat: string;
    lon: string;
    osm_id: string;
}

export interface AccountInfoEventData extends EventData {
    data: AccountInfo[];
}
export interface UserProfileEventData extends ProfileEventData {}
export interface ProfileEventData extends EventData {
    data: UserProfile;
}

export interface PhoneNumber {
    id: number;
    phoneNumber: string;
}
export interface SmsId {
    id: number;
    identifier: string;
}

export interface QrCodeTransferData {
    ICC: string;
    id: number;
    name: string;
    amount?: string;
}

function getCacheControl(maxAge = 60, stale = 59) {
    return `max-age=${maxAge}, max-stale=${stale}, stale-while-revalidate=${stale}`;
}

export interface User extends LokAPIType.IContact {
    id: number;
    name: string;
    street: string;
    street2: string;
    zip: string;
    city?: string;
    phone: string;
    mobile: string;
    email: string;
    partner_latitude?: number;
    partner_longitude?: number;
    is_company: boolean;
    is_favorite: boolean;
    [k: string]: any;
    // webPushSubscriptions: string[] = null;
    // phoneNumbers: PhoneNumber[] = null;
    // smsIds: SmsId[] = null;
    // adherent: true = null;
    // admin: false = null;
    // mainICC: string = null;
    // autocompleteLabel?: string = null;
    // name: string = null;
    // creationDate: number = null; // timestamp
    // excerpt: string = null;
    // description: string = null;
    // image: string = null;
    // identityDocument: {
    //     id: number;
    //     webPath: string;
    // } = null;
    // firstname: string = null;
    // id: number = null;
    // username: string = null;
    // email: string = null;
    // roles: Roles[] = null;
    // enabled: boolean = null;
    // groups: string[] = null;
    // groupNames: string[] = null;
}

export interface LoginParams {
    username: string;
    password: string;
}

export enum Roles {
    PRO = 'ROLE_PRO',
    PERSON = 'ROLE_PERSON',
    // USER = 'ROLE_USER',
    ADMIN = 'ROLE_ADMIN',
    SUPER_ADMIN = 'ROLE_SUPER_ADMIN'
}

export interface ZipCity {
    id: number;
    zipCode: string;
    city: string;
    name: string;
}
export interface Address {
    city: string;
    zip: string;
    street: string;
}

export class Phone {
    id: number;
    phoneNumber: string;
    identifier?: string;
    paymentEnabled: boolean;
}

declare class AccountInfo {
    getBalance(): Promise<string>;
    getSymbol(): Promise<string>;
}

export interface UserProfile extends User {}

export interface UpdateUserProfile extends Partial<Omit<UserProfile, 'image'>> {
    image?: ImageAsset | ImageSource;
}

export interface UserSettings {}
export interface Benificiary {
    autocompleteLabel: string;
    id: number;
    ICC: string;
    user: User;
}

export interface TransactionConfirmation {
    confirmation_url: string;
    secure_validation: boolean;
    operation: {
        smsPayment: boolean;
        id: number;
        type: number;
        paymentID: number;
        submissionDate: number;
        executionDate: number;
        description: string;
        reason: string;
        amount: number;
        fromAccountNumber: string;
        toAccountNumber: string;
        creditor: {
            name: string;
            id: number;
        };
        creditorName: string;
        debitor: {
            name: string;
            id: number;
        };
        debitorName: string;
    };
}

interface TokenRequestResult {
    api_token: string;
    status: string;
    id: number;
    uid: number;
}

function getImageData(asset: ImageAsset | ImageSource): Promise<any> {
    return new Promise((resolve, reject) => {
        if (asset instanceof ImageAsset) {
            asset.getImageAsync((image, error) => {
                if (error) {
                    return reject(error);
                }
                let imageData: any;
                if (image) {
                    if (global.isIOS) {
                        imageData = UIImagePNGRepresentation(image);
                    } else {
                        // can be one of these overloads https://square.github.io/okhttp/3.x/okhttp/okhttp3/RequestBody.html
                        const bitmap: android.graphics.Bitmap = image;
                        const stream = new java.io.ByteArrayOutputStream();
                        // const size = bitmap.getRowBytes() * bitmap.getHeight();
                        // const byteBuffer = java.nio.ByteBuffer.allocate(size);
                        // bitmap.copyPixelsToBuffer(byteBuffer);
                        // const byteArray = byteBuffer.array();
                        bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, stream);
                        const byteArray = stream.toByteArray();
                        bitmap.recycle();

                        imageData = byteArray;
                    }
                }
                resolve(imageData);
            });
        } else {
            let imageData: any;
            if (global.isIOS) {
                imageData = UIImagePNGRepresentation(asset.ios);
            } else {
                // can be one of these overloads https://square.github.io/okhttp/3.x/okhttp/okhttp3/RequestBody.html
                const bitmapImage: android.graphics.Bitmap = asset.android;
                const stream = new java.io.ByteArrayOutputStream();
                bitmapImage.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, stream);
                const byteArray = stream.toByteArray();
                bitmapImage.recycle();

                imageData = byteArray;
            }
            resolve(imageData);
        }
    });
}
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
function getFormData(actualData, prefix?: string) {
    return Promise.all(
        Object.keys(actualData).map((k) => {
            const value = actualData[k];
            if (!!value) {
                if (value instanceof ImageAsset || value instanceof ImageSource) {
                    return getImageData(value).then((data) => ({
                        data,
                        contentType: 'image/png',
                        fileName: 'image.png',
                        parameterName: `cairn_user_profile_edit[${k}][file]`
                    }));
                } else if (typeof value === 'object') {
                    return getFormData(value, `${prefix || ''}[${k}]`);
                } else {
                    return Promise.resolve({
                        data: value.toString(),
                        parameterName: `cairn_user_profile_edit${prefix || ''}[${k}]`
                    });
                }
            }

            return Promise.resolve(null);
        })
    ).then((result) => flatten(result));
}

export default class AuthService extends NetworkService {
    @numberProperty userId: number;
    @objectProperty userProfile: UserProfile;
    // @objectProperty loginParams: LoginParams;
    @objectProperty recipientHistory: User[];
    @stringProperty pushToken: string;
    authority = `https://${APP_HOST}`;
    lokAPI: NativeLokAPI;
    constructor() {
        super();

        this.lokAPI = new NativeLokAPI(APP_HOST, APP_DB, this);
        this.lokAPI.apiToken = this.token;
    }

    async lokAPIRequest<T = any>(opts: LokAPIType.coreHttpOpts) {
        const nativeRequestOpts = {
            url: 'https://' + opts.host + opts.path,
            method: opts.method,
            headers: opts.headers,
            body: opts.data
        };
        return super.request<T>(nativeRequestOpts);
    }

    isLoggedIn() {
        // return !!this.token && !!this.loginParams && !!this.userId;
        return !!this.token && !!this.userId;
    }

    // registerPushToken(pushToken: string) {
    //     this.pushToken = pushToken;
    //     if (this.token) {
    //         this.registerPushToken(pushToken);
    //     }
    // }
    async registerPushToken(pushToken: string) {
        this.pushToken = pushToken;
        return this.request<{ validation_url: string }>({
            apiPath: '/mobile/token-subscription',
            method: 'POST',
            body: {
                action: 'POST',
                platform: gVars.platform,
                device_token: pushToken
            }
        });
    }
    async unregisterPushToken() {
        if (this.pushToken) {
            const token = this.pushToken;
            this.pushToken = undefined;
            return this.request<{ validation_url: string }>({
                apiPath: '/mobile/token-subscription',
                method: 'POST',
                body: {
                    action: 'DELETE',
                    platform: gVars.platform,
                    device_token: token
                }
            });
        }
    }

    // getUserId() {
    //     return this.request({
    //         url: authority + '/user.json',
    //         method: 'GET'
    //     }).then(result => {
    //         this.userId = result.current_user_id + '';
    //     });
    // }
    isProUser(profile: User = this.userProfile) {
        return true;
        // return profile.roles.indexOf(Roles.PRO) !== -1;
    }

    async getUserProfile(userId?: number) {
        const profile = await this.lokAPI.getMyContact(this.userId);
        if (!profile) {
            return null;
        }
        // const profile = cleanupUser(result);
        if (!userId || userId === this.userId) {
            this.userProfile = profile;
            this.notify({
                eventName: UserProfileEvent,
                data: profile
            } as UserProfileEventData);
        }

        return profile;
    }
    async getUserSettings() {
        const result = await this.request<UserSettings>({
            apiPath: `/mobile/notifications/${this.userId}`,
            method: 'GET'
        });
        return result;
    }
    async postUserSettings(userSettings: UserSettings) {
        // const body = JSON.parse(JSON.stringify({ baseNotifications: userSettings.baseNotifications })) as UserSettings;
        // body.baseNotifications = body.baseNotifications.sort(function (a, b) {
        //     return a.id - b.id;
        // });
        const result = await this.request<UserSettings>({
            apiPath: `/mobile/notifications/${this.userId}`,
            method: 'POST'
            // body
        });
        // this.notify({
        //     eventName: UserProfileEvent,
        //     data: this.userProfile
        // } as UserProfileEventData);
        return result;
    }
    async changePassword(currentPassword: string, newPassword: string) {
        const result = await this.request({
            apiPath: '/mobile/users/change-password',
            method: 'POST',
            body: {
                current_password: currentPassword,
                plainPassword: {
                    first: newPassword,
                    second: newPassword
                }
            }
        });
        // if (this.loginParams) {
        //     this.loginParams.password = newPassword;
        // }
        return result;
    }

    async updateUserProfile(data: UpdateUserProfile, userId?: number): Promise<any> {
        if (!data) {
            return Promise.resolve();
        }

        //the name cannnot be changed after account creation
        //can change logo only if adherent is a pro
        //an admin can also change name, username and id document if necessary
        const editableKeys = ['address', 'description', 'email'];
        if (this.isProUser(this.userProfile)) {
            editableKeys.push('image');
        } //if user is admin...

        const currentData = this.userProfile;

        // const actualData = mergeOptions(currentData, data);
        // if (actualData.address) {
        //     actualData.address = pick(actualData.address, ['street1', 'street2', 'zipCity']);
        //     if (actualData.address.zipCity) {
        //         // actualData.address.zipCity = pick(actualData.address.zipCity, ['zipCode', 'city']);
        //         // currentData.address.zipCity = pick(currentData.address, ['street1', 'street2', 'zipCity']);
        //         actualData.address.zipCity = `${actualData.address.zipCity.zipCode} ${actualData.address.zipCity.city}`;
        //         // currentData.address.zipCity = pick(currentData.address.zipCity, ['city', 'zipCode']);
        //     }
        // }
        const params = await getFormData(currentData);
        const result = await this.request({
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            apiPath: `/mobile/users/profile/${userId || this.userId}`,
            body: params.filter((s) => !!s),
            method: 'POST'
        });
        // if it succeeds we need to update the user profile
        await this.getUserProfile();
        return result;
    }

    async addPhone(phoneNumber: string, userId: number) {
        return this.request<{ validation_url: string }>({
            apiPath: `/mobile/phones/add/${userId}`,
            method: 'POST',
            body: {
                phoneNumber,
                paymentEnabled: false
            }
        });
    }
    async confirmPhone(validationUrl: string, activationCode: string, save: boolean) {
        const body = {
            activationCode
        } as any;

        if (!save) {
            //cancel button has been click
            body.cancel = '';
        }
        return this.request<{ validation_url: string }>({
            apiPath: validationUrl,
            method: 'POST',
            body
        });
    }

    //Cannot use phoneNumber as URI because it is not an unique identifier :
    //a same phone number can be added to both a person and a pro
    async deletePhone(phoneNumber: PhoneNumber) {
        return this.request({
            apiPath: `/mobile/phones/${phoneNumber.id}`,
            method: 'DELETE',
            body: {
                save: 'true'
            }
        }).then(() => this.getUserProfile());
    }

    // async getZipCities(zipCity: ZipCity) {
    //     return this.request({
    //         apiPath: '/zipcities',
    //         body: {
    //             search: `${zipCity.zipCode} ${zipCity.city}`
    //         },
    //         method: 'POST'
    //     });
    // }
    async autocompleteAddress(query: string) {
        const result = await this.request({
            url: 'https://photon.komoot.de/api',
            queryParams: {
                q: query,
                // format: 'json',
                // 'accept-language': 'fr',
                // countrycodes: 'fr',
                lang: 'fr',
                // email: 'contact@akylas.fr',
                // namedetails: 0,
                // addressdetails: 1,
                // dedupe: true,
                limit: 20
            },
            method: 'GET'
        });
        const newItems = result.features
            .filter((r) => (r.properties.osm_key === 'highway' || r.properties.street) && r.properties.city && r.properties.postcode)
            .map((r) => ({
                lon: r.geometry && r.geometry.coordinates[0],
                lat: r.geometry && r.geometry.coordinates[1],
                display_name: `${r.properties.housenumber ? `${r.properties.housenumber} ` : ''}${r.properties.street || r.properties.name} ${r.properties.postcode} ${r.properties.city}`,
                street1: `${r.properties.housenumber ? `${r.properties.housenumber} ` : ''}${r.properties.street || r.properties.name}`,
                zipCity: {
                    name: `${r.properties.postcode} ${r.properties.city}`,
                    zipCode: r.properties.postcode,
                    city: r.properties.city
                }
            }));
        // const newItems = result.filter(s => s.address && (s.address.pedestrian || s.address.road || s.address.street) && (s.address.city || s.address.village));
        // newItems.forEach(s => (s.display_name = formatOsmAddress(s.address)));
        const displayNames = newItems.map((s) => s.display_name);
        return newItems.filter((el, i, a) => i === displayNames.indexOf(el.display_name)) as Address[];
        // return newItems;
    }

    accounts: AccountInfo[];
    // lastAccountsUpdateTime: number;
    async getAccounts() {
        this.accounts = await this.lokAPI.getAccounts();
        // if (!this.accounts || !this.lastAccountsUpdateTime || Date.now() - this.lastAccountsUpdateTime >= 3600 * 1000) {
        // let result = await this.request<AccountInfo[]>({
        //     apiPath: '/mobile/accounts.json',
        //     method: 'GET'
        // });

        // result = result.map((a) => ({
        //     balance: parseFloat(a.status.balance),
        //     creditLimit: parseFloat(a.status.creditLimit),
        //     number: a.number,
        //     id: a.id,
        //     name: a.type.name
        // }));
        // // this.lastAccountsUpdateTime = Date.now();
        // this.accounts = result;
        // // }
        this.notify({
            eventName: AccountInfoEvent,
            data: this.accounts
        } as AccountInfoEventData);
        return this.accounts;
    }
    beneficiaries: Benificiary[];
    // lastBenificiariesUpdateTime: number;
    async getBenificiaries() {
        // if (this.beneficiaries && this.lastBenificiariesUpdateTime && Date.now() - this.lastBenificiariesUpdateTime < 3600 * 1000) {
        // return this.beneficiaries;
        // }
        let result = await this.request<Benificiary[]>({
            apiPath: '/mobile/beneficiaries',
            method: 'GET'
        });
        this.beneficiaries = result = result.filter((b) => !!b.user);
        // this.lastBenificiariesUpdateTime = Date.now();
        return result;
    }
    async getUsers({
        sortKey,
        sortOrder,
        limit,
        offset,
        query,
        categories,
        roles,
        payment_context = false
    }: {
        sortKey?: string;
        sortOrder?: string;
        limit?: number;
        offset?: number;
        query?: string;
        roles?: string[];
        categories?: string[];
        payment_context?: boolean;
    }) {
        try {
            return await this.lokAPI.searchRecipients(query);
        } catch (error) {
            throw error;
        }
    }
    async getUsersForMap(mapBounds: MapBounds<LatLonKeys>, categories: number[]) {
        let boundingBox = {
            minLon: '',
            maxLon: '',
            minLat: '',
            maxLat: ''
        };
        if (mapBounds) {
            boundingBox = {
                minLon: mapBounds.southwest.lon + '',
                maxLon: mapBounds.northeast.lon + '',
                minLat: mapBounds.southwest.lat + '',
                maxLat: mapBounds.northeast.lat + ''
            };
        }

        const result = await this.lokAPI.get('/partner_map/search', {
            bounding_box: boundingBox,
            categories
        });
        // result = (result as any).result || result;
        // if (!Array.isArray(result)) {
        //     result = [result];
        // }
        return result?.rows.filter((b) => !!b);
    }
    async addBeneficiary(cairn_user_email: string): Promise<TransactionConfirmation> {
        // this.lastBenificiariesUpdateTime = undefined;
        return this.request({
            apiPath: '/mobile/beneficiaries',
            method: 'POST',
            body: {
                cairn_user: cairn_user_email
            }
        });
    }

    public async transfer(fromAccount: LokAPIType.IAccount, recipient: LokAPIType.IRecipient, amount: number, description: string): Promise<LokAPIType.IPayment> {
        const result = await fromAccount.transfer(recipient, amount, description);

        // call getAccounts to update accounts balance after transfer
        this.getAccounts();
        return result;
    }
    async createTransaction(account: AccountInfo, user: User, amount: number, reason: string, description: string): Promise<TransactionConfirmation> {
        const date = Date.now();
        const body = {
            fromAccount: (account as any).number,
            toAccount: user.email || user.mainICC,
            amount,
            executionDate: date,
            reason
        } as any;
        if (!!description) {
            body.description = description;
        }
        return this.request({
            apiPath: '/mobile/payment/request',
            method: 'POST',
            body
        });
    }
    async fakeSMSPayment(sender: string, message: string) {
        return this.request({
            apiPath: '/sms/reception',
            method: 'GET',
            queryParams: {
                originator: 'blabalcairn',
                recipient: sender,
                message
            }
        });
    }
    async categories() {
        const res = await this.request<{ rows: { id: number; name: string }[] }>({
            apiPath: '/lokavaluto_api/public/partner_industry/get'
        });
        return res.rows;
    }

    async login(user: LoginParams) {
        if (!user) {
            throw new Error('missing_login_params');
        }
        const wasLoggedin = this.isLoggedIn();
        try {
            await this.lokAPI.login(user.username, user.password);

            this.token = this.lokAPI.apiToken;
            this.userProfile = this.lokAPI.userProfile;
            console.log('userProfile', this.token, this.userProfile);
            this.userId = this.userProfile.id;

            this.notify({
                eventName: UserProfileEvent,
                data: this.userProfile
            } as UserProfileEventData);

            // this.loginParams = user;
            if (!wasLoggedin) {
                // console.log('emitting loggedin event', new Error().stack);
                this.notify({
                    eventName: LoggedinEvent,
                    data: this.userProfile
                } as UserProfileEventData);
            }
            // })
        } catch (err) {
            this.onLoggedOut();
            return Promise.reject(err);
        }
    }

    onLoggedOut() {
        const wasLoggedin = this.isLoggedIn();
        this.lokAPI.logout();
        this.token = null;
        // this.loginParams = null;
        this.recipientHistory = null;
        this.userId = null;
        if (wasLoggedin) {
            this.notify({
                eventName: LoggedoutEvent,
                object: this
            });
        }
    }
    async getFavorites() {
        try {
            const partners = await this.lokAPI.$post('/partner/favorite');
            const recipients: LokAPIType.IRecipient[] = [];
            for (let index = 0; index < partners.rows.length; index++) {
                // recipients.push(...(await this.lokAPI.makeRecipient(partners.rows[index])));
                recipients.push(partners.rows[index]);
            }
            return recipients;
        } catch (error) {
            throw error;
        }
    }
    async toggleFavorite(partner: User): Promise<User> {
        try {
            await partner.toggleFavorite();
            // console.log('this.recipientfavorites', this.recipientfavorites);
            this.notify({
                eventName: ProfileEvent,
                data: partner
            } as ProfileEventData);
            return partner;
        } catch (error) {
            throw error;
        }
    }

    async register(user, type: string) {
        return this.request({
            apiPath: '/mobile/users/registration',
            method: 'POST',
            queryParams: {
                type
            }
        });
    }

    async resetPassword(emailOrUsername) {
        return this.request({
            apiPath: `resetting/check-email?username=${emailOrUsername}`,
            method: 'GET'
        });
    }
    async handleRequestRetry(requestParams: HttpRequestOptions, retry = 0) {
        this.logout();

        // throw but dont show the error
        throw new FakeError({
            statusCode: 401,
            message: 'HTTP error',
            requestParams
        });
    }
    logout() {
        this.onLoggedOut();
        // backendService.token = "";
        // return firebase.logout();
    }
}

let authService: AuthService;
export function getAuthInstance() {
    if (!authService) {
        authService = new AuthService();
    }
    return authService;
}
