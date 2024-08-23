import { Component, Input, Output, EventEmitter , SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/utils.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalComponent } from '../../../common/modal/modal.component';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [ CommonModule, NgSelectModule, ReactiveFormsModule, ModalComponent ,IconModule],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.css'
})
export class ProfileModalComponent {
    @Input() isOpenProfileModal: boolean = false;
    @Output() isOpenProfileModalChange = new EventEmitter<boolean>();
    @Input() ProfileData: any = null;
    @Input() serviceName = '';
  
    close() {
      this.isOpenProfileModal = false;
      this.isOpenProfileModalChange.emit(this.isOpenProfileModal);
      this.resetForm();
    }
    
  ProfileModalForm: FormGroup;

  isSubmitForm = false;

  TypeOptions = [
    { id: 0, name: 'Add Type' , disabled: true }, // This is the "Add Type" option
    { id: 1, name: 'Shipper' },
    { id: 2, name: 'Carrier' },
    { id: 3, name: 'Loader' }
  ];
  CategoryOptions = [
    { id: 0, name: 'Add Category' , disabled: true }, // This is the "Add Category" option
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    { id: 3, name: 'Category 3' }
  ];
  
  isTypeModalOpen = false;
  type: any = {};

  isCategoryModalOpen = false;
  category: any = {};

  onAddCategoryClick(category: any = null) {
    this.isCategoryModalOpen = true;
    this.serviceName = 'Category';
    this.category = category;
    }

  onAddTypeClick(type: any = null) {
  this.isTypeModalOpen = true;
  this.serviceName = 'Type';
  this.type = type;
  }

  constructor(private fb: FormBuilder, private utilsService: UtilsService) {
    // Initialize the form with FormBuilder
    this.ProfileModalForm = this.fb.group({
      FirstName: new FormControl("", [Validators.required]),
      MiddleName: new FormControl("", [Validators.required]),
      LastName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      belongTo: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required]),
      location: new FormControl("", [Validators.required]),
    });
  }


  // Method for handling form submission
  saveProfile() {
    this.isSubmitForm = true;
    if (this.ProfileModalForm.valid) {
      // Form is valid
      this.utilsService.showMessage('RoleRight' + (this.ProfileData?.id ?  ' Updated successfully!' : ' Added successfully!'), 'success');
      console.log(this.ProfileModalForm.value);
      
      // Reset the form after successful submission
      this.resetForm();
      
      // Emit close event
      this.close();
    }
  }
  setFormValues(profile: any) {
    this.ProfileModalForm.setValue({
      FirstName: profile.FirstName || "",
      MiddleName: profile.MiddleName || "",
      LastName: profile.LastName || "",
      email: profile.email || "",
      password: "",
      belongTo: profile.belongTo || "",
      category: profile.category || "",
      status: profile.status || "",
      location: profile.location || "",
    });
  }

  // Method to reset the form
  resetForm() {
    Object.keys(this.ProfileModalForm.controls).forEach(key => {
      if (this.ProfileModalForm.controls[key].dirty) {
        this.ProfileModalForm.controls[key].reset();
      }
    });
    this.isSubmitForm = false;
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes['ProfileData'] && this.ProfileData) {
      this.setFormValues(this.ProfileData);
    }
    if (changes['isOpenProfileModal']) {
      (this.ProfileData==null) ?  this.ProfileModalForm.reset() : this.setFormValues(this.ProfileData);
    }
  }
}
