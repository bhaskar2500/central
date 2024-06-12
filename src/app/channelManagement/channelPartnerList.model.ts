import { ChannelPartnerSubsidiary } from "./subsidiaryDetails/subsidiaryDetails.model";

export class ChannelPartner{
    channelPartnerKey : Number;
    name : String;
    code : String;
    description : String;
    threshold : Number;
    isActive : Boolean;
    createdBy : String;
    createdOn : any;
    lastUpdatedBy : String;
    lastUpdatedOn : any;
    deletedBy : String;
    deletedOn : any;
    tooltipFlag = 0;
    subsidaries: ChannelPartnerSubsidiary[];
    subidaryCommaString:string;
    organizationId: string;
}