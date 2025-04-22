import { Component , ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { RoleRightModalComponent } from './components/role-right-modal/role-right-modal.component';
import { DeleteModalComponent } from '../common/delete-modal/delete-modal.component';
@Component({
  selector: 'app-role-right',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RoleRightModalComponent , IconModule , DataTableModule , DeleteModalComponent],
  templateUrl: './role-right.component.html',
  styleUrl: './role-right.component.css'
})
export class RoleRightComponent {
  @ViewChild ('datatable') datatable: any;
  isRoleRightModalOpen = false;
  isDeleteRoleRightModalOpen = false;
  RoleRightData: any = {};
  RoleRightId: number = 0;
  deleteserviceName = 'Delete RoleRight';
  serviceName = 'RoleRight';

  openRoleRightModal(RoleRightData: any = null) {
      this.RoleRightData = RoleRightData;
    this.isRoleRightModalOpen = true;
  }
  openDeleteRoleRightModal( RoleRightId: number) {
      this.RoleRightId = RoleRightId;
    this.isDeleteRoleRightModalOpen = true;
  }
search = '';
cols = [
    { field: 'id', title: 'SrNo', isUnique: true, filter: false },
    { field: 'ProfileName', title: 'Profile'  },
    { field: 'RoleName', title: 'Role Name'  },
    { field: 'createdBy', title: 'Created By'},
    { field: 'actions', title: 'Actions', sort: false, headerClass: 'justify-center' },
];

rows = [
    {
        id: 1,
        RoleName: 'Admin',
        ProfileName: 'Profile 1',
        createdBy: 'Caroline Jensen',
    },
    {
        id: 2,
        RoleName: 'Faculty',
        ProfileName: 'Profile 2',
        createdBy: 'Celeste Grant',
    },
    {
        id: 3,
        createdBy: 'Tillman Forbes',
        ProfileName: 'Profile 3',
        RoleName: 'Administration',
    },
    {
        id: 4,
        RoleName:'HOD',
        ProfileName: 'Profile 4',
        createdBy: 'Daisy Whitley',
    },
];
}
