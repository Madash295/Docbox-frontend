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
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, IconModule , ReactiveFormsModule, FormsModule,NgOtpInputModule],
  animations: [
    trigger('toggleAnimation', [
        transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
        transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  
 
}
