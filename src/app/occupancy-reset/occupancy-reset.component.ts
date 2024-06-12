import { Component, OnInit } from '@angular/core';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { occupancy } from './occupancy-reset.model';
import { Router } from '@angular/router';
import { LCForm } from '../shared/LCForm';
import * as moment from 'moment';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'lc-occupancy-reset',
  templateUrl: './occupancy-reset.component.html',
  styleUrls: ['./occupancy-reset.component.scss']
})
export class OccupancyResetComponent extends LCForm {

  constructor(private dataService: ManageComponentDataService
    , private logger: ErrorLoggerService
    , private router: Router
    , private fb: FormBuilder
    , private spinnerService: Ng4LoadingSpinnerService, ) {
    super();
    this.occupancyFormdata = this.fb.group({})
  }

  minuteList: any[] = this.dataService.getStayMinutes();
  hourList: any[] = this.dataService.getstayHours().map((i, index) => { return { label: moment(i.value.toString(), "LT").format("hh:00 A"), value: index } }).slice(0, 24)
  occupancyFormdata: FormGroup;
  msgs: Message[] = [];
  totalCount: number;
  screenWidth: number = screen.width;
  occupancyGridData: occupancy[] = [];
  ngOnInit() {
    this.spinnerService.show();
    this.hourList = this.hourList.slice(0, 25);
    this.occupancyFormdata = new FormGroup({
      location: new FormControl(this.dataService.getCurrentLocation().primaryAddress.address1),
      countDate: new FormControl("", Validators.required),
      countHour: new FormControl("", Validators.required),
      countMinute: new FormControl("", Validators.required),
      countTransient: new FormControl(0, ),
      countContract: new FormControl(0, ),
      countTotal: new FormControl(0, ),
    });
    this.refreshOccupancyGrid();
  }
  refreshOccupancyGrid() {
    this.dataService.getOccupancyData().subscribe((data: occupancy[]) => {
      let isEmptyRecord = false;
      if (data != null && data) {
        data.forEach((record) => {
          if (!(record.countContract==null &&  record.countDate==null && record.countHour ==null && record.countHourFormated==null 
            && record.countMinute==null && record.countTransient==null && record.countTotal==null)) {
            record.countHourFormated = record.countHour != null ? moment(record.countHour, "LT").format("hh:00 A") : null;
            record.countDate = moment(record.countDate).format('MM/DD/YY');
          }
        })
        this.occupancyGridData = data;
      }
      this.spinnerService.hide();

    }, err => {
      this.spinnerService.hide();
    });
  }
  saveOccupancy() {
    if (this.occupancyFormdata.valid) {
      var objToSave: occupancy = this.generateObjToSave();
      this.dataService.saveOccupancy(objToSave).subscribe((data) => {
        this.msgs = [];
        this.occupancyFormdata.markAsPristine();
        this.occupancyFormdata.markAsUntouched();
        this.refreshOccupancyGrid();
        window.scrollTo(0, 0);
        this.msgs.push({ severity: "success", detail: "Occupancy Data has been saved successfully." })
      },
        (err) => {
          window.scrollTo(0, 0);
          this.msgs = [];
          this.msgs.push({ severity: "error", detail: "Insert of occupancy Data has failed." })
          this.logger.logError("error", err.error, "Occupancy Reset Page")
        });
    }
    else {
      this.msgs.push({ severity: "error", detail: "Please fill the mandatory fields" })
    }
  }
  generateObjToSave() {
    var formData = this.occupancyFormdata;
    var objToSave = new occupancy();
    objToSave.countDate = formData.controls["countDate"].value != "" ? formData.controls["countDate"].value.toLocaleDateString() : "";
    objToSave.countHour = parseInt(formData.controls["countHour"].value.value);
    objToSave.countMinute = parseInt(formData.controls["countMinute"].value.value);
    objToSave.countTransient = parseInt(formData.controls["countTransient"].value);
    objToSave.countContract = parseInt(formData.controls["countContract"].value);
    super.removeNulls(objToSave);
    return objToSave;
  }
  calculateTotalCount($event) {
    var formData = this.occupancyFormdata;
    // this.totalCount = parseInt(formData.controls["transient"].value)+parseInt(formData.controls["contract"].value);
  }
  onCancel() {
    this.router.navigateByUrl('lc/locationDetails');
  }
  form() {
    return this.occupancyFormdata;
  }
}
