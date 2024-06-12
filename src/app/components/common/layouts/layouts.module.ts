import { NgModule, ModuleWithProviders } from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";

import {BsDropdownModule} from 'ngx-bootstrap';

import {BasicLayoutComponent} from "./basicLayout.component";
import {BlankLayoutComponent} from "./blankLayout.component";
import {TopNavigationLayoutComponent} from "./topNavigationLayout.component";

import {NavigationComponent} from "./../navigation/navigation.component";
import {FooterComponent} from "./../footer/footer.component";
import {TopNavbarComponent} from "./../topnavbar/topnavbar.component";
import {TopNavigationNavbarComponent} from "./../topnavbar/topnavigationnavbar.component";
import { BreadcrumbModule} from 'primeng/breadcrumb';

import { CommonErrorsComponent } from '../common-errors/common-errors.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import {DialogModule} from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { PageSecurityDirective, FieldSecurityDirective } from './../security/field-security/field-security.directive';
import { UserSecurityService } from './../security/user-security/user-security.service';

@NgModule({
  declarations: [
    FooterComponent,
    BasicLayoutComponent,
    BlankLayoutComponent,
    NavigationComponent,
    TopNavigationLayoutComponent,
    TopNavbarComponent,
    TopNavigationNavbarComponent,
    CommonErrorsComponent,
    PageSecurityDirective, FieldSecurityDirective
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BreadcrumbModule, 
    BsDropdownModule.forRoot(),
    DialogModule,
    ButtonModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  exports: [
    FooterComponent,
    BasicLayoutComponent,
    BlankLayoutComponent,
    NavigationComponent,
    TopNavigationLayoutComponent,
    TopNavbarComponent,
    TopNavigationNavbarComponent,
    PageSecurityDirective, FieldSecurityDirective
  ]
})

export class LayoutsModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LayoutsModule,
      providers: [ UserSecurityService ]
    };
  }}
