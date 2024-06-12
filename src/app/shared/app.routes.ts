import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MerchantId } from '../merchantId/merchantId';
import { RateComponent } from '../rate/rate.component';
import { RateDetailsComponent } from '../rate-details/rate-details.component';
import { NotesComponent } from '../notes/notes.component';
import { ChannelManagement } from '../channelManagement/channelManagement';
import { ChannelPartnerDetails } from '../channelManagement/channelPartnerDetails/channelPartnerDetails';
import { SubsidiaryDetails } from '../channelManagement/subsidiaryDetails/subsidiaryDetails';
import { ReferenceTableManagement } from '../referenceTableManagement/referenceTableManagement';
import { LocationDetailsComponent } from '../location-details/location-details.component';
import { MarketingInformationComponent } from '../marketing-information/marketing-information.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { LocationFeaturesComponent } from '../location-features/location-features.component';
import { EnforcementComponent } from '../enforcement/enforcement.component';

import { OperationalComponent } from '../operational/operational.component';

import { LocationSearchResultsComponent } from '../location-search/results/location-search-results.component';
import { LocationSearchComponent } from '../location-search/search/location-search';

import { LoginGuardSevice } from './auth/login-guard.service';
import { CapacityComponent } from '../capacity/capacity.component';
import { AddressDetailsComponent } from '../operational/address-details/address-details.component';
import { PhotoComponent } from '../operational/photo/photo.component';
import { FeeDetailsComponent } from '../enforcement/fee-details/fee-details.component';
import { PageNavigationGuardService } from "../shared/can-deactivate/page-navigation-guard.service"
import { TopNavigationLayoutComponent } from '../components/common/layouts/topNavigationLayout.component';
import { OccupancyResetComponent } from '../occupancy-reset/occupancy-reset.component';
import { NoPermissionComponent } from './no-permission/no-permission.component';



/**
 * Used to Configure all the supported Routes in the application
 * 
 * Configuration:
 *  i. Default Route: login
 * ii. Route for Non Matching Paths: 
 */
export const rootRouterConfig: Routes = [
     { path: '', pathMatch: 'full', redirectTo:'/lc/locationSearch' }
    ,{
        path: 'lc',component: TopNavigationLayoutComponent,
        canActivate : [LoginGuardSevice],
        canActivateChild: [LoginGuardSevice],
        canDeactivate :[PageNavigationGuardService],
        pathMatch: 'prefix',
        children: [
              { path  :'merchantIdData', component: MerchantId  }
            , { path: 'login', component: LoginComponent }
            , { path: 'logOut', component: LoginComponent }
            , { path: 'noPermission', component: NoPermissionComponent }
            , { path: 'notes', component: NotesComponent, canDeactivate :[PageNavigationGuardService] }
            , { path: 'channelManagement', component: ChannelManagement }
            , { path: 'channelManagement/channelPartnerDetails', component: ChannelPartnerDetails }
            , { path: 'channelManagement/channelPartnerDetails/:channelPartnerKey', component: ChannelPartnerDetails, canDeactivate :[PageNavigationGuardService] }
            , { path: 'channelManagement/subsidiaryDetails/:channelPartnerKey/:channelPartnerSubsidiaryKey', component: SubsidiaryDetails, canDeactivate :[PageNavigationGuardService] }


            , { path: 'referenceTableManagement', component: ReferenceTableManagement }
            , { path: 'capacity', component: CapacityComponent }


            , { path: 'contacts', component: ContactsComponent }
            
            , { path: 'contact-details', component: ContactDetailsComponent, canDeactivate :[PageNavigationGuardService] }
            , { path: 'contact-details/:contactId', component: ContactDetailsComponent, canDeactivate :[PageNavigationGuardService] }

            , { path: 'features', component: LocationFeaturesComponent, canDeactivate :[PageNavigationGuardService] }

            , { path: 'enforcement', component: EnforcementComponent, canDeactivate :[PageNavigationGuardService] }

            , { path: 'fee-details/:typeId/:feeKey', component: FeeDetailsComponent, canDeactivate :[PageNavigationGuardService] }
           

            , { path: 'marketing-information', component: MarketingInformationComponent , canDeactivate :[PageNavigationGuardService]}
            , { path: 'operational', component: OperationalComponent, canDeactivate :[PageNavigationGuardService] }
            , { path: 'address-details', component: AddressDetailsComponent, canDeactivate :[PageNavigationGuardService] }
            , { path: 'address-details/:addressKey', component: AddressDetailsComponent, canDeactivate :[PageNavigationGuardService] }
            , { path: 'photo', component: PhotoComponent }
            , { path: 'rates', component: RateComponent }
            , { path: 'locationSearch', component: LocationSearchComponent }
            , { path: 'locationSearchResults', component: LocationSearchResultsComponent  }
            , { path: 'locationDetails', component: LocationDetailsComponent ,pathMatch: 'prefix'}
            , { path: 'referenceTableManagement', component: ReferenceTableManagement }
            , { path: 'channelManagement', component: ChannelManagement }
            , { path: 'rateDetails', component: RateDetailsComponent,canDeactivate : [PageNavigationGuardService] }
            , { path: 'occupancy', component: OccupancyResetComponent,canDeactivate : [PageNavigationGuardService] }
        ]
    },

];

