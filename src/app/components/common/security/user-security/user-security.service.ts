import { Injectable } from '@angular/core';

@Injectable()
export class UserSecurityService {

  constructor() {}
   // ALLOWED PERMISSIONS:
   // Page Permissions: not-allowed
   // Field Permissions: remove, hidden, disabled
   userRole: string;
   pages:any[];

   setUserPermissions(entitlements){
       this.pages = entitlements.entitlements;
       this.userRole = entitlements.role;
   }
   findPermission(pageIn, fieldIn){
    if(!this.pages || this.pages == null){
        return;
    }

      let pageFound =this.pages.find((page)=>{
          return page.id === pageIn;
      });

     if(!pageFound || pageFound == null){
       return;
     }

      if((!fieldIn || fieldIn == null) && pageFound){
         return pageFound.permission;
      }
      let permissionFound = pageFound.fields.find((field)=>{
          return field.id === fieldIn;
      });
      
      return permissionFound.permission;
   }

   getPagePermissions(pageId){
        if(!this.pages || this.pages == null){
            return;
        }
         let pageFound =this.pages.find((page)=>{
          return page.id === pageId;
      });

      return pageFound;
   }


}
