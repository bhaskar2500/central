import { Component, OnInit, ApplicationRef } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { NotificationService } from '../../../shared/notification-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'lc-common-errors',
  templateUrl: './common-errors.component.html',
  styleUrls: ['./common-errors.component.scss']
})
export class CommonErrorsComponent implements OnInit {

  msgs: Message[] = [];
  menuSchema :string ;
  class:string;
  display :boolean =false ;
  isSave :boolean =false;
  constructor( private notification : NotificationService 
    ,private router: Router
    , private applicationRef: ApplicationRef
  ) { }

  ngOnInit() {
    
    this.notification.showMessage().subscribe((msg)=>{
      this.msgs=msg;
      this.display=  this.msgs.length>0? true :false;
      this.isSave = this.msgs.filter(i=>i.severity=="success").length>0 
    });
    this.router.events.subscribe((val) => {
      this.setRouteSchema(location.pathname);
      this.applicationRef.tick();
    });
  }
  setRouteSchema(route :string){
    if (route == "/lc/locationDetails"){
    this.menuSchema = "locationDetails";
    this.msgs=[];
    }
    this.class=this.msgs.length>0?"ui-messages ui-widget ui-corner-all ui-messages-success ng-star-inserted":"";
  }

}
