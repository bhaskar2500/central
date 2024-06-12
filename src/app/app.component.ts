import { Component,OnInit } from '@angular/core';
import { AuthService  } from './shared/auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Location Central';
  isAuthenticated:boolean = false;
  constructor(private authService: AuthService ) { }

  ngOnInit() {
    this.authService.isAuthenticated.subscribe(function(isAuthenticated){
      this.isAuthenticated=isAuthenticated;
    });

  }

}
