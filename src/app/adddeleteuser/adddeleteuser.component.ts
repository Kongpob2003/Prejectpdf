import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Backend } from '../services/api/backend';
import { UserLoginRes } from '../../model/response';
import { AdminsiderbarComponent } from "../adminsiderbar/adminsiderbar.component";

@Component({
  selector: 'app-adddeleteuser',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminsiderbarComponent],
  templateUrl: './adddeleteuser.component.html',
  styleUrls: ['./adddeleteuser.component.css']
})
export class AdddeleteuserComponent implements OnInit {

  activeTab: 'add' | 'delete' = 'add';
  users: UserLoginRes[] = [];

  newUser = {
    username: '',
    email: '',
    password: '',
    phone: '',
    type: 'user'
  };

  emailError = false;
  passwordError = false;
  phoneError = false;

  constructor(
    private backend: Backend,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    this.users = await this.backend.GetUser();
    this.cdr.detectChanges();
  }

  /* ================= EMAIL ================= */
  onEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;

    // อนุญาตเฉพาะอังกฤษ
    input.value = input.value.replace(/[^a-zA-Z0-9._@]/g, '');
    this.newUser.email = input.value;

    const gmailPattern = /^[a-zA-Z0-9._]+@gmail\.com$/;
    this.emailError = !gmailPattern.test(this.newUser.email);
  }

  /* ================= PASSWORD ================= */
  getPasswordStrength(): string {
    const len = this.newUser.password.length;
    if (len === 0) return '';
    if (len < 6) return 'อ่อนแอ';
    if (len < 10) return 'ปานกลาง';
    return 'แข็งแรง';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength === 'อ่อนแอ') return 'weak';
    if (strength === 'ปานกลาง') return 'medium';
    if (strength === 'แข็งแรง') return 'strong';
    return '';
  }

  /* ================= PHONE ================= */
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.newUser.phone = input.value;
    this.phoneError = this.newUser.phone.length !== 10;
  }

  /* ================= ADD USER ================= */
  async addUser() {
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password || !this.newUser.phone) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // password >= 4
    this.passwordError = this.newUser.password.length < 4;
    if (this.passwordError) {
      alert('รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร');
      return;
    }

    // gmail only
    const gmailPattern = /^[a-zA-Z0-9._]+@gmail\.com$/;
    this.emailError = !gmailPattern.test(this.newUser.email);
    if (this.emailError) {
      alert('อีเมลต้องเป็น @gmail.com เท่านั้น');
      return;
    }

    // phone
    if (this.phoneError) {
      alert('เบอร์โทรต้องเป็นตัวเลข 10 หลัก');
      return;
    }

    try {
      // ✅ เรียก backend
      await this.backend.AddUser(this.newUser);
      
      // ✅ ถ้าสำเร็จ
      alert('เพิ่มผู้ใช้สำเร็จ');

      // Reset Form
      this.newUser = {
        username: '',
        email: '',
        password: '',
        phone: '',
        type: 'user'
      };

      await this.loadUsers();

    } catch (error: any) {
      console.error(error);

      // ✅ ดักจับ Error Email ซ้ำ
      // (ตรวจสอบ status หรือ error message ตามที่ Backend ส่งมา)
      if (error.status === 409 || error.error?.message === 'Email already exists') {
        alert('❌ ไม่สามารถเพิ่มได้: อีเมลนี้มีผู้ใช้งานแล้ว');
      } else {
        alert('❌ เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
      }
    }
  }

  /* ================= DELETE ================= */
  async deleteUser(uid: number) {
    if (!confirm('คุณต้องการลบผู้ใช้นี้หรือไม่?')) return;
    await this.backend.DeleteUser(uid);
    this.users = this.users.filter(u => u.uid !== uid);
    this.cdr.detectChanges();
    alert('ลบผู้ใช้สำเร็จ');
  }
}
