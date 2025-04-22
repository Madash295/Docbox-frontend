import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UtilsService } from 'src/app/utils.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
// import { login } from './store/authentication/auth.actions';
// import { AuthState } from './store/authentication/auth.state';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// import { selectAuthUser, selectAuthToken } from './store/authentication/auth.selector';
// import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../../shared/icon/icon.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  imports: [CommonModule, IconModule , ReactiveFormsModule, FormsModule,NgOtpInputModule],
  animations: [
    trigger('toggleAnimation', [
        transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
        transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
],
  templateUrl: './otp-verify.component.html',
  styleUrl: './otp-verify.component.css'
})
export class OtpVerifyComponent {
  displayType = 'register';
  isSubmitForm = false;
  RegistrationForm:FormGroup;
  constructor( public router: Router,private fb: FormBuilder,private utilsService: UtilsService,private http: HttpClient){
    this.RegistrationForm = this.fb.group({
      companyName: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required]),
      email: new FormControl("",[Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
      confirmPassword: new FormControl("", [Validators.required]),
    });   
  }
   otp!:string;
   formdata: FormData= new FormData();
   verify :any;
  //  tokenSubscription?: Subscription;
   config = {
     allowNumbersOnly: true,
     length: 6,
     isPasswordInput: false,
     disableAutoFocus: false,
     placeholder: '',
     inputStyles: {
       width: '40px',
       height: '40px',
     },
   }; 
Register()
{
  this.isSubmitForm = true;
    if (this.RegistrationForm.valid) {
      const RegisterData = this.RegistrationForm.value;
  
        // Call the API
        this.http
          .post('http://localhost:5235/api/Registration/register', {
            companyName:RegisterData.companyName,
            username: RegisterData.username,
            email: RegisterData.email,
            password: RegisterData.password,
            confirmPassword: RegisterData.confirmPassword
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
              // localStorage.setItem('token', response.token);
              // localStorage.setItem('user', JSON.stringify(response.user));
  
              // Show success message
              this.utilsService.showMessage(response.message, 'success');
              this.displayType="VerifyOTP";
  
              // Navigate to the profile page
            //  this.router.navigate(['users/profile']);
            }
          });
    }
    

}
 

  //ngoninit function
  ngOnInit(){
    this.displayType="register"
  }

  //Post user api call
  postAPICall(phoneNumber:any){
    const object={
      phoneNo:phoneNumber
    }
    console.log("HELOOOOOOOOOOOOOOOOOOOOOOOO",phoneNumber);

  }
  handleLogin()
  {
    this.router.navigate(['/']);
  }


  //Function to verify OTP from input
  onOtpEntry(otpcode:any){
    this.otp=otpcode;
  }

  async handleClick() {
    console.log(this.otp)
    const RegisterData = this.RegistrationForm.value;
      // Call the API
      this.http
      .post('http://localhost:5235/api/Registration/verify-otp', {
        companyName:RegisterData.companyName,
        username: RegisterData.username,
        email: RegisterData.email,
        password: RegisterData.password,
        otp: this.otp
      })
      .pipe(
        catchError((error) => {
          // Show error message on failure
          if (error.status === 400) {
            this.utilsService.showMessage('Invalid or expired OTP.', 'error');
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
          // localStorage.setItem('user', JSON.stringify(response.user));

          // Show success message
          this.utilsService.showMessage("OTP Verified", 'success');
          this.displayType="VerifyOTP";

          // Navigate to the profile page
          this.router.navigate(['users/profile']);
        }
      });
  
  }
 
}
