import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Message } from 'primeng/components/common/message';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { contactDetails } from './contact-details.model';
import { Address } from '../shared/model/contactModel/Address.model';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { availableHours } from '../shared/model/contactModel/availableHours.model';
import ReferenceTable from '../shared/enum/refTable.enum';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LCForm } from '../shared/LCForm';
import { NotificationService } from '../shared/notification-service.service';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';

@Component({
  selector: 'lc-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})
export class ContactDetailsComponent extends LCForm {

  contactDetailsFormdata: any;
  msgs: Message[] = [];
  contactDetailsDbData: any;
  filteredCompanyArray: any[];
  openTime: any;
  closeTime: any;
  contacttypeList: any;
  statesList: any;
  contactId: any;
  company: any;
  canadaStates: any[];
  isCanadaState: boolean;
  screenWidth: number = screen.width;
  hoursOfOperation: availableHours[] = [];
  doNotcontact: boolean = false;
  days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  constructor(private router: Router, private dataService: ManageComponentDataService, private route: ActivatedRoute, private confirmationService: ConfirmationService
    , private spinnerService: Ng4LoadingSpinnerService
    , private notificationService: NotificationService
    , private logger: ErrorLoggerService) {
    super();
    this.openTime = [];
    this.closeTime = [];
    this.openTime = this.dataService.createTimeField();;
    this.closeTime = this.dataService.createTimeField();
    this.statesList = this.dataService.getStatesList();
    this.canadaStates = this.dataService.getCanadaStatesList();

    this.dataService.getTableValuesByTableName(ReferenceTable.Contact_Type).subscribe((data) => {
      this.contacttypeList = data;
    });
  }

  filterCompanySingle(event) {
    let query = event.query;
    this.filteredCompanyArray = this.getFilteredCompanyName(query);
  }
  ngOnInit() {
    this.dataService.getTableValuesByTableName(ReferenceTable.Company).subscribe((data) => {
      this.company = data;
    });
    this.populateHoursOfOps();
    this.spinnerService.show();
    this.contactId = this.route.snapshot.paramMap.get('contactId');
    this.contactDetailsFormdata = new FormGroup({
      isActive: new FormControl(true),
      firstName: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      title: new FormControl(),
      email: new FormControl("", Validators.required),
      primaryPhone: new FormControl("", Validators.required),
      contactType: new FormControl("", Validators.required),
      priority: new FormControl("", Validators.required),
      company: new FormControl(),
      cellPhone: new FormControl(),
      website: new FormControl(),
      donotcontact: new FormControl(),
      address1: new FormControl(),
      address2: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      zip: new FormControl(),
    });
    if (!this.contactId)
      this.spinnerService.hide();

    if (this.contactId != undefined && this.contactId != "") {
      this.dataService.getContactDetailsByContactKey(this.contactId).subscribe(
        (data: contactDetails) => {
          if (data.contactId != undefined && data.contactId != null) {
            this.contactDetailsDbData = data;
            this.contactDetailsFormdata.controls['isActive'].setValue(data.isActive);
            this.contactDetailsFormdata.controls['firstName'].setValue(data.firstName);
            this.contactDetailsFormdata.controls['lastName'].setValue(data.lastName);
            this.contactDetailsFormdata.controls['title'].setValue(data.title);
            this.contactDetailsFormdata.controls['email'].setValue(data.email);
            this.contactDetailsFormdata.controls['primaryPhone'].setValue(data.primaryPhone);
            this.contactDetailsFormdata.controls['contactType'].setValue({ elementId: data.contactType });
            this.contactDetailsFormdata.controls['priority'].setValue(data.priority);
            this.contactDetailsFormdata.controls['company'].setValue({ elementId: data.company, elementValue: data.companyValue });
            this.contactDetailsFormdata.controls['cellPhone'].setValue(data.cellPhone);
            this.contactDetailsFormdata.controls['website'].setValue(data.website);
            this.doNotcontact = data.doNotContact;
            this.hoursOfOperation= data.availableHours.length!=0 ? data.availableHours : this.hoursOfOperation ;
          if (this.hoursOfOperation.length != this.days.length) {
            let notPresentDay: any[] = []
            notPresentDay = this.days.filter((item) => { return this.hoursOfOperation.map(i => i.name).indexOf(item) > -1 });
            notPresentDay.forEach((day) => {
              this.hoursOfOperation.push({name:day, endTime:null,isAvailable :false,dayId: null , startTime: null});
            });
          }
          }
          this.spinnerService.hide();
        }
        , (error) => {
          this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
          this.spinnerService.hide();
        }

      );
    }
  }
  onCancel() {
    this.router.navigateByUrl('/lc/contacts');
  }
  populateHoursOfOps(){
    if (this.hoursOfOperation.length == 0) {
      this.days.forEach((day) => {
        this.hoursOfOperation.push({ dayId: null, name: day, isAvailable: false, startTime: null, endTime: null });
      });
    }
  }
  checkstate() {
    this.msgs = [];
    var a = this.contactDetailsFormdata.controls['isActive'].value;
    if (a == false) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
        },
        reject: () => {
          this.contactDetailsFormdata.controls['isActive'].setValue(true);
        }
      });
    }
  }


  onSubmit() {

    this.spinnerService.show();
    var objSaveDetails = this.contactDetailsDbData;
    var objSaveDetails = this.contactDetailsDbData ? this.contactDetailsDbData : {};


    this.msgs = [];
    for (let inner in this.contactDetailsFormdata.controls) {
      this.contactDetailsFormdata.get(inner).markAsTouched();
      this.contactDetailsFormdata.get(inner).markAsDirty();
      this.contactDetailsFormdata.get(inner).updateValueAndValidity();
    }
    if (this.contactDetailsFormdata.status == "INVALID") {
      this.msgs.push({ severity: 'error', detail: 'Form has errors' });
      window.scroll(0, 0);
      this.spinnerService.hide();
    }


    else {
      if (!this.doNotcontact) {
        if (this.hoursOfOperation.findIndex(i => i.endTime != null && i.startTime != null && i.isAvailable==true ) === -1) {
          this.msgs.push({ severity: 'error', detail: 'Available Hours is Mandatory. Please select atleast one day for Available Hours' });
          this.spinnerService.hide();
        }
      }
      objSaveDetails.isActive = this.contactDetailsFormdata.controls['isActive'].value;
      objSaveDetails.firstName = this.contactDetailsFormdata.controls['firstName'].value;
      objSaveDetails.lastName = this.contactDetailsFormdata.controls['lastName'].value;
      objSaveDetails.title = this.contactDetailsFormdata.controls['title'].value;
      objSaveDetails.email = this.contactDetailsFormdata.controls['email'].value;
      objSaveDetails.primaryPhone = this.contactDetailsFormdata.controls['primaryPhone'].value;
      var contactType = this.contactDetailsFormdata.controls['contactType'].value;
      contactType = contactType && typeof contactType != 'string' ? contactType.elementId : "";
      objSaveDetails.contactType = contactType;
      let priority = parseInt(this.contactDetailsFormdata.controls['priority'].value);
      objSaveDetails.priority = priority;
      var company = this.contactDetailsFormdata.controls['company'].value;
      company = company && typeof company != 'string' ? company.elementId : company;
      objSaveDetails.company = company;
      if (company == null) {
        delete objSaveDetails['company'];
      }
      objSaveDetails.doNotContact = this.doNotcontact;
      objSaveDetails.cellPhone = this.contactDetailsFormdata.controls['cellPhone'].value;
      objSaveDetails.website = this.contactDetailsFormdata.controls['website'].value;

      if (objSaveDetails.address == undefined || objSaveDetails.address == null) {
        objSaveDetails.address = {};
      }
      objSaveDetails.address.address1 = this.contactDetailsFormdata.controls['address1'].value;
      objSaveDetails.address.address2 = this.contactDetailsFormdata.controls['address2'].value;
      objSaveDetails.address.city = this.contactDetailsFormdata.controls['city'].value;
      let state = this.contactDetailsFormdata.controls['state'].value;
      if (!this.findCanadaState(this.contactDetailsFormdata.value.state)) {
        this.isCanadaState = false;
      }
      else {
        this.isCanadaState = true;
      }
      // let zip = this.contactDetailsFormdata.controls['zip'].value;
      // zip = zip ? parseInt(zip) : null;
      // objSaveDetails.address.zip = zip;
      objSaveDetails.address.state = state;
      objSaveDetails.address.zip = this.contactDetailsFormdata.controls['zip'].value;

      objSaveDetails.availableHours = this.hoursOfOperation;

      //TODO: Enable availableHours and address after DB issues.
      //delete objSaveDetails["availableHours"];
      if (this.contactDetailsFormdata.value.primaryPhone.includes('_')) {
        this.msgs.push({ severity: 'error', detail: 'Please enter valid Primary Phone' });
        this.spinnerService.hide();
        return;
      }
      if (this.contactDetailsFormdata.value.donotcontact == false) {

      }
      super.removeNulls(objSaveDetails);
      this.dataService.saveContactDetailsForLocation(objSaveDetails, this.contactId).subscribe(
        (data: contactDetails) => {
          this.contactId = data.contactId.toString();
          window.scroll(0, 0);
          this.spinnerService.hide();
          this.msgs = [];
          this.msgs.push({ severity: 'success', detail: 'Contact Details has been saved successfully' });
        }
        , (error) => {
          this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' });
          this.logger.logError("error", error.error, "Contact Details Page");
          this.spinnerService.hide();
          window.scroll(0, 0);
        }
      );
    }

  }
  stateChanged(event) {
    this.isCanadaState = this.findCanadaState(this.contactDetailsFormdata.value.state);

  }

  findCanadaState(state) {
    for (var i = 0; i < this.canadaStates.length; i++) {
      if (this.canadaStates[i].value == state) {
        return true;
      }
    }
    return false;
  }

  getFilteredCompanyName(query) {
    let filteredCompanyArray: any[] = [];
    if (this.company && this.company.length > 0)
      for (var i = 0; i < this.company.length; i++) {
        let element = this.company[i];

        if (element.elementValue.includes(query)) {
          filteredCompanyArray.push(element);
        }
      }
    return filteredCompanyArray;
  }
  form() {
    return this.contactDetailsFormdata;
  }
}
export class Company {
  values: String;
}



