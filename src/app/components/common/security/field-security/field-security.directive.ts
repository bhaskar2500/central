
import {Directive, DoCheck, Host, Optional, Input, Renderer, ElementRef, TemplateRef, ViewContainerRef} from '@angular/core';
import { UserSecurityService } from './../user-security/user-security.service';

@Directive({
  selector: '[lcPageSecurity]'
})
export class PageSecurityDirective {
 @Input('lcPageSecurity') pageId: String;
 pageChildren : any;

    constructor(private el: ElementRef, private userSecurity : UserSecurityService) { }
    ngOnInit() {
        if (this.pageId) {
              let pagePermissions = this.userSecurity.getPagePermissions(this.pageId);
              if( pagePermissions){
                this.pageChildren = pagePermissions.fields;
              }
        }
    }

    getFieldPermission(fieldId){
      if(!this.pageChildren || this.pageChildren == null){ return; }

      let permissionFound = this.pageChildren.find((field)=>{
          return field.id === fieldId;
      });
      return permissionFound.permission;
    }
}

@Directive({
  selector: '[lcFieldSecurity]'
})
export class FieldSecurityDirective {
 @Input('lcFieldSecurity') fieldId: String; // Required permission passed in
    constructor( private el: ElementRef
               , @Optional() @Host() private pagePermission: PageSecurityDirective
                , private userSecurity : UserSecurityService, public renderer: Renderer) {}

    ngOnInit() {
        if (this.fieldId) {
              let permission ='';
              if(this.pagePermission ){
                permission = this.pagePermission.getFieldPermission( this.fieldId);
              }else{
                permission = this.userSecurity.findPermission(null, this.fieldId);
              }
              
              if(permission == "disabled"){
                this.el.nativeElement.disabled= true;
              }else if(permission == "hidden"){
                this.el.nativeElement.style.display = 'none';
              }else if(permission == "remove"){
                this.el.nativeElement.remove();
              }              
        }
    }
}
