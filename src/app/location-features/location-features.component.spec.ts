import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import {DropdownModule} from 'primeng/dropdown';
import {FieldsetModule} from 'primeng/primeng';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {PaginatorModule} from 'primeng/paginator';
import {InputMaskModule} from 'primeng/inputmask';
import {CheckboxModule} from 'primeng/checkbox';
import {DataTableModule} from 'primeng/datatable';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AuthService } from '../shared/auth/auth.service';
import { NoAuthGuard } from '../shared/auth/auth-no-guard.service';
import { JwtService } from '../shared/auth/jwt.service';


import { RouterModule,Routes} from '@angular/router';
import { MerchantId} from '../merchantId/merchantId';
import { AppComponent } from '../app.component';
import { HeaderComponent } from '../shared/layout/header/header.component';
import { FooterComponent } from '../shared/layout/footer/footer.component';
import { LoginComponent } from '../shared/auth/login/login.component';
import {ChannelManagement} from '../channelManagement/channelManagement';
import {ChannelPartnerDetails} from '../channelManagement/channelPartnerDetails/channelPartnerDetails';
import {SubsidiaryDetails} from '../channelManagement/subsidiaryDetails/subsidiaryDetails';
import { ReferenceTableManagement} from '../referenceTableManagement/referenceTableManagement';

import { MarketingInformationComponent } from '../marketing-information/marketing-information.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { LocationFeaturesComponent } from './location-features.component';
import { EnforcementComponent } from '../enforcement/enforcement.component';
import { FeeDetailsComponent } from '../fee-details/fee-details.component';
import { OperationalComponent } from '../operational/operational.component';
import { AddressDetailsComponent } from '../address-details/address-details.component';
import { MessageService} from 'primeng/components/common/messageservice';
import { NotesComponent } from '../notes/notes.component';
import {rootRouterConfig} from '../shared/app.routes';
import { RateComponent } from '../rate/rate.component'
import { LocationSearchComponent } from '../location-search/location-search.component'
import { LocationDetailsComponent } from '../location-details/location-details.component'
import { Capacity } from '../capacity/app.capacity';
import { APP_BASE_HREF } from '@angular/common';
describe('LocationFeaturesComponent', () => {
  let component: LocationFeaturesComponent;
  let fixture: ComponentFixture<LocationFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    MerchantId,
    NotesComponent,
    RateComponent,
    MarketingInformationComponent,
    ChannelManagement,
    ChannelPartnerDetails,
    SubsidiaryDetails,
    ReferenceTableManagement,
	  ContactsComponent,
	  ContactDetailsComponent,
	  LocationFeaturesComponent,
	  EnforcementComponent,
	  FeeDetailsComponent,
	  Capacity,
    LocationSearchComponent,
    LocationDetailsComponent,
    OperationalComponent,
    AddressDetailsComponent
      ],
     imports: [
    BrowserModule
  , BrowserAnimationsModule
  , RouterModule.forRoot(rootRouterConfig)
	// , InputTextModule
	, ButtonModule
	, FormsModule
	, ReactiveFormsModule
	,FieldsetModule
  ,DropdownModule
  ,CheckboxModule
  ,DataTableModule
  ,PaginatorModule
,InputMaskModule, MessagesModule, MessageModule,HttpClientModule
],
      providers :[AuthService,JwtService,MessageService,
       {provide: APP_BASE_HREF, useValue: '/'} ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have 2 text area', () => {
    const compiled= fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('textarea').length==2).toBeTruthy();
  });
   it('should have 7 text fields', () => {
    const compiled= fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('input[type="text"]').length==7).toBeTruthy();
  });
    it('should have save button and cancel button', () => {
    const compiled= fixture.debugElement.nativeElement;
    var saveButton=false;
    var cancelButton=false;
    var buttons=compiled.querySelectorAll('button');
    compiled.querySelectorAll('button').forEach(function(button){

   if(!saveButton)
          saveButton =  button.getAttribute('label') == "Save Feature Updates"   ;
   if(!cancelButton)
      cancelButton = button.getAttribute('label') == "Cancel"  ;

    } )
    expect(saveButton && cancelButton).toBeTruthy();
  });

  it('should have validate text fields', () => {
    const compiled= fixture.debugElement.nativeElement;
    compiled.querySelectorAll('button').forEach(function(button){
     if(button.getAttribute('label') == "Save Feature Updates" ){
       button.click();;
     }
    fixture.detectChanges();
    console.log(compiled.getElementsByClassName('span'));
    expect( compiled.getElementsByClassName('span').length>0).toBeTruthy();
    });

  });

});
