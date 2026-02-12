import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserLoginRes } from '../../model/response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
  private readonly KEY = 'user';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setUser(user: UserLoginRes) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.KEY, JSON.stringify(user));
    }
  }

  getUser(): UserLoginRes | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  // ✅ เพิ่มฟังก์ชันนี้: เพื่อดึง Role ของ user
  getRole(): string | null {
    const user = this.getUser();
    return user ? user.type : null; // ตรวจสอบว่าใน model UserLoginRes มี field 'type' หรือ 'role'
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