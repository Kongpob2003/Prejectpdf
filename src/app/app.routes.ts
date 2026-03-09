import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard'; // ตรวจสอบ path

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },

  // ================= ADMIN ROUTES =================
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] } // ✅ อนุญาตเฉพาะ admin
  },
  {
    path: 'adddeleteuser',
    loadComponent: () => import('./adddeleteuser/adddeleteuser.component').then(m => m.AdddeleteuserComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'category',
    loadComponent: () => import('./category/category.component').then(m => m.CategoryComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'qualityassurance', // สมมติว่าเป็นของ Admin
    loadComponent: () => import('./qualityassurance/qualityassurance.component').then(m => m.QualityassuranceComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'relation', // สมมติว่าเป็นของ Admin
    loadComponent: () => import('./relation/relation.component').then(m => m.RelationComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'jae', // สมมติว่าเป็นของ Admin
    loadComponent: () => import('./jae/jae.component').then(m => m.JaeComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },

{
    path: 'menubook', // สมมติว่าเป็นของ Admin
    loadComponent: () => import('./menubook/menubook.component').then(m => m.Menubook),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  // ================= USER ROUTES =================
  {
    path: 'userhome',
    loadComponent: () => import('./userhome/userhome.component').then(m => m.UserHomeComponent),
    canActivate: [authGuard],
    data: { roles: ['user'] } // ✅ อนุญาตเฉพาะ user
  },
  {
    path: 'userprofile',
    loadComponent: () => import('./userprofile/userprofile.component').then(m => m.UserprofileComponent),
    canActivate: [authGuard],
    data: { roles: ['user'] }
  },
  {
    path: 'usercalender',
    loadComponent: () => import('./usercalender/usercalender.component').then(m => m.UserCalenderComponent),
    canActivate: [authGuard],
    data: { roles: ['user'] }
  },
  {
    path: 'userrelation',
    loadComponent: () => import('./userrelation/userrelation.component').then(m => m.UserRelationComponent),
    canActivate: [authGuard],
    data: { roles: ['user'] }
  },
  {
    path: 'userjae',
    loadComponent: () => import('./userjae/userjae.component').then(m => m.UserjaeComponent),
    canActivate: [authGuard],
    data: { roles: ['user'] }
  },
  {
    path: 'userqualityassurance',
    loadComponent: () => import('./userqualityassurance/userqualityassurance.component').then(m => m.UserQualityassuranceComponent),
    canActivate: [authGuard],
    data: { roles: ['user'] }
  },

  // ================= SHARED / PUBLIC / OTHER =================
  {
    path: 'profile', // อันนี้อาจจะเป็นของ Admin หรือเปล่า? ถ้าใช่ให้ใส่ roles: ['admin']
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] } 
  },
  {
    path: 'calender', // อันนี้อาจจะเป็นของ Admin
    loadComponent: () => import('./calender/calender.component').then(m => m.CalenderComponent),
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  
  // Components ที่อาจจะไม่ได้เป็น Page หลัก (หรือถ้าเป็น Page ก็ใส่ Guard)
  {
    path: 'sidebar',
    loadComponent: () => import('./sidebar/sidebar.component').then(m => m.SidebarComponent)
  },
  {
    path: 'adminsidebar',
    loadComponent: () => import('./adminsiderbar/adminsiderbar.component').then(m => m.AdminsiderbarComponent)
  },
  {
    path: 'review',
    loadComponent: () => import('./review/review.component').then(m => m.Review),
    canActivate: [authGuard],
    data: { roles: ['admin', 'user'] } // ✅ ตัวอย่างถ้าเข้าได้ทั้ง 2 สิทธิ์
  },
];