import { Component, OnInit, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { ManageComponentDataService } from '../../shared/manage-component-data.service'
import { take, map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ErrorLoggerService } from '../../shared/logger/error-logger.service';

declare var jQuery: any;

@Component({
  selector: 'lc-location-search-results',
  templateUrl: './location-search-results.component.html',
  styleUrls: ['./location-search-results.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LocationSearchResultsComponent implements AfterViewChecked{
  newLocationLogoPath = "../../../assets/new.jpg";
  availableLocations: any[];
  dbResults: any[];
  loading: boolean;
  filterBy: string;
  filterValue: string;
  noFilter: string;
  rows: number;
  items: any;
  searchBy: any;
  tableflag: boolean = false;
  cardflag: boolean = false;
  isSmallDevice: boolean = window.screen.width <= 1024;
  constructor(private route: ActivatedRoute, private dataService: ManageComponentDataService
    , private router: Router, private spinnerService: Ng4LoadingSpinnerService, private logger: ErrorLoggerService) {
    this.dbResults = [];
    this.items = this.dataService.getColumnNameInSearch();
  }
  ngAfterViewChecked(){
    this.changeExpanderStyle();
  }
  ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      this.filterBy = params["filterBy"];
      this.filterValue = params["filterValue"];
      this.noFilter = params["noFilter"];
      this.rows = 0;
      this.tableView();
      if (this.isSmallDevice) {
        this.cardView();
      }
      this.dataService.getListOfAvailableLocations(-1, 0, '', 1, this.filterBy, this.filterValue).subscribe(
        (locationList: any[]) => {
          if (locationList && locationList.length > 0) {
            this.rows = locationList[0].totalCount;
          }
        }, (error) => {
          this.tableView();
          this.logger.logError("error", error["statusText"], "Location Search Results")
        });
    });
    for (var i in this.items) {
      if (this.filterBy == this.items[i].value) {
        this.searchBy = this.items[i].label;
      }

    }

  }

  putGeoLocationData(event) {
    let data = event.hasOwnProperty("data") ? event.data : event;
    console.log(data);
    this.dataService.saveCurrentLocation(data);
    this.router.navigateByUrl("lc/locationDetails");
  }

  loadLocationLazy(event) {
    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value

    //imitate db connection over a network
    this.loadTableData(event.rows, event.first, event.sortField, event.sortOrder);
  }

  loadTableData(rows: number, offset: number, sortField: string, sortOrder: number) {
    this.spinnerService.show();
    this.dataService.getListOfAvailableLocations(rows, offset, sortField, sortOrder, this.filterBy, this.filterValue).subscribe(
      (locationList: any[]) => {
        this.availableLocations = locationList;
        this.spinnerService.hide();
      }, (error) => {
        console.log(error);
        this.spinnerService.hide();
      })
  }
  tableView() {
    this.tableflag = true;
    this.cardflag = true;
  }
  cardView() {
    this.tableflag = false;
    this.cardflag = false;
  }
  changeExpanderStyle() {
    jQuery('.ui-row-toggler').each((index, element) => {
      if (this.availableLocations[index] && this.availableLocations[index].newLocation)
        jQuery(element).css("color", "red");
      else
        jQuery(element).css("color", "green");
    });
  }
}