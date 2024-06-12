import { Component, OnInit, ViewEncapsulation, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ManageComponentDataService } from '../../shared/manage-component-data.service';

import ReferenceTable from '../../shared/enum/refTable.enum';
import { AddressDetails } from './adress-details.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { NotificationService } from '../../shared/notification-service.service';
import { LCForm } from '../../shared/LCForm';
import { ErrorLoggerService } from '../../shared/logger/error-logger.service';
import { GoogleMapsAPIWrapper } from '@agm/core'
import { MapLocation } from './mapLocation.model';

declare var google: any;

@Component({
  selector: 'lc-address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss'],
  providers: [MessageService]
})

export class AddressDetailsComponent extends LCForm implements OnInit {

  coordinates: any;
  map: any = "./assets/map.png";
  msgs: Message[] = [];
  addressDetailsFormdata: any;
  addressDetailsDbData: AddressDetails;
  addressKey: any;
  statesList: any;
  addressTypeValue: any;
  mapLatitude: any = 41.8336479;
  mapLongitude: any = -87.872046;
  markerLatitude: any;
  markerLongitude: any;
  canadaStates: any[];
  isCanadaState: boolean;
  zoomLevel: number = 15;
  screenWidth: number = screen.width;
  previousMapLocation: MapLocation;
  initialGeoType: string;
  constructor(private router: Router
    , private messageService: MessageService
    , private confirmationService: ConfirmationService
    , private dataService: ManageComponentDataService
    , private route: ActivatedRoute, private spinnerService: Ng4LoadingSpinnerService
    , private cdRef: ChangeDetectorRef, private notificationService: NotificationService
    , private logger: ErrorLoggerService
    , private wrapper: GoogleMapsAPIWrapper
  ) {
    super();
    this.statesList = [];
    this.canadaStates = [];
    this.statesList = this.dataService.getStatesList();
    this.canadaStates = this.dataService.getCanadaStatesList();

    this.dataService.getTableValuesByTableName(ReferenceTable.Address_Type).subscribe((data) => {
      this.addressTypeValue = data;
    });
  }

  form() {
    return this.addressDetailsFormdata;
  }


  alignMapUsingZipCode(zipCode) {
    zipCode = typeof (zipCode) === 'object' ? zipCode.value : zipCode;
    if (zipCode && zipCode != "") {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': zipCode }, (results, status) => {
        var latitude = results[0] ? results[0].geometry.location.lat() : this.mapLatitude;
        var longitude = results[0] ? results[0].geometry.location.lng() : this.mapLongitude;
        this.mapLatitude = latitude;
        this.mapLongitude = longitude;
        this.markerLatitude = latitude;
        this.markerLongitude = longitude;
        console.log("lat: " + latitude + ", long: " + longitude);
      });
      this.zoomLevel = 16;
    }
  }

  checkstate() {
    this.msgs = [];
    var a = this.addressDetailsFormdata.controls['active'].value;
    if (a == false) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
        },
        reject: () => {
          this.addressDetailsFormdata.controls['active'].setValue(true);
        }
      });
    }
  }
  public ngDoCheck() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.notificationService.clearMessages();
    this.spinnerService.show();
    this.addressKey = this.route.snapshot.params["addressKey"];
    this.addressDetailsFormdata = new FormGroup({
      active: new FormControl(true),
      addressTypeValue: new FormControl("", Validators.required),
      address1: new FormControl("", Validators.required),
      address2: new FormControl(),
      city: new FormControl("", Validators.required),
      state: new FormControl("", Validators.required),
      zip: new FormControl("", Validators.required),
      oneWayStreet: new FormControl(),
      publish: new FormControl()
    });
    if (!this.addressKey)
      this.spinnerService.hide();

    if (this.addressKey != undefined && this.addressKey.trim() != "") {
      this.dataService.getAddressDetailsByID(this.addressKey).subscribe(
        (data: AddressDetails) => {
          this.addressDetailsFormdata.controls['active'].setValue(true);
          this.addressDetailsFormdata.controls['addressTypeValue'].setValue(data.addressTypeValue);
          this.addressDetailsDbData = data;
          this.addressDetailsFormdata.controls['active'].setValue(data.isActive ? data.isActive : false);
          this.addressDetailsFormdata.controls['addressTypeValue'].setValue({ elementId: data.addressType });
          this.addressDetailsFormdata.controls['address1'].setValue(data.address1);
          this.addressDetailsFormdata.controls['address2'].setValue(data.address2);
          this.addressDetailsFormdata.controls['city'].setValue(data.city);
          this.addressDetailsFormdata.controls['state'].setValue(data.state);

          this.addressDetailsFormdata.controls['zip'].setValue(data.zip);
          this.addressDetailsFormdata.controls['oneWayStreet'].setValue(data.oneWayStreet);
          this.addressDetailsFormdata.controls['publish'].setValue(data.publish);
          if (this.addressDetailsFormdata.value.addressTypeValue.elementId == 1) {

            let publishValue = this.addressDetailsFormdata.get('publish');
            publishValue.disable();

          }

          this.spinnerService.hide();

          if (data.mapLocation != null || data.mapLocation != undefined) {
            if (data.mapLocation.latitude != null || data.mapLocation.latitude != undefined) {
              this.markerLatitude = data.mapLocation.latitude;
              this.mapLatitude = data.mapLocation.latitude;
              this.zoomLevel = 16;
            }
            if (data.mapLocation.longitude != null || data.mapLocation.longitude != undefined) {
              this.mapLongitude = data.mapLocation.longitude;
              this.markerLongitude = data.mapLocation.longitude;
              this.zoomLevel = 16;
            }
            this.previousMapLocation = data.mapLocation;
            this.initialGeoType = data.geoCodingType;
          } else {
            data.zip && data.zip != "" && data.zip ? this.alignMapUsingZipCode(data.zip) : "";
          }


          this.spinnerService.hide();
        }
        , (error) => {
          this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
          this.spinnerService.hide();
        }
      );
    } else {
      this.mapLatitude = 41.8336479;
      this.mapLongitude = -87.872046;
      this.spinnerService.hide();
    }

  }

  onChoseLocation(event) {
    this.markerLatitude = event.coords.lat;
    this.markerLongitude = event.coords.lng;
  }
  onClickAddressType() {
    if (this.addressDetailsFormdata.value.addressTypeValue.elementId == 1) {
      let publishValue = this.addressDetailsFormdata.get('publish');
      this.addressDetailsFormdata.controls['publish'].setValue(true);
      publishValue.disable();

    }
    else {
      let publishValue = this.addressDetailsFormdata.get('publish');
      publishValue.enable();
    }
  }
  saveAddressDetails() {
    this.spinnerService.show();
    var objTosave = this.addressDetailsDbData;
    var objTosave = this.addressDetailsDbData ? this.addressDetailsDbData : new AddressDetails();
    this.msgs = [];


    for (let inner in this.addressDetailsFormdata.controls) {
      this.addressDetailsFormdata.get(inner).markAsTouched();
      this.addressDetailsFormdata.get(inner).markAsDirty();
      this.addressDetailsFormdata.get(inner).updateValueAndValidity();
    }
    if (this.addressDetailsFormdata.status == "INVALID") {
      this.msgs.push({ severity: 'error', detail: 'Form has errors' });
      this.spinnerService.hide();
      window.scroll(0, 0);
    }
    else {
      this.addressDetailsFormdata.markAsPristine();
      this.addressDetailsFormdata.markAsUntouched();
      var addressType = this.addressDetailsFormdata.controls['addressTypeValue'].value;
      addressType = addressType && addressType.elementId ? addressType.elementId : objTosave.addressType;
      objTosave.addressType = addressType;
      objTosave.isActive = this.addressDetailsFormdata.controls['active'].value;
      if (objTosave.isActive == null || !objTosave.isActive) { objTosave.isActive = false; }
      let type = this.addressDetailsFormdata.controls['addressTypeValue'].value;
      objTosave.addressType = type ? type.elementId : "";
      objTosave.address1 = this.addressDetailsFormdata.controls['address1'].value;
      objTosave.address2 = this.addressDetailsFormdata.controls['address2'].value;
      objTosave.city = this.addressDetailsFormdata.controls['city'].value;
      objTosave.state = this.addressDetailsFormdata.controls['state'].value;
      if (!this.findCanadaState(this.addressDetailsFormdata.value.state)) {
        this.isCanadaState = false;
      }
      else {
        this.isCanadaState = true;
      }
      objTosave.zip = this.addressDetailsFormdata.controls['zip'].value;
      // let zip = this.addressDetailsFormdata.controls['zip'].value;
      // zip = zip ? parseInt(zip) : null;
      // objTosave.zip = zip;
      objTosave.oneWayStreet = this.addressDetailsFormdata.controls['oneWayStreet'].value;
      if (objTosave.oneWayStreet == null || !objTosave.oneWayStreet) { objTosave.oneWayStreet = false; }
      objTosave.publish = this.addressDetailsFormdata.controls['publish'].value;

      objTosave.addressKey = this.addressKey;

      if (objTosave.publish == null || !objTosave.publish) { objTosave.publish = false; }
      var mapLocation = { latitude: this.markerLatitude, longitude: this.markerLongitude };
      objTosave.geoCodingType = this.initialGeoType != 'M' // Checks if initial geoCode is not manual and set it automatic .
        && this.previousMapLocation && this.previousMapLocation.latitude != this.markerLatitude
        && this.previousMapLocation.longitude != this.markerLongitude ?
        "M" : "A";
      objTosave.mapLocation = mapLocation;


      super.removeNulls(objTosave);
      this.dataService.saveAddressDetailsForLocation(objTosave).subscribe(
        (data) => {
          this.msgs = [];
          this.spinnerService.hide();
          this.router.navigateByUrl("/lc/operational");
          this.notificationService.pushMessages([{ severity: "success", detail: 'Address Details Data has been saved successfully' }])
        }
        , (error) => {
          this.msgs = [];
          this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' });
          this.logger.logError("error", error.error, "AddressDetails Page");
          this.spinnerService.hide();
          window.scroll(0, 0);
        }
      );

    }
  }
  stateChanged(event) {
    this.isCanadaState = this.findCanadaState(this.addressDetailsFormdata.value.state);

  }

  findCanadaState(state) {
    for (var i = 0; i < this.canadaStates.length; i++) {
      if (this.canadaStates[i].value == state) {
        return true;
      }
    }
    return false;
  }
  cancel() {
    this.router.navigateByUrl('/lc/operational');
  }
  validateFormData() {
  }

}
