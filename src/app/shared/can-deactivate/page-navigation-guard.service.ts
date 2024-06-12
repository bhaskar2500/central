import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ComponentCanDeactivate } from './component-can-deactivate.component';



@Injectable()
export class PageNavigationGuardService implements CanDeactivate<ComponentCanDeactivate> {

  constructor() { }
  canDeactivate(component: ComponentCanDeactivate) {
    if (!component.canDeactivate()) {
      if(confirm("Are you sure you want to exit ?")){
        return true;
      }
      else{
        return false;
      }
    }
    return true;
  }
}
