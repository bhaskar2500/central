import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RateDetailsModel } from './ratesDetails.models';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { error } from 'util';
import { RateChannelPartner, } from "../shared/model/rateModel/rateChannelPartner.model";
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import ReferenceTable from '../shared/enum/refTable.enum';
import { LCForm } from '../shared/LCForm';
import { NotificationService } from '../shared/notification-service.service';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';

@Component({
  selector: 'lc-rate-details', templateUrl: './rate-details.component.html',
  styleUrls: ['./rate-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService]
})
export class RateDetailsComponent extends LCForm {


  constructor(private route: ActivatedRoute, private messageService: MessageService, private dataService: ManageComponentDataService
    , private router: Router
    , private fb: FormBuilder
    , private confirmationService: ConfirmationService
    , private cdRef: ChangeDetectorRef, private spinnerService: Ng4LoadingSpinnerService
    , private notificationService: NotificationService
    , private logger: ErrorLoggerService) {


    super();
    this.ratesFormData = this.fb.group({})
  }
  controls: any[] = ["addOn", "minStayHours", "minStayMinutes", "maxStayHours", "maxStayMinutes"
    , "entryStartTime", "exitStartTime", "isCombinable", "combinable", "nonRefundable", "multipleInOut"
    , "entryEndTime", "exitEndTime"];
  requiredControls: any[] = ["entryStartTime", "exitStartTime", "increment"];
  ratesFormData: FormGroup;
  rateKey: string;
  rateRecord: RateDetailsModel;
  dropDownBounds: any = [];
  rateTypeData: any[] = [];
  incrementData: any;
  maxStayHours: any[] = [];
  minStayHours: any[] = [];
  stayMinutes: any = []
  selectedChannelPartners: RateChannelPartner[] = [];
  isChannelDisabled: boolean = false;
  weekDays: any[] = [];
  msgs: Message[] = [];
  additionalDays: any[] = [];
  toolTipWeekDays: string;
  toolTipChannels: string;
  screenWidth: number = screen.width;
  minDateValue: Date;
  public ngDoCheck() {
    this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.msgs = [];
    this.addControlsToForm();
    this.spinnerService.show();
    this.setMinimiumDate();
    this.dropDownBounds = this.dataService.createTimeField();
    this.maxStayHours = this.minStayHours = this.dataService.getstayHours();
    this.minStayHours = this.minStayHours.slice(0, 24);
    this.stayMinutes = this.dataService.getStayMinutes();
    this.incrementData = this.getDataFromReferenceTable(ReferenceTable.Increment);
    this.getDataFromReferenceTable(ReferenceTable.Rate_Type)
    this.additionalDays.push({ label: "NA", value: 0 })
    Array(5).fill(1).map((x, i) => i + 1).forEach((number) => {
      this.additionalDays.push({ label: number, value: number })
    });
    this.route.queryParams.subscribe((params) => {
      this.rateKey = params["RateKey"];
      if (!this.rateKey || this.rateKey == null
        || (typeof this.rateKey == 'string'
          && (this.rateKey.trim() == '' || this.rateKey.trim() == 'undefined')
        )
      ) {
        this.spinnerService.hide();
      } else {
        this.getRateDetailsByID(this.rateKey);
      }
    });
  }

  /**
  * on Active unselect warns the user to perform the action.
  */
  confirm() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.ratesFormData.controls["isActive"].setValue(false);
      },
      reject: () => {
        this.ratesFormData.controls["isActive"].setValue(true);
      },
    });
  }
  setMinimiumDate() {
    this.minDateValue = new Date();
    this.minDateValue.setDate(this.minDateValue.getDate());
    this.minDateValue.setMonth(this.minDateValue.getMonth());
    this.minDateValue.setFullYear(this.minDateValue.getFullYear());
  }
  showDialog(isChecked) {
    if (!isChecked) {
      this.confirm();
    }
    // this.confirm();
  }

  /**
   * Gets the rates data from the rate management screen and sends it to the DB.
  */
  saveRate(redirect) {
    this.spinnerService.show();

    if (this.validateFormData() && this.ratesFormData.valid) {
      this.msgs = [];
      this.dataService.saveRateDetails(this.saveFormDateToModel()).subscribe(
        (data) => {
          this.ratesFormData.markAsPristine();
          this.ratesFormData.markAsUntouched();
          if (!redirect) {
            window.scroll(0, 0);
          }
          else
            this.redirectToRates();
          this.spinnerService.hide();
          this.notificationService.pushMessages([{ severity: 'success', detail: 'Rate Details has been saved successfully' }]);
        }
        , (error) => {
          this.msgs = [];
          this.isErrorExists({ severity: "error", detail: "Error Updating Data" });
          this.logger.logError("error", error.error, "Rate Details Page ", )
          this.spinnerService.hide();
          window.scrollTo(0, 0);
        }
      );
    }
    else {
      if (!this.ratesFormData.valid)
        this.isErrorExists({ severity: "error", detail: "Please fill the mandatory fields" });
      window.scroll(0, 0);
      this.spinnerService.hide();
      return false;
    }
  }

  redirectToRates() {
    this.router.navigateByUrl("lc/rates");
  }

  /**
   * Gets the rates data of clicked row and stores it in the DB.
  */
  getRateDetailsByID(rateKey) {
    this.dataService.getRateDetailsByID(rateKey).subscribe((data) => {
      this.rateRecord = data as RateDetailsModel;
      this.spinnerService.hide();
      this.refreshFields();
    },
      (error) => {
        this.spinnerService.hide();
      })
  }
  /**
  * Binds the rows to the data table 
  */
  refreshFields() {
    let data = Array.isArray(this.rateRecord) ? this.rateRecord[0] : this.rateRecord;
    if (this.rateKey == "-1" || this.rateKey != "" || !this.rateKey) {

      let tempChannels = [];
      let tempDays = [];
      data.selectedChannels.forEach((v) => {
        if (v.selected) {
          tempChannels.push(v);
        }
      });
      data.selectedDaysOfTheWeek.forEach((v) => {
        if (v.selected) {
          tempDays.push(v);
        }
      });
      this.toolTipWeekDays = tempDays.map(i => i.dayName).join("\n,")
      this.toolTipChannels = tempChannels.map(i => i.name).join("\n,")
      tempChannels.forEach(function (v) { delete v.selected });
      tempDays.forEach(function (v) { delete v.selected });
      this.ratesFormData.controls['selectedChannels'].setValue(tempChannels);
      this.ratesFormData.controls['selectedWeekDays'].setValue(tempDays);
      data.selectedDaysOfTheWeek.forEach(function (v) { delete v.selected });
      data.selectedChannels.forEach(function (v) { delete v.selected });
      this.weekDays = data.selectedDaysOfTheWeek;
      this.selectedChannelPartners = data.selectedChannels;
    }
    if (this.rateKey != "-1") {
      let rateLabel = this.rateTypeData.find((i) => i.elementId == data.rateType) ? this.rateTypeData.find((i) => i.elementId == data.rateType).elementValue : "";
      this.disableOnRateChange(rateLabel);
      this.ratesFormData.controls['isActive'].setValue(data.isActive);
      this.ratesFormData.controls['addOn'].setValue(data.addOn);
      this.ratesFormData.controls['rateType'].setValue({ elementId: data.rateType });
      this.ratesFormData.controls['rateName'].setValue(data.rateName);
      this.ratesFormData.controls['price'].setValue(data.price);
      this.ratesFormData.controls['maxDailyPrice'].setValue(data.maxDailyPrice);
      this.ratesFormData.controls['increment'].setValue({ elementId: data.increment });
      this.ratesFormData.controls['entryStartTime'].setValue({ value: data.entryTime["lower"] });
      this.ratesFormData.controls['entryEndTime'].setValue({ value: data.entryTime["upper"] });
      this.ratesFormData.controls['exitStartTime'].setValue({ value: data.exitTime["lower"] });
      this.ratesFormData.controls['exitEndTime'].setValue({ value: data.exitTime["upper"] });
      this.ratesFormData.controls['combinable'].setValue(data.combinable);
      this.ratesFormData.controls['nonRefundable'].setValue(data.nonRefundable);
      this.ratesFormData.controls['multipleInAndOut'].setValue(data.multipleInAndOut);
      this.ratesFormData.controls['additionalDays'].setValue(data.additionalDays);
      this.ratesFormData.controls['startDate'].setValue(typeof (data.activeStartDate) != 'object' ? new Date(data.activeStartDate) : data.activeStartDate);
      this.ratesFormData.controls['endDate'].setValue(typeof (data.activeEndDate) != 'object' ? new Date(data.activeEndDate) : data.activeEndDate);
      if (data.maxStay) {
        this.ratesFormData.controls['maxStayHours'].setValue(data.maxStay.hours);
        this.ratesFormData.controls['maxStayMinutes'].setValue(data.maxStay.minutes);
      }
      if (data.minStay) {
        this.ratesFormData.controls['minStayHours'].setValue(data.minStay.hours);
        this.ratesFormData.controls['minStayMinutes'].setValue(data.minStay.minutes);
      }
    }
  }
  /**
   * Addes form controls dyanamically using a model class. 
   */
  addControlsToForm() {
    this.ratesFormData = new FormGroup({
      isActive: new FormControl(true),
      addOn: new FormControl(false),
      rateType: new FormControl(null, Validators.required),
      rateName: new FormControl(),
      price: new FormControl(),
      maxDailyPrice: new FormControl(),
      increment: new FormControl(null),
      multipleInAndOut: new FormControl(),
      entryStartTime: new FormControl(null, Validators.required),
      entryEndTime: new FormControl(null, Validators.required),
      exitStartTime: new FormControl(null),
      exitEndTime: new FormControl(null),
      combinable: new FormControl(false),
      nonRefundable: new FormControl(false),
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null),
      additionalDays: new FormControl(),
      minStayHours: new FormControl(),
      minStayMinutes: new FormControl(),
      maxStayHours: new FormControl(),
      maxStayMinutes: new FormControl(),
      selectedWeekDays: new FormControl(),
      selectedChannels: new FormControl()
    });
  }

  onWeekDaySelected(daysDropDown) {
    this.toolTipWeekDays = daysDropDown.value ? daysDropDown.value.map(i => i.dayName).join(",\n") : "";
  }
  onChannelSelected(channelDropDown) {
    this.toolTipChannels = channelDropDown.value ? channelDropDown.value.map(i => i.name).join(",\n") : "";
  }

  onSelectClick(dd) {
    this.disableOnRateChange(dd.selectedOption.value.elementValue);
  }
  /**
   * Enables all controls first whenever rate type is changed . 
   */
  enableAllControls() {
    Object.keys(this.ratesFormData.controls).forEach((control) => {
      let ctrl = this.ratesFormData.get(control);
      if (ctrl != null) {
        ctrl.enable();
      }
    })
  }
  /**
  * Disable/Enable certain controls whenever rate type is changed after controls are enabled . 
  */
  changeControlState(controls, rateType) {
    this.enableAllControls();
    controls.forEach((control) => {
      if (this.ratesFormData.contains(control)) {
        let ctrl = this.ratesFormData.controls[control];
        ctrl.enabled ? ctrl.disable() : ctrl.enable();
      }
    })
    rateType != "Incremental" ? this.ratesFormData.controls["increment"].setValue(null) :
      this.ratesFormData.controls["increment"].setValue(null);
  }
  /**
  * Gets the data from reference table using tablename params
  * @param tableName 
  */
  getDataFromReferenceTable(tableName) {
    this.dataService.getTableValuesByTableName(tableName).subscribe((data: any[]) => {
      tableName == ReferenceTable.Rate_Type ? this.rateTypeData = data : this.incrementData = data;
    },
      (error) => {
        console.log("type table issue.");
      }
    );
  }
  /**
  * Saves the to a model which is stored in database.
  * @param tableName 
  */
  saveFormDateToModel() {
    var objToSave = new RateDetailsModel();
    let formData: any = this.ratesFormData.getRawValue();
    let rateKey: number = this.rateKey ? parseInt(this.rateKey) : -1;
    objToSave.rateKey = rateKey;
    objToSave.addOn = formData["addOn"];
    objToSave.isActive = formData["isActive"];
    objToSave.entryTime["start"] = formData["entryStartTime"]
    objToSave.entryTime["end"] = formData["entryEndTime"]
    objToSave.exitTime["start"] = formData["exitStartTime"]
    objToSave.exitTime["end"] = formData["exitEndTime"];

    let price = formData['price'];
    price = price ? parseFloat(price) : 0.00;
    objToSave.price = price

    let maxDailyPrice = formData['maxDailyPrice'];
    maxDailyPrice = maxDailyPrice ? parseFloat(maxDailyPrice) : 0.00;
    objToSave.maxDailyPrice = maxDailyPrice;

    objToSave.maxHours = formData['maxHours'];
    objToSave.activeStartDate = formData["startDate"];
    objToSave.activeEndDate = formData['endDate'];

    objToSave.isActive = formData['isActive'];
    objToSave.nonRefundable = formData['nonRefundable'];
    objToSave.combinable = formData['combinable'];
    objToSave.multipleInAndOut = formData['combinable'];
    objToSave.additionalDays = formData["additionalDays"];

    var rateType = formData['rateType'];
    rateType = rateType ? rateType.elementId : null;
    objToSave.rateType = rateType;

    var increment = formData['increment'];
    increment = increment ? increment.elementId : null;
    objToSave.increment = increment;

    objToSave.rateName = formData['rateName'];
    var maxStay = {
      hours: formData['maxStayHours'],
      minutes: formData['maxStayMinutes']
    };
    objToSave.maxStay = maxStay;
    var minStay = {
      hours: formData['minStayHours'],
      minutes: formData['minStayMinutes']
    };
    objToSave.minStay = minStay;
    objToSave.maxStay = maxStay;
    var entryTime = {
      lower: formData['entryStartTime'] ? formData['entryStartTime'].value : formData['entryStartTime'],
      upper: formData['entryEndTime'] ? formData['entryEndTime'].value : formData['entryEndTime']
    };
    objToSave.entryTime = entryTime;
    var exitTime = {
      lower: formData['exitStartTime'] ? formData['exitStartTime'].value : formData['exitStartTime'],
      upper: formData['exitEndTime'] ? formData['exitEndTime'].value : formData['exitEndTime'],
    };
    this.selectedChannelPartners.forEach((channel) => {
      objToSave.selectedChannels.push({
        name: channel.name, channelPartnerKey: channel.channelPartnerKey
        , selected: this.isControlSelected(formData["selectedChannels"], channel, "selectedChannels")
      });
    });
    objToSave.exitTime = exitTime;

    this.weekDays.forEach((day) => {
      objToSave.selectedDaysOfTheWeek.push({
        name: day.dayName, dayId: day.dayId
        , selected: this.isControlSelected(formData["selectedWeekDays"], day, "selectedWeekDays")
      });
    });
    super.removeNulls(objToSave);

    return objToSave;
  }
  /**
  * Disable on rate change all the fields based on the rate type supplied. 
  */
  disableOnRateChange(label) {
    if (label != "") {
      if (label == "Incremental") {
        this.changeControlState(this.controls, label);
      }
      else {
        if (label == "Event")
          this.changeControlState(["selectedWeekDays"], label);
        else
          this.changeControlState(["increment", "maxDailyPrice"], label);
      }
      this.ratesFormData.controls["rateName"].setValue(label);
    }
  }

  createSelectedChannels() {
    this.selectedChannelPartners.forEach((eachChannel: RateChannelPartner) => {
      this.ratesFormData.addControl(eachChannel.name, new FormControl(eachChannel.selected));
    })
  }
  createWeekDays() {
    if (this.weekDays) {
      this.weekDays.forEach((eachDay) => {
        this.ratesFormData.addControl(eachDay.dayName, new FormControl(eachDay.selected));
      })
    }
  }
  isControlSelected(formData, control, type): boolean {
    let selected = false;
    if (formData != undefined) {
      formData.forEach((formChannel) => {
        if (type == "selectedChannels" && formChannel.name == control.name) {
          selected = true;
          return true;
        }
        if (type == "selectedWeekDays" && formChannel.dayName == control.dayName) {
          selected = true;
          return true;
        }
      });
    }
    return selected;
  }
  showErrorBoundary() {
    for (let inner in this.ratesFormData.controls) {
      if (this.ratesFormData.get(inner) == null) {
        console.log("control not found:" + inner);
        continue;
      }
      this.ratesFormData.get(inner).markAsTouched();
      this.ratesFormData.get(inner).markAsDirty();
      this.ratesFormData.get(inner).updateValueAndValidity();
    }
  }
  validateFormData() {
    this.showErrorBoundary();
    if (this.ratesFormData.valid) {
      this.msgs = [];
      let formData: any = this.ratesFormData.getRawValue();
      let rateType = formData["rateType"] ? formData["rateType"].elementValue : formData["rateType"];
      if (Date.parse(formData["startDate"]) > Date.parse(formData["endDate"])) {
        this.isErrorExists({ severity: 'error', detail: 'Start Date should be less than End date ' });
        return false;
      }
      if (rateType != "Incremental" && formData["entryStartTime"].value > formData["entryEndTime"].value) {
        this.isErrorExists({ severity: 'error', detail: 'Lower bound of entry time should be less than upper bound of entry time' });
        return false;
      }
      if (rateType != "Incremental" && formData["exitStartTime"].value > formData["exitEndTime"].value) {
        this.isErrorExists({ severity: 'error', detail: 'Lower bound of exit time should be less than upper bound of exit time' });
        return false;
      }
      if (rateType != "Incremental" && formData["exitStartTime"].value < formData["entryStartTime"].value) {
        this.isErrorExists({ severity: 'error', detail: 'Exit Time should  be greater than Entry Time ' });
        return false;
      }
      if (formData["selectedWeekDays"] && formData["selectedWeekDays"].length == 0 && rateType != "Event") {
        this.isErrorExists({ severity: 'error', detail: 'Atleast one day from Applicable days should be selected' });
        return false;
      }
      //Skip validation  if rate is Incremental and even if no channels selected .
      if (formData["selectedChannels"] && formData["selectedChannels"].length == 0) {
        this.isErrorExists({ severity: 'error', detail: 'Atleast one channel from selected should be selected' });
        return false;
      }
    }
    return true;
  }
  isErrorExists(msg: Message) {
    //push if error is not ethere in the msgs.
    if (this.msgs.findIndex(i => i.detail == msg.detail) == -1) {
      this.msgs.push({ severity: msg.severity, detail: msg.detail })
    }
  }
  form() {
    return this.ratesFormData;
  }
}
