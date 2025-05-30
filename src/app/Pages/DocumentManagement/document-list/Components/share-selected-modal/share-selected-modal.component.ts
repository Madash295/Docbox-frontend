import { Component, Input, Output, EventEmitter , SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/utils.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';

@Component({
  selector: 'app-share-selected-modal',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule,IconModule],
  templateUrl: './share-selected-modal.component.html',
  styleUrl: './share-selected-modal.component.css'
})
export class ShareSelectedModalComponent {
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
    { id: 0, name: 'Add Type' , disabled: true },
    { id: 1, name: 'Administration' },
    { id: 2, name: 'Faculty' },
    { id: 3, name: 'HOD' }
  ];
  CategoryOptions = [
    { id: 0, name: 'Add Category' , disabled: true },
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
