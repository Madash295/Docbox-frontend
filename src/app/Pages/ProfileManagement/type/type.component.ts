import { Component , OnInit  , ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { ModalComponent } from '../common/modal/modal.component';
import { DeleteModalComponent } from '../common/delete-modal/delete-modal.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
@Component({
  selector: 'app-type',
  standalone: true,
  imports: [CommonModule, DataTableModule,  ModalComponent , DeleteModalComponent , IconModule],
  templateUrl: './type.component.html',
  styleUrl: './type.component.css'
})
export class TypeComponent {
    @ViewChild ('datatable') datatable: any;
    isTypeModalOpen = false;
    isDeleteTypeModalOpen = false;
    type: any = {};
    typeId: number = 0;
    deleteServiceName = 'Delete Type';
    serviceName = 'Type';
  
    openTypeModal(type: any = null) {
        this.type = type;
        this.isTypeModalOpen = true;
    }
    openDeleteTypeModal( typeId: number) {
      this.typeId = typeId;
    this.isDeleteTypeModalOpen = true;
  }
  search = '';
  cols = [
      { field: 'id', title: 'SrNo', isUnique: true, filter: false },
      { field: 'name', title: 'Type Name'  },
      { field: 'createdBy', title: 'Created By'},
      { field: 'isActive', title: 'Active', type: 'bool'},
      { field: 'actions', title: 'Actions', sort: false, headerClass:'justify-center' },
  ];
  
  rows = [
      {
          id: 1,
          name: 'Admin',
          createdBy: 'Caroline Jensen',
          isActive: true,
      },
      {
          id: 2,
          name: 'Shipper',
          createdBy: 'Celeste Grant',
          isActive: false,
      },
      {
          id: 3,
          createdBy: 'Tillman Forbes',
          name: 'User',
          isActive: false,
      },
      {
          id: 4,
          name:'Loader',
          createdBy: 'Daisy Whitley',
          isActive: true,
      },
  ];
  

}
