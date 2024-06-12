import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Address } from '../shared/model/locationModel/address.model'
import { HoursOfOperation } from './hoursOfOperation.model';
import { Operational } from './operational.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LCForm } from '../shared/LCForm';
import { NotificationService } from '../shared/notification-service.service';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';

@Component({
  selector: 'lc-operational',
  templateUrl: './operational.component.html',
  styleUrls: ['./operational.component.scss'],
  providers: [MessageService]
})
export class OperationalComponent extends LCForm implements OnInit, AfterViewInit {
  photos: any = [];
  msgs: Message[] = [];
  operationalFormdata: any;
  openTime: any[];
  closeTime: any[];
  addressData: any;
  revenueSystem: any;
  timeString: String;
  timeZone: any[];
  phoneNo: String;
  primaryCustomerServiceNo: String;
  dbValue: Operational;
  base64Image: string;
  images: any[];
  base64ImageArray: any[] = [];
  screenWidth: number = screen.width;
  hoursOfOperation: HoursOfOperation[] = [];
  days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  constructor(private router: Router, private messageService: MessageService
    , private dataService: ManageComponentDataService, private spinnerService: Ng4LoadingSpinnerService
    , private notificationService: NotificationService
    , private logger: ErrorLoggerService) {
    super();
    this.openTime = [];
    this.closeTime = [];
    this.revenueSystem = [];
    this.timeZone = [];
    this.openTime = this.dataService.createTimeField();
    this.closeTime = this.dataService.createTimeField();
    this.timeZone = this.dataService.getTimeZone();

    this.dataService.getRevenueSystem().subscribe((data) => {
      this.revenueSystem = data;
    });
  }

  form() {
    return this.operationalFormdata;
  }
  ngAfterViewInit() {

  }
  is_dayLight: boolean;
  is_allowOverNight: boolean;
  ngOnInit() {
    this.spinnerService.show();
    this.populateHoursOfOps();
    this.operationalFormdata = new FormGroup({
      customerServicePhoneNumber: new FormControl("", Validators.required),
      // primaryCustomerServiceNumber: new FormControl("", Validators.required),
      neighborhood: new FormControl(),
      photos: new FormControl(),
      howToFind: new FormControl(),
      parkingLocationDescription: new FormControl(),
      parkingInstructions: new FormControl(),
      parkingDisclosures: new FormControl(),
      revenueSystem: new FormControl(),
      validationMethods: new FormControl(),
      address: new FormControl(),
      timeZone: new FormControl(),
      dayLightSaving: new FormControl(false, ),
      allowOvernight: new FormControl(false, )
    });
    this.dataService.getOperationalForLocation().subscribe(
      (data: Operational) => {
        try {
          this.dbValue = data;
          this.addressData = data.addresses;
          data.addresses.forEach((address) => {
            address.isOneWayFormatted = address.oneWayStreet ? "True" : "False";
            address.publishFormatted = address.publish ? "True" : "False";
          })
          this.operationalFormdata.controls['customerServicePhoneNumber'].setValue(data.elimiwaitPhoneNumber);
          // this.operationalFormdata.controls['primaryCustomerServiceNumber'].setValue(data.customerServicePhoneNumber);
          this.operationalFormdata.controls['neighborhood'].setValue(data.neighborhood);

          this.photos = data.photos;
          let images = [];
          this.images = [];
          if (!data.photos || data.photos == null) {
            data.photos = [];
          }
          for (let image in data.photos) {
            let dbImage: any = image;
            let newImage = {
              source: dbImage.imageLink,
              title: dbImage.imageName,
              dbObj: dbImage
            }
            this.images.push(newImage);
          }

          this.operationalFormdata.controls['howToFind'].setValue(data.howToFind);
          this.operationalFormdata.controls['parkingLocationDescription'].setValue(data.parkingLocationDescription);
          this.operationalFormdata.controls['parkingInstructions'].setValue(data.parkingInstructions);
          this.operationalFormdata.controls['parkingDisclosures'].setValue(data.parkingDisclosures);
          this.operationalFormdata.controls['revenueSystem'].setValue(data.revenueSystem);
          this.operationalFormdata.controls['revenueSystem'].setValue({ elementId: data.revenueSystem });
          this.operationalFormdata.controls['validationMethods'].setValue(data.validationMethods);

          this.is_dayLight = data.dayLightSaving != null ? data.dayLightSaving : false;
          this.is_allowOverNight = data.allowOverNight != null ? data.allowOverNight : false;

          this.operationalFormdata.controls['timeZone'].setValue(data.timeZone);
          this.operationalFormdata.controls['dayLightSaving'].setValue(this.is_dayLight);
          this.operationalFormdata.controls['allowOvernight'].setValue(this.is_allowOverNight);

          this.hoursOfOperation = data.hoursOfOperation.length != 0 ? data.hoursOfOperation : this.hoursOfOperation;
          if (this.hoursOfOperation.length != this.days.length) {
            let notPresentDay: any[] = []
            notPresentDay = this.days.filter((item) => { return this.hoursOfOperation.map(i => i.name).indexOf(item) > -1 });
            notPresentDay.forEach((day) => {
              this.hoursOfOperation.push({ dayId: 12, name: day, is24HourOpen: false, closed: false, openTime: null, closeTime: null });
            });
          }
        } catch (ex) {
          console.log(ex);
          this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
        }
        this.spinnerService.hide();
      }
      , (error) => {
        this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
        this.spinnerService.hide();
      },
      () => { this.spinnerService.hide(); }
    );
  }
  selectTime() { }
  populateHoursOfOps() {
    if (this.hoursOfOperation.length == 0) {
      this.days.forEach((day) => {
        this.hoursOfOperation.push({ dayId: null, name: day, is24HourOpen: false, closed: false, openTime: null, closeTime: null });
      });
    }
  }
  saveOperational() {

    try {
      this.notificationService.clearMessages();
      this.spinnerService.show();
      var validationFlag: Boolean = this.validateFormData();
      if (validationFlag) {
        var objToSave = this.fetchOperationalObjectFromFormData();
        this.dataService.saveOperationalForLocation(objToSave).subscribe(
          (data) => {
            window.scroll(0, 0);
            this.spinnerService.hide();
            this.msgs = [];
            { this.msgs.push({ severity: 'success', detail: 'Operational Data has been saved successfully' }); }

          },
          (error) => {
            this.msgs = [];
            this.logger.logError("error", error.error, "Operational Page");
            this.notificationService.pushMessages([{ severity: 'error', detail: 'Update of Information has failed' }])

            this.spinnerService.hide();
          }
        );
      } else {
        window.scroll(0, 0);
        this.spinnerService.hide();
      }
    } catch (ex) {
      console.log(ex);
      this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' });
      this.spinnerService.hide();
    }
  }

  validateFormData() {
    this.msgs = [];
    // this.phoneNo = this.operationalFormdata.value.customerServicePhoneNumber.toString();
    // if (this.operationalFormdata.value.customerServicePhoneNumber == null || this.operationalFormdata.value.customerServicePhoneNumber == '.' || this.phoneNo.includes('_')) {
    //   this.msgs.push({ severity: 'error', detail: 'Please enter Customer Service Phone Number' });
    //   this.spinnerService.hide();
    //   return false;
    // }
    // let primaryCustomerServiceNo = this.operationalFormdata.value.primaryCustomerServiceNumber ? this.operationalFormdata.value.primaryCustomerServiceNumber.toString() : null;
    // if (primaryCustomerServiceNo == null || primaryCustomerServiceNo == '.' ||primaryCustomerServiceNo.includes('_')) {
    //   this.msgs.push({ severity: 'error', detail: 'Please enter Customer Service Phone Number' });
    //   this.spinnerService.hide();
    //   window.scroll(0,0);
    //   return false;
    // }
    let isValid: boolean = true;
    let days = ["Sunday", "Monday", "TuesDay", "WednesDay", "Thursday", "Friday", "Saturday"]
    this.hoursOfOperation.forEach((operation, i) => {
      if (isValid) {
        if (!operation.is24HourOpen) {
          if (operation.closeTime == "" ) {
            this.msgs.push({ severity: 'error', detail: 'Please Enter Close Time for ' + days[i] });
            isValid = false;
          }
          else if( !operation.openTime && operation.closeTime){
            this.msgs.push({ severity: 'error', detail: 'Please Enter Open Time for ' + days[i] });
            isValid = false;
          }
          if (operation.openTime == "" ) {
            this.msgs.push({ severity: 'error', detail: 'Please Enter Open Time for ' + days[i] });
            isValid = false;
          }
          else if( operation.openTime && !operation.closeTime){
            this.msgs.push({ severity: 'error', detail: 'Please Enter Close Time for ' + days[i] });
            isValid = false;
          }

          if (operation.closeTime < operation.openTime) {
            this.msgs.push({ severity: 'error', detail: 'Close Time should be greater than open time for ' + days[i] });
            isValid = false;
          }
        }
      }
    });
    return isValid;
  }

  fetchOperationalObjectFromFormData() {
    //TODO: call Service to Persist data in APIC
    var objToSave = new Operational();
    var objToSave = this.dbValue ? this.dbValue : new Operational();

    let elimiwaitPhoneNumber = this.operationalFormdata.value.customerServicePhoneNumber ? this.operationalFormdata.value.customerServicePhoneNumber.toString() : null;
    if (elimiwaitPhoneNumber != null && !elimiwaitPhoneNumber.includes('_')) {
      objToSave.elimiwaitPhoneNumber = elimiwaitPhoneNumber;
    }

    // let primaryCustomerServiceNo = this.operationalFormdata.value.primaryCustomerServiceNumber ? this.operationalFormdata.value.primaryCustomerServiceNumber.toString() : null;
    // if (primaryCustomerServiceNo !=null && !primaryCustomerServiceNo.includes('_')) {
    //   objToSave.customerServicePhoneNumber =primaryCustomerServiceNo;
    // }
    objToSave.neighborhood = this.operationalFormdata.controls['neighborhood'].value;
    objToSave.photos = this.operationalFormdata.controls['photos'].value;
    objToSave.howToFind = this.operationalFormdata.controls['howToFind'].value;
    objToSave.parkingLocationDescription = this.operationalFormdata.controls['parkingLocationDescription'].value;
    objToSave.parkingInstructions = this.operationalFormdata.controls['parkingInstructions'].value;
    objToSave.parkingDisclosures = this.operationalFormdata.controls['parkingDisclosures'].value;
    objToSave.revenueSystem = this.operationalFormdata.controls['revenueSystem'].value;
    let revenueSystem = this.operationalFormdata.controls['revenueSystem'].value;
    objToSave.revenueSystem = revenueSystem ? revenueSystem.elementId : null;
    objToSave.validationMethods = this.operationalFormdata.controls['validationMethods'].value;

    objToSave.timeZone = this.operationalFormdata.controls['timeZone'].value;
    objToSave.dayLightSaving = this.operationalFormdata.controls['dayLightSaving'].value == "1";
    objToSave.allowOverNight = this.operationalFormdata.controls['allowOvernight'].value;
    if (this.hoursOfOperation.length > 0) {
      this.hoursOfOperation.forEach((hour) => {
        hour.openTime = hour.openTime == '24Hrs' ? "" : hour.openTime
        hour.openTime = hour.openTime == 'Select' ? "" : hour.openTime
        hour.closeTime = hour.closeTime == 'Select' ? "" : hour.closeTime
        hour.closeTime = hour.closeTime == '24Hrs' ? "" : hour.closeTime
      })
    }
    objToSave.hoursOfOperation = this.hoursOfOperation;

    delete objToSave["addresses"];

    super.removeNulls(objToSave);
    return objToSave;
  }
  addressDetails(event) {
    this.router.navigateByUrl('/lc/address-details/' + event.data.addressKey);
    this.router.navigateByUrl('/lc/address-details/' + event.data.addressId);
  }

  onClick() {
    this.router.navigateByUrl('/lc/address-details/');
  }

  onPhotoClick(imageData) {
    let image = imageData;// event.image.dbObj;
    if (image && image != null) {
      let imageId = image.imageId;
      let imageName = image.imageName;
      let imageLink = image.imageLink;
      this.router.navigateByUrl('/lc/photo?imageId=' + imageId + '&imageName=' + imageName + '&imageLink=' + imageLink);
    } else {
      this.msgs = [];
      this.msgs.push({ severity: 'error', detail: 'Image cannot be opened.' });
      window.scroll(0, 0);
    }
  }

  createNewPhoto() {
    this.router.navigateByUrl('/lc/photo');
  }

  cancel() {
    this.router.navigateByUrl('/lc/locationDetails');
  }

  timeTo12HrFormat(time) {   // Take a time in 24 hour format and format it in 12 hour format
    var time_part_array = time.split(":");
    var ampm = 'AM';

    if (time_part_array[0] >= 12) {
      ampm = 'PM';
    }

    if (time_part_array[0] > 12) {
      time_part_array[0] = time_part_array[0] - 12;
    }

    var formatted_time = time_part_array[0] + ':' + time_part_array[1] + ' ' + ampm;
    formatted_time = formatted_time.replace(/^0+/, '');
    return formatted_time;

  }

  getTwentyFourHourTime(str) {
    str = String(str).toLowerCase().replace(/\s/g, '');
    var has_am = str.indexOf('am') >= 0;
    var has_pm = str.indexOf('pm') >= 0;
    // first strip off the am/pm, leave it either hour or hour:minute
    str = str.replace('am', '').replace('pm', '');
    // if hour, convert to hour:00
    if (str.indexOf(':') < 0) str = str + ':00';
    // now it's hour:minute
    // we add am/pm back if striped out before 
    if (has_am) str += ' am';
    if (has_pm) str += ' pm';
    // now its either hour:minute, or hour:minute am/pm
    // put it in a date object, it will convert to 24 hours format for us 
    var d = new Date("1/1/2011 " + str);
    // make hours and minutes double digits
    var doubleDigits = function (n) {
      return (parseInt(n) < 10) ? "0" + n : String(n);
    };
    return doubleDigits(d.getHours()) + ':' + doubleDigits(d.getMinutes());
  }
  setEmptyToSelect(event, time, rowData) {
    let value = event ? event.value : "";
    this.setSelectForEmptyTime(value, time, rowData);
  }
  setTimeToHrs(checked, rowData) {
    if (checked) {
      this.closeTime.push({ label: "24Hrs", value: "24Hrs" });
      rowData.closeTime = "24Hrs"
      rowData.openTime = "24Hrs"
    }
    else {
      this.closeTime.push({ label: "Select", value: "Select" });
      rowData.closeTime = "Select"
      rowData.openTime = "Select"
      this.closeTime.findIndex(i => i.label == "24Hrs") !== -1 ? this.closeTime.splice(this.closeTime.findIndex(i => i.label == "24Hrs"), 1) : "";
      this.closeTime.findIndex(i => i.label == "Select") !== -1 ? this.closeTime.splice(this.closeTime.findIndex(i => i.label == "Select"), 1) : "";
    }
  }
  setSelectForEmptyTime(value, time, rowData) {
    let isEmpty = (value == "" || value==null);
    if (isEmpty && time == 'open') {
      this.closeTime.push({ label: "Select", value: "" });
      rowData.openTime = 'Select'

      this.closeTime.findIndex(i => i.label == "Select") !== -1 ? this.closeTime.splice(this.closeTime.findIndex(i => i.label == "Select"), 1) : "";
    }
    else if (isEmpty && time == "close") {
      this.closeTime.push({ label: "Select", value: "" });
      rowData.closeTime = 'Select'
      this.closeTime.findIndex(i => i.label == "Select") !== -1 ? this.closeTime.splice(this.closeTime.findIndex(i => i.label == "Select"), 1) : "";
      this.closeTime.splice(this.closeTime.findIndex(i => i.label == "Select"), 1);
    }
  }
}
