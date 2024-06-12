import { Injectable } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class NotificationService {

  private currentErrorSubject = new BehaviorSubject<Message[]>([] as Message[]);
  public currentError = this.currentErrorSubject.asObservable().pipe(distinctUntilChanged());
  message: Message;

  constructor() { }
  showMessage() : Observable<Message[]>{
    return this.currentErrorSubject;
  }
  pushMessages(errors:Message[]){
    this.currentErrorSubject.next(errors);
  }
  clearMessages(){
    this.currentErrorSubject.next([]);
  }
}

