import { Address } from "../shared/model/locationModel/address.model";
import { HoursOfOperation } from "./hoursOfOperation.model";




export class Operational {
    elimiwaitPhoneNumber: string;
    customerServicePhoneNumber: string;
    neighborhood: String;
    photos: any[];
    howToFind: String;
    parkingLocationDescription: String;
    parkingInstructions: string;
    parkingDisclosures: String;
    revenueSystem:Number;
    validationMethods: String;
    addresses: Address[];
    hoursOfOperation:HoursOfOperation[];
    addressKey:String;
    timeZone: number;
    dayLightSaving: boolean;
    allowOverNight : boolean;
}