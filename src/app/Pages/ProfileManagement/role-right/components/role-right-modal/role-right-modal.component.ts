import { Component , Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/utils.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-role-right-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , NgSelectModule],
  templateUrl: './role-right-modal.component.html',
  styleUrl: './role-right-modal.component.css'
})
export class RoleRightModalComponent {
  @Input() isOpenModal: boolean = false;
  @Output() isOpenModalChange = new EventEmitter<boolean>();
  @Input() RoleRightData: any = null;
  @Input() serviceName = '';
  RoleRightForm: FormGroup;
  close()
  {
    this.isOpenModal = false;
    this.isOpenModalChange.emit(this.isOpenModal);
  }

  isSubmitForm = false;

  constructor(private fb: FormBuilder, private utilsService: UtilsService) {
    // Initialize the form with FormBuilder
    this.RoleRightForm = this.fb.group({
      profile: new FormControl("", [Validators.required]),
      role: new FormControl("", [Validators.required]),
    });
  }
    // Options for select inputs
    RoleOptions = ['Shipper', 'Loader', 'Carrier'];
    ProfileOptions = ['Profile1', 'Profile2', 'Profile3'];
  setFormValues(data: any) {
    this.RoleRightForm.setValue({
      profile: data.ProfileName || "",
      role: data.RoleName || "",
    });
  }
  // Method for handling form submission
  submit() {
    this.isSubmitForm = true;
    if (this.RoleRightForm.valid) {
      // Form is valid
      this.utilsService.showMessage('RoleRight' + (this.RoleRightData?.id ?  ' Updated successfully!' : ' Added successfully!'), 'success');
      console.log(this.RoleRightForm.value);
      
      // Reset the form after successful submission
      this.resetForm();
      
      // Emit close event
      this.close();
    }
  }

  // Method to reset the form
  resetForm() {
    Object.keys(this.RoleRightForm.controls).forEach(key => {
      if (this.RoleRightForm.controls[key].dirty) {
        this.RoleRightForm.controls[key].reset();
      }
    });
    this.isSubmitForm = false;
  }
 

  ngOnChanges(changes: SimpleChanges) {
    if (changes['RoleRightData'] && this.RoleRightData) {
      this.setFormValues(this.RoleRightData);
    }

    if (changes['isOpenModal']) {
      (this.RoleRightData==null) ?  this.RoleRightForm.reset() : this.setFormValues(this.RoleRightData);
    }
  }
}
