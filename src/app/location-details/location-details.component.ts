import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../shared/notification-service.service';
import { ManageComponentDataService } from '../shared/manage-component-data.service';


@Component({
  selector: 'lc-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss', ]
})
export class LocationDetailsComponent implements OnInit {
  constructor(private router: Router
              ,private notificationService: NotificationService
              ,private dataService : ManageComponentDataService) { }
  showOccupanyReset :boolean;
  ngOnInit() {
  this.showOccupanyReset = this.dataService.getCurrentLocation().allowOccupencyReset == '1';
  }
  onFeaturesClick(){
    this.router.navigateByUrl('lc/features');
    this.notificationService.clearMessages();
  }
  onCapacityClick(){
    this.router.navigateByUrl('lc/capacity');
    this.notificationService.clearMessages();
  }
  onContactsClick(){
    this.router.navigateByUrl('lc/contacts');
    this.notificationService.clearMessages();
  }
  onOperationalClick(){
    this.router.navigateByUrl('lc/operational');
    this.notificationService.clearMessages();
  }
  onNotesClick(){
    this.router.navigateByUrl('lc/notes');
    this.notificationService.clearMessages();
  }
  onMarketingClick(){
    this.router.navigateByUrl('lc/marketing-information');
    this.notificationService.clearMessages();
  }
  onRatesClick(){
    this.router.navigateByUrl('lc/rates');
    this.notificationService.clearMessages();
  }
  onMerchantIDDataClick(){
    this.router.navigateByUrl('lc/merchantIdData');
    this.notificationService.clearMessages();
  }
  onEnforcementClick(){
    this.router.navigateByUrl('lc/enforcement');
    this.notificationService.clearMessages();
  }
  onOccupancyClick(){
    this.router.navigateByUrl('lc/occupancy');
    this.notificationService.clearMessages();
  }
}
