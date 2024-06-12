import { Component, OnInit, ViewEncapsulation, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { MarketingInformation } from './marketing-information.model';
import ReferenceTable from './../shared/enum/refTable.enum';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { filter } from 'rxjs/operators';
import { LCForm } from '../shared/LCForm';
import { NotificationService } from '../shared/notification-service.service';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';

@Component({
  selector: 'lc-marketing-information',
  templateUrl: './marketing-information.component.html',
  styleUrls: ['./marketing-information.component.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class MarketingInformationComponent extends LCForm {
  marketingFormdata: any;
  msgs: Message[] = [];
  verticalMarketList: any;
  nationalAccount: any;
  filteredNationalAccountArray: any[] = [];
  screenWidth: number = screen.width;
  constructor(private router: Router
    , private messageService: MessageService
    , private dataService: ManageComponentDataService
    , private spinnerService: Ng4LoadingSpinnerService
    , private notificationService: NotificationService
    , private logger: ErrorLoggerService) {
    super();

  }

  filterAccount(event) {
    let query = event.query;
    this.filteredNationalAccountArray = this.getFilteredNationalAccount(query);
  }
  ngOnInit() {
    this.spinnerService.show();
    this.marketingFormdata = new FormGroup({
      verticalMarket: new FormControl("", Validators.required),
      nationalAccount: new FormControl(""),
      contractorNumber: new FormControl({ value: '123', disabled: true }, Validators.required)
    });
    this.dataService.getTableValuesByTableName(ReferenceTable.Vertical_Markets).subscribe((data) => {
      this.verticalMarketList = data;
    });
    this.dataService.getTableValuesByTableName(ReferenceTable.National_Account).subscribe((data) => {
      this.nationalAccount = data;
    });
    this.dataService.getMarketingInformationForLocation().subscribe(
      (data: MarketingInformation) => {
        this.marketingFormdata.controls["nationalAccount"].setValue({ elementId: data.nationalAccount, elementValue: data.nationalAccountValue });
        this.marketingFormdata.controls["verticalMarket"].setValue(data.verticalMarkets);
        this.marketingFormdata.controls["contractorNumber"].setValue(data.contractorNumber);
        this.spinnerService.hide();
      }
      , (error) => {
        this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
        this.spinnerService.hide();
        window.scrollTo(0, 0);
      }
    );
  }

  cancel() {
    this.router.navigateByUrl('/lc/locationDetails');
  }

  saveMarketingInformation() {
    this.msgs = [];

    this.spinnerService.show();
    for (let inner in this.marketingFormdata.controls) {
      this.marketingFormdata.get(inner).markAsTouched();
      this.marketingFormdata.get(inner).markAsDirty();
      this.marketingFormdata.get(inner).updateValueAndValidity();
    }


    if (this.marketingFormdata.status == "INVALID") {
      this.msgs.push({ severity: 'error', detail: 'Form has errors' });
      this.spinnerService.hide();
    }
    else {
      //TODO: call Service to Persist data in APIC
      var objTosave = new MarketingInformation();
      objTosave.verticalMarkets = this.marketingFormdata.controls['verticalMarket'].value;
      let selectedNationalAccount = this.marketingFormdata.controls['nationalAccount'].value;
      if (typeof selectedNationalAccount != 'string') {
        let nationalAccount = this.marketingFormdata.controls['nationalAccount'].value;
        objTosave.nationalAccount = nationalAccount ? nationalAccount.elementId : objTosave.nationalAccount;
      }

      objTosave.contractorNumber = this.marketingFormdata.controls['contractorNumber'].value;
      super.removeNulls(objTosave);
      this.dataService.saveMarketingInformationForLocation(objTosave).subscribe(
        (data) => {
          this.msgs = [];
          { this.msgs.push({ severity: 'success', detail: 'Marketing Data has been saved successfully' }); }
          this.spinnerService.hide();
        }
        , (error) => {
          this.msgs = [];
          this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' });
          this.logger.logError("error",error.error,"Marketing Information Page");
          this.spinnerService.hide();
        }
      );

    }
  }
  getFilteredNationalAccount(query) {
    let filteredNationalAccountArray: any[] = [];
    if (this.nationalAccount && this.nationalAccount.length > 0)
      for (var i = 0; i < this.nationalAccount.length; i++) {
        let element = this.nationalAccount[i];

        if (element.elementValue.toUpperCase().includes(query.toUpperCase())) {
          filteredNationalAccountArray.push(element);
        }
      }
    return filteredNationalAccountArray;
  }
  form() {
    return this.marketingFormdata;
  }

}

export class Account {
  value: String;
}
