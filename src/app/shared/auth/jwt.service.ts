import { Injectable } from '@angular/core';
import * as jwt_decode from "jwt-decode";


@Injectable()
export class JwtService {

  getToken(): any  {
    return window.sessionStorage.getItem('jwtToken'); 
  }

  saveToken(token: string) {
    window.sessionStorage['jwtToken'] = token;
  }

  destroyToken() {
    window.sessionStorage.removeItem('jwtToken');
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }
}
