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
import { AdminsiderbarComponent } from "../adminsiderbar/adminsiderbar.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminsiderbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user: UserLoginRes | null = null;

  profile = {
    username: '',
    email: '',
    password: '',
    phone: ''
  };

  isEditing = false;
  emailDuplicateError = false;
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
    // Reset error ซ้ำก่อนเช็ค
    this.emailDuplicateError = false;
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

    } catch (err : any) {
      console.error(err);
      // ✅ ดักจับ Error 409 (Email ซ้ำ)
      if (err.status === 409) {
        this.emailDuplicateError = true; // สั่งโชว์ตัวแดง
        alert('❌ ไม่สามารถบันทึกได้: อีเมลนี้มีผู้ใช้งานแล้ว');
      } else {
        alert('❌ บันทึกข้อมูลไม่สำเร็จ');
      }
      this.cdr.detectChanges();
      
    }
  }
  // เพิ่มฟังก์ชัน reset error เมื่อพิมพ์ใหม่
  onEmailInput() {
    this.emailDuplicateError = false;
  }
  logout() {
    this.router.navigate(['/login']);
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
