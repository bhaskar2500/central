import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { smoothlyMenu } from '../../../app.helpers';
import { ManageComponentDataService } from '../../../shared/manage-component-data.service';

declare var jQuery:any;

@Component({
  selector: 'topnavigationnavbar',
  templateUrl: 'topnavigationnavbar.template.html'
})
export class TopNavigationNavbarComponent {
  selectedLocation :any;
  constructor(private dataService:ManageComponentDataService ) { }
  
  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

}
