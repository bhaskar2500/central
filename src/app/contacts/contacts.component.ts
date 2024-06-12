import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { ContactsList } from './ContactsList.model';
import { Messages } from 'primeng/components/messages/messages';
import { Message } from 'primeng/components/common/message';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService } from '../shared/notification-service.service';

@Component({
  selector: 'lc-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactsComponent implements OnInit {
  contacts: any;
  msgs: Message[] = [];
  item: any;
  gridHeader: any;
  tableflag: boolean = false;
  cardflag: boolean = false;
  screenWidth: number = screen.width;
  constructor(private router: Router, private dataService: ManageComponentDataService, private spinnerService: Ng4LoadingSpinnerService
    , private notificationService: NotificationService) {
    this.contacts = [];
    this.item = [
      { header: 'locationCode' },
      { header: 'locationCode' },
      { header: 'locationCode' },
      { header: 'locationCode' },
      { header: 'locationCode' },
      { header: 'locationCode' },
      { header: 'locationCode' },
    ]
  }

  ngOnInit() {
    this.spinnerService.show();
    if (window.screen.width < 1024) {
      this.cardView();
    }
    else {
      this.tableView();
    }
    this.dataService.getListOfContacts().subscribe(
      (data: ContactsList[]) => {
        this.contacts = data;
        this.spinnerService.hide();
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

    this.router.navigateByUrl('/lc/contact-details/');
  }
  onCancel() {
    this.router.navigateByUrl('lc/locationDetails');
  }

  setContactDetails(event) {
    event = event.hasOwnProperty("data") ? event.data : event;
    this.router.navigateByUrl('/lc/contact-details/' + event.contactId);
  }
  tableView() {
    this.tableflag = true;
    this.cardflag = true;
  }
  cardView() {
    this.tableflag = false;
    this.cardflag = false;
  }


}
