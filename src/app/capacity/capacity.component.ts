import { Component, OnInit, ViewEncapsulation, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroup, FormControl, Validators, FormBuilder, FormControlName } from '@angular/forms';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { CapacityType } from '../shared/model/locationModel/capacityType.model'
import { Capacity } from './capacity.model';
import { Blocked } from './blocked.model';
import { capacitySpaces } from './capacity.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../shared/notification-service.service';
import { LCForm } from '../shared/LCForm';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';

@Component({
  selector: 'capacity',
  templateUrl: './capacity.html',
  styleUrls: ['./capacity.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class CapacityComponent extends LCForm implements OnInit {


  capacityFormdata: FormGroup;
  msgs: Message[] = [];
  hours: any[];
  first: any[];
  fromTime: any;
  toTime: any;
  openTime: any[];
  closeTime: any[];
  dateObj = new Date();
  newDate: String;
  screenWidth: number = screen.width;
  capacityControlIDs: any[] = [0];
  capacityResultSet: capacitySpaces[] = [];
  restrictedSpaces = [];
  ddRestrictedSpaces = [];
  display: boolean = false;
  isNoteSaved: boolean = false;
  minDateValue: Date;
  noteIDToBeSaved : number;
  constructor(private router: Router
    , private messageService: MessageService
    , private dataService: ManageComponentDataService
    , private spinnerService: Ng4LoadingSpinnerService, private notificationService: NotificationService
    , private logger: ErrorLoggerService
  ) {

    super();
    this.openTime = [];
    this.closeTime = [];
    this.openTime = this.dataService.getCapacityTime();
    this.closeTime = this.dataService.getCapacityTime();
  }

  ngOnInit() {
    this.spinnerService.show();
    this.setMinDate();
    this.loadRestrictedSpaces();
    this.capacityFormdata = new FormGroup({
      contractedCapacity: new FormControl(),
      workingCapacity: new FormControl("", Validators.required),
      notes0: new FormControl(),
      spaceNumber0: new FormControl(),
      fromTime0: new FormControl(),
      toTime0: new FormControl(),
      capacityType0: new FormControl(),
      locationCapacityTypeKey0: new FormControl(),
      reserved: new FormControl(),
      tenant: new FormControl(),
      client: new FormControl(),
      blocked: new FormControl(),
      toTime: new FormControl(),
      available: new FormControl(),
      oversell: new FormControl(),
      stopsell: new FormControl(),
      stopsellCount: new FormControl(),
      totalRestrictedSpaces: new FormControl(),
      lastSpaceAvailable: new FormControl()
    });


  }
  showDialog(noteIndex) {
    this.display = true;
    this.noteIDToBeSaved = noteIndex;
  }
  rejectNewNote() {
    !this.isNoteSaved && this.capacityFormdata.controls["notes"+this.noteIDToBeSaved] 
    && this.capacityFormdata.controls["notes"+this.noteIDToBeSaved] == null 
    ? this.capacityFormdata.controls["notes"+this.noteIDToBeSaved].setValue("") : "";
    this.display = false;
  }
  addNewNote() {
    this.display = false;
    this.isNoteSaved = true;
  }
  loadRestrictedSpaces() {
    this.dataService.getTableValuesByTableName("RESTRICTED_CAPACITY_TYPE").subscribe((data: any[]) => {
      this.ddRestrictedSpaces = data;
      this.dataService.getCapacityForLocation().subscribe(
        (data: Capacity) => {
          this.restrictedSpaces = data && data["restrictedSpaces"] ? data["restrictedSpaces"] : [];
          this.capacityFormdata.controls['contractedCapacity'].setValue(data.contractedCapacity);
          this.capacityFormdata.controls['workingCapacity'].setValue(data.workingCapacity);
          this.capacityFormdata.controls['oversell'].setValue(data.oversell);
          this.capacityFormdata.controls['stopsell'].setValue(data.stopsell);

          if (this.restrictedSpaces.length > 0) { this.capacityControlIDs = []; }
          this.restrictedSpaces.forEach((space) => {

            let restrictedSpaceIndex = this.capacityControlIDs.length;
            this.capacityFormdata.controls['capacityType' + restrictedSpaceIndex].setValue({ elementId: space["capacityType"] });
            if (space["capacityToDate"] && space["capacityToDate"] != null) {
              this.capacityFormdata.controls['toTime' + restrictedSpaceIndex].setValue(new Date(space["capacityToDate"]));
            }
            if (space["capacityFromDate"] && space["capacityFromDate"] != null) {
              this.capacityFormdata.controls['fromTime' + restrictedSpaceIndex].setValue(new Date(space["capacityFromDate"]));
            }
            this.capacityFormdata.controls['spaceNumber' + restrictedSpaceIndex].setValue(space["value"]);
            this.capacityFormdata.controls['locationCapacityTypeKey' + restrictedSpaceIndex].setValue(space["locationCapacityTypeKey"]);
            this.capacityFormdata.controls['notes' + restrictedSpaceIndex].setValue(space["notes"]);
            this.capacityControlIDs.push(restrictedSpaceIndex);
            this.addRestrictedCapControl();

          })
          if (this.capacityControlIDs.length == 0) {
            this.capacityControlIDs.push(0);
          }
          this.ngDoCheck();
          this.spinnerService.hide();
        }
        , (error) => {
          if (error.status != 404) {

            this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
            this.logger.logError("error", error.error, "Capacity Page");
          }
          this.spinnerService.hide();
        }
      );
    })
  }
  addRestrictedCapControl() {
    this.capacityFormdata.addControl("capacityType" + (this.capacityControlIDs.length).toString(), new FormControl());
    this.capacityFormdata.addControl("fromTime" + (this.capacityControlIDs.length).toString(), new FormControl());
    this.capacityFormdata.addControl("toTime" + (this.capacityControlIDs.length).toString(), new FormControl());
    this.capacityFormdata.addControl("spaceNumber" + (this.capacityControlIDs.length).toString(), new FormControl());
    this.capacityFormdata.addControl("locationCapacityTypeKey" + (this.capacityControlIDs.length).toString(), new FormControl());
    this.capacityFormdata.addControl("notes" + (this.capacityControlIDs.length).toString(), new FormControl());
  }
  removeRestrictedCapControl(controlID) {
    this.capacityFormdata.removeControl("capacityType" + controlID);
    this.capacityFormdata.removeControl("fromTime" + controlID);
    this.capacityFormdata.removeControl("toTime" + controlID);
    this.capacityFormdata.removeControl("spaceNumber" + controlID);
    this.capacityFormdata.removeControl("locationCapacityTypeKey" + controlID);
    this.capacityFormdata.removeControl("notes" + controlID);
  }
  ngDoCheck() {

    let todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    let totalRestrictedSpaces = 0;
    let workingCapacity = this.getNumberFromStringValue(this.capacityFormdata.controls['workingCapacity'].value);
    let oversell = this.getNumberFromStringValue(this.capacityFormdata.controls['oversell'].value);
    let stopsell = this.getNumberFromStringValue(this.capacityFormdata.controls['stopsell'].value);

    for (let ind = 0; ind < this.capacityControlIDs.length; ind++) {
      let fromDate = this.capacityFormdata.controls['fromTime' + this.capacityControlIDs[ind]].value;
      if (fromDate && fromDate != null) { fromDate.setHours(0, 0, 0, 0); }
      let toDate = this.capacityFormdata.controls['toTime' + this.capacityControlIDs[ind]].value;
      if (toDate && toDate != null) { toDate.setHours(0, 0, 0, 0); }
      if (fromDate && fromDate != null
        && toDate && toDate != null
        && todayDate >= fromDate && todayDate <= toDate) {
        totalRestrictedSpaces += this.getNumberFromStringValue(this.capacityFormdata.controls['spaceNumber' + this.capacityControlIDs[ind]].value);
      }
    }
    let stopsellCount = (workingCapacity * stopsell) / 100;
    stopsellCount = Math.floor(stopsellCount);

    this.capacityFormdata.controls['stopsellCount'].setValue(stopsellCount);
    let available = (workingCapacity - totalRestrictedSpaces) + oversell;
    this.capacityFormdata.controls['totalRestrictedSpaces'].setValue(totalRestrictedSpaces);
    this.capacityFormdata.controls['available'].setValue(available);

  }

  getNumberFromStringValue(numberString) {
    if (!numberString || numberString == null || parseInt(numberString).toString() == 'NaN') {
      return 0;
    }
    return parseInt(numberString);
  }

  onCancel() {
    this.router.navigateByUrl('lc/locationDetails');
  }

  addNewSpace() {
    this.addRestrictedCapControl();
    this.capacityControlIDs.push((this.capacityControlIDs.length));
  }
  isDisabled() {
    return this.capacityControlIDs.length === 5;
  }

  saveCapacity() {
    this.msgs = [];
    this.spinnerService.show();
    var validationFlag: Boolean = this.validateFormData();
    if (validationFlag == true) {
      var objTosave = this.fetchCapacityObjectFromFormData();
      this.dataService.saveCapacityForLocation(objTosave).subscribe(
        (data) => {
          this.loadRestrictedSpaces();
          this.msgs = [];
          for (let inner in this.capacityFormdata.controls) {
            this.capacityFormdata.get(inner).markAsTouched();
            this.capacityFormdata.get(inner).markAsDirty();
            this.capacityFormdata.get(inner).updateValueAndValidity();
          }
          this.spinnerService.hide();
          this.msgs.push({ severity: "success", detail: 'Capacity Data has been saved successfully' });
          window.scroll(0, 0);
        }
        , (error) => {
          this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' });
          this.spinnerService.hide();
          window.scroll(0, 0);
        }

      );
    } else {
      this.spinnerService.hide();
      window.scroll(0, 0);
    }
  }

  validateFormData() {
    var workingCapacityData = this.capacityFormdata.value.workingCapacity;
    var totalRestrictedSpaces = this.capacityFormdata.value.totalRestrictedSpaces;

    this.msgs = [];
    let selectedRestrictedCapacities = [];
    for (let ind = 0; ind < this.capacityControlIDs.length; ind++) {
      let fromDate = this.capacityFormdata.controls['fromTime' + this.capacityControlIDs[ind]].value;
      let toDate = this.capacityFormdata.controls['toTime' + this.capacityControlIDs[ind]].value;
      let capacityValue = parseInt(this.capacityFormdata.controls['spaceNumber' + this.capacityControlIDs[ind]].value);
      let prop: string = this.capacityFormdata.controls['capacityType' + this.capacityControlIDs[ind]]
        && this.capacityFormdata.controls['capacityType' + this.capacityControlIDs[ind]].value != null ? this.capacityFormdata.controls['capacityType' + this.capacityControlIDs[ind]].value["elementId"] : "";

      let capObj = this.ddRestrictedSpaces.filter((i) => i.elementId == prop);

      let capacityDisplayName = capObj && capObj.length > 0 ? capObj[0].elementValue : "";

      if (!capacityDisplayName && !fromDate && !toDate && !capacityValue) {
        continue;
      }
      else if (capObj.length == 0 && (fromDate || toDate || capacityValue)) {
        this.msgs.push({ severity: 'error', detail: 'Found an entry under restricted spaces with empty capacity type.' });
        return false;
      }


      // if (fromDate && fromDate != null
      //   && (!toDate || toDate == null)
      // ) {
      //   this.msgs.push({ severity: 'error', detail: 'Please enter the To Date for ' + capacityDisplayName });
      //   return false;
      // }
      if (toDate && toDate != null
        && (!fromDate || fromDate == null)
      ) {
        this.msgs.push({ severity: 'error', detail: 'Please enter the From Date for ' + capacityDisplayName });
        return false;
      }
      if (fromDate && toDate && fromDate >= toDate) {
        this.msgs.push({ severity: 'error', detail: 'From Date should not be greater than To Date for ' + capacityDisplayName });
        return false;
      }
      if (capacityValue > workingCapacityData) {
        this.msgs.push({ severity: 'error', detail: 'Spaces marked for ' + capacityDisplayName + ' should be less than Working Capacity' });
        return false;
      }
    }
    if (totalRestrictedSpaces > workingCapacityData) {
      // total Restricted Space count should be less than working capacity of location;
      this.msgs.push({ severity: 'error', detail: 'Total Restricted Space count should be less than working capacity of location' });
      return false;
    }

    return true;
  }
  fetchCapacityObjectFromFormData() {
    //TODO: call Service to Persist data in APIC
    var objTosave = new Capacity();
    var formData = this.capacityFormdata.getRawValue();
    objTosave.oversell = convertStringToNumber(this.capacityFormdata.controls['oversell'].value);
    objTosave.contractedCapacity = convertStringToNumber(this.capacityFormdata.controls['contractedCapacity'].value);
    objTosave.workingCapacity = convertStringToNumber(this.capacityFormdata.controls['workingCapacity'].value);
    objTosave.stopsell = convertStringToNumber(this.capacityFormdata.controls['stopsell'].value);

    for (let ind = 0; ind < this.capacityControlIDs.length; ind++) {
      objTosave.restrictedSpaces.push({
        capacityType: this.capacityFormdata.controls['capacityType' + this.capacityControlIDs[ind]].value !=null ?this.capacityFormdata.controls['capacityType' + this.capacityControlIDs[ind]].value.elementId : "",
        capacityFromDate: this.capacityFormdata.controls["fromTime" + this.capacityControlIDs[ind]].value != null ? new Date(this.capacityFormdata.controls["fromTime" + ind].value).toLocaleDateString() : "",
        capacityToDate: this.capacityFormdata.controls['toTime' + this.capacityControlIDs[ind]].value != null ? new Date(this.capacityFormdata.controls['toTime' + ind].value).toLocaleDateString() : "",
        value: convertStringToNumber(this.capacityFormdata.controls['spaceNumber' + this.capacityControlIDs[ind]].value),
        locationCapacityTypeKey: this.capacityFormdata.controls['locationCapacityTypeKey' + this.capacityControlIDs[ind]].value != null ? convertStringToNumber(this.capacityFormdata.controls['locationCapacityTypeKey' + ind].value) : -1,
        notes: formData['notes' + this.capacityControlIDs[ind]] && formData['notes' + this.capacityControlIDs[ind]] != null ? formData['notes' + ind] : ""
      })
    }
    super.removeNulls(objTosave);
    //NaN value removal 
    return objTosave;

  }
  form() {
    return this.capacityFormdata;
  }
  removeRestrictedSpace(index) {
    let ind = this.capacityControlIDs.findIndex(i => i == index);
    if (ind !== -1) {
      this.removeRestrictedCapControl(this.capacityControlIDs[ind]);
      this.capacityControlIDs.splice(ind, 1);
    }
    this.ngDoCheck();
  }
  setMinDate() {
    this.minDateValue = new Date();
    this.minDateValue.setDate(this.minDateValue.getDate());
    this.minDateValue.setMonth(this.minDateValue.getMonth());
    this.minDateValue.setFullYear(this.minDateValue.getFullYear());
  }
}
function convertStringToNumber(value) {
  if (value && value != null && (typeof value == 'string')) {
    return parseInt(value);
  }
  return value;
}


