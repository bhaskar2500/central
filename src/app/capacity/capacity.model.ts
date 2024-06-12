import { Blocked } from "./blocked.model";
import { Rented } from "./rented.model";
import { Client } from "./client.model";
import { Tenant } from "./tenant.model";
import { Reserved } from "./reserved.model";

export class Capacity{
    contractedCapacity: number;
    workingCapacity: number;
    restrictedSpaces: capacitySpaces[]=[];
    oversell:number;
    available:number;   
    stopsell:number;
}


export class capacitySpaces{
    capacityFromDate : string="";
    capacityToDate : string ="";
    value : number =  0 ;
    capacityType:  string;
    locationCapacityTypeKey :number =-1;
    notes:string="";
}