import { MapLocation } from "./mapLocation.model";

export class AddressDetails{
    isActive: boolean;
    addressType: number;
    addressTypeValue: String;
    address1 : String;
    address2: String;
    city: String;
    state : String;
    zip:String;
    oneWayStreet: boolean;
    publish : boolean;
    mapLocation:MapLocation;
    addressId:number;
    geoCodingType:string;
    addressKey : any;
}