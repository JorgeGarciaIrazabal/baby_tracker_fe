/* tslint:disable */
/* eslint-disable */
/**
 * Baby Tracker
 * Track everything your baby does
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {exists} from '../runtime';

/**
 *
 * @export
 * @interface Pee
 */
export interface Pee {
    /**
     *
     * @type {number}
     * @memberof Pee
     */
    id?: number;
    /**
     *
     * @type {Date}
     * @memberof Pee
     */
    at?: Date;
    /**
     *
     * @type {number}
     * @memberof Pee
     */
    babyId?: number;
}

export function PeeFromJSON(json: any): Pee {
    return PeeFromJSONTyped(json, false);
}

export function PeeFromJSONTyped(json: any, ignoreDiscriminator: boolean): Pee {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {

        'id': !exists(json, 'id') ? undefined : json['id'],
        'at': !exists(json, 'at') ? undefined : (new Date(json['at'])),
        'babyId': !exists(json, 'baby_id') ? undefined : json['baby_id'],
    };
}

export function PeeToJSON(value?: Pee | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {

        'id': value.id,
        'at': value.at === undefined ? undefined : (value.at.toISOString()),
        'baby_id': value.babyId,
    };
}


