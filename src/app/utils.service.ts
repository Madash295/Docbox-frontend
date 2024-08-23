import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  showMessage(msg: string = '', type: 'success' | 'error' | 'info' | 'warning' = 'success') {
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: 'toast' },
    });

    toast.fire({
      icon: type,
      title: msg,
      padding: '10px 20px',
    });
  }
}
