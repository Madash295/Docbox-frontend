import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
declare var FB: any;

@Injectable({
    providedIn: 'root'
  })
  export class FacebookService  {
  
    constructor( public router: Router, ) {
      this.initializeFacebookSDK();
      // Ensure the global function is set
      (window as any).loginWithFacebook = this.loginToFacebook.bind(this);
    }
  
    private initializeFacebookSDK() {
      (window as any).fbAsyncInit = () => {
        FB.init({
          appId: '1658715838259299',
          cookie: true,
          xfbml: true,
          version: 'v12.0'
        });
  
        FB.AppEvents.logPageView();
        FB.XFBML.parse();  
      };
  
    }
  
    logoutFromFacebook() {
      return new Promise((resolve, reject) => {
        FB.getLoginStatus((response: any) => {
            debugger
            if (response.status === 'connected') {
        FB.logout((response: any) => {
            debugger
            // FB.Auth.setAuthResponse(null, 'unknown');
          console.log('Logged out of Facebook', response);
          resolve(response);
        });
    }
}, { scope: 'email' });
      });
    }
  
    loginToFacebook(): void {
        FB.getLoginStatus((response: any) => {
          if (response.status === 'connected') {
            console.log('Logged in and authenticated');
            FB.api('/me?fields=name,email', (userInfo: any) => {
              console.log(userInfo);
              this.handleFacebookLogin(response.authResponse.accessToken, userInfo);
              this.router.navigate(['home']);
            });
          } else {
            console.log('Not authenticated');
          }
        }, { scope: 'email' });
     
        // FB.login((response: any) => {
        //     console.log('Logged in and authenticated', response.authResponse);
        //   if (response.authResponse) {
         
        //     FB.api('/me?fields=name,email', (userInfo: any) => {
        //         this.handleFacebookLogin(response.authResponse.accessToken, userInfo);
             
        //     });
        //   } 
        // }, { scope: 'email' });
    
    }
    handleFacebookLogin(accessToken: string, userInfo: any) {
        const payload = {
          accessToken,
          userInfo
        };
        console.log(payload);
    
        // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        // this._httpClient.post<any>(`https://your-backend-api.com/api/login/facebook`, payload, { headers })
        //   .subscribe(response => {
        //     console.log(response);
        //     // Handle the response from your backend
        //   }, error => {
        //     console.error(error);
        //   });
      }
  }
  