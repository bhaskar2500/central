import { OnInit, Component } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { Router, ActivatedRoute } from "@angular/router";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ManageComponentDataService } from "../../shared/manage-component-data.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Operational } from './../operational.model';
import { LCForm } from '../../shared/LCForm';
import { NotificationService } from "../../shared/notification-service.service";

@Component({
  selector: 'photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],

})
export class PhotoComponent extends LCForm implements OnInit {
  photoFormData: any;
  msgs: Message[] = [];
  uploadedFile: any;
  uploadedFilePath: SafeResourceUrl = "";
  currentImageId;
  constructor(private router: Router
            , private route: ActivatedRoute
            , private sanitizer: DomSanitizer
            , private dataService: ManageComponentDataService
            , private spinnerService: Ng4LoadingSpinnerService
            , private notificationService: NotificationService
            ) {super();}

  ngOnInit() {
    this.photoFormData = new FormGroup({
      imageName: new FormControl(),
      uploadFile: new FormControl(),
      imageSize: new FormControl(),
      imageDimension: new FormControl(),
      imagePreview: new FormControl()
    });

    this.route.queryParams.subscribe((params) => {
      this.currentImageId = params["imageId"];
      if(this.currentImageId && this.currentImageId !=null){this.currentImageId  = parseInt(this.currentImageId );}
      let currentImageName = params["imageName"];
      let currentImageLink = params["imageLink"];

      this.photoFormData.controls['imageName'].setValue(currentImageName);
      this.uploadedFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(currentImageLink);
      if (!this.currentImageId || this.currentImageId == null
        || (typeof this.currentImageId == 'string'
          && (this.currentImageId.trim() == '' || this.currentImageId.trim() == 'undefined'
          )
        )
      ){
        this.currentImageId == -1;
      }
    });
  }

  onCancel() {
    this.router.navigateByUrl("lc/operational");
  }

  savePhotographDetails() {
    this.msgs=[];
     //1. Get Image Path from the instance object
      if (this.uploadedFile  != undefined && this.uploadedFile  != null) {
          let path = this.uploadedFile.objectURL.changingThisBreaksApplicationSecurity;
          this.uploadedFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(path);
          let fileName = this.photoFormData.controls['imageName'].value;
          this.spinnerService.show();
          //2. Upload the image to object store
            this.dataService.saveImageData(this.uploadedFile, fileName).subscribe((event: any) => {
                    if(event instanceof HttpResponse && event.status ==200){
                      //3. If Image upload is successfull, fetch Operational Record for image attach
                      this.dataService.getOperationalForLocation().subscribe(
                      (data: Operational) => {
                        //4.a Take the current Image and search for existing id or insert new image in photos array
                        let currentImage ={
                          imageId:this.currentImageId,
                          imageName:fileName,
                          imageLink:environment.imageHost+'/'+event.body.key
                        }
                        if(data.photos|| data.photos==null ){data.photos=[];}
                        let imageFound=false;
                        //search for existing record
                        for(let index = 0 ; index <data.photos.length;index++ ){
                          if(data.photos[index].imageId === currentImage.imageId){
                             data.photos[index] = currentImage;
                             imageFound=true;
                          }
                        }
                        if(!imageFound){
                           //insert for new images
                          data.photos.push(currentImage);
                        }
                        //4.b Update the operational record with the new image data
                        super.removeNulls(data);
                         this.dataService.saveOperationalForLocation(data).subscribe((operationalSaveSuccess)=>{
                            this.msgs.push({ severity: 'success', detail: 'Image Uploaded' });
                            this.router.navigateByUrl("lc/operational");
                            window.scroll(0,0);
                            this.spinnerService.hide();
                         },(operationalSaveError)=>{
                           this.msgs.push({ severity: 'error', detail: 'Error updating operational record.' });
                           window.scroll(0,0);
                            this.spinnerService.hide();
                         });
                      }
                      ,(operationalGetError) => {
                             this.notificationService.pushMessages([{ severity: 'error', detail: 'Error fetching operational record for image save.' }]);
                             window.scroll(0,0);
                            this.spinnerService.hide();
                      });
                  }
            }, (err) => {
              this.notificationService.pushMessages([{ severity: 'error', detail: 'Error uploading image.' }]);
                window.scroll(0,0);
                this.spinnerService.hide();
            });
      }
  }

  onBasicUpload(event) {
    if (event.files != undefined && event.files != null && event.files.length > 0) {
      this.uploadedFile = event.files[0];
      let path = event.files[0].objectURL.changingThisBreaksApplicationSecurity;
      let fileName = event.files[0].name;
      let imageSize : any = event.files[0].size;
      let sizeInKB = (imageSize / 1024).toFixed(2) + " KB."
      this.photoFormData.controls['imageSize'].setValue(sizeInKB);
      this.photoFormData.controls['uploadFile'].setValue(fileName);
      this.uploadedFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(path);
    }
  }

  form() {
    return this.photoFormData;
  }
}