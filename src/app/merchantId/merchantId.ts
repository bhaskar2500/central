import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ManageComponentDataService } from '../shared/manage-component-data.service';
import { Message } from 'primeng/components/common/api';
import { MerchantIdData } from './merchantId.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormCanDeactivate } from '../shared/can-deactivate/form-can-deactivate.component';
import { NotificationService } from '../shared/notification-service.service';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';

@Component({
    selector: 'merchantId',
    templateUrl: './merchantId.html',
    styleUrls: ['./merchantId.scss'],
    encapsulation: ViewEncapsulation.None

})
export class MerchantId extends FormCanDeactivate {

    Formdata: any;
    msgs: Message[] = [];
    screenWidth: number = screen.width;
    constructor(private router: Router, private dataService: ManageComponentDataService, private spinnerService: Ng4LoadingSpinnerService
        , private notificationService: NotificationService,private logger: ErrorLoggerService) {
        super();
    }
    ngOnInit() {
        this.spinnerService.show();
        this.Formdata = new FormGroup({
            merchantId: new FormControl(),
            hostedSecureId: new FormControl(),
            hostedSecureAPIToken: new FormControl()
        });


        this.dataService.getMerchantIDDataForLocation().subscribe(
            (data: MerchantIdData) => {
                this.Formdata.controls['merchantId'].setValue(data.merchantId);
                this.Formdata.controls['hostedSecureId'].setValue(data.hostedSecureId);
                this.Formdata.controls['hostedSecureAPIToken'].setValue(data.hostedSecureAPIToken);
                this.spinnerService.hide();
            }
            , (error) => {
                // this.msgs.push({ severity: 'error', detail: 'Error Fetching Data' });
                // this.spinnerService.hide();
                if (error.status != 404)
                    this.msgs.push({ severity: 'error', detail: "Error retreiving data .Please try again !!" });
                else
                    this.msgs.push({ severity: 'warning', detail: error.error.message });
                this.spinnerService.hide();
                window.scrollTo(0, 0);
            }
        );

    }

    saveMerchantIDData() {
        this.msgs = [];
        this.spinnerService.show();
        var objSave = new MerchantIdData();
        objSave.merchantId = this.Formdata.controls['merchantId'].value;
        objSave.hostedSecureId = this.Formdata.controls['hostedSecureId'].value;
        objSave.hostedSecureAPIToken = this.Formdata.controls['hostedSecureAPIToken'].value;

        this.dataService.saveMerchantIDDataForLocation(objSave).subscribe(
            (data) => {

                { this.msgs.push({ severity: 'success', detail: 'Merchant Id Data has been saved successfully' }); }

                this.spinnerService.hide();
            }
            , (error) => {
                this.msgs.push({ severity: 'error', detail: 'Update of Information has failed' });
                this.logger.logError("error", error.error, "Merchand ID Page");

                window.scrollTo(0, 0);
                this.spinnerService.hide();
            }
        );
    }
    onCancel() {
        this.router.navigateByUrl("/lc/locationDetails");
    }
    form() {
        return this.Formdata;
    }
}
