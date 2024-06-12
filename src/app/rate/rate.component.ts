import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { RatesModel } from './rates.models';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import * as moment from 'moment';


@Component({
  selector: 'lc-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RateComponent implements OnInit {
  addRatesButtonFlag: boolean = false;
  routeUrl: string;
  rateDetailsGridData: RatesModel[];
  objectKeys = Object.keys;
  msgs: Message[] = [];
  tableflag:boolean=false;
  cardflag:boolean=false;
  screenWidth:number =screen.width;
  constructor(private route: ActivatedRoute, private dataService: ManageComponentDataService, private router: Router, private spinnerService: Ng4LoadingSpinnerService) {
    this.routeUrl = route.snapshot.url[0].path;
  }

  ngOnInit() {
    this.spinnerService.show();
    if(window.screen.width < 1024){
      this.cardView();
    }
    else{
    this.tableView();
    }
    this.refreshGrid();
  }

  /**
   * Gets the clicked row data and fills in the Rate Details fieldset .
   * @event takes the row click event and fetches that row data.
  */
  getRateDetails(rate) {
    this.router.navigate(["lc/rateDetails"], { queryParams: { RateKey: rate.rateKey } });
  }
  getRateDetailsTable(event) {
    this.router.navigate(["lc/rateDetails"], { queryParams: { RateKey:  event.data.rateKey } });
  }

  redirectToHome() {
    this.router.navigateByUrl('lc/locationDetails');
  }
  refreshGrid() {
    this.dataService.getListofRates().subscribe((data: RatesModel[]) => {
      this.rateDetailsGridData = data;
      this.rateDetailsGridData.forEach((record) => {
        record.isActiveFormatted =  record.isActive ? "True" : "False";
        record.entryTime["lower"] = moment(record.entryTime["lower"], "hh:mm").format("hh:mm A")
        record.entryTime["upper"] = moment(record.entryTime["upper"], "hh:mm").format("hh:mm A")
        record.exitTime["lower"] = moment(record.exitTime["lower"], "hh:mm").format("hh:mm A")
        record.exitTime["upper"] = moment(record.exitTime["upper"], "hh:mm").format("hh:mm A")
        record.price= record.price !=null ?  parseFloat(record.price.toFixed(2)) : record.price;
        record.maxDailyPrice= record.maxDailyPrice!=null ? parseFloat(record.maxDailyPrice.toFixed(2)) :record.maxDailyPrice;
        record.activeEndDate = moment(record.activeEndDate).format('MM/DD/YY');
        record.activeStartDate = moment(record.activeStartDate).format('MM/DD/YY');
        record.selectedDaysData = record.selectedDaysOfTheWeek ? record.selectedDaysOfTheWeek.filter((i) => i["selected"]).map(i => i["dayName"]).join(' -') : "";
        record.selectedChannelsData = record.selectedChannels ? record.selectedChannels.filter((i) => i["selected"]).map(i => i["name"]).join(' ,') : "";

      })

      this.spinnerService.hide();
    },
      (error) => {
        if (error.status != 404)
          this.msgs.push({ severity: "error", detail: "Unable to load the rates data . Please refresh the page ." });
        else
          this.msgs.push({ severity: 'warning', detail: error.error.message });
        this.spinnerService.hide();
      });
  }
  addRateDetails() {
    this.router.navigate(["lc/rateDetails"], { queryParams: { RateKey: -1 } });
  }
  tableView(){
    this.tableflag=true;
    this.cardflag=true;
  }
  cardView(){
    this.tableflag=false;
    this.cardflag=false;
  }
  formatDate(date) {
    if (typeof (date) != 'object') {
      date = new Date(date);
    }
    return date.toISOString().slice(0, 10);
  }
}
