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
    // Removed duplicate @Output() isOpenProfileModalChange
    @Input() ProfileData: any = null;
    @Input() serviceName = '';
    @Output() isOpenProfileModalChange = new EventEmitter<boolean>();
    @Output() userAdded = new EventEmitter<string>();
  
    close() {
      this.isOpenProfileModal = false;
      this.isOpenProfileModalChange.emit(false);
      this.resetForm();
    }
    
  ProfileModalForm: FormGroup;

  isSubmitForm = false;

  TypeOptions = [
    { id: 0, name: 'Add Type' , disabled: true }, // This is the "Add Type" option
    { id: 1, name: 'Administration' },
    { id: 2, name: 'Faculty' },
    { id: 3, name: 'HOD' }
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
   
      email: new FormControl("", [Validators.required, Validators.email]),
      
    });
  }


  saveProfile() {
    if (this.ProfileModalForm.valid) {
      // Emit the email entered into the form
      this.userAdded.emit(this.ProfileModalForm.value.email);
      // Optionally reset the form and close the modal
      this.ProfileModalForm.reset();
      this.isOpenProfileModal = false;
      this.isOpenProfileModalChange.emit(false);
    }
  }

  // Method for handling form submission
  
  setFormValues(profile: any) {
    this.ProfileModalForm.setValue({
      email: profile.email || "",

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
