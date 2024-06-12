import { Address } from '../shared/model/contactModel/Address.model'; 
import { availableHours } from '../shared/model/contactModel/availableHours.model';

export class contactDetails{
    contactId: number;
    isActive: boolean;
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    primaryPhone: number;
    contactType: number;
    priority: string;
    company: number;
    companyValue: string;
    doNotContact:boolean;
    cellPhone: number;
    website: string;
    
    address: Address[];
    availableHours: availableHours[];

}