import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AuthData } from './auth.model'
import { distinctUntilChanged, map } from 'rxjs/operators';
import { JwtService } from '../auth/jwt.service';
import { ManageComponentDataService } from '../../shared/manage-component-data.service';
import { ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthData>({} as AuthData);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  path: string;
  private userList: AuthData[] = [];
  private error: string;
  // public  person : AuthData;
  constructor(
    private jwtService: JwtService,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {  }
  /**
  * This authenticttes the user by matching the credentials.
  * @param networkid, pass
  * */
  authenticate(networkId: string, pass: string) {
    if (this.userList && this.userList.length > 0) {
      let person = this.userList.find(
        function (person) {
          return person.networkId == networkId;
        });
      if (person != null) {
        if (!this.jwtService.getToken()) {
          this.setAuth(person);
        }
      }
      return person != null ? true : false;
    }
  }

  /**
  * This logs out the user by nulifying  the current user and isAuthenticated observable  .
  * */
  logout(): boolean {
    this.purgeAuth();
    window.location.href = '/logout';
    return true;
  }

  /**
   * This sets the user to observable for other listeners to respond to login across the application .
   * @param user
   * */
  setAuth(user: AuthData, type = "") {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.jwtService.saveToken(user.token);
    // this.userList.push(user);
  }
  /**
   * Removes JWT from localstorage and  sets current user to an empty object
   * */
  purgeAuth() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as AuthData);
    this.isAuthenticatedSubject.next(false);
    this.deleteCookie("userInfo");
    this.RemoveComponentData();
  }
  /**
  *  If JWT is defined then set  & restore user's info
  * */
  populate() {
    if (this.jwtService.getToken() && this.jwtService.getToken() != null) {
      let networkId: string;
      this.currentUser.subscribe((currentUser) => {
        networkId = currentUser["networkId"];
        this.userList.push({
          networkId: networkId
          , password: ""
          , token: JSON.stringify(this.jwtService.getToken())
          , userID: this.userList.length + 2
        });
      })
    } else {
      this.purgeAuth();
    }
  }
  deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  RemoveComponentData() {
    window.localStorage.clear();
  }
}
