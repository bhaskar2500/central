import { Component, OnInit, ViewEncapsulation, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ManageComponentDataService } from '../../shared/manage-component-data.service';
import { FeeDetail } from './fee-details.model';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { NotificationService } from '../../shared/notification-service.service';
import { LCForm } from '../../shared/LCForm';
import { ErrorLoggerService } from '../../shared/logger/error-logger.service';

@Component({
  selector: 'lc-fee-details',
  templateUrl: './fee-details.component.html',
  styleUrls: ['./fee-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeeDetailsComponent extends LCForm implements OnInit {
  feeFormdata: any;
  msgs: Message[] = [];
  feeKey: any;
  feeInfo: any;
  feeDetailsDbData: any;
  rateKey: any;
  rateDetailsLegend: String;
  screenWidth: number = screen.width;

  constructor(private router: Router
    , private messageService: MessageService
    , private dataService: ManageComponentDataService
    , private route: ActivatedRoute
    , private confirmationService: ConfirmationService
    , private cdRef: ChangeDetectorRef
    , private spinnerService: Ng4LoadingSpinnerService, private notificationService: NotificationService
    , private logger: ErrorLoggerService ) {
    super();
  }

  form() {
    return this.feeFormdata;
  }

  ngOnInit() {
    this.notificationService.clearMessages();
    this.spinnerService.show();
    this.feeKey = this.route.snapshot.params["feeKey"];
    this.rateKey = this.route.snapshot.params["typeId"];
    if (this.rateKey == 'PARKING_FEE') {
      this.rateDetailsLegend = "Parking Fee Rates";
    }
    else if (this.rateKey == 'ADMIN_FEE') {
      this.rateDetailsLegend = "Admin Fee Rates";
    }
    else {
      this.rateDetailsLegend = "Violation Fee Rates";
    }
    this.feeFormdata = new FormGroup({
      active: new FormControl(true),
      rateDescription: new FormControl(),
      rate: new FormControl(),
      publish: new FormControl(false),

    });

    if (this.feeKey && this.feeKey.trim() != '' && this.feeKey != '-1') {
      let ob = this.dataService.getFeeDetailsForLocation(this.feeKey);
      ob.subscribe(
        (data: FeeDetail) => {
          this.feeDetailsDbData = data;
          this.feeFormdata.controls['active'].setValue(data.isActive);
          this.feeFormdata.controls['rateDescription'].setValue(data.rateDescription);
          this.feeFormdata.controls['rate'].setValue(data.rate);
          this.feeFormdata.controls['publish'].setValue(data.publish);
          this.spinnerService.hide();
        }
        , (error) => { this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' }); this.spinnerService.hide(); }
      );
    } else {
      this.spinnerService.hide();
    }
  }
  onCancel() {
    this.router.navigateByUrl("lc/enforcement");
  }
  public ngDoCheck() {
    this.cdRef.detectChanges();
  }
  checkstate() {
    this.msgs = [];
    var a = this.feeFormdata.controls['active'].value;
    if (a == false) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
        },
        reject: () => {
          this.feeFormdata.controls['active'].setValue(true);
        }
      });
    }
  }

  saveFeeDetails() {
    this.spinnerService.show();
    var objTosave = this.feeDetailsDbData ? this.feeDetailsDbData : {};
    this.msgs = [];

    for (let inner in this.feeFormdata.controls) {
      this.feeFormdata.get(inner).markAsTouched();
      this.feeFormdata.get(inner).markAsDirty();
      this.feeFormdata.get(inner).updateValueAndValidity();
    }
    if (this.feeFormdata.status == "INVALID") {

      this.msgs.push({ severity: 'error', detail: 'Form has errors' });
      this.spinnerService.hide();

    }
    else {
      objTosave.feeType = this.rateKey;
      objTosave.isActive = this.feeFormdata.controls['active'].value;
      objTosave.rateDescription = this.feeFormdata.controls['rateDescription'].value;
      objTosave.rate = parseFloat(this.feeFormdata.controls['rate'].value);

      objTosave.publish = this.feeFormdata.controls['publish'].value;
      super.removeNulls(objTosave);
      this.dataService.saveFeeDetailsForLocation(objTosave).subscribe(
        (data) => {
          this.router.navigateByUrl("/lc/enforcement");
          this.spinnerService.hide();
          this.notificationService.pushMessages([{ severity: "success", detail: 'Fee Details Data has been saved successfully' }])
        }
        , (error) => {
          this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' });
          this.logger.logError("error", error.error, "Fee Details Page");
          this.spinnerService.hide();
        }
      );

    }
  }

}
