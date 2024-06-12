import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Router } from '@angular/router';

import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { FeaturesDetails } from './location-features.model';
import { MultiSelectModule } from 'primeng/multiselect';
import ReferenceTable from '../shared/enum/refTable.enum';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LCForm } from '../shared/LCForm';
import { NotificationService } from '../shared/notification-service.service';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';

@Component({
  selector: 'lc-location-features',
  templateUrl: './location-features.component.html',
  styleUrls: ['./location-features.component.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class LocationFeaturesComponent extends LCForm {
  featuresFormdata: any;
  msgs: Message[] = [];
  facilitytypeList: any;
  serviceTypeList: any;
  validationMethodList: any;
  garagetype: any;
  facilityAccess: any;
  lotSignageList: any;
  amenitiesList: any;
  supportedVehicleList: any;
  transientPaymentOptionsList: any;
  monthlyPaymentOptionList: any;
  toolTipServiceType: string;
  toolTipFacilityType: string;
  toolTipValidationMethods: string;
  toolTipTransientPaymentOptions: string;
  toolTipAvailableAmenities: string;
  toolTipsSupportedType: string;
  toolTipMonthlyPaymentOptions: string;
  screenWidth: number = screen.width;

  constructor(private router: Router, private dataService: ManageComponentDataService, private spinnerService: Ng4LoadingSpinnerService
    , private notificationService: NotificationService,private logger: ErrorLoggerService) {
    super();
    this.dataService.getTableValuesByTableName(ReferenceTable.Facility_Type).subscribe((data) => {
      this.facilitytypeList = data;
    });

    this.dataService.getTableValuesByTableName(ReferenceTable.Service_Type).subscribe((data) => {
      this.serviceTypeList = data;
    });

    this.dataService.getTableValuesByTableName(ReferenceTable.Validations_Methods).subscribe((data) => {
      this.validationMethodList = data;
    });

    this.dataService.getTableValuesByTableName(ReferenceTable.Garage_Type).subscribe((data: any[]) => {
      let resData = data.filter(el => el.elementValue !== "Enforcement" );
      this.garagetype = resData;
    });

    this.dataService.getTableValuesByTableName(ReferenceTable.Facility_Access).subscribe((data) => {
      this.facilityAccess = data;
    });

    this.dataService.getTableValuesByTableName(ReferenceTable.Location_Signage).subscribe((data) => {
      this.lotSignageList = data;
    });

    this.dataService.getTableValuesByTableName(ReferenceTable.Available_Amenities).subscribe((data) => {
      this.amenitiesList = data;
    });

    this.dataService.getTableValuesByTableName(ReferenceTable.Supported_Vehicle_Type).subscribe((data) => {
      this.supportedVehicleList = data;
    });

    this.dataService.getTableValuesByTableName(ReferenceTable.Payment_Options).subscribe((data) => {
      this.transientPaymentOptionsList = data;
    });

    this.dataService.getTableValuesByTableName(ReferenceTable.Payment_Options).subscribe((data) => {
      this.monthlyPaymentOptionList = data;
    });

  }
  ngOnInit() {
    this.spinnerService.show();
    this.featuresFormdata = new FormGroup({
      publishedName: new FormControl("", Validators.required),
      lotNumber: new FormControl(),
      lotDescription: new FormControl(),
      publishToWeb: new FormControl(),
      explanation: new FormControl(),
      lotSignage: new FormControl("", Validators.required),
      ownerDepository: new FormControl(),
      amentities: new FormControl(),
      supportedVehicleTypes: new FormControl(),

      facilityType: new FormControl(),
      serviceType: new FormControl(),
      validationMethods: new FormControl(),
      transientParking: new FormControl(),
      monthlyParking: new FormControl(),
      garageType: new FormControl("", Validators.required),
      availableToPublic: new FormControl(),
      facilityAccessType: new FormControl(),
      adaSpaceCount: new FormControl(),
      heightRestriction: new FormControl(),
      feet: new FormControl(),
      inches: new FormControl(),

      transientLocationPaymentOptions: new FormControl(),
      monthlyLocationPaymentOptions: new FormControl(),
      monthlyParkingApproval: new FormControl(),

      regularEV: new FormControl(),
      teslaSuperCharger: new FormControl(),

    });

    this.dataService.getFeaturesDetailsForLocation().subscribe(
      (data: FeaturesDetails) => {
        this.featuresFormdata.controls['lotNumber'].setValue(data.lotNumber);
        this.featuresFormdata.controls['lotDescription'].setValue(data.lotDescription);
        this.featuresFormdata.controls['publishedName'].setValue(data.publishedName);
        this.featuresFormdata.controls['publishToWeb'].setValue(data.publishToWeb);
        this.featuresFormdata.controls['explanation'].setValue(data.explanation);
        this.featuresFormdata.controls['lotSignage'].setValue({ elementId: data.lotSignage });
        this.featuresFormdata.controls['ownerDepository'].setValue(data.ownerDepository);
        this.featuresFormdata.controls['facilityType'].setValue(data.facilityType);
        this.featuresFormdata.controls['serviceType'].setValue(data.serviceType);
        this.featuresFormdata.controls['validationMethods'].setValue(data.validationMethods);
        this.featuresFormdata.controls['garageType'].setValue({ elementId: data.garageType });
        this.featuresFormdata.controls['availableToPublic'].setValue(data.availableToPublic);
        this.featuresFormdata.controls['facilityAccessType'].setValue({ elementId: data.facilityAccessType });
        this.featuresFormdata.controls['adaSpaceCount'].setValue(data.adaSpaceCount);
        this.featuresFormdata.controls['heightRestriction'].setValue(data.heightRestriction);
        this.spinnerService.hide();
        this.toolTipServiceType = data.serviceType.map(i => i.elementValue).join(",\n");
        this.toolTipFacilityType = data.facilityType.map(i => i.elementValue).join(",\n");
        this.toolTipValidationMethods = data.validationMethods.map(i => i.elementValue).join(",\n");
        this.toolTipTransientPaymentOptions = data.transientLocationPaymentOptions.map(i => i.optionValue).join(",\n");
        this.toolTipAvailableAmenities = data.amenities.map(i => i.elementValue).join(",\n");
        this.toolTipsSupportedType = data.supportedVehicleTypes.map(i => i.elementValue).join(",\n");
        this.toolTipMonthlyPaymentOptions = data.monthlyLocationPaymentOptions.map(i => i.optionValue).join(",\n");

        if (data.maxHeight != undefined && data.maxHeight != null) {
          this.featuresFormdata.controls['feet'].setValue(data.maxHeight['feet']);
          this.featuresFormdata.controls['inches'].setValue(data.maxHeight['inches']);
        }
        this.featuresFormdata.controls['amentities'].setValue(data.amenities);
        this.featuresFormdata.controls['supportedVehicleTypes'].setValue(data.supportedVehicleTypes);


        this.featuresFormdata.controls['transientParking'].setValue(data.transientParking);

        let transientOptions: any = this.convertFromPaymentDTO(data.transientLocationPaymentOptions);
        this.featuresFormdata.controls['transientLocationPaymentOptions'].setValue(transientOptions);

        let monthlyOptions: any = this.convertFromPaymentDTO(data.monthlyLocationPaymentOptions);
        this.featuresFormdata.controls['monthlyLocationPaymentOptions'].setValue(monthlyOptions);
        this.featuresFormdata.controls['monthlyParkingApproval'].setValue(data.monthlyParkingApproval);

        this.featuresFormdata.controls['monthlyParking'].setValue(data.monthlyParking);
        if (data.electricVehicleCapabilities != undefined && data.electricVehicleCapabilities != null) {
          data.electricVehicleCapabilities.forEach((paymentOption) => {
            if (paymentOption.optionName.includes('Regular EV1')) {
              this.featuresFormdata.controls['regularEV'].setValue(paymentOption.optionValue);
            } else if (paymentOption.optionName.includes('TESLA')) {
              this.featuresFormdata.controls['teslaSuperCharger'].setValue(paymentOption.optionValue);
            }

          });
        }

        this.onCheckboxClick();
      }
      , (error) => {
        this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
        this.spinnerService.hide();
      }
    );
  }

  onServiceTypeSelected(selectedServiceType) {
    this.toolTipServiceType = selectedServiceType.value ? selectedServiceType.value.map(i => i.elementValue).join(",\n") : "";
  }
  onFacilityTypeSelected(selectedFacilityType) {
    this.toolTipFacilityType = selectedFacilityType.value ? selectedFacilityType.value.map(i => i.elementValue).join(",\n") : "";
    console.log(this.toolTipFacilityType);
  }
  onValidationMethods(selectedValidationMethod) {
    this.toolTipValidationMethods = selectedValidationMethod.value ? selectedValidationMethod.value.map(i => i.elementValue).join(",\n") : "";
  }
  onTransientPaymentOptions(selectedTransientPaymentOptions) {
    this.toolTipTransientPaymentOptions = selectedTransientPaymentOptions.value ? selectedTransientPaymentOptions.value.map(i => i.elementValue).join(",\n") : "";
  }
  onAvailableAmenities(selectedAmenities) {
    this.toolTipAvailableAmenities = selectedAmenities.value ? selectedAmenities.value.map(i => i.elementValue).join(",\n") : "";
  }
  onSupportedType(selectedSupportedType) {
    this.toolTipsSupportedType = selectedSupportedType.value ? selectedSupportedType.value.map(i => i.elementValue).join(",\n") : "";
  }
  onMonthlyPaymentOptions(selectedMonthlyPaymentOptions) {
    this.toolTipMonthlyPaymentOptions = selectedMonthlyPaymentOptions.value ? selectedMonthlyPaymentOptions.value.map(i => i.elementValue).join(",\n") : "";

  }
  onCancel() {
    this.router.navigateByUrl('/lc/locationDetails');
  }

  onCheckboxClick() {
    let publishToWeb = this.featuresFormdata.get('publishToWeb');
    let ctrl = this.featuresFormdata.get('explanation');

    (publishToWeb != undefined && publishToWeb.value == true) ? ctrl.disable() : ctrl.enable();
  }

  saveFeaturesData() {
    this.msgs = [];

    for (let inner in this.featuresFormdata.controls) {
      this.featuresFormdata.get(inner).markAsTouched();
      this.featuresFormdata.get(inner).markAsDirty();
      this.featuresFormdata.get(inner).updateValueAndValidity();
    }
    if (this.featuresFormdata.status == "INVALID") {
      this.msgs.push({ severity: 'error', detail: 'Form has errors' });
      window.scroll(0, 0);
    }
    else {
      this.spinnerService.show();
      var validationFlag: Boolean = this.validateFormData();
      if (validationFlag == true) {
        var objSaveDetails = this.fetchFeaturesObjectFromFormData();
        this.dataService.saveFeaturesDetailsForLocation(objSaveDetails).subscribe(
          (data) => {
            window.scroll(0, 0);
            this.spinnerService.hide();
            { this.msgs.push({ severity: 'success', detail: 'Features Data has been saved successfully' }); }
          }
          , (error) => {
            this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' });
            this.logger.logError("error", error.error, "Location Features Page ", )
            window.scroll(0, 0); this.spinnerService.hide();
          }
        );
      }
      else { this.spinnerService.hide(); }
    }
  }

  validateFormData() {
    var transientParking = +this.featuresFormdata.value.transientParking;
    this.msgs = [];
    if (this.featuresFormdata.controls['transientParking'].value == true) {
      if (this.featuresFormdata.controls['transientLocationPaymentOptions'] && this.featuresFormdata.controls['transientLocationPaymentOptions'].value.length == 0) {
        this.msgs.push({ severity: "error", detail: "Please select atleast one transient payment option" });
        window.scroll(0, 0);
        this.featuresFormdata.controls['transientLocationPaymentOptions'].setErrors({ 'incorrect': true });
        return false;
      }
    }
    return true;
  }

  fetchFeaturesObjectFromFormData() {
    var objSaveDetails = new FeaturesDetails();
    let lotNumber = parseInt(this.featuresFormdata.controls['lotNumber'].value);
    objSaveDetails.lotNumber = lotNumber;
    objSaveDetails.lotDescription = this.featuresFormdata.controls['lotDescription'].value;
    objSaveDetails.publishedName = this.featuresFormdata.controls['publishedName'].value;
    objSaveDetails.publishToWeb = this.featuresFormdata.controls['publishToWeb'].value;
    objSaveDetails.explanation = this.featuresFormdata.controls['explanation'].value;
    let signage = this.featuresFormdata.controls['lotSignage'].value;
    objSaveDetails.lotSignage = signage ? signage.elementId : null;
    objSaveDetails.ownerDepository = this.featuresFormdata.controls['ownerDepository'].value;
    objSaveDetails.facilityType = this.featuresFormdata.controls['facilityType'].value;
    objSaveDetails.serviceType = this.featuresFormdata.controls['serviceType'].value;
    objSaveDetails.validationMethods = this.featuresFormdata.controls['validationMethods'].value;

    objSaveDetails.monthlyParkingApproval = this.featuresFormdata.controls['monthlyParkingApproval'].value;
    objSaveDetails.monthlyParking = this.featuresFormdata.controls['monthlyParking'].value;

    let garageType = this.featuresFormdata.controls['garageType'].value;
    objSaveDetails.garageType = garageType ? garageType.elementId : null;

    objSaveDetails.availableToPublic = this.featuresFormdata.controls['availableToPublic'].value;

    let facilityAccessType = this.featuresFormdata.controls['facilityAccessType'].value;
    objSaveDetails.facilityAccessType = facilityAccessType ? facilityAccessType.elementId : null;

    objSaveDetails.adaSpaceCount = parseInt(this.featuresFormdata.controls['adaSpaceCount'].value==null ? "0":this.featuresFormdata.controls['adaSpaceCount'].value);
    objSaveDetails.heightRestriction = this.featuresFormdata.controls['heightRestriction'].value;

    objSaveDetails.maxHeight = {
      feet: parseInt(this.featuresFormdata.controls['feet'].value)
      , inches: parseInt(this.featuresFormdata.controls['inches'].value)
    };

    objSaveDetails.amenities = this.featuresFormdata.controls['amentities'].value;

    let supportedVehicleTypes = this.featuresFormdata.controls['supportedVehicleTypes'].value;
    objSaveDetails.supportedVehicleTypes = supportedVehicleTypes;

    objSaveDetails.transientParking = this.featuresFormdata.controls['transientParking'].value;


    let transientOptions: any = this.convertToPaymentDTO(this.featuresFormdata.controls['transientLocationPaymentOptions'].value);
    objSaveDetails.transientLocationPaymentOptions = transientOptions;

    let monthlyOptions: any = this.convertToPaymentDTO(this.featuresFormdata.controls['monthlyLocationPaymentOptions'].value);
    let monthlyLocationPaymentOptions = monthlyOptions;
    objSaveDetails.monthlyLocationPaymentOptions = monthlyLocationPaymentOptions;


    if (objSaveDetails.electricVehicleCapabilities == undefined || objSaveDetails.electricVehicleCapabilities == null) { objSaveDetails.electricVehicleCapabilities = []; }
    //Regular EV
    let regularEV = parseInt(this.featuresFormdata.controls['regularEV'].value);
    if (regularEV && regularEV != null && regularEV.toString() != 'NaN') {
      var REVpaymentOption = {
        optionName: 'Regular EV',
        optionValue: regularEV,
        optionId: 1002
      }

      objSaveDetails.electricVehicleCapabilities.push(REVpaymentOption);
    }
    else {
      delete objSaveDetails['regularEV'];
    }
    //Tesla Supercharger
    let teslaSuperCharger = parseInt(this.featuresFormdata.controls['teslaSuperCharger'].value);
    if (teslaSuperCharger && teslaSuperCharger != null && teslaSuperCharger.toString() != 'NaN') {
      var TSpaymentOption = {
        optionName: 'Tesla Supercharger',
        optionValue: teslaSuperCharger,
        optionId: 1003
      }
      objSaveDetails.electricVehicleCapabilities.push(TSpaymentOption);
    }
    else {
      delete objSaveDetails['teslaSuperCharger'];
    }
    super.removeNulls(objSaveDetails);
    return objSaveDetails;
  }
  form() {
    return this.featuresFormdata;
  }

  //TODO: the Swagger Definition for Trasient and monthly options have to updated in future.
  private convertFromPaymentDTO(payments: any) {
    let convertedOptions = [];
    if (payments && payments.length > 0) {
      payments.forEach((item) => {
        convertedOptions.push({ elementId: item.optionName, elementValue: item.optionValue });
      });
    }
    return convertedOptions;
  }
  private convertToPaymentDTO(payments: any) {
    let convertedOptions = [];
    if (payments && payments.length > 0) {
      payments.forEach((item) => {
        if (item.elementValue == 'NONE') { item.elementId = 0 }
        convertedOptions.push({ optionName: item.elementId, optionValue: item.elementValue });
      });
    }
    return convertedOptions;
  }
}
