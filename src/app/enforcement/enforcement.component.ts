import { Component, OnInit, ViewEncapsulation, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { Enforcement } from './enforcement.component.model';

import { SelectedAttributes } from './selectedAttributes.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormCanDeactivate } from '../shared/can-deactivate/form-can-deactivate.component';
import { NotificationService } from '../shared/notification-service.service';
import { LCForm } from '../shared/LCForm';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';

@Component({
  selector: 'lc-enforcement',
  templateUrl: './enforcement.component.html',
  styleUrls: ['./enforcement.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EnforcementComponent extends LCForm implements OnInit {
  parkingfeerates: any;
  adminfeerates: any;
  violationfeerates: any;
  msgs: Message[] = [];

  enforcementFormdata: FormGroup;
  enforcementDBData: Enforcement;
  discountAmount: any;
  discountRedumptionPeriod: any;

  daysBeforeSentTxt: any="myfield1";

  parkingFeeRatesData: any[];
  adminFeeRatesData: any[];
  violationFeeRatesData: any[];
  screenWidth: number = screen.width;


  constructor(private router: Router
    , private dataService: ManageComponentDataService
    , private spinnerService: Ng4LoadingSpinnerService
    , private notificationService: NotificationService
    , private logger:ErrorLoggerService) {
    super();
    this.parkingFeeRatesData = [];
    this.adminFeeRatesData = [];
    this.violationFeeRatesData = [];
  }

  ngOnInit() {
    this.spinnerService.show();
    this.enforcementFormdata = new FormGroup({
      violations: new FormControl(),
      transient: new FormControl(),
      digital: new FormControl(),
      parkMobile: new FormControl(),
      monthlyParker: new FormControl(),
      discountAmount: new FormControl(),
      discountRedemptionPeriod: new FormControl(),
      daysBeforeCollections: new FormControl(),
      ticketTitle: new FormControl(),
      ticketHeader: new FormControl(),
      ticketFooter: new FormControl(),
    });
    this.dataService.getEnforcementForLocation().subscribe(
      (data: Enforcement) => {
        this.enforcementDBData = data;
        this.enforcementFormdata.controls['discountAmount'].setValue(data.discountAmount);
        this.enforcementFormdata.controls['discountRedemptionPeriod'].setValue(data.discountRedemptionPeriod);
        this.enforcementFormdata.controls['daysBeforeCollections'].setValue(data.daysBeforeCollections);
        this.enforcementFormdata.controls['ticketTitle'].setValue(data.ticketTitle);
        this.enforcementFormdata.controls['ticketHeader'].setValue(data.ticketHeader);
        this.enforcementFormdata.controls['ticketFooter'].setValue(data.ticketFooter);

        this.enforcementFormdata.controls['violations'].setValue(data.violations);
        this.enforcementFormdata.controls['transient'].setValue(data.transient);
        this.enforcementFormdata.controls['digital'].setValue(data.digital);
        this.enforcementFormdata.controls['parkMobile'].setValue(data.parkMobile);
        this.enforcementFormdata.controls['monthlyParker'].setValue(data.monthlyParker);

        this.parkingFeeRatesData = data.parkingFees;
        this.parkingFeeRatesData = this.parkingFeeRatesData.map((i) =>{ return {
        feeDetailKey : i.feeDetailKey
        ,feeType :i.feeType
        ,publish :i.publish
        ,rate :parseFloat(i.rate).toFixed(2)
        ,rateDescription :i.rateDescription } 
         });
        this.adminFeeRatesData = data.adminFees;
        this.violationFeeRatesData = data.violationFees;

        this.spinnerService.hide();
      }
      , (error) => {
        this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
        this.spinnerService.hide();
        window.scroll(0, 0);
      }
    );

  }
  onParkingClick() {
    this.router.navigateByUrl('lc/fee-details/PARKING_FEE/' + -1);
  }

  onAdminClick() {
    this.router.navigateByUrl('lc/fee-details/ADMIN_FEE/' + -1);
  }

  onViolationClick() {
    this.router.navigateByUrl('lc/fee-details/VIOLATION_FEE/' + -1);
  }

  onCancel() {
    this.router.navigateByUrl('/lc/locationDetails');
  }

  parkingFeeDetails(event) {
    this.router.navigateByUrl('lc/fee-details/PARKING_FEE/' + event.data.feeDetailKey);
  }
  adminFeeDetails(event) {
    this.router.navigateByUrl('lc/fee-details/ADMIN_FEE/' + event.data.feeDetailKey);
  }
  violationFeeDetails(event) {
    this.router.navigateByUrl('lc/fee-details/VIOLATION_FEE/' + event.data.feeDetailKey);
  }

  submitEnforcement() {
    this.notificationService.clearMessages();
    this.msgs = [];
    this.spinnerService.show();
    try {
      var discountRedemptionPeriod = this.enforcementFormdata.value.discountRedemptionPeriod;
      //discountRedemptionPeriod  = discountRedemptionPeriod && discountRedemptionPeriod !=null ? discountRedemptionPeriod : 0;
      var daysBeforeCollections = this.enforcementFormdata.value.daysBeforeCollections;
      //daysBeforeCollections = daysBeforeCollections && daysBeforeCollections != null? daysBeforeCollections :0;


      if (discountRedemptionPeriod != null && daysBeforeCollections != null) {

        if (discountRedemptionPeriod > daysBeforeCollections) {

          this.msgs.push({ severity: 'error', detail: 'Discount Redemption Period should be less than or equal to Days Before Sent To Collection' });
          window.scroll(0, 0);
          this.spinnerService.hide();
          return;
        }
      }

      var objTosave = this.enforcementDBData ? this.enforcementDBData : new Enforcement();

      objTosave.violations = this.enforcementFormdata.controls['violations'].value;
      objTosave.transient = this.enforcementFormdata.controls['transient'].value;
      objTosave.digital = this.enforcementFormdata.controls['digital'].value;
      objTosave.parkMobile = this.enforcementFormdata.controls['parkMobile'].value;
      objTosave.monthlyParker = this.enforcementFormdata.controls['monthlyParker'].value;

      var discountAmount = this.enforcementFormdata.controls['discountAmount'].value;
      discountAmount = discountAmount && (typeof discountAmount == 'string' && discountAmount.trim() != '') ? parseFloat(discountAmount.trim()) : 0;
      objTosave.discountAmount = discountAmount;
      var discountRedemptionPeriod = this.enforcementFormdata.controls['discountRedemptionPeriod'].value;
      discountRedemptionPeriod = discountRedemptionPeriod && (typeof discountRedemptionPeriod == 'string' && discountRedemptionPeriod.trim() != '') ? parseInt(discountRedemptionPeriod.trim()) : discountRedemptionPeriod;
      objTosave.discountRedemptionPeriod = discountRedemptionPeriod;
      objTosave.ticketTitle = this.enforcementFormdata.controls['ticketTitle'].value;
      objTosave.ticketHeader = this.enforcementFormdata.controls['ticketHeader'].value;
      objTosave.ticketFooter = this.enforcementFormdata.controls['ticketFooter'].value;
      // objTosave.daysBeforeCollections= this.enforcementFormdata.controls['daysBeforeCollections'].value;
      super.removeNulls(objTosave);

      Object.keys(objTosave).forEach(prop => {
        let value = objTosave[prop];
        if (value == "" || !value || value == null || (typeof value == 'string' && value == 'NaN')) {
          delete objTosave[prop];
        }
      });

      delete objTosave['violationFees'];
      delete objTosave['adminFees'];
      delete objTosave['parkingFees'];

      this.dataService.saveEnforcementForLocation(objTosave).subscribe(
        (data) => {
          this.spinnerService.hide();
          window.scroll(0, 0);
          this.msgs.push({ severity: 'success', detail: 'Enforcement Data has been saved successfully' });
        }
        , (error) => {
          this.logger.logError("error", error.error, "Fee Details Page");

          this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' });

          this.spinnerService.hide();
          window.scroll(0, 0);
        }
      );
    } catch (ex) {
      this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' }); this.spinnerService.hide();
      window.scroll(0, 0);
    }
  }
  form() {
    return this.enforcementFormdata;
  }
}