import { Component , Input, Output, EventEmitter ,OnChanges,  SimpleChanges, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from 'src/app/utils.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule , NgSelectModule],
  templateUrl: './location-modal.component.html',
  styleUrl: './location-modal.component.css'
})
export class LocationModalComponent {
  @Input() isOpenModal: boolean = false;
  @Output() isOpenModalChange = new EventEmitter<boolean>();
  @Input() LocationData: any = null;
  @Input() serviceName = '';
  locationModalForm: FormGroup;
  close()
  {
    this.isOpenModal = false;
    this.isOpenModalChange.emit(this.isOpenModal);
  }

  isSubmitForm = false;

  constructor(private fb: FormBuilder, private utilsService: UtilsService) {
    // Initialize the form with FormBuilder
    this.locationModalForm = this.fb.group({
      zipcode: new FormControl("", [Validators.required]),
      teritory: new FormControl("", [Validators.required]),
      address1: new FormControl("", [Validators.required]),
      address2: new FormControl("", [Validators.required]),
      city: new FormControl("", [Validators.required]),
      state: new FormControl("", [Validators.required]),
    });
  }
    // Options for select inputs
    TeritoryOptions = ['Teritory1', 'Teritory2', 'Teritory3'];
  setFormValues(data: any) {
    this.locationModalForm.setValue({
      zipcode: data?.zipcode,
      teritory: data?.teritory,
      address1: data?.address1,
      address2: data?.address2,
      city: data?.city,
      state: data?.state,
    });
  }
  // Method for handling form submission
  submit() {
    this.isSubmitForm = true;
    if (this.locationModalForm.valid) {
      // Form is valid
      this.utilsService.showMessage('Location' + (this.LocationData?.id ?  ' Updated successfully!' : ' Added successfully!'), 'success');
      console.log(this.locationModalForm.value);
      
      // Reset the form after successful submission
      this.resetForm();
      
      // Emit close event
      this.close();
    }
  }

  // Method to reset the form
  resetForm() {
    Object.keys(this.locationModalForm.controls).forEach(key => {
      if (this.locationModalForm.controls[key].dirty) {
        this.locationModalForm.controls[key].reset();
      }
    });
    this.isSubmitForm = false;
  }
  ngOnInit(): void {
    this.setFormValues(this.LocationData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['LocationData'] && this.LocationData) {
      this.setFormValues(this.LocationData);
    }
    if (changes['isOpenModal']) {
      (this.LocationData==null) ?  this.locationModalForm.reset() : this.setFormValues(this.LocationData);
    }

  }
}
