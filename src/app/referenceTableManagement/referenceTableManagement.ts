import { Component, OnInit, ViewEncapsulation, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReferenceTableValue } from './referenceTableManagement.model';
import { Message } from 'primeng/components/common/message';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { ReferenceTable } from './referenceTableDropDown.model';
import { NewValue } from './addNewValue.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormCanDeactivate } from '../shared/can-deactivate/form-can-deactivate.component';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';

@Component({
  selector: 'referenceTableManagement',
  templateUrl: './referenceTableManagement.html',
  styleUrls: ['./referenceTableManagement.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ReferenceTableManagement extends FormCanDeactivate {
  referenceTableFormdata: any;
  referenceTableValues: any;
  msgs: Message[] = [];
  displayAddValues: boolean = false;
  guide: boolean = true;
  refTableList: any;
  selectedTableName: any;
  refreshTable: boolean;
  flag: boolean = false;
  screenWidth:number =screen.width;;
  constructor(private router: Router, private dataService: ManageComponentDataService
    , private applicationRef: ApplicationRef, private spinnerService: Ng4LoadingSpinnerService
    , private logger: ErrorLoggerService) {
    super();
    this.referenceTableValues = [];
  }
  ngOnInit() {
    this.spinnerService.show();
    this.referenceTableFormdata = new FormGroup({
      tableName: new FormControl(),
      newValue: new FormControl("", Validators.required)

    });

    this.dataService.getRefTableDropDownData().subscribe((data: ReferenceTable) => {
      this.refTableList = data;
      this.spinnerService.hide();
    }
      , (error) => {
        // this.msgs.push({ severity: 'error', detail: 'Unable to fetch data.' });
        // this.spinnerService.hide();
        if (error.status != 404) {
          this.msgs.push({ severity: 'error', detail: "Error retreiving table list. Please try again !" });
        }
        else {
          this.msgs.push({ severity: 'warning', detail: error.error.message });
        }
        this.spinnerService.hide();
        window.scrollTo(0, 0);
      });
  }
  onCancel() {
    this.router.navigateByUrl('/lc/locationSearch');
  }
  addNewValue() {
    this.flag = true;
    this.refreshTable = false;
    var selectedTableName = this.referenceTableFormdata.controls['tableName'].value.tableName;
    var newTableValueToSave = new ReferenceTableValue();
    newTableValueToSave.elementValue = " ";

    this.referenceTableValues = this.referenceTableValues.concat(newTableValueToSave);
    this.refreshTable = true;
  }
  showTableValue() {
    this.guide = false;
    if (this.referenceTableFormdata.controls['tableName'].value.tableName == 'select') {
      this.guide = true;
    } else {
      this.selectedTableName = this.referenceTableFormdata.controls['tableName'].value.tableName;
      this.getValuesByRefTableName(this.selectedTableName);
    }
  }

  getValuesByRefTableName(selectedTableName: string) {
    this.spinnerService.show();
    this.refreshTable = false;
    this.dataService.getTableValuesByTableName(selectedTableName).subscribe(
      (data: ReferenceTableValue[]) => {
        this.referenceTableValues = data;
        this.refreshTable = true;
        this.spinnerService.hide();
      }
      , (error) => {
        this.msgs = [];
        if (error.status != 404) {
          this.msgs.push({ severity: 'error', detail: "Error retreiving table values. Please try again !" });
        }
        else {
          this.msgs.push({ severity: 'warning', detail: error.error.message });
          this.referenceTableValues = [];
        }
        this.spinnerService.hide();
        window.scrollTo(0, 0);
      }
    );
  }


  saveReferenceTableData() {
    var newTableToSave: ReferenceTable = new ReferenceTable();
    newTableToSave.tableName = this.selectedTableName;
    newTableToSave.elements = [];
    this.referenceTableValues.forEach((element) => {
      if ((element.elementId == undefined || element.elementId == null)
        && element.elementValue != null
        && element.elementValue != undefined && element.elementValue.trim() != "") {

        if (element.elementValue && typeof element.elementValue == 'string') {
          element.elementValue = element.elementValue.trim();
        }
        newTableToSave.elements.push(element);

      }
    });
    this.dataService.saveNewDataInReferenceTable(this.selectedTableName, newTableToSave).subscribe(
      (data) => {
        this.msgs=[];
        this.getValuesByRefTableName(this.selectedTableName);
        this.msgs.push({ severity: 'success', detail: 'Record Saved Successfully' });
        window.scrollTo(0, 0);
      }
      , (error) => {
        this.msgs=[];
        this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' });
        this.logger.logError("error",error.error,"Reference Table Page");
        window.scrollTo(0, 0);
      }
    );
  }

  cancel1() {
    this.displayAddValues = false;
  }

  form() {
    return this.referenceTableFormdata;
  }
}