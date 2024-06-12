import { CurrencyPipe } from "@angular/common";
import { SelectedAttributes } from "./selectedAttributes.model";
import { FeeDetail } from "./fee-details/fee-details.model";


export class Enforcement{
    
    discountAmount:CurrencyPipe;
    discountRedemptionPeriod:Number;
    daysBeforeCollections:Number;
    ticketTile:Number;
    ticketHeader:String;
    ticketFooter:String;
    parkingFees:FeeDetail[];
    adminFees:FeeDetail[];
    ticketTitle:string;
    violationFees:FeeDetail[];
    violations:boolean;
    transient: boolean;
    digital: boolean;
    parkMobile:boolean;
    monthlyParker:boolean;
}