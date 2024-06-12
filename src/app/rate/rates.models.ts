import { RateChannelPartner,} from "../shared/model/rateModel/rateChannelPartner.model";

export class RatesModel {
    constructor(){
}
rateId    :string ;
isActive  :boolean;
channel   :string;
rateKey   :string;
rateType  :string;
price     : number;
increment :string;
selectedDaysOfTheWeek :object[];
maxDailyPrice : number;
activeEndDate : string;   
activeStartDate : string;
selectedChannels:RateChannelPartner[];
maxHours : number;
entryTime: any;
exitTime :any;
combinable:boolean;
nonRefundable: boolean;
selectedDaysData :string;
selectedChannelsData :string;
isActiveFormatted: string;
}
