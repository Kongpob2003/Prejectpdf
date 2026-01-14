import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // SSR → ไม่เช็ค localStorage
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
