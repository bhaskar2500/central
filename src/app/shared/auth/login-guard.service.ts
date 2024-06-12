import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service'
import { take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserSecurityService } from '../../components/common/security/user-security/user-security.service';
import { JwtService } from './jwt.service';
import { NoPermissionComponent } from './../no-permission/no-permission.component';
import { ErrorLoggerService } from '../../shared/logger/error-logger.service';

@Injectable()
export class LoginGuardSevice implements CanActivate, CanActivateChild {
  cookie: {}
  constructor(
    private router: Router,
    private authService: AuthService,
    private userSecurityService: UserSecurityService
    , private jwtService: JwtService
    , private logger: ErrorLoggerService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkPagePermission(route, state);
  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkPagePermission(childRoute, state);
  }

  private checkPagePermission(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let component: any = childRoute.component;
    if (component.name == 'NoPermissionComponent' || component.name == 'TopNavigationLayoutComponent') { return true; }

    let loggedIn = this.checkLogin();
    if (loggedIn) {
      let pagePermission = this.userSecurityService.findPermission(component.name, null);
      if (pagePermission && pagePermission != null && pagePermission == 'not-allowed') {
        loggedIn = false;
        alert("You do not have permission to navigate to this page.");
      }
    }
    return loggedIn;
  }

  checkLogin(): boolean {
  // console.log("Production Environment: "+ environment.production);
  // console.log("printing User Info Cookie on fresh load \n"+this.getCookie("userInfo"));
    if (!environment.production) {
	//  console.log("Non Production load of cookie");
	  var date = new Date();
      date.setTime(date.getTime() + (environment.cookieExpDays * 24 * 60 * 60 * 1000));
      let cookieString = "=" + (JSON.stringify(environment.cookieValue) || "") + "; expires=" + date.toUTCString(); + "; path=/";
      document.cookie = environment.cookieName + cookieString;
    }else{
//	console.log("Production load of cookie");
	}

    if (this.getCookie("userInfo") != null) {
      let userInfoToken = this.getCookie("userInfo");
      let decodedData =null;
	 
      if (environment.production) {
	 // console.log("printing User Info Json \n"+userInfoToken);
      decodedData = this.jwtService.getDecodedAccessToken(userInfoToken);
	 // console.log("printing Decoded Json \n"+JSON.stringify(decodedData,null,2));
      }else{
          decodedData = JSON.parse(userInfoToken);
      }
      if (decodedData != null) {
        this.authService.setAuth({
          userID: 5, networkId: decodedData.user
          , password: "", token: decodedData.token
        }, "cookie");
        if (!decodedData.entitlements || decodedData.entitlements == null || decodedData.entitlements.entitlements.length < 1) {
          //alert("Entitlement Issue: You do not have permission to access this site, Please contact administrator.");
           this.logger.logError("error", "Entitlement data is null", "userInfoToken : \n <Start of Cookie Data>"+ userInfoToken +"\n <End of Cookie Info>");
          this.router.navigateByUrl('/lc/noPermission');
          return false;
        } else {
          this.userSecurityService.setUserPermissions(decodedData.entitlements);
          return true;
        }
      } else {
	     //alert("Unable to retrieve permissions for your account, Please contact administrator.");
       this.logger.logError("error", "Unable to Retrieve account details from userInfo cookie", "userInfoToken : \n <Start of Cookie Data>"+ userInfoToken +"\n <End of Cookie Info>");
		  this.router.navigateByUrl('/lc/noPermission');
        return false;
      }
    }
    else {
      window.location.href = '/login';
      return false;
    }
  }
  getCookie(name: string): string {
    const nameLenPlus = (name.length + 1);
    return document.cookie
      .split(';')
      .map(c => c.trim())
      .filter(cookie => {
        return cookie.substring(0, nameLenPlus) === `${name}=`;
      })
      .map(cookie => {
        return decodeURIComponent(cookie.substring(nameLenPlus));
      })[0] || null;
  }
}