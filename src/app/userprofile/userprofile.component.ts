import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

import { UserLoginRes } from '../../model/response';
import { Backend } from '../services/api/backend';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent {

  user: UserLoginRes | null = null;

  profile = {
    username: '',
    email: '',
    password: '',
    phone: ''
  };

  isEditing = false;

  // ===== VALIDATION FLAGS =====
  emailError = false;
  passwordError = false;
  phoneError = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private backend: Backend,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.user = await this.auth.getUser();
      console.log('PROFILE USER:', this.user);
    }

    if (this.user) {
      this.profile = {
        username: this.user.username,
        email: this.user.email,
        password: this.user.password,
        phone: this.user.phone
      };
    }
  }

  editProfile() {
    this.isEditing = true;
  }

  async saveProfile() {
    if (!this.user) return;

    // ===== VALIDATION =====
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    this.emailError = !emailRegex.test(this.profile.email);
    this.passwordError = this.profile.password.length < 4;
    this.phoneError = !/^\d{10}$/.test(this.profile.phone);

    // ❌ ถ้าไม่ผ่าน ไม่ยิง backend
    if (this.emailError || this.passwordError || this.phoneError) {
      alert('กรุณากรอกข้อมูลให้ถูกต้อง');
      return;
    }

    const payload = {
      uid: this.user.uid,
      username: this.profile.username,
      email: this.profile.email,
      password: this.profile.password,
      phone: this.profile.phone
    };

    try {
      // ✅ เชื่อม backend จริง
      await this.backend.EditUser(payload, payload.uid);

      // ✅ sync user ฝั่ง frontend
      this.user = { ...this.user, ...this.profile };
      this.auth.setUser(this.user);

      this.isEditing = false;
      alert('บันทึกข้อมูลเรียบร้อย');
      this.cdr.detectChanges();

    } catch (err) {
      console.error(err);
      alert('บันทึกข้อมูลไม่สำเร็จ');
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
