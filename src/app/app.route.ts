// import { Routes } from '@angular/router';

// // dashboard
// import { IndexComponent } from './index';
// import { AppLayout } from './layouts/app-layout';
// import { AuthLayout } from './layouts/auth-layout';
// import { LoginComponent } from './Pages/Authentication/login/login.component';
// import { ProfileComponent } from './Pages/ProfileManagement/profile/profile.component';
// import { RoleComponent } from './Pages/ProfileManagement/role/role.component';
// import { CategoryComponent } from './Pages/ProfileManagement/category/category.component';
// import { TypeComponent } from './Pages/ProfileManagement/type/type.component';
// import { RoleRightComponent } from './Pages/ProfileManagement/role-right/role-right.component';
// import { LocationComponent } from './Pages/ProfileManagement/location/location.component';

// export const routes: Routes = [
//     {
//         path: '',
//         component: AuthLayout,
//         children: [
//             // dashboard
//             { path: '', component: LoginComponent, title: 'Login' },
//         ],
//     },

//     {
//         path: '',
//         component: AuthLayout,
//         children: [
//         ],
//     },

//     {
//         path: '',
//         component: AppLayout,
//         children: [
//             // dashboard
//             { path: 'home',
                
//                  component: IndexComponent,
//                   title: 'Dashboard' },

//             // profile
//             { path: 'users/profile', component: ProfileComponent, title: 'Profile' },

//               // roles
//             { path: 'users/roles', component: RoleComponent, title: 'Role' },

//                 // categories
//             { path: 'users/categories', component: CategoryComponent, title: 'Category' },

//               // types
//               { path: 'users/types', component: TypeComponent, title: 'Type' },

//               //RoleRight 
//               { path: 'users/role-right', component: RoleRightComponent, title: 'Role Right' },

//               //Location
//               { path: 'users/location', component: LocationComponent, title: 'Location' },
//         ],
//     },
// ];
import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';
import { authGuard } from './auth.guard';

// Route configuration with lazy loading for standalone components
export const routes: Routes = [
    {
        path: '',
        component: AuthLayout,
        children: [
            { 
                path: '', 
                loadComponent: () => import('./Pages/Authentication/login/login.component').then(m => m.LoginComponent), 
                title: 'Login',
                data: { roles: ['Admin'] },  
                canActivate: [authGuard],
            },
            { 
                path: 'auth/register', 
                loadComponent: () => import('./Pages/Authentication/otp-verify/otp-verify.component').then(m => m.OtpVerifyComponent), 
                title: 'Register',
                   data: { roles: ['Admin'] },  
                   canActivate: [authGuard],
            },
        ],
    },
    {
        path: '',
        canActivate: [authGuard],
        component: AppLayout,
        children: [
            { 
                path: 'home', 
                loadComponent: () => import('./index').then(m => m.IndexComponent), 
                title: 'Dashboard' ,
                data: { roles: ['Admin'] }, 
                canActivate: [authGuard],
            },

            { 
                path: 'users/profile', 
                loadComponent: () => import('./Pages/ProfileManagement/profile/profile.component').then(m => m.ProfileComponent), 
                title: 'Profile' ,
                data: { roles: ['Admin'] }, 
                canActivate: [authGuard],
            },
             { 
                path: 'users/profile', 
                loadComponent: () => import('./Pages/ProfileManagement/profile/profile.component').then(m => m.ProfileComponent), 
                title: 'Profile' ,
                data: { roles: ['Admin'] }, 
                canActivate: [authGuard],
            },
            
             { 
                path: 'users/profile', 
                loadComponent: () => import('./Pages/ProfileManagement/profile/profile.component').then(m => m.ProfileComponent), 
                title: 'Profile' ,
                data: { roles: ['Admin'] }, 
                canActivate: [authGuard],
            },
            
            { 
                path: 'users/all-files', 
                loadComponent: () => import('./Pages/DocumentManagement/document-list/document-list.component').then(m => m.DocumentListComponent), 
                title: 'All Files',
                data: { roles: ['Admin'] }, 
                canActivate: [authGuard],
            },
            
            { 
                path: 'admin/companyStats', 
                loadComponent: () => import('./Pages/CompanyManagement/companies/company-stat.component').then(m => m.CompanyComponent), 
                title: 'Company Stats' ,
                data: { roles: ['SuperAdmin'] },
                canActivate: [authGuard], 
            },
            { 
                path: 'admin/backup', 
                loadComponent: () => import('./Pages/CompanyManagement/backupInfo/backup-info.component').then(m => m.BackupComponent), 
                title: 'Backup Info' ,
                data: { roles: ['SuperAdmin'] },
                canActivate: [authGuard], 
            },
             { 
                path: 'trash/recover', 
                loadComponent: () => import('./Pages/DocumentManagement/BackupRecovery/trashRecover.component').then(m => m.TrashComponent), 
                title: 'Trash Recovery' ,
                data: { roles: ['Admin','User'] },
                canActivate: [authGuard], 
            },

            { 
                path: 'dashboard/Analytics', 
                loadComponent: () => import('./Pages/Dashboard/analytics/analytics.component').then(m => m.AnalyticsComponent), 
                title: 'Analytics' ,
                data: { roles: ['Admin'] },
                canActivate: [authGuard], 
            },
              { 
                path: 'dashboard/SuperAdminAnalytics', 
                loadComponent: () => import('./Pages/Dashboard/superAdminDashboard/dashboard.component').then(m => m.DashboardComponent), 
                title: 'Analytics' ,
                data: { roles: ['SuperAdmin'] },
                canActivate: [authGuard], 
            },
            { 
                path: 'profile/edit', 
                loadComponent: () => import('./Pages/Authentication/profile/edit-profile.component').then(m => m.EditProfileComponent), 
                title: 'Edit Profile' ,
                canActivate: [authGuard], 
            }
        ],
    },
];

