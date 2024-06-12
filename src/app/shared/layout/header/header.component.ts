import { Component, OnInit, ApplicationRef } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MerchantId } from '../../../merchantId/merchantId';
import { Routes } from '@angular/router';
import { AuthData } from '../../auth/auth.model';
import { ManageComponentDataService } from '../../manage-component-data.service';
import { Location } from '../../location.model';


@Component({
  selector: 'lc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  logoPath = "../../../assets/sp+.PNG";
  homeImage: any = "../../../assets/home.png";
  menuSchema: String = "";
  constructor(private authService: AuthService
    , private router: Router
    , private applicationRef: ApplicationRef
    , private dataService: ManageComponentDataService) {
  }

  currentUser: AuthData;
  selectedLocation: Location;
  icon: string = "fa fa-bars";
  headerName: string = "";
  ngOnInit() {
    this.selectedLocation = new Location();
    this.router.events.subscribe((val) => {
      this.setMenuSchema(location.pathname);
      this.selectedLocation = this.dataService.getCurrentLocation();
      this.selectedLocation = this.selectedLocation ? this.selectedLocation : new Location();
      this.applicationRef.tick();

    });

    this.authService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData as AuthData;
      }
    );
  }
  logOut() {
    this.authService.logout();
  }
  private setMenuSchema(route: string) {
    if (route == "" || route == "/" || route == "/lc")
      this.menuSchema = "loadingLogin";
    else if (route == "/lc/login" || route == "/lc/logOut")
      this.menuSchema = "login";
    else if (route == "/lc/locationSearch") {
      this.menuSchema = "locationSearch";
    }
    else if (route == "/lc/channelManagement"
      || route == "/lc/referenceTableManagement"
      || route.includes("/lc/channelManagement"))
      this.menuSchema = "management";
    else
      this.menuSchema = "location";
      if (route.includes("/lc/rateDetails"))
        this.headerName = "Rate Details"
      else if (route.includes("/lc/rates"))
        this.headerName = "Rates"
      else if (route.includes("/lc/features"))
        this.headerName = "Features"
      else if (route.includes("notes"))
        this.headerName = "Notes";
      else if (route.includes("operational"))
        this.headerName = "Operational"
      else if (route.includes("enforcement"))
        this.headerName = "Enforcement";
      else if (route.includes("referenceTableManagement"))
        this.headerName = "Reference Table Management"
      else if (route.includes("locationDetails"))
        this.headerName = "Location Details";
      else if (route.includes("capacity"))
        this.headerName = "Capacity"
      else if (route.includes("marketing"))
        this.headerName = "Marketing"
      else if (route.includes("contacts"))
        this.headerName="Contact"
      else if (route == "/lc/locationSearch") 
        this.headerName="Location Search"
      
  }

  onSubmit() {
    this.router.navigateByUrl('lc/referenceTableManagement');


  }
  onClick() {
    this.router.navigateByUrl('lc/channelManagement');
  }

  onHamburgerMenuClick() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
      this.icon = "fa fa-close"
    } else {
      this.icon = "fa fa-bars"
      x.className = "topnav";
    }
  }
}
