import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'lc-no-permission',
  templateUrl: './no-permission.component.html',
  styleUrls: ['./no-permission.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NoPermissionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
