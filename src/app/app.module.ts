import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

//Imports from INSPINIA 

// App modules/components
import {LayoutsModule} from "./components/common/layouts/layouts.module";

// Imports from PrimeFaces
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/primeng';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { DataTableModule } from 'primeng/datatable';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { ConfirmationService} from 'primeng/api';
import {MultiSelectModule} from 'primeng/multiselect';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TooltipModule} from 'primeng/tooltip';
import {CalendarModule} from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import { DataGridModule } from 'primeng/datagrid';
import {PanelModule} from 'primeng/panel';


// Imports from Location Central
import { rootRouterConfig } from './shared/app.routes';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { LoginComponent } from './shared/auth/login/login.component';
import { MerchantId } from './merchantId/merchantId';
import { NotesComponent } from './notes/notes.component';
import { RateComponent } from './rate/rate.component';

import { LocationDetailsComponent } from './location-details/location-details.component'
import { MarketingInformationComponent } from './marketing-information/marketing-information.component';
import { ChannelManagement } from './channelManagement/channelManagement';
import { ChannelPartnerDetails } from './channelManagement/channelPartnerDetails/channelPartnerDetails';
import { SubsidiaryDetails } from './channelManagement/subsidiaryDetails/subsidiaryDetails';
import { ReferenceTableManagement } from './referenceTableManagement/referenceTableManagement';
import { ContactsComponent } from './contacts/contacts.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { LocationFeaturesComponent } from './location-features/location-features.component';
import { EnforcementComponent } from './enforcement/enforcement.component';

import { OperationalComponent } from './operational/operational.component';

import { AuthService } from './shared/auth/auth.service';
import { JwtService } from './shared/auth/jwt.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { fakeBackendProvider } from './shared/auth/user-api-info-mock.service';
import { LoginGuardSevice } from './shared/auth/login-guard.service'
import { ManageComponentDataService } from './shared/manage-component-data.service';
import { NotificationService } from './shared/notification-service.service'
import { RateDetailsComponent } from './rate-details/rate-details.component'
import { CapacityComponent } from './capacity/capacity.component';
import { AddressDetailsComponent } from './operational/address-details/address-details.component';
import { TokenInterceptorService } from './shared/token-interceptor.service';
import { PhotoComponent } from './operational/photo/photo.component';
import {FileUploadModule} from 'primeng/fileupload';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { FeeDetailsComponent } from './enforcement/fee-details/fee-details.component';
import { FormCanDeactivate } from './shared/can-deactivate/form-can-deactivate.component';
import { ComponentCanDeactivate } from './shared/can-deactivate/component-can-deactivate.component';
import { PageNavigationGuardService } from "./shared/can-deactivate/page-navigation-guard.service";

import { LocationSearchResultsComponent } from './location-search/results/location-search-results.component';
import { LocationSearchComponent } from './location-search/search/location-search';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { ErrorLoggerService } from './shared/logger/error-logger.service';
import { OccupancyResetComponent } from './occupancy-reset/occupancy-reset.component';

import { NoPermissionComponent } from './shared/no-permission/no-permission.component';

@NgModule({
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
    CapacityComponent,
    LocationSearchResultsComponent,
    LocationSearchComponent,
    LocationDetailsComponent,
    OperationalComponent,
    AddressDetailsComponent,
    RateDetailsComponent,
    PhotoComponent,
    OccupancyResetComponent,
    NoPermissionComponent],
  imports: [
    BrowserModule
    , BrowserAnimationsModule
    , RouterModule.forRoot(rootRouterConfig)
    , InputTextModule
    , ButtonModule
    , FormsModule
    , ReactiveFormsModule
    , FieldsetModule
    , DropdownModule
    , CheckboxModule
    , TableModule
    , DataTableModule
    , PaginatorModule
    , CardModule
    , DialogModule
    , ProgressSpinnerModule
    , InputMaskModule, MessagesModule, MessageModule, HttpClientModule,ConfirmDialogModule,AutoCompleteModule,TooltipModule
    , MultiSelectModule, AccordionModule
    , FileUploadModule
    , DataGridModule
    , PanelModule
    , AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCyUWIEysT4ebb5jX1WUM_7POjz2R1JYlU'
    })
    ,CalendarModule,
    LayoutsModule.forRoot()
    , CurrencyMaskModule
  ],

  providers: [LoginGuardSevice, AuthService,JwtService,MessageService
    ,ManageComponentDataService, ConfirmationService,PageNavigationGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },fakeBackendProvider
    ,NotificationService
    ,ErrorLoggerService
    ,GoogleMapsAPIWrapper
  ],

  bootstrap: [AppComponent]

})
export class AppModule { }
