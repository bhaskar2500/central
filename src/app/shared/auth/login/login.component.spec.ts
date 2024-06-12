// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import {InputTextModule} from 'primeng/inputtext';
// import {ButtonModule} from 'primeng/button';

// import { LoginComponent } from './login.component';

// /**
//  * Test Scenarios:
//  *   i. Find if the Login Component Exists
//  *  ii. Checks if NetworkId Exists
//  * iii. Checks if Password Field Exists
//  *  iv. Checks if the Error Message is being Rendered [Pending]
//  *   v. Checks if the app is navigating on Succcess   [Pending]
//  */

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports:[ InputTextModule, ButtonModule ]
//       ,declarations: [ LoginComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//    it('should check for networkId field', () => {
//       const bannerElement: HTMLElement = fixture.nativeElement;
//       const networkIdentField = bannerElement.querySelector('#networkId');
//       expect(networkIdentField).toBeDefined();
//   });

//    it('should check for password field', () => {
//       const bannerElement: HTMLElement = fixture.nativeElement;
//       const pwdField = bannerElement.querySelector('#pwd');
//       expect(pwdField).toBeDefined();
//   });
// });
