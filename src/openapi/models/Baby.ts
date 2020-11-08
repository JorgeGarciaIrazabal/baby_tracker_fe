/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface Baby
 */
export interface Baby {
    /**
     * 
     * @type {number}
     * @memberof Baby
     */
    id?: number;
    /**
     * 
     * @type {Date}
     * @memberof Baby
     */
    birthDate: Date;
    /**
     * 
     * @type {string}
     * @memberof Baby
     */
    name: string;
    /**
     * 
     * @type {number}
     * @memberof Baby
     */
    fatherId?: number;
    /**
     * 
     * @type {number}
     * @memberof Baby
     */
    motherId?: number;
}

export function BabyFromJSON(json: any): Baby {
    return BabyFromJSONTyped(json, false);
}

export function BabyFromJSONTyped(json: any, ignoreDiscriminator: boolean): Baby {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'birthDate': (new Date(json['birth_date'])),
        'name': json['name'],
        'fatherId': !exists(json, 'father_id') ? undefined : json['father_id'],
        'motherId': !exists(json, 'mother_id') ? undefined : json['mother_id'],
    };
}

export function BabyToJSON(value?: Baby | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'birth_date': (value.birthDate.toISOString()),
        'name': value.name,
        'father_id': value.fatherId,
        'mother_id': value.motherId,
    };
}


