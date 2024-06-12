

import { Injectable } from '@angular/core';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtService } from './auth/jwt.service'
import { AuthService } from './auth/auth.service';
import 'rxjs/add/operator/do';


@Injectable()
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private jwtService: JwtService, private http: HttpClient, private authService: AuthService) {
    this.authService.currentUser.subscribe((user) => {
      this.user = user.networkId
    })

  }
  private user: string;
  /**
   * Attaches headers with every request and
   * @param request 
   * @param next handles next request in the queue
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({

      setHeaders: {
        accept: 'application/json',
        authorization: this.jwtService.getToken() ? this.jwtService.getToken() : "",
        "x-ibm-client-id": "aba4dd7e-25b0-4dc1-8db3-bb836216cc51",
        "x-ibm-client-secret": 'Q3wP0sR5hB1vJ8vR8yK3nW2iK5aY2sU6pD2bV4yY1eX1kA0qW5',
        fileName: window.localStorage["imageData"] != undefined ? JSON.stringify(JSON.parse(window.localStorage["imageData"]).fileName) : "",
        email1: this.user
      }
    });
    //1. Create a New Subscriber
    const locations = new Observable<HttpEvent<any>>((observer) => {

      // Get the next and error callbacks. These will be passed in when
      // the consumer subscribes.
       //2. Make the actual Request[OriginalRequest] - next = Http Handler[responsible to make the http request]
       next.handle(request)
          .do((event: HttpEvent<any>) => {
            //2 a. Incase of Success from to the Http Request pass back to the Invoker without making modifications
            observer.next(event);
          }, (err:  HttpEvent<any>) => {
            //2 b. Incase of Error, Verify for Invalid JWT:
            if (err instanceof HttpErrorResponse) {
              console.log("Error: Request :");
               // 2.b.i. make a call to /rt for refreshing the token.
              if (err.status === 500 && err.error.httpMessage == "Invalid JWT Token") {
                this.http.get("/rt").subscribe((response) => {
                  // 2 b.ii. set the token in jwtService
                  this.jwtService.saveToken(response["token"]);
                  // 2.b.ii.1. make the initial HTTP Request[OriginalRequest]
                  request=request.clone({setHeaders:{ authorization:response["token"]}
                  });
                  let secondResponse= next.handle(request).do((event: HttpEvent<any>)=>{
                     // 2.b.ii.1.a on success return response
                    observer.next(event);
                  },(err)=>{ // 2.b.ii.1.b on error return error
                    observer.error(err);}
                  ).materialize().delay(500)
                  .dematerialize();
                  secondResponse.subscribe();
                },(error)=>{
                  observer.error({error:{"status":500} ,"result":"Unable to Fetch Data"});
                })
              }
              else {
                observer.error(err);
              }
            } else {
              observer.error(err);
            }
          }).subscribe();
    });
    return locations.materialize().delay(500)
    .dematerialize();
  }

}