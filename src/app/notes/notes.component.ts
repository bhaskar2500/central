import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng/components/common/api';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ManageComponentDataService } from '../shared/manage-component-data.service'
import { Notes } from './notes.model'
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import ReferenceTable from '../shared/enum/refTable.enum';
import { FormCanDeactivate } from '../shared/can-deactivate/form-can-deactivate.component';
import { NotificationService } from '../shared/notification-service.service';
import { ErrorLoggerService } from '../shared/logger/error-logger.service';
import { LCForm } from '../shared/LCForm';

@Component({
  selector: 'lc-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.Emulated
})
export class NotesComponent extends LCForm {
  notesDiv: number[] = [1];
  notesFormdata: FormGroup;
  msgs: Message[] = [];
  noteTypes: any[];
  notesData: Notes[] = [];
  screenWidth: number = screen.width;
  constructor(private messageService: MessageService, private router: Router, private dataService: ManageComponentDataService, private spinnerService: Ng4LoadingSpinnerService
    , private logger : ErrorLoggerService
    , private notificationService: NotificationService) {
    super();
    this.dataService.getTableValuesByTableName(ReferenceTable.Note_Type).subscribe((data: any[]) => {
      this.noteTypes = data;
    },
      (error) => {
        this.msgs.push({ severity: "error", detail: "Error fetching data from NoteType API" });
      })
  }

  ngOnInit() {
    this.spinnerService.show();
    this.notesFormdata = new FormGroup({
      notesDesc1: new FormControl("", Validators.required),
      notesDd1: new FormControl("", Validators.required),
    });
    this.dataService.getNotes().subscribe((data: any[]) => {
      this.spinnerService.hide();
      if (data != null || data != undefined) {
        for (var i = 0; i < data.length; i++) {
          var notesDd = "notesDd" + (i + 1).toString();
          var notesDescription = "notesDesc" + (i + 1).toString();
          if (this.notesFormdata.contains(notesDd) || this.notesFormdata.contains(notesDescription)) {
            this.notesFormdata.controls[notesDd].setValue({ elementId: data[i].categoryID, elementValue: data[i].categoryname });
            this.notesFormdata.controls[notesDescription].setValue(data[i].note);
          }
          else {
            this.addNoteDetails();
            this.notesFormdata.controls[notesDd].setValue({ elementId: data[i].categoryID, elementValue: data[i].categoryname });
            this.notesFormdata.controls[notesDescription].setValue(data[i].note);
          }
        }

      }
    },
      (error) => {
        if (error.status != 404)
          this.msgs.push({ severity: 'error', detail: "Error retreiving notes .Please try again !!" });
        else
          this.msgs.push({ severity: 'warning', detail: error.error.message });
        this.spinnerService.hide();
      });

  }

  addNoteDetails() {
    this.notesFormdata.addControl("notesDesc" + (this.notesDiv.length + 1).toString(), new FormControl("", Validators.required));
    this.notesFormdata.addControl("notesDd" + (this.notesDiv.length + 1).toString(), new FormControl("", Validators.required));
    this.notesDiv.push(this.notesDiv.length + 1);
  }
  removeNotes(id) {
    this.notesFormdata.removeControl("notesDesc" + id.toString());
    this.notesFormdata.removeControl("notesDd" + id.toString());
    this.notesDiv.splice(parseInt(id) - 1, 1);
  }
  showError() {
    this.msgs = [];
    for (let inner in this.notesFormdata.controls) {
      this.notesFormdata.get(inner).markAsTouched();
      this.notesFormdata.get(inner).markAsDirty();
      this.notesFormdata.get(inner).updateValueAndValidity();
    }
    if (this.notesFormdata.status == "INVALID") {
      this.msgs.push({ severity: 'error', detail: 'Form has errors' });
    }
  }
  onCancel() {
    this.router.navigateByUrl('lc/locationDetails');
  }
  isDuplicate() {
    var notesArray = this.notesData.map(function (item) { return item.categoryName })
    let isDuplicate: boolean = false;
    isDuplicate = notesArray.some(function (item, idx) {
      return notesArray.indexOf(item) != idx
    });
    return isDuplicate;
  }
  saveNotes() {
    this.spinnerService.show();
    if (this.notesFormdata.valid) {
      this.arrangeNotes();
      if (this.isDuplicate()) {
        this.msgs.push({ severity: 'error', detail: 'Notes Type and Notes Description should not be duplicate' })
      }
      else {
        this.spinnerService.show();
        this.dataService.saveNotesToDb(this.notesData).subscribe((data) => {
          this.msgs = [];
          this.msgs.push({ detail: "Notes has been saved Successfully", severity: "success" })
          // this.notificationService.pushMessages(this.msgs);
          this.spinnerService.hide();
        },
          (error) => {
            this.msgs = [];
            this.spinnerService.hide();
            this.logger.logError("error", error.error, "Notes Page");
            this.msgs.push({ severity: "error", detail: "Unable to save the data .Please try again !!" });
          });
      }
    }
  }
  arrangeNotes() {
    this.notesData = [];
    for (var i = 1; i <= Object.keys(this.notesFormdata.value).length / 2; i++) {
      let record: Notes = new Notes();
      Object.keys(this.notesFormdata.value).forEach((value) => {
        if (value.endsWith((i).toString()) && value.includes('Dd')) {
          record.categoryName = typeof (this.notesFormdata.value[value]) != "string" ? this.notesFormdata.value[value].elementValue : this.notesFormdata.value[value];
          record.categoryId = typeof (this.notesFormdata.value[value]) != "string" ? this.notesFormdata.value[value].elementId : this.noteTypes.find(i => i.elementValue == record.categoryName).elementId;
        }
        else if (value.endsWith((i).toString()) && value.includes('Desc')) {
          record.note = this.notesFormdata.value[value];
        }
      })
      this.notesData.push({ categoryId: record.categoryId, categoryName: record.categoryName, note: record.note });
    }
  }
  form() {
    return this.notesFormdata;
  }
}
