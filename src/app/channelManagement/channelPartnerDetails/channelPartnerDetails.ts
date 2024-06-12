import { Component, OnInit, ViewEncapsulation, ApplicationRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ManageComponentDataService } from '../../shared/manage-component-data.service';
import { ChannelPartner } from '../../channelManagement/channelPartnerList.model'
import { ChannelPartnerSubsidiary } from '../subsidiaryDetails/subsidiaryDetails.model';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { FormCanDeactivate } from '../../shared/can-deactivate/form-can-deactivate.component';
import { NotificationService } from '../../shared/notification-service.service';
import { ErrorLoggerService } from '../../shared/logger/error-logger.service';

@Component({
  selector: 'channelManagement',
  templateUrl: './channelPartnerDetails.html',
  styleUrls: ['./channelPartnerDetails.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ChannelPartnerDetails extends FormCanDeactivate {
  subsidiaryList: any;
  ChannelPartnerInformationFormdata: any;
  msgs: Message[] = [];
  channelPartnerKey: string;
  channelPartnerDbData: any;
  thresholdFlag=0;
  screenWidth:number =screen.width;
  constructor(private router: Router, private dataService: ManageComponentDataService, private route: ActivatedRoute, private confirmationService: ConfirmationService, private spinnerService: Ng4LoadingSpinnerService
  ,private notificationService : NotificationService
  ,private logger: ErrorLoggerService) {
    super();
    this.subsidiaryList = [];
  }
  ngOnInit() {
    
    this.spinnerService.show();
    this.channelPartnerKey = this.route.snapshot.paramMap.get('channelPartnerKey');
    this.ChannelPartnerInformationFormdata = new FormGroup({
      isActive: new FormControl(true, Validators.required),
      name: new FormControl("", Validators.required),
      code: new FormControl(),
      description: new FormControl(),
      threshold: new FormControl(),
      organizationId: new FormControl(),
    });
    if (!this.channelPartnerKey)
      this.spinnerService.hide();
    if (this.channelPartnerKey != undefined && this.channelPartnerKey != "") {
      this.dataService.getChannelPartnerInformation(this.channelPartnerKey).subscribe(
        (data: ChannelPartner) => {
          if (data != null) {

            this.channelPartnerDbData = data;
            this.ChannelPartnerInformationFormdata.controls['isActive'].setValue(data.isActive);
            this.ChannelPartnerInformationFormdata.controls['name'].setValue(data.name);
            this.ChannelPartnerInformationFormdata.controls['code'].setValue(data.code);
            this.ChannelPartnerInformationFormdata.controls['description'].setValue(data.description);
            this.ChannelPartnerInformationFormdata.controls['threshold'].setValue(data.threshold);
            this.ChannelPartnerInformationFormdata.controls['organizationId'].setValue(data.organizationId);
            this.ChannelPartnerInformationFormdata.markAsPristine();
            this.ChannelPartnerInformationFormdata.markAsUntouched();
            this.spinnerService.hide();
            this.dataService.getListOfSubsidiariesByChannelPartner(this.channelPartnerKey).subscribe(
              (data: ChannelPartnerSubsidiary[]) => {
                this.subsidiaryList = data;
                this.ChannelPartnerInformationFormdata.markAsPristine();
                this.ChannelPartnerInformationFormdata.markAsUntouched();
                this.spinnerService.hide();
                
              }
            );
          }
        },
        (error) => {
          // this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
          // this.spinnerService.hide();
          if (error.status != 404)
          this.msgs.push({ severity: 'error', detail: "Error retreiving data .Please try again !!" });
        else
          this.msgs.push({ severity: 'error', detail: error.error.message });
        this.spinnerService.hide();
          window.scrollTo(0,0);
        }

      );
    }
  }
  onClick() {
    
    for (let inner in this.ChannelPartnerInformationFormdata.controls) {
      this.ChannelPartnerInformationFormdata.get(inner).markAsTouched();
      this.ChannelPartnerInformationFormdata.get(inner).markAsDirty();
      this.ChannelPartnerInformationFormdata.get(inner).updateValueAndValidity();
    }

    if (this.ChannelPartnerInformationFormdata.status == "INVALID") {
      this.msgs.push({ severity: 'error', detail: 'Please enter name and save before proceeding' });
      window.scrollTo(0,0);
    }
    else{
      this.ChannelPartnerInformationFormdata.markAsPristine();
    this.ChannelPartnerInformationFormdata.markAsUntouched();
    }
    if (this.channelPartnerKey) {
      this.router.navigateByUrl('/lc/channelManagement/subsidiaryDetails/' + this.channelPartnerKey + '/');
    }
  }
  cancel() {
    this.router.navigateByUrl('/lc/channelManagement');
  }
  submitchannelPartner() {
    this.notificationService.clearMessages();
    this.msgs=[];
    this.ChannelPartnerInformationFormdata.markAsPristine();
    this.ChannelPartnerInformationFormdata.markAsUntouched();
    this.spinnerService.show();
    var objTosave= this.channelPartnerDbData ? this.channelPartnerDbData : {};
    objTosave.isActive = this.ChannelPartnerInformationFormdata.controls['isActive'].value;
    objTosave.name = this.ChannelPartnerInformationFormdata.controls['name'].value;
    objTosave.code = this.ChannelPartnerInformationFormdata.controls['code'].value;
    objTosave.description = this.ChannelPartnerInformationFormdata.controls['description'].value;
    objTosave.organizationId = this.ChannelPartnerInformationFormdata.controls['organizationId'].value;
    
    let threshold=parseInt(this.ChannelPartnerInformationFormdata.controls['threshold'].value);
    if(threshold && threshold !=null && threshold.toString() != 'NaN'){
    objTosave.threshold = threshold;
    }else{
      delete objTosave['threshold'];
    }

    if (this.ChannelPartnerInformationFormdata.controls['threshold'].value > 100) {
      //this.msgs.push({ severity: 'warn', detail: 'Please enter value less than or equal to 100' });
      this.thresholdFlag=1;
       this.spinnerService.hide();
    }
    else {
      this.dataService.saveChannelPartnerInformation(objTosave).subscribe(
        (data: ChannelPartner) => {
          this.msgs=[];
          window.scroll(0,0); 
          this.msgs.push({severity:'success',detail:'Channel Partner Detail has been saved successfully'});
        this.spinnerService.hide();
       
        // this.notificationService.pushMessages([{severity:'success',detail:'Channel Partner Detail has been saved successfully'}]);
       
        }
        , (error) => { this.msgs=[];this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' }); 
        window.scrollTo(0,0);
        this.logger.logError("error",error.error,"Capacity Page")
        this.spinnerService.hide();
      }
      );
    }
  }
  setSubsidiaryDetails(event) {
    this.router.navigateByUrl('/lc/channelManagement/subsidiaryDetails/' + event.data.channelPartnerKey + '/' + event.data.channelPartnerSubsidiaryKey);

  }
  checkstate() {
    this.msgs = [];
    var a = this.ChannelPartnerInformationFormdata.controls['isActive'].value;
    if (a == false) {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to perform this action?',
        accept: () => {
        },
        reject: () => {
          this.ChannelPartnerInformationFormdata.controls['isActive'].setValue(true);
        }
      });
    }
  }
  form() {
    return this.ChannelPartnerInformationFormdata;
  }
}
