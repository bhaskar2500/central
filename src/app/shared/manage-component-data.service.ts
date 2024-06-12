import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Location } from './location.model';
import { MarketingInformation } from '../marketing-information/marketing-information.model';
import { MerchantIdData } from '../merchantId/merchantId.model';
import { FeaturesDetails } from '../location-features/location-features.model';
import { Capacity } from '../capacity/capacity.model';
import { Enforcement } from '../enforcement/enforcement.component.model';
import { contactDetails } from '../contact-details/contact-details.model';

import { ChannelPartner } from '../channelManagement/channelPartnerList.model';
import { ChannelPartnerDetails } from '../channelManagement/channelPartnerDetails/channelPartnerDetails';
import { ChannelPartnerSubsidiary } from '../channelManagement/subsidiaryDetails/subsidiaryDetails.model';
import { ReferenceTable } from '../referenceTableManagement/referenceTableDropDown.model';
import { NewValue } from '../referenceTableManagement/addNewValue.model';
import { ReferenceTableValue } from '../referenceTableManagement/referenceTableManagement.model';

import { Operational } from '../operational/operational.model';
import { AddressDetails } from '../operational/address-details/adress-details.model';
import { JwtService } from '../shared/auth/jwt.service'
import { AuthService } from './auth/auth.service';
import { FeeDetail } from '../enforcement/fee-details/fee-details.model';
import * as moment from 'moment';
  
@Injectable()
export class ManageComponentDataService {
  startTimeArray: any[];
  stopTimeArray: any[];
  statesList: any[];
  separatedStateList: any[];
  canadaStatesList: any[];
  fromTimeList: any[];
  timeZone: any[];
  searchBy: any[];
  API_HOST = "https://api.us.apiconnect.ibmcloud.com/gpearsonsppluscom-dev/spplus/v1.0.0";
  // APIC_HOST = "https://169.60.191.152:9091/v1.0.0";
  APIC_HOST = "https://api.us.apiconnect.ibmcloud.com/gpearsonsppluscom-dev/spplus/v1.0.0";
  constructor(private http: HttpClient, private authService: AuthService) {
    this.separatedStateList = [
      {
        label: 'USA States', value: 'USA',
        items: [
          { label: 'Alabama', value: 'AL' },
          { label: 'Alaska', value: 'AK' },
          { label: 'Arizona', value: 'AZ' },
          { label: 'Arkansas', value: 'AR' },
          { label: 'California', value: 'CA' },
          { label: 'Colorado', value: 'CO' },
          { label: 'Connecticut', value: 'CT' },
          { label: 'Delaware', value: 'DE' },
          { label: 'Florida', value: 'FL' },
          { label: 'Georgia', value: 'GA' },
          { label: 'Hawaii', value: 'HI,' },
          { label: 'Idaho', value: 'ID' },
          { label: 'Illinois', value: 'IL' },
          { label: 'Indiana', value: 'IN' },
          { label: 'Iowa', value: 'IA' },
          { label: 'Kansas', value: 'KS' },
          { label: 'Louisiana', value: 'LA' },
          { label: 'Maine', value: 'ME' },
          { label: 'Manitoba', value: 'MB' },
          { label: 'Maryland', value: 'MD' },
          { label: 'Massachusetts', value: 'MA' },
          { label: 'Michigan', value: 'MI' },
          { label: 'Minnesota', value: 'MN' },
          { label: 'Mississippi', value: 'MS' },
          { label: 'Missouri	', value: 'MO' },
          { label: 'Montana', value: 'MT' },
          { label: 'Nebraska	', value: 'NE	' },
          { label: 'Nevada', value: 'NV' },
          { label: 'New Hampshire', value: 'NH' },
          { label: 'New Jersey', value: 'NJ' },
          { label: 'New Mexico', value: 'NM' },
          { label: 'New York', value: 'NY' },
          { label: 'North Carolina', value: 'NC' },
          { label: 'North Dakota', value: 'ND' },
          { label: 'Ohio', value: 'OH' },
          { label: 'Oklahoma	', value: 'OK' },
          { label: 'Oregon', value: 'OR' },
          { label: 'Pennsylvania', value: 'PA' },
          { label: 'South Carolina', value: 'SC' },
          { label: 'South Dakota', value: 'SD' },
          { label: 'Tennessee', value: 'TN' },
          { label: 'Texas', value: 'TX' },
          { label: 'Utah', value: 'UT' },
          { label: 'Vermont', value: 'VT' },
          { label: 'Virginia', value: 'VA' },
          { label: 'Washington', value: 'WA' },
          { label: 'West Virginia', value: 'WV' },
          { label: 'Wisconsin', value: 'WI' },
          { label: 'Wyoming', value: 'WY' },


        ]
      },
      {
        label: 'USA Territories', value: 'USA Territories',
        items: [
          { label: 'Puerto Rico', value: 'PR' },
        ]
      },
      {
        label: 'CANADA Provinces', value: 'CANADA',
        items: [
          { label: 'Alberta', value: 'AB' },
          { label: 'British Columbia', value: 'BC' },
          { label: 'Manitoba', value: 'MB' },
          { label: 'Newfoundland	', value: 'NF' },
          { label: 'New Brunswick', value: 'NB' },
          { label: 'Northwest Territories', value: 'NT' },
          { label: 'Nova Scotia', value: 'NS' },
          { label: 'Nunavut', value: 'NU' },
          { label: 'Ontario	', value: 'ON' },
          { label: 'Prince Edward Island', value: 'PE' },
          { label: 'Quebec', value: 'QC' },
          { label: 'Saskatchewan', value: 'SK' },
          { label: 'Yukon Territory', value: 'YT' }
        ]
      },
    ]
    this.canadaStatesList = [{ label: 'Alberta', value: 'AB' },
    { label: 'British Columbia', value: 'BC' },
    { label: 'Manitoba', value: 'MB' },
    { label: 'Newfoundland	', value: 'NF' },
    { label: 'New Brunswick', value: 'NB' },
    { label: 'Northwest Territories', value: 'NT' },
    { label: 'Nova Scotia', value: 'NS' },
    { label: 'Nunavut', value: 'NU' },
    { label: 'Ontario	', value: 'ON' },
    { label: 'Prince Edward Island', value: 'PE' },
    { label: 'Quebec', value: 'QC' },
    { label: 'Saskatchewan', value: 'SK' },
    { label: 'Yukon Territory', value: 'YT' }]
  }

  getLowerBoundTime() {
    return this.startTimeArray;
  }
  getUpperBoundTime() {
    return this.stopTimeArray;
  }
  getStatesList() {
    return this.separatedStateList;
  }
  getCanadaStatesList() {
    return this.canadaStatesList;
  }
  saveNotesToDb(notes) {
    return this.http.put(this.APIC_HOST + '/locations/' + this.getCurrentLocation().locationCode + '/notes', notes);
  }
  getNotes() {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/notes');
  }

  saveRateDetails(ratesData) {
    return this.http.put(this.APIC_HOST + '/locations/' + this.getCurrentLocation().locationCode + '/rates/' + ratesData.rateKey, ratesData);
  }

  getListofRates() {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/rates');
  }

  getRateDetailsByID(rateID) {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/rates/' + rateID);
  }

  getListOfAvailableLocations(rows: number, offset: number, sortField: string, sortOrder: number, filterBy: string, filterValue: string) {
    let networkId: string;
    this.authService.currentUser.subscribe((data) => {
      networkId = data["networkId"];
    })
    let sortOrderParam = sortOrder && sortOrder == 1 ? 'ASC' : 'DESC';

    let urlParams = this.generateURLParams([{ id: 'limit', value: rows }
      , { id: 'offset', value: offset }
      , { id: 'sortBy', value: sortField }
      , { id: 'sortOrder', value: sortOrderParam }
      , { id: 'filterBy', value: filterBy }
      , { id: 'filterValue', value: filterValue }
    ])
    return this.http.get(this.APIC_HOST + '/locations/' + networkId + urlParams);
  }

  /** This method parses input array and constructs the url Params for the links
   *  input format :: [{id: '', value: ''}]
   */
  generateURLParams(params) {
    let urlParams = "";
    if (params && params.length > 1) {
      params.forEach((param) => {
        if (param.id && param.value) {
          if (params.indexOf(param) != 0) {
            urlParams = urlParams + "&";
          }
          urlParams = urlParams + param.id + '=' + param.value;
        }
      });
      if (urlParams.trim() != '') { urlParams = "?" + urlParams; }
    }
    return urlParams;
  }

  getMarketingInformationForLocation() {
    var locationCode = this.getCurrentLocation().locationCode;

    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/marketing');
  }


  saveMarketingInformationForLocation(dataToSave: MarketingInformation) {
    var locationCode = this.getCurrentLocation().locationCode;
    dataToSave['locationCode'] = locationCode;

    return this.http.put(this.APIC_HOST + '/locations/' + locationCode + '/marketing', dataToSave);
  }
  getCapacityForLocation() {
    var locationCode = this.getCurrentLocation().locationCode;

    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/capacity');
  }

  saveCapacityForLocation(dataToSave: Capacity) {
    var locationCode = this.getCurrentLocation().locationCode;

    return this.http.put(this.APIC_HOST + '/locations/' + locationCode + '/capacity', dataToSave);
  }
  getEnforcementForLocation() {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/enforcement');
  }

  saveEnforcementForLocation(dataToSave: Enforcement) {
    var locationCode = this.getCurrentLocation().locationCode;
    dataToSave['locationCode'] = locationCode;

    return this.http.put(this.APIC_HOST + '/locations/' + locationCode + '/enforcement', dataToSave);
  }
  getFeeDetailsForLocation(feeID: string) {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/enforcement/fee/' + feeID);
  }
  saveFeeDetailsForLocation(dataToSave: FeeDetail) {
    var locationCode = this.getCurrentLocation().locationCode;
    var feeId = dataToSave.feeDetailKey ? dataToSave.feeDetailKey : -1;
    return this.http.put(this.APIC_HOST + '/locations/' + locationCode + '/enforcement/fee/' + feeId, dataToSave);
  }

  getMerchantIDDataForLocation() {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/merchantiddata');
  }
  saveMerchantIDDataForLocation(objSave: MerchantIdData) {
    var locationCode = this.getCurrentLocation().locationCode;
    objSave['locationCode'] = locationCode;
    return this.http.put(this.APIC_HOST + '/locations/' + locationCode + '/merchantiddata', objSave);
  }

  getFeaturesDetailsForLocation() {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/features');
  }

  saveFeaturesDetailsForLocation(objSaveDetails: FeaturesDetails) {
    var locationCode = this.getCurrentLocation().locationCode;
    objSaveDetails['locationCode'] = locationCode;

    return this.http.put(this.APIC_HOST + '/locations/' + locationCode + '/features', objSaveDetails);
  }


  saveContactDetailsForLocation(objSaveContactDetails: contactDetails, contactId: string) {
    var locationCode = this.getCurrentLocation().locationCode;
    contactId = (contactId && contactId.trim() != '') ? contactId : "-1";
    return this.http.put(this.APIC_HOST + '/locations/' + locationCode + '/contacts/' + contactId, objSaveContactDetails);

  }

  getOperationalForLocation() {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/operational');
  }
  saveOperationalForLocation(objSaveDetails: Operational) {
    var locationCode = this.getCurrentLocation().locationCode;
    objSaveDetails['locationCode'] = locationCode;

    return this.http.put(this.APIC_HOST + '/locations/' + locationCode + '/operational', objSaveDetails);
  }
  getAddressDetailsByID(addressKey: string) {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/operational/addresses/' + addressKey);
  }

  saveAddressDetailsForLocation(objSaveDetails: AddressDetails) {
    var locationCode = this.getCurrentLocation().locationCode;
    var addressKey = -1;
    if (objSaveDetails.addressId != undefined && objSaveDetails.addressId != null) { addressKey = objSaveDetails.addressId }
    return this.http.put(this.APIC_HOST + '/locations/' + locationCode + '/operational/addresses/' + addressKey, objSaveDetails);
  }
  getRevenueSystem() {
    return this.http.get(this.APIC_HOST + '/referenceTables/REVENUE_APPLICATION');
  }

  getListOfChannelPartners() {
    return this.http.get(this.APIC_HOST + '/channels/');
  }

  getChannelPartnerInformation(channelCode: string) {
    return this.http.get(this.APIC_HOST + '/channels/' + channelCode);
  }

  getListOfSubsidiariesByChannelPartner(channelCode: string) {
    return this.http.get(this.APIC_HOST + '/channels/' + channelCode + '/subsidiaries');
  }

  saveChannelPartnerInformation(objToSave: ChannelPartner) {
    var dataToSend = [];
    dataToSend.push(objToSave)
    return this.http.put(this.APIC_HOST + '/channels/', dataToSend);
  }

  saveSubsidiaryInformation(channelCode: string, objSaveDetails: ChannelPartnerSubsidiary) {
    let subsidarykey = objSaveDetails.channelPartnerSubsidiaryKey ? objSaveDetails.channelPartnerSubsidiaryKey : -1;
    return this.http.put(this.APIC_HOST + '/channels/' + channelCode + '/subsidiaries/' + subsidarykey, objSaveDetails);
  }

  getSubsidiaryInformation(channelCode: string, subsidiaryCode: string) {
    return this.http.get(this.APIC_HOST + '/channels/' + channelCode + '/subsidiaries/' + subsidiaryCode);
  }
  getRefTableDropDownData() {
    return this.http.get(this.APIC_HOST + '/referenceTables/');
  }

  getTableValuesByTableName(tableName: string) {
    return this.http.get(this.APIC_HOST + '/referenceTables/' + tableName);
  }
  saveNewDataInReferenceTable(selectedTableName: string, dataToSave: ReferenceTable) {
    return this.http.put(this.APIC_HOST + '/referenceTables/' + selectedTableName, dataToSave.elements);
  }
  getDataForReferenceTable(selectedTableName: string) {
    return this.http.get('/api/getDataForReferenceTable?selectedTableName=' + selectedTableName);
  }
  getReferenceTableDropdown() {

    return this.http.get('/api/getReferenceTableManagement');
  }
  saveCurrentLocation(selectedLocation) {
    window.localStorage["selectedLocation"] = JSON.stringify(selectedLocation);
  }

  getListOfContacts() {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/contacts');
  }

  getlistOfCoordinates() {
    return this.http.get('/api/getcoordinates');

  }

  getContactDetailsByContactKey(contactId: string) {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/contacts/' + contactId);
  }

  getListOfCompanies(query: string) {
    return this.http.get('/api/getCompanyList?q=' + query);
  }

  getListOfAccounts(query: string) {
    return this.http.get('/api/getaccountList?q=' + query);
  }

  getCurrentLocation(): Location {
    var value = window.localStorage["selectedLocation"];
    if (value) {
      return JSON.parse(value);
    }
    return new Location();
  }

  getAddressesList() {
    var locationCode = this.getCurrentLocation().locationCode;
    return this.http.get(this.APIC_HOST + '/locations/' + locationCode + '/operational/addresses');
  }

  saveAddressDetailsByID(addressData) {
    return this.http.post('/api/saveAddressDetailsByID', addressData).subscribe();
  }
  saveParkingFeeRates(parkingData) {
    return this.http.post('/api/saveParkingFeeRates', parkingData).subscribe();
  }

  getcontactaffiliationsListByRefTable() {
    return this.http.get('/api/getcontactaffiliationsListByRefTable');
  }

  getCapacityTime() {
    var date = new Date();
    var dateValue = date.getDate();
    var locale = "en-us";
    var month = date.toLocaleString(locale, { month: "long" });
    var year = date.getFullYear();
    var dateString = month + " " + dateValue + " " + year + " ";
    this.fromTimeList = [
      { label: dateString + " 12:00am", value: '1' },
      { label: dateString + " 12:30am", value: '2' },
      { label: dateString + " 1:00am", value: '3' },
      { label: dateString + " 1:30am", value: '4' },
      { label: dateString + " 2:00am", value: '5' },
      { label: dateString + " 2:30am", value: '6' },
      { label: dateString + " 3:00am", value: '7' },
      { label: dateString + " 3:30am", value: '8' },
      { label: dateString + " 4:00am", value: '9' },
      { label: dateString + " 4:30am", value: '10' },
      { label: dateString + " 5:00am", value: '11' },
      { label: dateString + " 5:30am", value: '12' },
      { label: dateString + " 6:00am", value: '13' },
      { label: dateString + " 6:30am", value: '14' },
      { label: dateString + " 7:00am", value: '15' },
      { label: dateString + " 7:30am", value: '16' },
      { label: dateString + " 8:00am", value: '17' },
      { label: dateString + " 8:30am", value: '18' },
      { label: dateString + " 9:00am", value: '19' },
      { label: dateString + " 9:30am", value: '20' },
      { label: dateString + " 10:00am", value: '21' },
      { label: dateString + " 10:30am", value: '22' },
      { label: dateString + " 11:00am", value: '23' },
      { label: dateString + " 11:30am", value: '24' },
      { label: dateString + " 12:00pm", value: '25' },
      { label: dateString + " 12:30pm", value: '26' },
      { label: dateString + " 1:00pm", value: '27' },
      { label: dateString + " 1:30pm", value: '28' },
      { label: dateString + " 2:00pm", value: '29' },
      { label: dateString + " 2:30am", value: '30' },
      { label: dateString + " 3:00pm", value: '31' },
      { label: dateString + " 3:30pm", value: '32' },
      { label: dateString + " 4:00pm", value: '33' },
      { label: dateString + " 4:30am", value: '34' },
      { label: dateString + " 5:00pm", value: '35' },
      { label: dateString + " 5:30pm", value: '36' },
      { label: dateString + " 6:00pm", value: '37' },
      { label: dateString + " 6:30pm", value: '38' },
      { label: dateString + " 7:00pm", value: '39' },
      { label: dateString + " 7:30pm", value: '40' },
      { label: dateString + " 8:00pm", value: '41' },
      { label: dateString + " 8:30pm", value: '42' },
      { label: dateString + " 9:00pm", value: '43' },
      { label: dateString + " 9:30pm", value: '44' },
      { label: dateString + " 10:00pm", value: '45' },
      { label: dateString + " 10:30pm", value: '46' },
      { label: dateString + " 11:00pm", value: '47' },
      { label: dateString + " 11:30pm", value: '48' }]
    return this.fromTimeList;

  }
  createTimeField() {
    let record: any = [];
    var time = moment();
    var dt = new Date(1970, 0, 1, 0, 0, 0, 0);
    //record.push({ "label": "select", value: "" })
    while (dt.getDate() == 1) {
      var point = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      var value = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      dt.setMinutes(dt.getMinutes() + 30);
      record.push({
        "label": point, "value": moment(value, "hh:mm:ss a").format("HH:mm:ss")
      });
    }
    return record;
  }
  getstayHours() {
    let stayHours: any = [];
    let hours: number = 0;
    while (hours <= 168) {
      (hours == 0) ? stayHours.push({ label: "0 hrs", value: 0 }) : stayHours.push({ label: hours.toString() + " hrs", value: hours });
      hours < 24 ? hours++ : hours = hours + 12;
    }
    return stayHours;
  }
  getStayMinutes() {
    let stayMins: any = [];
    let mins: number = 0;
    while (mins <= 55) {
      mins == 0 ? stayMins.push({ label: "0 mins", value: 0 }) : stayMins.push({ label: mins.toString() + " mins", value: mins });
      mins += 5
    }
    return stayMins;
  }
 
  saveImageData(file, imageName) {
      let apiCreateEndpoint = '/storeImage';
      var locationCode = this.getCurrentLocation().locationCode;
      let fileNameParts = file.name.split('.');
      let extn=fileNameParts[fileNameParts.length-1];
      let fileName=file.name;
      if(extn){
        fileName =locationCode+"_"+imageName+"."+extn;
        fileName = fileName.replace(' ', '_');
      }else{fileName =locationCode+"_"+imageName;}

      const formData: FormData = new FormData();
      formData.append('imageName', fileName);
      formData.append('locationCode', locationCode);
      formData.append('uploadedFiles', file, fileName);
      
      const req = new HttpRequest('POST', apiCreateEndpoint, formData, {
        reportProgress: false // for progress data
      });
      return this.http.request(req);
  }
  
  getImageData(imageId) {
    return this.http.get("/images/"+imageId);
  }

  convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));
    if (time.indexOf('AM') != -1 && hours == 12) {
      time = time.replace('12', '0');
    }
    if (time.indexOf('PM') != -1 && hours < 12) {
      time = time.replace(hours, (hours + 12));
    }
    return time.replace(/(AM|PM)/, '');
  }

  getTimeZone() {
    this.fromTimeList = [
      { label: "Pacific Time Zone: PST", value: '1' },
      { label: "Mountain Time Zone MST", value: '2' },
      { label: "Central Time Zone: CST", value: '3' },
      { label: "Eastern Time Zone: EST", value: '4' }]
    return this.fromTimeList;
  }
  getColumnNameInSearch() {
    this.searchBy = [
      { label: 'LOC #', value: 'locationCode' },
      { label: 'Name', value: 'name' },
      { label: 'Address Line 1', value: 'address1' },
      { label: 'City', value: 'city' },
      { label: 'State', value: 'state' },
      { label: 'Ops Center', value: 'opsCenter' },
      { label: 'Region', value: 'region' }
    ];
    return this.searchBy;
  }
  getListOfAttributesByName(attributeDetails) {
    let urlParams: string = "";
    let filterBy: string = attributeDetails.columnName;
    let filterValue = attributeDetails.columnValue;
    urlParams = this.generateURLParams([{ id: 'filterBy', value: filterBy }
      , { id: 'filterValue', value: filterValue }]);
    //TO DO : check attribute details has name and value coming as not null .
    console.log(this.APIC_HOST + '/fuzzySearch' + urlParams);
    return this.http.get(this.APIC_HOST + '/fuzzySearch/locations' + urlParams);
  }

  saveOccupancy(occupancyData){
    return this.http.put(this.APIC_HOST+'/locations/'+this.getCurrentLocation().locationCode+'/occupancy',occupancyData);
  }
  getOccupancyData(){
    return this.http.get(this.APIC_HOST+'/locations/'+this.getCurrentLocation().locationCode+'/occupancy');
  }
}