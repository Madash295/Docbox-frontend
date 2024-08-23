import { Component , Input, Output, EventEmitter ,OnChanges,  SimpleChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/utils.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  @Input() isOpenModal: boolean = false;
  @Input () modalTitle: string = '';
  @Output() isOpenModalChange = new EventEmitter<boolean>();
  @Input() data: any = null;
  @Input() serviceName = '';
  CommonModalForm: FormGroup;
  close()
  {
    this.isOpenModal = false;
    this.isOpenModalChange.emit(this.isOpenModal);
  }

  isSubmitForm = false;

  constructor(private fb: FormBuilder, private utilsService: UtilsService) {
    // Initialize the form with FormBuilder
    this.CommonModalForm = this.fb.group({
      Name: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required]),
    });
  }
  setFormValues(data: any) {
    this.CommonModalForm.setValue({
      Name: data.name || "",
      status: data.isActive || "",
    });
  }
  // Method for handling form submission
  SaveModal() {
    this.isSubmitForm = true;
    if (this.CommonModalForm.valid) {
      // Form is valid
      this.utilsService.showMessage(this.modalTitle + (this.data?.id ?  ' Updated successfully!' : ' Added successfully!'), 'success');
      console.log(this.CommonModalForm.value);
      
      // Reset the form after successful submission
      this.resetForm();
      
      // Emit close event
      this.close();
    }
  }

  // Method to reset the form
  resetForm() {
    Object.keys(this.CommonModalForm.controls).forEach(key => {
      if (this.CommonModalForm.controls[key].dirty) {
        this.CommonModalForm.controls[key].reset();
      }
    });
    this.isSubmitForm = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.setFormValues(this.data);
    }

    if (changes['isOpenModal']) {
     
      (this.data==null) ?  this.CommonModalForm.reset() : this.setFormValues(this.data);
        
    }
  }
}
