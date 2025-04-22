import { Component , ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalComponent } from '../common/modal/modal.component';
import { DeleteModalComponent } from '../common/delete-modal/delete-modal.component';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule , DataTableModule , IconModule , ModalComponent , DeleteModalComponent],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  @ViewChild ('datatable') datatable: any;
  isRoleModalOpen = false;
  isDeleteRoleModalOpen = false;
  deleteServiceName = 'Role';
  role: any = {};
  roleId: number = 0;
  serviceName = 'Role';

  openRoleModal(role: any = null) {
      this.role = role;
    this.isRoleModalOpen = true;
  }
  openDeleteRoleModal( roleId: number) {
      this.roleId = roleId;
      this.isDeleteRoleModalOpen = true;
  }
search = '';
cols = [
    { field: 'id', title: 'SrNo', isUnique: true, filter: false },
    { field: 'name', title: 'Role Name'  },
    { field: 'createdBy', title: 'Created By'},
    { field: 'isActive', title: 'Active', type: 'bool' },
    { field: 'actions', title: 'Actions', sort: false, headerClass: 'justify-center' },
];

rows = [
    {
        id: 1,
        name: 'Admin',
        createdBy: 'Docbox',
        isActive: true,
    },
    {
        id: 2,
        name: 'Faculty',
        createdBy: 'Docbox',
        isActive: false,
    },
    {
        id: 3,
        createdBy: 'Company Admin',
        name: 'Administration',
        isActive: false,
    },
    {
        id: 4,
        name:'HOD',
        createdBy: 'Company Admin',
        isActive: true,
    },
];

}

