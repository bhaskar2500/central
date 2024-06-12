import {ComponentCanDeactivate} from './component-can-deactivate.component';
import {NgForm, FormGroup} from "@angular/forms";

export abstract class FormCanDeactivate extends ComponentCanDeactivate{

 abstract form():FormGroup;
 
 canDeactivate():boolean{
      console.log("candeactivate called ")
      return  !this.form().dirty;
  }
}