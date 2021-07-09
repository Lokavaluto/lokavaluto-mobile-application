import * as Platform from '@nativescript/core/platform';
import dayjs from 'dayjs';

import { Address, NominatimAddress } from '../services/AuthService';
export { convertTime, convertDuration } from './locale';

// const dayjs: (...args) => Dayjs = require('dayjs');
// const Duration = require('duration');

// const supportedLanguages = ['en', 'fr'];
// const deviceLang = Platform.device.language.split('-')[0];

// export enum UNITS {
//     Duration = 'duration',
//     Date = 'date',
//     Distance = 'm',
//     DistanceKm = 'km',
//     Speed = 'km/h',
//     Pace = 'min/km',
//     Cardio = 'bpm'
// }

// export function getCurrentDateLanguage() {
//     const deviceLang = Platform.device.language;
//     if (supportedLanguages.indexOf(deviceLang) !== -1) {
//         return deviceLang;
//     }
//     return 'en-US';
// }

// export function convertValueToUnit(value: any, unit: UNITS, otherParam?): [string, string] {
//     if (value === undefined || value === null) {
//         return ['', ''];
//     }
//     // console.log('convertValueToUnit', value, unit, otherParam);
//     switch (unit) {
//         case UNITS.Duration:
//             return [convertDuration(value, 'HH:mm:ss'), ''];

//         case UNITS.Date:
//             return [convertTime(value, 'M/d/yy h:mm a'), ''];

//         case UNITS.Distance:
//             return [value.toFixed(), unit];
//         case UNITS.DistanceKm:
//             if (value < 1000) {
//                 return [value.toFixed(), 'm'];
//             } else if (value > 100000) {
//                 return [(value / 1000).toFixed(0), unit];
//             } else {
//                 return [(value / 1000).toFixed(1), unit];
//             }
//         case UNITS.Speed:
//             return [value.toFixed(), unit];
//         case UNITS.Pace:
//             let result = value < 0.001 ? 0 : 60.0 / value;

//             // no point in showing Pace > 60 min/km
//             if (result > 60.0) {
//                 result = 0;
//             }
//             const minutes = Math.floor(result) % 60;
//             let seconds = Math.floor((result - minutes) * 60).toFixed();
//             if (seconds.length === 1) {
//                 seconds = '0' + seconds;
//             }
//             return [`${minutes}:${seconds}`, unit];
//         default:
//             return [value.toFixed(), unit];
//     }
// }

// export function formatValueToUnit(value: any, unit: UNITS, options?: { prefix?: string; otherParam? }) {
//     let result = convertValueToUnit(value, unit, options ? options.otherParam : undefined).join('');
//     if (options && options.prefix && result.length > 0) {
//         result = options.prefix + result;
//     }
//     return result;
// }

export function formatAddress(address: Address) {
    return `${address.street} ${address.city}`;
}
export function formatOsmAddress(address: NominatimAddress) {
    return `${address.house_number ? `${address.house_number} ` : ''} ${address.pedestrian || address.road || address.street} ${address.postcode} ${address.city || address.village}`;
}

export function formatCurrency(num, showZeroCents = true) {
    // num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) {
        num = 0;
    }
    // console.log('formatCurrency', num, num === Math.abs(num));
    const sign = num === Math.abs(num);
    num = Math.abs(num);
    num = Math.floor(num * 100 + 0.50000000001);
    let cents: any = num % 100;
    num = Math.floor(num / 100).toString();

    if (cents < 10) {
        cents = '0' + cents;
    }
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }

    let result = (sign ? '' : '-') + num;
    if (cents !== '00' || showZeroCents) {
        result += ',' + cents;
    }

    return result;
}
