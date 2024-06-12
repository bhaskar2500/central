import { Injectable } from '@angular/core';
import { HttpRequest, HttpParams, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import { AuthData } from './auth.model';
import { RatesModel } from '../../rate/rates.models';
import { Operational } from '../../operational/operational.model';
import { AddressDetails } from '../../operational/address-details/adress-details.model';
import { Notes } from '../../notes/notes.model';
import { Enforcement } from '../../enforcement/enforcement.component.model';


@Injectable()
export class UserApiInfoMockService implements HttpInterceptor {
    users: AuthData[];


    notes: Notes[] = [];
    rateDetails: RatesModel[];
    locationDetails: any[];
    channelPartnerList: any[];
    contactsList: any[];
    subsidiaryList: any[];
    referenceTableValues: any[];
    addressesList: any[];
    coordinates: any[];
    refTableDropData: any[];
    facilityType: any[];
    garageType: any[];
    serviceType: any[];
    supportedVehicleType: any[];
    availableAmenities: any[];
    locationSignage: any[];
    paymentOptions: any[];
    contactType: any[];
    contactAffiliations: any[];
    company: any[];
    addressType: any[];
    validationsMethods: any[];
    noteType: any[];
    verticalMarkets: any[];
    nationalAccount: any[];
    rateType: any[];
    increment: any[];
    locationAttributes: any[];
    companyList: any[];
    statesList: any[];
    enforcementFeeList: any[];
    facilityAccess: any[];
    timeData: any[] = [];
    addressTypeList: any[];
    revenueSystem: any[];

    constructor() {
        this.coordinates = [{ longitude: 7.809007, latittude: 51.678418 }]

        this.users = [{ networkId: 'bhaskar', password: 'bhaskar', token: 'bhaskar234234', userID: 1 }
            , { networkId: 'siva', password: 'siva', token: 'siva34234', userID: 1 }
            , { networkId: 'ssarkar', password: 'ssarkar', token: 'ssarkar234234', userID: 1 }
            , { networkId: 'gkalyan', password: 'gkalyan', token: 'rk234234', userID: 1 }];


        this.companyList = [
            { values: 'Prolifics' },
            { values: 'TCS' },
            { values: 'Indian Oil Corporation' },
            { values: 'Reliance Industries' },
            { values: 'Tata Motors' }
        ];

        this.rateDetails = [{
            "rateId": "", rateKey: new Date().getTime().toString(),
             activeStartDate: "", activeEndDate: "",
            "channel": "Channel", "increment": "", "price": 4335, "isActive": true, "rateType": "", "maxHours": 0
            , "maxDailyPrice": 646
            , entryTime: { start: "", end: "" }
            , "exitTime": { start: "", end: "" },
            selectedChannels:[]
            , combinable: false
            , nonRefundable: false
            ,selectedDaysData :"",selectedChannelsData:""
            , selectedDaysOfTheWeek: [{ dayName: "monActive", selected: true }, { dayName: "tueActive", selected: true }, { dayName: "wedActive", selected: false }
                , { dayName: "thursActive", selected: false }, { dayName: "friActive", selected: false }, { dayName: "satActive", selected: false }, { dayName: "sunActive", selected: false }]
        ,isActiveFormatted:""}]

        this.rateType = [{ label: "Hourly", value: "hourly" }, { label: "Up To", value: "upTo" }, { label: "Morning Special", value: "morningSpecial" }, { label: "Evening Special", value: "eveningSpecial" },
        { label: "Weekend", value: "weekend" }, { label: "Event", value: "event" }, { label: "Flex", value: "flex" }, { label: "Oversize", value: "Oversize" }, { label: "Bicycle", value: "Bicycle" }, { label: "Motorcycle/Scooter", value: "hourly" }, { label: "Other Special", value: "hourly" }]

        this.locationDetails = [
            { NewLocation: "", LocationCode: 114, Name: "CHAMPION PARKING 92 LLC", AddressLine: "Bay Area", City: "San Francisco", State: "Manhattan" },
            { NewLocation: "", LocationCode: 325, Name: "PARK KWIK LLC", AddressLine: "Bay Area", City: "New York", State: "Brooklyn" },
            { NewLocation: "", LocationCode: 282, Name: "282 SOUTH 5TH PARKING LLC", AddressLine: "Brown's Area", City: "Long Island", State: "Brooklyn" },
            { NewLocation: "", LocationCode: 920, Name: "BATTERY 17 PARKING LLC", AddressLine: "13th street", City: "Brooklyb", State: "Brooklyn" },
            { NewLocation: "", LocationCode: 921, Name: "C & C PARKING LOT CORP", AddressLine: "13th street", City: "New York", State: "Queens" },
            { NewLocation: "", LocationCode: 922, Name: "IMPERIAL PARKING (U.S)., LLC", AddressLine: "13th street", City: "New York", State: "Queens" },
            { NewLocation: "new.jpg", LocationCode: 923, Name: "GGG PARKING GARAGE CORP.", AddressLine: "13th street", City: "New York", State: "Queens" },
        ]
        this.channelPartnerList = [
            { channelPartnerKey: 123, isActive: true, name: 'sp+', partnerCode: '93', description: 'sample', subsidiary: ['sp+', 'google'], createdBy: 'sample', createdOn: 'sample', threshold: "" },
            { channelPartnerKey: 1123, isActive: true, name: 'google', partnerCode: '94', description: 'sample', subsidiary: [], createdBy: 'sample', createdOn: 'sample', threshold: "" }
        ];
        this.subsidiaryList = [
            { channelPartnerKey: 123, channelPartnerSubsidiaryKey: 123, name: 'sp+', subsidiaryCode: '95', description: "hi", discountPercentage: '456', isActive: true, discountAmount: "123", discount: 12 },
            { channelPartnerKey: 123, channelPartnerSubsidiaryKey: 1123, name: 'google', subsidiaryCode: '96', description: "hello", discountPercentage: '654', isActive: true, discountAmount: "321", discount: 13 }
        ];
        this.contactsList = [
            { contactId: 121, lastName: 'negi', firstName: 'sunidhi', title: 'sample', companyName: 'prolifics', contactTypeValue: 'mobile', priority: 'medium', email: 'abc@gmail.com', primaryPhoneValue: '12345' },
            { contactId: 122, lastName: 'sarkar', firstName: 'sohini', title: 'sample', companyName: 'prolifics', contactTypeValue: 'mobile', priority: 'medium', email: 'abc@gmail.com', primaryPhoneValue: '12345' }
        ];

        this.addressesList = [
            { addressKey: 121, addressType: "permannant", streetNo: "1", streetName: "sample", city: "New York", state: "New York", zipCode: "123", oneWayStreet: "sample", publish: 'sample', mapLocation: 'sample', active: 'active', address1: 'address1', address2: 'address2', zip: 'zip', oneWay: 'oneWay', isActive: true },
            { addressKey: 123, addressType: "temporary", streetNo: "2", streetName: "sample", city: "New York", state: "New York", zipCode: "123", oneWayStreet: "sample", publish: 'sample', mapLocation: 'sample', active: 'active', address1: 'address1', address2: 'address2', zip: 'zip', oneWay: 'oneWay', isActive: true }
        ];
        this.refTableDropData = [{ tableName: 'select' },
        { tableName: 'Facility Type', tableId: 2 },
        { tableName: 'Garage Type', tableId: 3 },
        { tableName: 'Service Type', tableId: 4 },
        { tableName: 'Supported Vehicle Type', tableId: 5 },
        { tableName: 'Available Amenities', tableId: 6 },
        { tableName: 'Location Signage', tableId: 7 },
        { tableName: 'Payment Options', tableId: 8 },
        { tableName: 'Contact Type', tableId: 9 },
        { tableName: 'Contact Affiliations', tableId: 10 },
        { tableName: 'Company', tableId: 11 },
        { tableName: 'Address Type', tableId: 12 },
        { tableName: 'Validations Methods', tableId: 13 },
        { tableName: 'Note Type', tableId: 14 },
        { tableName: 'Vertical Markets', tableId: 15 },
        { tableName: 'National Account', tableId: 16 },
        { tableName: 'Rate Type', tableId: 17 },
        { tableName: 'Increment', tableId: 18 },
        { tableName: 'Location Attributes', tableId: 19 }
        ];
        this.facilityType = [{ elementValue: 'sample1', elementId: '1' },
        { elementValue: 'sample1.1', elementId: '1.1' },];
        this.garageType = [{ elementValue: 'sample2', elementId: '2' },];
        this.serviceType = [{ elementValue: 'sample3', elementId: '3' },
        { elementValue: 'sample3.1', elementId: '3.1' }];
        this.facilityAccess = [{ elementValue: 'sample19', elementId: '19' },
        { elementValue: 'sample19.1', elementId: '19.1' }];
        this.supportedVehicleType = [{ elementValue: 'sample4', elementId: '4' },];
        this.availableAmenities = [{ elementValue: 'sample5', elementId: '5' },];
        this.locationSignage = [{ elementValue: 'sample6', elementId: '6' },];
        this.paymentOptions = [{ elementValue: 'sample7', elementId: '7' },];
        this.contactType = [{ elementValue: 'sample8', elementId: '8' },];
        this.contactAffiliations = [
            { elementValue: 'sample9', elementId: '9' },
            { elementValue: 'sample9.1', elementId: '9.1' }
        ];
        this.company = [{ elementValue: 'sample10', elementId: '10' },];
        this.addressType = [{ label: 'sample11', value: 'sample11' },];
        this.validationsMethods = [{ elementValue: 'sample12', elementId: '12' },
        { elementValue: 'sample12.1', elementId: '12.1' }];
        this.noteType = [{ label: 'VIP', value: 'VIP' }, { label: 'General', value: 'General' }];
        this.verticalMarkets = [{ elementValue: 'sample14', elementId: '14' },];
        this.nationalAccount = [{ elementValue: 'sample15', elementId: '15' },];
        this.increment = [{ elementValue: 'sample17', elementId: '17' },];
        this.locationAttributes = [{ elementValue: 'sample18', elementId: '18' },];


        this.statesList = [
            { label: 'Alabama', value: 'alabama' },
            { label: 'Alaska', value: 'alaska' },
            { label: 'Arizona', value: 'arizona' },
            { label: 'Arkansas', value: 'arkansas' },
            { label: 'California', value: 'california' },
            { label: 'Colorado', value: 'colorado' },
            { label: 'Connecticut', value: 'connecticut' },
            { label: 'Delaware', value: 'delaware' },
            { label: 'Florida', value: 'florida' },
            { label: 'Georgia', value: 'georgia' },
            { label: 'Hawaii', value: 'hawaii' },
            { label: 'Idaho', value: 'idaho' },
            { label: 'Illinois', value: 'illinois' },
            { label: 'Indiana', value: 'indiana	' },
            { label: 'Iowa', value: 'iowa' },
            { label: 'Kansas', value: 'kansas' },
            { label: 'Kentucky[E]', value: 'kentucky[E]' },
            { label: 'Louisiana', value: 'louisiana' },
            { label: 'Maine', value: 'maine' },
            { label: 'Maryland', value: ' maryland' },
            { label: 'Massachusetts', value: 'massachusetts' },
            { label: 'Michigan', value: '  michigan' },
            { label: 'Minnesota', value: 'Minnesota' },
            { label: 'Mississippi', value: 'mississippi' },
            { label: 'Missouri	', value: 'missouri' },
            { label: 'montana', value: 'montana' },
            { label: 'Nebraska	', value: 'nebraska	' },
            { label: 'Nevada', value: 'nevada' },
            { label: 'New Hampshire', value: 'newhampshire' },
            { label: 'New Jersey', value: 'newjersey' },
            { label: 'New Mexico', value: 'newmexico' },
            { label: 'New York', value: 'newyork' },
            { label: 'North Carolina', value: 'northcarolina' },
            { label: 'North Dakota', value: 'northdakota' },
            { label: 'Ohio', value: 'ohio' },
            { label: 'Oklahoma	', value: 'oklahoma' },
            { label: 'Oregon', value: 'oregon' },
            { label: 'Pennsylvania', value: 'pennsylvania' },
            { label: 'Rhode Island', value: 'rhodeisland' },
            { label: 'South Carolina', value: 'southcarolina' },
            { label: 'South Dakota', value: 'southdakota' },
            { label: 'Tennessee', value: 'tennessee' },
            { label: 'Texas', value: 'texas' },
            { label: 'Utah', value: 'utah' },
            { label: 'Vermont', value: 'vermont' },
            { label: 'Virginia', value: ' virginia	' },
            { label: 'Washington', value: 'washington' },
            { label: 'West Virginia', value: 'westvirginia' },
            { label: 'Wisconsin', value: 'wisconsin' },
            { label: 'Wyoming', value: 'wyoming' }
        ];
        this.revenueSystem = [{ label: 'PT70', value: 'PT70' }, { label: 'Sales Audit', value: 'Sales Audit' },
        { label: 'Telerev/Sales Audit', value: 'Telerev/Sales Audit' }, { label: 'Daily Revenue', value: 'Daily Revenue' }, { label: 'PT70/Sales Audit', value: 'PT70/Sales Audit' }, { label: 'No Revenue', value: 'No Revenue' }]
        this.enforcementFeeList = [
            { feeKey: 199, rateKey: 1, rateDescription: "rateDescription", rate: "rate", publish: "publish", active: true },
            { feeKey: 200, rateKey: 2, rateDescription: "rateDescription", rate: "rate", publish: "publish", active: true }
            , { feeKey: 1, rateKey: 1, rateDescription: "rateDescription", rate: "rate", publish: "publish", active: true },
            { feeKey: 2, rateKey: 3, rateDescription: "rateDescription", rate: "rate", publish: "publish", active: true }
            , { feeKey: 12, rateKey: 1, rateDescription: "rateDescription", rate: "rate", publish: "publish", active: true },
            { feeKey: 14, rateKey: 3, rateDescription: "rateDescription", rate: "rate", publish: "publish", active: true }
        ];
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return Observable.of(null).mergeMap(() => {

            if (request.url.endsWith('/api/users') && request.method === 'GET') {
                return Observable.of(new HttpResponse({ status: 200, body: this.users }));
            }
            if (request.url.includes("/notes") && request.method === 'POST') {
                this.notes = request.body;
                console.log(this.notes)
                return Observable.of(new HttpResponse({ status: 200, body: this.notes }));
            }
            if (request.url.endsWith('/api/getAvailableLocations') && request.method === 'GET') {
                return Observable.of(new HttpResponse({ status: 200, body: this.locationDetails }));
            }


            if (request.url.includes('/api/getMarketingInformation') && request.method === 'GET') {
                var code = this.get(request.url, 'locationCode');
                var key = code + '.marketingInformation';
                var value = window.localStorage[key];
                var marketingInformation = value ? JSON.parse(value) : "";
                return Observable.of(new HttpResponse({ status: 200, body: marketingInformation }));
            }
            if (request.url.endsWith('/api/saveMarketingInformation') && request.method === 'POST') {
                var code: string = request.body['locationCode'];
                var key = code + '.marketingInformation';
                window.localStorage[key] = JSON.stringify(request.body);
                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }
            if (request.url.includes('/api/getCapacity') && request.method === 'GET') {
                var code = this.get(request.url, 'locationCode');
                var key = code + '.capacity';
                var value = window.localStorage[key];
                var capacity = value ? JSON.parse(value) : "";
                return Observable.of(new HttpResponse({ status: 200, body: capacity }));
            }
            if (request.url.endsWith('/api/saveCapacity') && request.method === 'POST') {
                var code: string = request.body['locationCode'];
                var key = code + '.capacity';
                window.localStorage[key] = JSON.stringify(request.body);
                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }
            if (request.url.includes('/api/getEnforcement') && request.method === 'GET') {
                var code = this.get(request.url, 'locationCode');
                var key = code + '.enforcement';
                var value = window.localStorage[key];
                var enforcement: Enforcement = value ? JSON.parse(value) : "";
                if (enforcement) {
                    var parkingFees = [];
                    var adminFees = [];
                    var violationFees = [];
                    this.enforcementFeeList.forEach((element) => {
                        if (element.rateKey == 1) { parkingFees.push(element); }
                        else if (element.rateKey == 2) { adminFees.push(element); }
                        else if (element.rateKey == 3) { violationFees.push(element); }
                    });
                    enforcement.parkingFees = parkingFees;
                    enforcement.adminFees = adminFees;
                    enforcement.violationFees = violationFees;
                }
                return Observable.of(new HttpResponse({ status: 200, body: enforcement }));
            }
            if (request.url.endsWith('/api/saveEnforcement') && request.method === 'POST') {
                var code: string = request.body['locationCode'];
                var key = code + '.enforcement';
                window.localStorage[key] = JSON.stringify(request.body);
                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }

            if (request.url.includes('/api/getFeeDetailsForLocation') && request.method === 'GET') {
                var key = this.get(request.url, 'feeKey');
                let feeDetails = this.enforcementFeeList.find(
                    function (feeDetails) {
                        return feeDetails.feeKey == key;
                    }
                );
                return Observable.of(new HttpResponse({ status: 200, body: feeDetails }));
            }

            if (request.url.includes('/api/getFeeDetails') && request.method === 'GET') {
                var code = this.get(request.url, 'locationCode');
                var key = code + '.feeDetails';
                var value = window.localStorage[key];
                var feeDetails = value ? JSON.parse(value) : "";
                return Observable.of(new HttpResponse({ status: 200, body: feeDetails }));
            }


            if (request.url.includes('/api/getOperational') && request.method === 'GET') {
                var code = this.get(request.url, 'locationCode');
                var key = code + '.operational';
                var value = window.localStorage[key];
                var operational = value ? JSON.parse(value) : "";
                return Observable.of(new HttpResponse({ status: 200, body: operational }));
            }
            if (request.url.endsWith('/api/saveOperational') && request.method === 'POST') {
                var code: string = request.body['locationCode'];
                var key = code + '.operational';
                window.localStorage[key] = JSON.stringify(request.body);
                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }

            if (request.url.includes('/api/getOperational') && request.method === 'GET') {
                var code = this.get(request.url, 'locationCode');
                var key = code + '.operational';
                var value = window.localStorage[key];
                var operational = value ? JSON.parse(value) : "";
                return Observable.of(new HttpResponse({ status: 200, body: operational }));
            }
            if (request.url.endsWith('/api/saveOperational') && request.method === 'POST') {
                var code: string = request.body['locationCode'];
                var key = code + '.operational';
                window.localStorage[key] = JSON.stringify(request.body);
                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }
            if (request.url.includes('/api/getAddressDetails') && request.method === 'GET') {
                var code = this.get(request.url, 'locationCode');
                var key = code + '.addressDetails';
                var value = window.localStorage[key];
                var addressDetails = value ? JSON.parse(value) : "";
                return Observable.of(new HttpResponse({ status: 200, body: addressDetails }));
            }

            if (request.url.includes('/api/getMerchantIDData') && request.method === 'GET') {
                var code = this.get(request.url, 'locationCode');
                var key = code + '.merchantIDData';
                var value = window.localStorage[key];
                var merchantIDData = value ? JSON.parse(value) : "";
                return Observable.of(new HttpResponse({ status: 200, body: merchantIDData }));
            }

            if (request.url.endsWith('/api/saveMerchantIDData') && request.method === 'POST') {
                var code: string = request.body['locationCode'];
                var key = code + '.merchantIDData';
                window.localStorage[key] = JSON.stringify(request.body);

                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }

            if (request.url.includes('/api/getFeaturesDetails') && request.method === 'GET') {
                var code = this.get(request.url, 'locationCode');
                var key = code + '.featuresDetails';
                var value = window.localStorage[key];
                var featuresDetails = value ? JSON.parse(value) : "";
                return Observable.of(new HttpResponse({ status: 200, body: featuresDetails }));
            }

            if (request.url.endsWith('saveFeaturesDetails') && request.method === 'POST') {
                var code: string = request.body['locationCode'];
                var key = code + '.featuresDetails';
                window.localStorage[key] = JSON.stringify(request.body);

                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }
            if (request.url.endsWith('/api/saveContactDetails') && request.method === 'POST') {
                var key: string = request.body['contactId'];
                if (key == undefined) {
                    request.body["contactId"] = new Date().getTime().toString();
                    this.contactsList.push(request.body);
                }

                else {
                    this.contactsList.forEach((contactDetails) => {
                        if (contactDetails.contactId == key) {
                            var index = this.contactsList.indexOf(contactDetails);
                            this.contactsList[index] = request.body;
                        }
                    });
                }

                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }

            if (request.url.endsWith('/api/saveFeeDetails') && request.method === 'POST') {
                var key: string = request.body['feeKey'];
                if (key == "undefined") {
                    request.body["feeKey"] = new Date().getTime().toString();
                    this.enforcementFeeList.push(request.body);
                }

                else {
                    this.enforcementFeeList.forEach((feeDetails) => {
                        if (feeDetails.feeKey == key) {
                            var index = this.enforcementFeeList.indexOf(feeDetails);
                            this.enforcementFeeList[index] = request.body;
                        }
                    });
                }

                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }

            if (request.url.endsWith('/api/saveAddressDetails') && request.method === 'POST') {
                var key: string = request.body['addressKey'];
                if (key == "") {
                    request.body["addressKey"] = new Date().getTime().toString();
                    this.addressesList.push(request.body);
                }

                else {
                    this.addressesList.forEach((addressDetails) => {
                        if (addressDetails.addressKey == key) {
                            var index = this.addressesList.indexOf(addressDetails);
                            this.addressesList[index] = request.body;
                        }
                    });
                }

                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }


            if (request.url.includes('/api/getChannelPartnerList') && request.method === 'GET') {

                return Observable.of(new HttpResponse({ status: 200, body: this.channelPartnerList }));
            }
            if (request.url.endsWith('/api/saveModifiedRateDetails') && request.method === 'POST') {
                let index: number = this.rateDetails.findIndex((i) =>
                    i.rateKey == request.body["rateKey"]
                );
                if (index === -1) {
                    request.body["rateKey"] = new Date().getTime().toString();
                    this.rateDetails.push(request.body);
                }
                else {
                    this.rateDetails[index] = request.body;
                }
                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }
            if (request.url.includes('/api/getChannelPartnerInformation') && request.method === 'GET') {
                var key = this.get(request.url, 'channelPartnerKey');
                let channelPartner = this.channelPartnerList.find(
                    function (channelPartner) {
                        return channelPartner.channelPartnerKey == key;
                    }
                );
                return Observable.of(new HttpResponse({ status: 200, body: channelPartner }));
            }
            if (request.url.includes('/api/getListOfSubsidiariesByChannelPartner') && request.method === 'GET') {
                var key = this.get(request.url, 'channelPartnerKey');
                var newSubsidiary: any[] = [];
                this.subsidiaryList.forEach(function (subsidiaryInformation) {
                    if (subsidiaryInformation.channelPartnerKey == key) {
                        newSubsidiary.push(subsidiaryInformation)
                    }
                });

                return Observable.of(new HttpResponse({ status: 200, body: newSubsidiary }));
            }
            if (request.url.includes('/api/getSubsidiaryInformation') && request.method === 'GET') {
                var key = this.get(request.url, 'channelPartnerSubsidiaryKey');
                let subsidiaries = this.subsidiaryList.find(
                    function (subsidiaries) {
                        return subsidiaries.channelPartnerSubsidiaryKey == key;
                    }
                );
                return Observable.of(new HttpResponse({ status: 200, body: subsidiaries }));
            }
            if (request.url.endsWith('/api/saveChannelPartnerInformation') && request.method === 'POST') {
                var key: string = request.body['channelPartnerKey'];
                if (key == undefined) {
                    request.body["channelPartnerKey"] = new Date().getTime().toString();
                    this.channelPartnerList.push(request.body);
                }
                else {
                    this.channelPartnerList.forEach((channelPartnerInformation) => {
                        if (channelPartnerInformation.channelPartnerKey == key) {
                            var index = this.channelPartnerList.indexOf(channelPartnerInformation);
                            this.channelPartnerList[index] = request.body;
                        }
                    });
                }
                // window.localStorage[key] = JSON.stringify(request.body);
                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }
            if (request.url.endsWith('/api/saveSubsidiaryInformation') && request.method === 'POST') {
                var key: string = request.body['channelPartnerSubsidiaryKey'];
                if (key == undefined) {
                    request.body["channelPartnerSubsidiaryKey"] = new Date().getTime().toString();
                    this.subsidiaryList.push(request.body);
                }
                else {
                    this.subsidiaryList.forEach((subsidiaryInformation) => {
                        if (subsidiaryInformation.channelPartnerSubsidiaryKey == key) {
                            var index = this.subsidiaryList.indexOf(subsidiaryInformation);
                            this.subsidiaryList[index] = request.body;
                        }
                    });
                }
                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }
            if (request.url.includes('/api/getListOfReferenceTableValue') && request.method === 'GET') {

                return Observable.of(new HttpResponse({ status: 200, body: this.referenceTableValues }));
            }
            if (request.url.includes('/api/getReferenceTableManagement') && request.method === 'GET') {
                var value = window.localStorage['referenceTableDropdown'];
                var referenceDropdown = value ? JSON.parse(value) : "";
                return Observable.of(new HttpResponse({ status: 200, body: referenceDropdown }));
            }
            if (request.url.includes('/api/getRefTableDropDownData') && request.method === 'GET') {
                return Observable.of(new HttpResponse({ status: 200, body: this.refTableDropData }));

            }
            if (request.url.includes('/api/getListOfReferenceTableValue') && request.method === 'GET') {
                return Observable.of(new HttpResponse({ status: 200, body: this.refTableDropData }));

            }
            // if (request.url.endsWith('/api/saveReferenceTableManagement') && request.method === 'POST') {
            //     window.localStorage['referenceTableDropdown'] = JSON.stringify(request.body);
            //     return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            // }
            if (request.url.endsWith('/api/saveNewDataInReferenceTable') && request.method === 'POST') {
                var code: string = request.body['tableName'];
                var result = [];
                switch (code) {
                    case 'Facility Type': {
                        request.body.elements.forEach((element) => {
                            var facilityTypeKey = new Date().getTime().toString();
                            this.facilityType.push({
                                "elementValue": element.elementValue,
                                "elementId": facilityTypeKey
                            });
                        });
                        result = this.facilityType;
                        break;
                    }
                    case 'Garage Type': {
                        request.body.elements.forEach((element) => {
                            var garageTypeKey = new Date().getTime().toString();
                            this.garageType.push({
                                "elementValue": element.elementValue,
                                "elementId": garageTypeKey
                            });
                        });
                        result = this.garageType;
                        break;
                    }
                    case 'Service Type': {
                        request.body.elements.forEach((element) => {
                            var serviceTypeKey = new Date().getTime().toString();
                            this.serviceType.push({
                                "elementValue": element.elementValue,
                                "elementId": serviceTypeKey
                            });
                        });
                        result = this.serviceType;
                        break;
                    }
                    case 'Supported Vehicle Type': {
                        request.body.elements.forEach((element) => {
                            var supportedVehicleTypeKey = new Date().getTime().toString();
                            this.supportedVehicleType.push({
                                "elementValue": element.elementValue,
                                "elementId": supportedVehicleTypeKey
                            });
                        });
                        result = this.supportedVehicleType;
                        break;
                    }
                    case 'Available Amenities': {
                        request.body.elements.forEach((element) => {
                            var AmenityKey = new Date().getTime().toString();
                            this.availableAmenities.push({
                                "elementValue": element.elementValue,
                                "elementId": AmenityKey
                            });
                        });
                        result = this.availableAmenities;
                        break;
                    }
                    case 'Location Signage': {
                        request.body.elements.forEach((element) => {
                            var signageKey = new Date().getTime().toString();
                            this.locationSignage.push({
                                "elementValue": element.elementValue,
                                "elementId": signageKey
                            });
                        });
                        result = this.locationSignage;
                        break;
                    }
                    case 'Payment Options': {
                        request.body.elements.forEach((element) => {
                            var paymentOptionKey = new Date().getTime().toString();
                            this.paymentOptions.push({
                                "elementValue": element.elementValue,
                                "elementId": paymentOptionKey
                            });
                        });
                        result = this.paymentOptions;
                        break;
                    }
                    case 'Contact Type': {
                        request.body.elements.forEach((element) => {
                            var contactTypeKey = new Date().getTime().toString();
                            this.contactType.push({
                                "elementValue": element.elementValue,
                                "elementId": contactTypeKey
                            });
                        });
                        result = this.contactType;
                        break;
                    }
                    case 'Contact Affiliations': {
                        request.body.elements.forEach((element) => {
                            var contactAffiliationKey = new Date().getTime().toString();
                            this.contactAffiliations.push({
                                "elementValue": element.elementValue,
                                "elementId": contactAffiliationKey
                            });
                        });
                        result = this.contactAffiliations;
                        break;
                    }
                    case 'Company': {
                        request.body.elements.forEach((element) => {
                            var companyKey = new Date().getTime().toString();
                            this.company.push({
                                "elementValue": element.elementValue,
                                "elementId": companyKey
                            });
                        });
                        result = this.company;
                        break;
                    }
                    case 'Address Type': {
                        request.body.elements.forEach((element) => {
                            var addressTypeKey = new Date().getTime().toString();
                            this.addressType.push({
                                "elementValue": element.elementValue,
                                "elementId": addressTypeKey
                            });
                        });
                        result = this.addressType;
                        break;
                    }
                    case 'Validations Methods': {
                        request.body.elements.forEach((element) => {
                            var validationsMethodsKey = new Date().getTime().toString();
                            this.validationsMethods.push({
                                "elementValue": element.elementValue,
                                "elementId": validationsMethodsKey
                            });
                        });
                        result = this.validationsMethods;
                        break;
                    }
                    case 'Note Type': {
                        request.body.elements.forEach((element) => {
                            var noteTypeKey = new Date().getTime().toString();
                            this.noteType.push({
                                "elementValue": element.elementValue,
                                "elementId": noteTypeKey
                            });
                        });
                        result = this.noteType;
                        break;
                    }
                    case 'Vertical Markets': {
                        request.body.elements.forEach((element) => {
                            var verticalMarketsKey = new Date().getTime().toString();
                            this.verticalMarkets.push({
                                "elementValue": element.elementValue,
                                "elementId": verticalMarketsKey
                            });
                        });
                        break;
                    }
                    case 'National Account': {
                        request.body.elements.forEach((element) => {
                            var nationalAccountKey = new Date().getTime().toString();
                            this.nationalAccount.push({
                                "elementValue": element.elementValue,
                                "elementId": nationalAccountKey
                            });
                        });
                        result = this.nationalAccount;
                        break;
                    }
                    case 'Rate Type': {
                        request.body.elements.forEach((element) => {
                            var rateTypeKey = new Date().getTime().toString();
                            this.rateType.push({
                                "elementValue": element.elementValue,
                                "elementId": rateTypeKey
                            });
                        });
                        result = this.rateType;
                        break;
                    }
                    case 'Increment': {
                        request.body.elements.forEach((element) => {
                            var incrementKey = new Date().getTime().toString();
                            this.increment.push({
                                "elementValue": element.elementValue,
                                "elementId": incrementKey
                            });
                        });
                        result = this.increment;
                        break;
                    }
                    case 'Location Attributes': {
                        request.body.elements.forEach((element) => {
                            var locationAttributesKey = new Date().getTime().toString();
                            this.locationAttributes.push({
                                "elementValue": element.elementValue,
                                "elementId": locationAttributesKey
                            });
                        });
                        result = this.locationAttributes;
                        break;
                    }
                }
                return Observable.of(new HttpResponse({ status: 200, body: result }));
            }
            if (request.url.includes('/api/getTableValuesByTableName') && request.method === 'GET') {
                var code: string = this.get(request.url, 'selectedTableName');
                var result = [];
                switch (code) {
                    case 'Facility Type': {
                        result = this.facilityType;
                        break;
                    }
                    case 'Garage Type': {
                        result = this.garageType;
                        break;
                    }
                    case 'Service Type': {
                        result = this.serviceType;
                        break;
                    }
                    case 'Facility Access': {
                        result = this.facilityAccess;
                        break;
                    }
                    case 'Supported Vehicle Type': {
                        result = this.supportedVehicleType;
                        break;
                    }
                    case 'Available Amenities': {
                        result = this.availableAmenities;
                        break;
                    }
                    case 'Location Signage': {
                        result = this.locationSignage;
                        break;
                    }
                    case 'Payment Options': {
                        result = this.paymentOptions;
                        break;
                    }
                    case 'Contact Type': {
                        result = this.contactType;
                        break;
                    }
                    case 'Contact Affiliations': {
                        result = this.contactAffiliations;
                        break;
                    }
                    case 'Company': {
                        result = this.company;
                        break;
                    }
                    case 'Address Type': {
                        result = this.addressType;
                        break;
                    }
                    case 'Validations Methods': {
                        result = this.validationsMethods;
                        break;
                    }
                    case 'Note Type': {
                        result = this.noteType;
                        break;
                    }
                    case 'Vertical Markets': {
                        result = this.verticalMarkets;
                        break;
                    }
                    case 'National Account': {
                        result = this.nationalAccount;
                        break;
                    }
                    case 'Rate Type': {
                        result = this.rateType;
                        break;
                    }
                    case 'Increment': {
                        result = this.increment;
                        break;
                    }
                    case 'Location Attributes': {
                        result = this.locationAttributes
                            ;
                        break;
                    }
                }
                return Observable.of(new HttpResponse({ status: 200, body: result }));
            }

            if (request.url.includes('/api/getCompanyList') && request.method == 'GET') {
                let key = this.get(request.url, 'q');
                let filteredResults = [];
                if (this.companyList && this.companyList.length > 0)
                    for (var i = 0; i < this.companyList.length; i++) {
                        let element = this.companyList[i];

                        if (element.values.includes(key)) {
                            filteredResults.push(element.values);
                        }
                    }
                return Observable.of(new HttpResponse({ status: 200, body: filteredResults }));
            }

            if (request.url.includes('/api/getaccountList') && request.method == 'GET') {
                let key = this.get(request.url, 'q');
                let filteredResults = [];
                if (this.nationalAccount && this.nationalAccount.length > 0)
                    for (var i = 0; i < this.nationalAccount.length; i++) {
                        let element = this.nationalAccount[i];

                        if (element.elementValue.includes(key)) {
                            filteredResults.push(element.elementValue);
                        }
                    }
                return Observable.of(new HttpResponse({ status: 200, body: filteredResults }));
            }

            // if (request.url.endsWith('/api/saveRateDetailsByID') && request.method === 'POST') {
            //     window.localStorage['ratesKey'] = JSON.stringify(request.body);
            //     return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            // }
            if (request.url.endsWith('api/getcoordinates') && request.method === 'GET') {
                return Observable.of(new HttpResponse({ status: 200, body: this.coordinates }));
            }
            // if (request.url.endsWith('/api/getTimeFields') && request.method === 'GET') {
            //     console.log('entered /api/getTimeFields');
            //     this.timeData = this.createTimeField(this.timeData);
            //     console.log('Exit /api/getTimeFields', this.timeData);
            //     return Observable.of(new HttpResponse({ status: 200, body: this.timeData }));
            // }
            // if (request.url.match(/(locations)\/(\d+)\/(rates)$/) != null && request.url.match(/(locations)\/(\d+)\/(rates)/).length > 0 && request.method === 'GET') {
            //     return Observable.of(new HttpResponse({ status: 200, body: this.rateDetails }));
            // }
            // if (request.url.match(/(locations)\/(\d+)\/(rates)\/ratesID$/) != null && request.url.match(/(locations)\/(\d+)\/(rates)\/ratesID$/).length > 0 && request.method === 'GET') {
            //     console.log('entered finally');
            //     let key: String = this.getKey(request.url)
            //     let record: any = this.rateDetails
            //         .filter(record => record.rateKey == key)[0];
            //     return Observable.of(new HttpResponse({
            //         status: 200, body: this.rateDetails
            //             .filter(record => record.rateKey == key)[0]
            //     }));
            // }

            if (request.url.includes('/api/getListOfContacts') && request.method === 'GET') {


                return Observable.of(new HttpResponse({ status: 200, body: this.contactsList }));
            }
            if (request.url.includes('/api/getContactDetailsByContactKey') && request.method === 'GET') {
                var key = this.get(request.url, 'contactId');
                let contactsDetails = this.contactsList.find(
                    function (contactsDetails) {
                        return contactsDetails.contactId == key;
                    }
                );

                return Observable.of(new HttpResponse({ status: 200, body: contactsDetails }));
            }

            if (request.url.endsWith('api/getAddressesList') && request.method === 'GET') {
                return Observable.of(new HttpResponse({ status: 200, body: this.addressesList }));
            }
            if (request.url.endsWith('/api/saveParkingFeeRates') && request.method === 'POST') {
                window.localStorage['parkingKey'] = JSON.stringify(request.body);
                return Observable.of(new HttpResponse({ status: 200, body: request.body }));
            }

            if (request.url.includes('api/getAddressDetailsByIDAddressKey') && request.method === 'GET') {
                var key = this.get(request.url, 'addressKey');
                let addressDetails = this.addressesList.find(
                    function (addressDetails) {
                        return addressDetails.addressKey == key;
                    }
                );
                return Observable.of(new HttpResponse({ status: 200, body: addressDetails }));
            }

            if (request.url.includes('/api/getListOfStates') && request.method === 'GET') {

                return Observable.of(new HttpResponse({ status: 200, body: this.statesList }));

            }
            if (request.url.includes('/api/getRevenueSystem') && request.method === 'GET') {

                return Observable.of(new HttpResponse({ status: 200, body: this.revenueSystem }));

            }

            if (request.url.includes('/api/getcontactaffiliationsListByRefTable') && request.method === 'GET') {
                return Observable.of(new HttpResponse({ status: 200, body: this.contactAffiliations }));
            }
            return next.handle(request);
        })
            // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .materialize()
            .delay(500)
            .dematerialize();
    }

    private get(url, name) {

        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(url))
            return decodeURIComponent(name[1]);
    }
    private getKey(url) {

        var match = url.match(/\/(\d+)/);
        if (match) {
            return match[1];
        }
    }

}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: UserApiInfoMockService,
    multi: true
};