import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/utils.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../models/user.model';
import { login } from './store/authentication/auth.actions';
import { AuthState } from './store/authentication/auth.state';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { selectAuthUser, selectAuthToken } from './store/authentication/auth.selector';
// import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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

  constructor(private fb: FormBuilder , public store: Store<AuthState>, public router: Router, private appSetting: AppService, private utilsService: UtilsService,private http: HttpClient) {
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

handleSignUp()
{
  this.router.navigate(['auth/register']);
}


login() {
  this.isSubmitForm = true;
  if (this.LoginForm.valid) {
    const loginData = this.LoginForm.value;

      // Call the API
      this.http
        .post('http://localhost:5235/api/Login/login', {
          email: loginData.Email,
          password: loginData.Password,
        })
        .pipe(
          catchError((error) => {
            // Show error message on failure
            if (error.status === 401) {
              this.utilsService.showMessage('Invalid email or password.', 'error');
            } else {
              this.utilsService.showMessage('An unexpected error occurred.', 'error');
            }
            return of(null); // Return a safe value to continue
          })
        )
        .subscribe((response: any) => {
          if (response) {
            // Store token and user info in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role);

            // Show success message
            this.utilsService.showMessage('Login successful', 'success');

            // Navigate to the profile page
            this.router.navigate(['users/profile']);
          }
        });
  //   console.log(this.LoginForm.value);

  //   // Mark all controls as touched to display validation errors
  //   // form.control.markAllAsTouched();
  //   // return;
  //   // Dispatch the login action if form is valid
  //   this.utilsService.showMessage('Login Successful', 'success');
  // //   this.store.dispatch(login({ email: this.LoginObj.username, password: this.LoginObj.password }));

  // this.router.navigate(['users/profile']);
  }
  
  
 
}
}
