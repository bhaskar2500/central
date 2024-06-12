import { MapLocation } from "../../../operational/address-details/mapLocation.model";


export class Address{

addressId:Number;
isActive:Boolean;
addressType:Number;
address1 : String;
address2 : String;
city : String;
state : String;
zip : Number;
oneWayStreet : Boolean;
publish:Boolean;
mapLocation:MapLocation;
isOneWayFormatted : string;
publishFormatted :string;
}