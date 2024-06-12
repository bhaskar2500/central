import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { Message } from 'primeng/components/common/message';
import { ChannelPartner } from '../channelManagement/channelPartnerList.model'
import { ChannelPartnerSubsidiary } from './subsidiaryDetails/subsidiaryDetails.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../shared/notification-service.service';

@Component({
  selector: 'channelManagement',
  templateUrl: './channelManagement.html',
  styleUrls: ['./channelManagement.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ChannelManagement implements OnInit {
  channelPartnerManagement: any;
  msgs: Message[] = [];
  subsidiaryList: any;
  count = 0;
  tableflag:boolean=false;
  cardflag:boolean=false;
  screenWidth:number =screen.width;
  constructor(private router: Router, private dataService: ManageComponentDataService, private spinnerService: Ng4LoadingSpinnerService
  ,private notificationService : NotificationService) {
    this.channelPartnerManagement = [];
  }
  ngOnInit() {
    // this.spinnerService.show();
    if(window.screen.width < 1024){
      this.cardView();
    }
    else {
      this.tableView();
    }
    this.refresh();
  }
  refresh() {
    this.dataService.getListOfChannelPartners().subscribe(
      (channelPartnerList: ChannelPartner[]) => {
        if (channelPartnerList != null) {
          for (var i = 0; i < channelPartnerList.length; i++) {
            channelPartnerList[i].subidaryCommaString = this.getCommanSeperatedStringOfSubsidaryNames(channelPartnerList[i].subsidaries);
            this.count = channelPartnerList[i].subsidaries.length;
            if (this.count > 5) {
              channelPartnerList[i].tooltipFlag = 1;
            }
          }

          this.channelPartnerManagement = channelPartnerList;
          this.spinnerService.hide();
        }
      }
      , (error) => {
        // this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
        // this.spinnerService.hide();
        if (error.status != 404)
          this.msgs.push({ severity: 'error', detail: "Error retreiving data .Please try again !!" });
        else
          this.msgs.push({ severity: 'warning', detail: error.error.message });
        this.spinnerService.hide();
        window.scrollTo(0, 0);
      }
    );
  }
  onClick() {
    this.router.navigateByUrl('/lc/channelManagement/channelPartnerDetails/');

  }
  onCancel() {
    this.router.navigateByUrl('lc/locationSearch');
  }
  onSubmit() {
    this.router.navigateByUrl('/lc/locationSearch');
  }
  setPartnerDetails(event) {
    event =  Object.keys(event).includes('data') ?  event.data  : event
    this.router.navigateByUrl('/lc/channelManagement/channelPartnerDetails/' + event.channelPartnerKey);
  }
  getCommanSeperatedStringOfSubsidaryNames(channelPartnerSubsidiaryList: ChannelPartnerSubsidiary[]) {
    var subsidiary = "";
    if (channelPartnerSubsidiaryList == null || channelPartnerSubsidiaryList == undefined) { return subsidiary; }
    else {
      for (var i = 0; i < channelPartnerSubsidiaryList.length; i++) {
        subsidiary = subsidiary.concat(channelPartnerSubsidiaryList[i].name);
        if (!((channelPartnerSubsidiaryList.length - 1) == i)) {
          subsidiary = subsidiary.concat(", ");
        }
      }
      return subsidiary;
    }
  }
  tableView(){
    this.tableflag=true;
    this.cardflag=true;
  }
  cardView(){
    this.tableflag=false;
    this.cardflag=false;
  }
}
