import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserLocalStorge } from '../../model/response';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    
  private readonly KEY = 'user';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setUser(user: UserLocalStorge) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.KEY, JSON.stringify(user));
    }
  }

  getUser(): UserLocalStorge | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null; // 👈 สำคัญมาก
    }
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.KEY);
    }
  }

  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!this.getUser();
  }
}
