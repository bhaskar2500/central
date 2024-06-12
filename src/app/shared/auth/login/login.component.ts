import { Component, OnInit, ApplicationRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service'
import { ManageComponentDataService } from '../../manage-component-data.service'
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
@Component({
    selector: 'lc-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginFormdata: FormGroup;
    showError = 0;
    authType: string;
    networkId: string;
    password: string;
    title: string;
    image: any = "./assets/sp.png";
    reroute: boolean;
    constructor(private router: Router
        , private authService: AuthService
        , private route: ActivatedRoute
        , private fb: FormBuilder
    ) {
        // use FormBuilder to create a form group
        this.loginFormdata = this.fb.group({
            'networkId': [null, [Validators.required]]
            , 'password': [null, Validators.required]
        });
    }

    ngOnInit() {
        if (this.authType == "lc/logOut") {
            this.authService.logout();
            this.router.navigateByUrl('/');
        }
        this.authService.isAuthenticated.subscribe((authenticated) => {
            if (authenticated) {
                this.LoginAndAuthenticated(authenticated);
            }
        });

    }
    onSubmit() {
        this.showError = 1;
        this.networkId = this.loginFormdata.controls['networkId'].value;
        this.password = this.loginFormdata.controls['password'].value;
        if (this.authType == "/login") {
            if (this.authService.authenticate(this.networkId, this.password)) {
                this.authService.setAuth({ networkId: this.networkId, password: this.password, userID: 6, token: '' })
                this.router.navigateByUrl('lc/locationSearch');
            }
            else {
                this.loginFormdata.setErrors({ invalidCred: "Incorrect UserName/Password", });
            }
        }

    }
    LoginAndAuthenticated(reroute) {
        if (reroute) {
            this.router.navigateByUrl('lc/locationSearch');
        }
    }


}

