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
import { AppComponent } from '../../app.component';
import { HeaderComponent } from '../../shared/layout/header/header.component';
import { FooterComponent } from '../../shared/layout/footer/footer.component';
import { LoginComponent } from '../../shared/auth/login/login.component';
import { MerchantId } from '../../merchantId/merchantId';
import { NotesComponent } from '../../notes/notes.component';
import { RateComponent } from '../../rate/rate.component';
import { MarketingInformationComponent } from '../../marketing-information/marketing-information.component';
import { ChannelManagement } from '../channelManagement';
import { ChannelPartnerDetails } from '../channelPartnerDetails/channelPartnerDetails';
import { SubsidiaryDetails } from './subsidiaryDetails';
import { ReferenceTableManagement } from '../../referenceTableManagement/referenceTableManagement';
import { ContactsComponent } from '../../contacts/contacts.component';
import { ContactDetailsComponent } from '../../contact-details/contact-details.component';
import { LocationFeaturesComponent } from '../../location-features/location-features.component';
import { EnforcementComponent } from '../../enforcement/enforcement.component';
import { FeeDetailsComponent } from '../../fee-details/fee-details.component';
import { Capacity } from '../../capacity/app.capacity';
import { LocationSearchComponent } from '../../location-search/location-search.component';
import { LocationDetailsComponent } from '../../location-details/location-details.component';
import { OperationalComponent } from '../../operational/operational.component';
import { AddressDetailsComponent } from '../../address-details/address-details.component';
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from '../../shared/app.routes';
import { AuthService } from '../../shared/auth/auth.service';
import { JwtService } from '../../shared/auth/jwt.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { APP_BASE_HREF } from '@angular/common';
/* 
Test cases:
1. TestCase for total text fields in screen.
2. TestCase for total checkboxes in screen.
3. TestCase for total fieldsets in screen.
4. TestCase for Save and Cancel Button.
5. TestCase for component availability.
6. TestCase for total buttons in screen.
*/


describe('SubsidiaryDetails', () => {
  let component: SubsidiaryDetails;
  let fixture: ComponentFixture<SubsidiaryDetails>;

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
                , InputTextModule
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
    fixture = TestBed.createComponent(SubsidiaryDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); //Testcase 5
  });
   
  it('should have 1 fieldset', () => {
    const compiled= fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('fieldset').length==1).toBeTruthy(); //Testcase 3
  });
  it('should have 1 checkbox', () => {
    const compiled= fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('p-checkbox').length==1).toBeTruthy(); //Testcase 2
  });
  it('should have 5 text fields', () => {
    const compiled= fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('input[type="text"]').length==5).toBeTruthy(); //Testcase 1
  });
  it('should have 2 buttons', () => {
    const compiled= fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('button').length==2).toBeTruthy(); //Testcase 6
  });

  it('should have save button and cancel button', () => {
    const compiled= fixture.debugElement.nativeElement;
    var saveButton=false;
    var cancelButton=false;
    var buttons=compiled.querySelectorAll('button');
    compiled.querySelectorAll('button').forEach(function(button){

   if(!saveButton)
          saveButton =  button.getAttribute('label') == "Add/ Update Subsidiary"   ;
   if(!cancelButton)
      cancelButton = button.getAttribute('label') == "Cancel"  ;

    } )
    expect(saveButton && cancelButton).toBeTruthy(); //Testcase 4
  });
});
