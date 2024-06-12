import { RateChannelPartner,} from "../shared/model/rateModel/rateChannelPartner.model";

export class RateDetailsModel {
    constructor(){
}
isActive  :boolean;
addOn     :boolean;
rateKey   :number;
rateType  :string;
rateName  :string;
price     : number;
increment :string;
selectedDaysOfTheWeek :any[]=[];
maxDailyPrice : number;
activeStartDate : Date;   
activeEndDate : Date;
selectedChannels:RateChannelPartner[]=[];
maxHours : number;
entryTime: any={upper:"",lower:""};
exitTime : any={upper:"",lower:""};
combinable:boolean;
nonRefundable: boolean;
maxStay:any={hours:"",minutes:""};
minStay: any={hours:"",minutes:""};
multipleInAndOut :boolean;
additionalDays : number;
}
