import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserApiInfoMockService } from '../../shared/auth/user-api-info-mock.service';
import { ManageComponentDataService } from '../../shared/manage-component-data.service';
import { ChannelPartnerSubsidiary } from './subsidiaryDetails.model';
import { Message } from 'primeng/components/common/message';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormCanDeactivate } from '../../shared/can-deactivate/form-can-deactivate.component'
import { NotificationService } from '../../shared/notification-service.service';
import { ErrorLoggerService } from '../../shared/logger/error-logger.service';

@Component({
  selector: 'subsidiaryDetails',
  templateUrl: './subsidiaryDetails.html',
  styleUrls: ['./subsidiaryDetails.scss'],
  encapsulation: ViewEncapsulation.None

})
export class SubsidiaryDetails extends FormCanDeactivate {
  subsidiaryFormdata: any;
  msgs: Message[] = [];
  susidiaryDbData: any;
  channelPartnerKey: string;
  sudsidaryFlag = 0;
  screenWidth:number =screen.width;
  constructor(private router: Router, private dataService: ManageComponentDataService, private route: ActivatedRoute, private confirmationService: ConfirmationService
  , private spinnerService: Ng4LoadingSpinnerService, private cdRef: ChangeDetectorRef
  ,private notificationService : NotificationService
  ,private logger: ErrorLoggerService) {
    super();
  }
  public ngDoCheck() {
    this.cdRef.detectChanges();
  }
  ngOnInit() {
    this.spinnerService.show();
    let channelPartnerSubsidiaryKey = this.route.snapshot.paramMap.get('channelPartnerSubsidiaryKey');
    this.channelPartnerKey = this.route.snapshot.paramMap.get('channelPartnerKey');
    if (!ChannelPartnerSubsidiary)
      this.spinnerService.hide();
    this.subsidiaryFormdata = new FormGroup({
      isActive: new FormControl(true, Validators.required),
      name: new FormControl(),
      code: new FormControl(),
      description: new FormControl(),
      discountAmount: new FormControl(),
      discountPercentage: new FormControl(),
    });
    if (!channelPartnerSubsidiaryKey)
      this.spinnerService.hide();
    if (channelPartnerSubsidiaryKey != undefined && channelPartnerSubsidiaryKey != "") {
      this.dataService.getSubsidiaryInformation(this.channelPartnerKey, channelPartnerSubsidiaryKey).subscribe(
        (data: ChannelPartnerSubsidiary) => {
          this.susidiaryDbData = data;
          this.subsidiaryFormdata.controls['isActive'].setValue(data.isActive);
          this.subsidiaryFormdata.controls['name'].setValue(data.name);
          this.subsidiaryFormdata.controls['code'].setValue(data.code);
          this.subsidiaryFormdata.controls['description'].setValue(data.description);
          this.subsidiaryFormdata.controls['discountAmount'].setValue(data.discountAmount);
          this.subsidiaryFormdata.controls['discountPercentage'].setValue(data.discountPercentage);
          this.spinnerService.hide();
        },
        (error) => {
          // this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
          // this.spinnerService.hide();
          if (error.status != 404)
          this.msgs.push({ severity: 'error', detail: "Error retreiving data .Please try again !!" });
        else
          this.msgs.push({ severity: 'warning', detail: error.error.message });
        this.spinnerService.hide();
          window.scrollTo(0,0);
        }

      );
    }
  }
  cancel() {
    this.router.navigateByUrl('/lc/channelManagement/channelPartnerDetails/' + this.channelPartnerKey);
  }
  submitSubsidiary(event) {
    this.spinnerService.show();
    var objTosave = this.susidiaryDbData ? this.susidiaryDbData : {};
    if (this.susidiaryDbData == undefined) {
      objTosave.channelPartnerKey = this.channelPartnerKey;
    }
    objTosave.isActive = this.subsidiaryFormdata.controls['isActive'].value;
    objTosave.name = this.subsidiaryFormdata.controls['name'].value;
    objTosave.code = this.subsidiaryFormdata.controls['code'].value;
    objTosave.description = this.subsidiaryFormdata.controls['description'].value;
    let discountAmount=parseFloat(this.subsidiaryFormdata.controls['discountAmount'].value);
    objTosave.discountAmount = discountAmount;
    let discountPercentage=parseInt(this.subsidiaryFormdata.controls['discountPercentage'].value);
    objTosave.discountPercentage = discountPercentage;

    Object.keys(objTosave).forEach(prop=>{
      let value = objTosave[prop];
      if (value== "" || !value ||value==null || value =='NaN') {
        delete objTosave[prop];
      }
    });


    if(this.subsidiaryFormdata.controls['discountPercentage'].value>100){
      //this.msgs.push({ severity: 'warn', detail: 'Please enter value less than or equal to 100' });
      this.sudsidaryFlag = 1;   
      this.spinnerService.hide();
    }else{
    this.dataService.saveSubsidiaryInformation(this.channelPartnerKey,objTosave).subscribe(
      (data) => {
        this.subsidiaryFormdata.markAsPristine();
        this.subsidiaryFormdata.markAsUntouched();
        this.router.navigateByUrl("/lc/channelManagement/channelPartnerDetails/" + this.channelPartnerKey);
        this.spinnerService.hide();
        this.notificationService.pushMessages([{severity:'success',detail:'Subsidiary Data has been saved successfully'}]);
      }
      , (error) => { this.msgs=[];this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' }); 
      window.scrollTo(0,0);
      this.spinnerService.hide();
      this.logger.logError("error",error.error,"Subsidiary Details Page");
    }
    );
  }

  }
  checkstate() {
    this.msgs = [];
    var a = this.subsidiaryFormdata.controls['isActive'].value;
    if (a == false) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
        },
        reject: () => {
          this.subsidiaryFormdata.controls['isActive'].setValue(true);
        }
      });
    }
  }
  form() {
    return this.subsidiaryFormdata;
  }
}