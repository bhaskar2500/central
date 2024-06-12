import { TestBed, async } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";

import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import {rootRouterConfig} from './shared/app.routes';
/*import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { LoginComponent } from './shared/auth/login/login.component'
//import { ShowWhenAuthed } from './shared/auth/ShowWhenAuthed.directive'
//import { LandingPageComponent } from './shared/landing-page/landing-page.component'

import {AuthService} from './shared/auth/auth.service';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [
    AppComponent,  LoginComponent,HeaderComponent,FooterComponent ],


      imports: [  InputTextModule, ButtonModule,FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes([
         { path: 'login', component:LoginComponent }
        ]) ],


        providers: [AuthService],

    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'Location Central'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Location Central');
  }));
  
});
*/