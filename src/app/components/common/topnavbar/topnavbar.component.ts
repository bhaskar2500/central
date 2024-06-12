import { Component, ApplicationRef } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { AuthService } from '../../../shared/auth/auth.service';
import { Router } from '@angular/router';
import { ManageComponentDataService } from '../../../shared/manage-component-data.service';
import { AuthData } from '../../../shared/auth/auth.model';
import { Location } from '../../../shared/location.model';
import { MenuItem } from 'primeng/api';
import { NotificationService } from '../../../shared/notification-service.service';

declare var jQuery: any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopNavbarComponent {
  currentUser: AuthData;
  selectedLocation: Location;
  icon: string = "fa fa-bars";
  headerName: string = "";;
  menuSchema: String = "";
  logoPath = "../../../assets/sp+.PNG";
  private items: MenuItem[] = [{ label: "Location Details", routerLink: "/lc/locationDetails" }];
  home: MenuItem;
  index: number;
  itemsToRemove: number;
  constructor(private authService: AuthService
    , private router: Router
    , private applicationRef: ApplicationRef
    , private dataService: ManageComponentDataService
    , private notifications: NotificationService) {
  }
  ngOnInit() {
    this.selectedLocation = new Location();
    this.closeMenuOnWindowClick();
    this.router.events.subscribe((val) => {
      this.setMenuSchema(location.pathname);
      this.applicationRef.tick();
      this.selectedLocation = this.dataService.getCurrentLocation();
      this.selectedLocation = this.selectedLocation ? this.selectedLocation : new Location();
      if (this.items.findIndex(i => i.label == this.headerName) == -1)
        this.items.push({
          label: this.headerName, routerLink: location.pathname
        });
    });

    this.home = { icon: 'fa fa-home', routerLink: "/lc/locationSearch" };

    this.authService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData as AuthData;
      }
    );
  }
  closeMenuOnWindowClick() {
    jQuery(window).on('click', function (e) {
      if(!jQuery(".hamburger,a.minimalize-styl-2").is(e.target))
        jQuery("#myTopnav").hasClass("responsive") ? jQuery("#myTopnav").removeClass("responsive") : "";
    });
  }

  toggleNavigation(): void {
    // jQuery("body").toggleClass("mini-navbar");
    // smoothlyMenu();\
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
      this.icon = "fa fa-close"
    } else {
      this.icon = "fa fa-bars"
      x.className = "topnav";
    }
  }
  logOut() {
    this.toggleNavigation();
    this.authService.logout();
  }
  private setMenuSchema(route: string) {
    if (route == "" || route == "/" || route == "/lc")
      this.menuSchema = "loadingLogin";
    else if (route == "/lc/login" || route == "/lc/logOut")
      this.menuSchema = "login";
    else if (route == "/lc/locationSearch" || route.includes("locationSearchResults")) {
      this.notifications.clearMessages();
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
    else if (route.includes("channelManagement"))
    this.headerName = "Channel Management"
    else if (route.includes("locationDetails"))
      this.headerName = "Location Details";
    else if (route.includes("capacity"))
      this.headerName = "Capacity"
    else if (route.includes("marketing"))
      this.headerName = "Marketing"
    else if (route.includes("contacts"))
      this.headerName = "Contact"
    else if (route == "/lc/locationSearch")
      this.headerName = "Location Search"
    else if (route == "/lc/merchantIdData")
      this.headerName = "Merchant Id Data"
    else if (route.includes("/lc/contacts-details"))
      this.headerName = "Contact Details"
      else if (route.includes("/lc/occupancy"))
      this.headerName = "Occupancy Reset"
  }
  redirectToLocationSearch(){
      this.router.navigate(["/lc/locationSearch"]);
  }
}
