import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ManageComponentDataService } from '../../shared/manage-component-data.service';
import { Message } from 'primeng/components/common/api';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormCanDeactivate } from '../../shared/can-deactivate/form-can-deactivate.component';
import { NotificationService } from '../../shared/notification-service.service';
import { filter } from 'rxjs/operator/filter';
import { isNull } from 'util';

@Component({
    selector: 'location-search',
    templateUrl: './location-search.html',
    styleUrls: ['./location-search.scss'],
    encapsulation: ViewEncapsulation.None

})
export class LocationSearchComponent {
    searchFormdata: any;
    items: any;
    statesList: any;
    openDropDown: boolean;
    locationAttributeValueList: any[] = [];
    mergedListofStates  : any[]=[];
    firstClick: number=0;
    @ViewChild('searchDropdown') searchOptionDropDown: any;

    constructor(private router: Router, private dataService: ManageComponentDataService, private notificationService: NotificationService) {
        this.statesList = this.dataService.getStatesList();
    }
    ngOnInit() {
        this.searchFormdata = new FormGroup({
            search: new FormControl(),
            keyword: new FormControl(),
        });
        this.items = this.dataService.getColumnNameInSearch();

    }
    allLocation(event) {
        this.router.navigate(["/lc/locationSearchResults"], { queryParams: { noFilter: true } });
    }
    searchLocationOnClick(event) {

        this.navigateWithSearchResult();
    }
    searchLocationOnKeyEnter(event) {
        if (this.firstClick ==0 && this.searchOptionDropDown && isNull(this.searchOptionDropDown.value) &&  this.searchOptionDropDown.el) {
            let el: HTMLElement = this.searchOptionDropDown.el.nativeElement as HTMLElement;
            let searchPanel= el.children[0] as HTMLElement;
            searchPanel.click();
            event.srcElement.focus();
            this.firstClick+=1;
        }
        if (event.key === "Enter") {
            this.navigateWithSearchResult();
        }
    }

    filterLocAttributes(event) {
        let searchValue: string;
        let keyWord: any;
        searchValue = this.searchFormdata.controls['search'].value != null ? this.searchFormdata.controls['search'].value.toUpperCase() : "";
        keyWord = this.searchFormdata.controls["keyword"].value
        if (searchValue != 'STATE') {
            this.dataService.getListOfAttributesByName({
                columnName: searchValue
                , columnValue: keyWord
            })
                .subscribe((attributeData: any[]) => {
                    this.locationAttributeValueList = attributeData["elementValue"];
                }, (err) => {
                    if (err.error["status"] == 404 || err.error["status"] == 500) {
                        this.locationAttributeValueList = [];
                    }
                })
        }
        else {
            let states: any[] = this.dataService.getStatesList().map(state => state.items);
            this.mergedListofStates= [].concat.apply([], states);
            console.log('--->states', this.mergedListofStates);
            this.locationAttributeValueList = this.mergedListofStates.filter(i=>i.label.toUpperCase().includes(keyWord.toUpperCase())).map(i=>i.label);
        }   
    }
    navigateWithSearchResult() {

        var filterBy = this.searchFormdata.controls['search'].value;
        var filterValue = this.searchFormdata.controls['keyword'].value;
        var uppercase = filterValue.toString().toUpperCase();
        var trimValue = uppercase.trim();
        let selectedState = this.mergedListofStates.filter(i=>i.label==filterValue).map(i=>i.value);
        filterValue = filterBy.toUpperCase() == "STATE" && selectedState.length >0  ?  selectedState[0] : filterValue;
        this.router.navigate(["/lc/locationSearchResults"], { queryParams: { filterBy: filterBy, filterValue: filterValue } });
        // if (filterBy == "state" && this.statesList && this.statesList.length > 0) {
        //     this.statesList.forEach((states) => {
        //         if (states && states.items && states.items.length > 0) {
        //             states.items.forEach((state) => {
        //                 if (state.value.toUpperCase() == trimValue ) {
        //                     selectedState = state;
        //                 }
        //             });
        //             if (selectedState == undefined) {
        //                 states.items.forEach((state) => {
        //                     if (state.label.toUpperCase().includes(trimValue)) {
        //                         selectedState = state;
        //                     }
        //                 });
        //             }
        //         }
        //     });

        //     if (selectedState) {
        //         this.router.navigate(["/lc/locationSearchResults"], { queryParams: { filterBy: filterBy, filterValue: selectedState.value } });
        //     } else {
        //         this.router.navigate(["/lc/locationSearchResults"], { queryParams: { filterBy: filterBy, filterValue: filterValue } });
        //     }
        // }
        // else {
        //     this.router.navigate(["/lc/locationSearchResults"], { queryParams: { filterBy: filterBy, filterValue: filterValue } });
        // }
    }
}