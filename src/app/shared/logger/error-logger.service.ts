import { Injectable } from '@angular/core';
import { Errors } from './error-logger.model';
import { HttpClient } from '@angular/common/http';
import { ManageComponentDataService } from '../manage-component-data.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ErrorLoggerService {
  errorModel: Errors;
  constructor(private http: HttpClient, private dataService: ManageComponentDataService, private authService: AuthService) {
  }

  logError(eventType, eventDescription, pageID) {
    this.authService.currentUser.subscribe((user) => {
      let log: {} = {
        locationCode: this.dataService.getCurrentLocation().locationCode
        , date: new Date().toString()
        , user: user.networkId
        , eventType: eventType
        , eventDescription: eventDescription
      }

      let error: Errors = {
        "log": JSON.stringify(log)
        , "pageID": pageID
        , uniqueID: pageID + Math.random() * 100
      }
      this.http.put(this.dataService.APIC_HOST+"/logEvents", error).subscribe();
    })
  }
}
