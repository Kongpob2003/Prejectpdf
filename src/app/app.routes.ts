import { Routes } from '@angular/router';
import { authGuard } from '../app/services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
    canActivate:[authGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'calender',
    loadComponent: () =>
      import('./calender/calender.component').then(m => m.CalenderComponent)
  },
  {
    path: 'adddeleteuser',
    loadComponent: () =>
      import('./adddeleteuser/adddeleteuser.component').then(m => m.AdddeleteuserComponent)
  },
  {
    path: 'category',
    loadComponent: () =>
      import('./category/category.component').then(m => m.CategoryComponent)
  },
  {
    path: 'jae',
    loadComponent: () =>
      import('./jae/jae.component').then(m => m.JaeComponent),
    canActivate:[authGuard]
  },
  {
    path: 'qualityassurance',
    loadComponent: () =>
      import('./qualityassurance/qualityassurance.component').then(m => m.QualityassuranceComponent)
  },
  {
    path: 'relation',
    loadComponent: () =>
      import('./relation/relation.component').then(m => m.RelationComponent)
  },
   {
    path: 'userhome',
    loadComponent: () =>
      import('./userhome/userhome.component').then(m => m.UserHomeComponent)
  },
  {
    path: 'userprofile',
    loadComponent: () =>
      import('./userprofile/userprofile.component').then(m => m.UserprofileComponent)
  },
  {
    path: 'usercalender',
    loadComponent: () =>
      import('./usercalender/usercalender.component').then(m => m.UserCalenderComponent)
  },
  {
    path: 'userrelation',
    loadComponent: () =>
      import('./userrelation/userrelation.component').then(m => m.UserRelationComponent)
  },
  {
    path: 'userjae',
    loadComponent: () =>
      import('./userjae/userjae.component').then(m => m.UserjaeComponent)
  },
  {
    path: 'userqualityassurance',
    loadComponent: () =>
      import('./userqualityassurance/userqualityassurance.component').then(m => m.UserQualityassuranceComponent)
  },
  {
    path: 'sidebar',
    loadComponent: () =>
      import('./sidebar/sidebar.component').then(m => m.SidebarComponent)
  },
  {
    path: 'adminsidebar',
    loadComponent: () =>
      import('./adminsiderbar/adminsiderbar.component').then(m => m.AdminsiderbarComponent)
  },
  
];
