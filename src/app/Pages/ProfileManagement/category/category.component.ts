import { Component , ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalComponent } from '../common/modal/modal.component';
import { DeleteModalComponent } from '../common/delete-modal/delete-modal.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule , DataTableModule , IconModule , ModalComponent , DeleteModalComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  @ViewChild ('datatable') datatable: any;
  isCategoryModalOpen = false;
  isDeleteCategoryModalOpen = false;
  category: any = {};
  categoryId: number = 0;
  deleteServiceName = 'Delete Category';
  serviceName = 'Category';

  openCategoryModal(category: any = null) {
      this.category = category;
      this.isCategoryModalOpen = true;
  }
  openDeleteCategoryModal( categoryId: number) {
    this.categoryId = categoryId;
  this.isDeleteCategoryModalOpen = true;
}
search = '';
cols = [
    { field: 'id', title: 'SrNo', isUnique: true, filter: false },
    { field: 'name', title: 'Category Name'  },
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
