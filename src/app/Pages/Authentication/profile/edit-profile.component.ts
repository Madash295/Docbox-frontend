import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/utils.service';
@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
 
  ],
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
  profileForm: FormGroup;
  selectedFile: File | null = null;
  profileImageUrl: string = '/assets/images/user-profile.jpeg'; // default

  constructor(private fb: FormBuilder, private http: HttpClient, private utilsService: UtilsService, private router: Router) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      profilePicture: [null]
    });
  }
   ngOnInit() {
    this.fetchUserProfile();
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get('http://localhost:5235/api/User/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (user: any) => {
          this.profileForm.patchValue({
            username: user.name || '',
            // Do not patch password for security reasons
          });
          this.profileImageUrl = user.profilePicture ? user.profilePicture : '/assets/images/user-profile.jpeg';
        },
        error: () => {
          // Optionally handle error
        }
      });
    }
  }
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Preview image
      const reader = new FileReader();
      reader.onload = e => this.profileImageUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

 // ...existing code...

onSubmit() {
  if (this.profileForm.invalid) return;

  const formData = new FormData();
  formData.append('Username', this.profileForm.value.username);
  formData.append('Password', this.profileForm.value.password);
  if (this.selectedFile) {
    formData.append('ProfilePicture', this.selectedFile, this.selectedFile.name);
  }

  const token = localStorage.getItem('token') || '';

  this.http.post('http://localhost:5235/api/User/update-profile', formData, {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  }).subscribe({
    next: (res: any) => {
      this.utilsService.showMessage('Profile updated successfully!', 'success');
      // Refetch user profile to get the latest image
      this.fetchUserProfile();
      // Navigate to All Files after save
     
      this.router.navigate(['/users/all-files']);
    },
    error: err => {
      alert('Failed to update profile.');
    }
  });
}
// Add this helper method
fetchUserProfile() {
  const token = localStorage.getItem('token');
  if (token) {
    this.http.get('http://localhost:5235/api/User/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (user: any) => {
        this.profileForm.patchValue({
          username: user.name || '',
        });
        // Add cache buster to force image reload
        this.profileImageUrl = user.profilePicture
          ? user.profilePicture + '?t=' + new Date().getTime()
          : '/assets/images/user-profile.jpeg';
      },
      error: () => {
        // Optionally handle error
      }
    });
  }
}

// In ngOnInit, use the helper

}