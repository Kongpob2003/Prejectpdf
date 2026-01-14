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
  }
];
