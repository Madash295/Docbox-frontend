declare var google:any;
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
  })
  export class GoogleService {
  
    constructor( public router: Router ) {
    
    }
    LogoutFromGoogle(){
        google.accounts.id.disableAutoSelect(
        )
            console.log('Logged out of Google');
        
        this.router.navigate(['/']);
    }
  
   
  }