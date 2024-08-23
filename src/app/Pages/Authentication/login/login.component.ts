import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/utils.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { login } from './store/authentication/auth.actions';
import { AuthState } from './store/authentication/auth.state';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { selectAuthUser, selectAuthToken } from './store/authentication/auth.selector';
// import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../../shared/icon/icon.module';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IconModule , ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('toggleAnimation', [
        transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
        transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
],
})
export class LoginComponent {
  storeData: any;
  user$: Observable<User | null>;
  LoginForm: FormGroup;
  isSubmitForm = false;

  constructor(private fb: FormBuilder , public store: Store<AuthState>, public router: Router, private appSetting: AppService, private utilsService: UtilsService) {
    // Initialize the form with FormBuilder
    this.user$ = this.store.select(selectAuthUser);
      this.initStoreData();
    this.LoginForm = this.fb.group({
      Email: new FormControl("", [Validators.required]),
      Password: new FormControl("", [Validators.required]),
      rememberMe: new FormControl(""),
    });
  }
  // token$: Observable<string | null>;

  // user$: Observable<User | null>;
  LoginObj : any = {
    username : '',
    password : '',
    
    RememberMe : false,
    errors:
    {
      nameError: 'Name is Required',
      passwordError: 'Password is Required',
    }
  }
  async initStoreData() {
    this.storeData
        // .select((d:any) => d.auth)
        // .subscribe((d:any) => {
        //     this.store = d;
        // });
}


login() {
  this.isSubmitForm = true;
  if (this.LoginForm.valid) {
    // Mark all controls as touched to display validation errors
    // form.control.markAllAsTouched();
    // return;
    // Dispatch the login action if form is valid
    this.utilsService.showMessage('Login Successful', 'success');
     this.store.dispatch(login({ email: this.LoginObj.username, password: this.LoginObj.password }));

  this.router.navigate(['users/profile']);
  }
  
  
 
}
}
