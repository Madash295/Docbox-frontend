import { Component , ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { LocationModalComponent } from './components/location-modal/location-modal.component';
import { DeleteModalComponent } from '../common/delete-modal/delete-modal.component';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LocationModalComponent , IconModule , DataTableModule , DeleteModalComponent],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent {
  @ViewChild ('datatable') datatable: any;
  isLocationModalOpen = false;
  isDeleteLocationModalOpen = false;
  LocationData: any = {};
  locationId: number = 0;
  serviceName = 'RoleRight';

  deleteserviceName = 'Delete Location';

  openLocationModal(LocationData: any = null) {
      this.LocationData = LocationData;
    this.isLocationModalOpen = true;
  }
  openDeleteLocationModal( locationId: number) {
      this.locationId = locationId;
      this.isDeleteLocationModalOpen = true;
  }
search = '';
cols = [
    { field: 'id', title: 'SrNo', isUnique: true, filter: false },
    { field: 'zipcode', title: 'Zipcode'  },
    { field: 'teritory', title: 'Teritory'  },
    { field: 'address1', title: 'Address 1'},
    { field: 'address2', title: 'Address 2'},
    { field: 'actions', title: 'Actions', sort: false, headerClass: 'justify-center' },
];

rows = [
    {
        id: 1,
        zipcode: 'zipcode1',
        teritory: 'teritory1',
        address1: 'address1 xyz street',
        address2: 'address2 xyz city',
        city: 'city1',
        state: 'state1',
    },
    {
      id: 2,
      zipcode: 'zipcode2',
      teritory: 'teritory2',
      address1: 'address1 xyz2 street',
      address2: 'address2 xyz2 city',
      city: 'city2',
      state: 'state2',
  },
  {
    id: 3,
    zipcode: 'zipcode3',
    teritory: 'teritory3',
    address1: 'address1 xyz3 street',
    address2: 'address2 xyz3 city',
    city: 'city3',
    state: 'state3',
  },
  {
    id: 4,
    zipcode: 'zipcode4',
    teritory: 'teritory4',
    address1: 'address1 xyz4 street',
    address2: 'address2 xyz4 city',
    city: 'city4',
    state: 'state4',
  },
];
}
