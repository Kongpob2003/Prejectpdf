import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // SSR check
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // 1. เช็คว่า Login หรือยัง
  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. เช็ค Role (ถ้า Route นั้นมีการกำหนด data: { roles: [...] })
  const expectedRoles = route.data['roles'] as Array<string>;
  
  if (expectedRoles) {
    const userRole = auth.getRole(); // ได้ค่า 'admin' หรือ 'user'

    // ถ้า Role ของ User ไม่อยู่ในรายชื่อที่อนุญาต
    if (!userRole || !expectedRoles.includes(userRole)) {
      
      // กรณีเข้าผิดสิทธิ์ ให้เด้งไปหน้าแรกของสิทธิ์ตัวเอง
      if (userRole === 'admin') {
        router.navigate(['/home']);
      } else {
        router.navigate(['/userhome']);
      }
      return false;
    }
  }

  return true;
};


