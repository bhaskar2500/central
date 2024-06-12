import { MaxHeight } from "./MaxHeight.model";
import { TransientLocationPaymentOptions } from "./transientLocation.model";
import { MonthlyLocationPaymentOptions } from "./monthlyLocation.model";
import { SupportedVehicleTypes } from "./supportedVehicle.model";
import { ElectricVehicleCapacities } from "./electricVehicle.model";
import { AvailableAmenities } from "./availableAmenities.model";

export class FeaturesDetails{
    lotNumber: number;
    lotDescription: string;
    publishedName: string;
    publishToWeb: boolean;
    explanation: string;
    lotSignage: number;
    ownerDepository: string;

    facilityType: any[];
    serviceType: any[];
    validationMethods: any[];
    garageType: number;
    availableToPublic: boolean;
    facilityAccessType: number;
    adaSpaceCount: number;
    heightRestriction: string;
    maxHeight: object;
    
    transientParking: boolean;
    //transientLocationPaymentOptions: TransientLocationPaymentOptions[];
    transientLocationPaymentOptions: any[];

    monthlyParkingApproval: boolean;
    monthlyParking: boolean;
    monthlyLocationPaymentOptions: MonthlyLocationPaymentOptions[];
    //monthlyLocationPaymentOptions: string;

    //supportedVehicleTypes: SupportedVehicleTypes[];
    supportedVehicleTypes: any[];
    electricVehicleCapabilities: ElectricVehicleCapacities[];

    //amentities: AvailableAmenities[];
    amenities: any[];
}