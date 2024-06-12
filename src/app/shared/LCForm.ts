
import { FormCanDeactivate } from './can-deactivate/form-can-deactivate.component';

export abstract class LCForm extends FormCanDeactivate{


   public removeNulls(objTosave){
       
        Object.keys(objTosave).forEach(prop=>{
                let value = objTosave[prop];
                if(value!=null && typeof value == 'object'){
                this.removeNulls(objTosave[prop])
                }
                if (value != 0 && (value == undefined || value==="" || value === false ||value==null || Object.is(value, NaN)) ) {
                delete objTosave[prop];
                }
            });
    }
}