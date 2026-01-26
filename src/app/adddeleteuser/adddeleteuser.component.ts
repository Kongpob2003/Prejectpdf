import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Backend } from '../services/api/backend';
import { UserLoginRes } from '../../model/response';

@Component({
  selector: 'app-adddeleteuser',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './adddeleteuser.component.html',
  styleUrls: ['./adddeleteuser.component.css']
})
export class AdddeleteuserComponent implements OnInit {
  
  activeTab: 'add' | 'delete' = 'add';
  users: UserLoginRes[] = [];
  
  // ข้อมูลสำหรับเพิ่มผู้ใช้
  newUser = {
    username: '',
    email: '',
    password: '',
    phone: '',
    type: 'user' // เปลี่ยนจาก role เป็น type ให้ตรงกับ backend
  };

  constructor(private backend: Backend, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  // โหลดรายการผู้ใช้
  async loadUsers() {
    try {
      this.users = await this.backend.GetUser();
      console.log('Users loaded:', this.users);
      // ✅ บังคับให้ Angular ตรวจสอบการเปลี่ยนแปลง
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading users:', error);
      alert('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    }
  }

  // เพิ่มผู้ใช้
  async addUser() {
    // ตรวจสอบข้อมูล
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password || !this.newUser.phone) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // ตรวจสอบรูปแบบอีเมล
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailPattern.test(this.newUser.email)) {
    //   alert('รูปแบบอีเมลไม่ถูกต้อง');
    //   return;
    // }

    // ตรวจสอบเบอร์โทร (ต้องเป็นตัวเลข 10 หลัก)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(this.newUser.phone)) {
      alert('เบอร์โทรต้องเป็นตัวเลข 10 หลัก');
      return;
    }

    try {
      const response = await this.backend.AddUser(this.newUser);
      console.log('Add user response:', response);
      
      alert('เพิ่มผู้ใช้สำเร็จ');
      
      // รีเซ็ตฟอร์ม
      this.newUser = {
        username: '',
        email: '',
        password: '',
        phone: '',
        type: 'user'
      };
      
      // โหลดข้อมูลใหม่
      await this.loadUsers();
      
    } catch (error: any) {
      console.error('Error adding user:', error);
      if (error.status === 409) {
        alert('อีเมลหรือชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว');
      } else {
        alert('เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
      }
    }
  }

  // ลบผู้ใช้
  async deleteUser(uid: number) {
    if (!confirm('คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?')) {
      return;
    }

    try {
      // 1. ลบจาก backend
      await this.backend.DeleteUser(uid);
      console.log('User deleted successfully');
      
      // 2. ✅ ลบจาก array โดยสร้าง array ใหม่ (เพื่อให้ Angular ตรวจจับได้)
      this.users = this.users.filter(user => user.uid !== uid);
      
      // 3. ✅ บังคับให้ Angular re-render
      this.cdr.detectChanges();
      
      // 4. แสดงข้อความสำเร็จ
      alert('ลบผู้ใช้สำเร็จ');
      
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('เกิดข้อผิดพลาดในการลบผู้ใช้');
      // ถ้าเกิด error ให้โหลดข้อมูลใหม่จาก backend
      await this.loadUsers();
    }
  }

  // ฟังก์ชันเสริม: ตรวจสอบความแข็งแรงของรหัสผ่าน
  getPasswordStrength(): string {
    const password = this.newUser.password;
    if (password.length === 0) return '';
    if (password.length < 6) return 'อ่อนแอ';
    if (password.length < 10) return 'ปานกลาง';
    return 'แข็งแรง';
  }

  // ฟังก์ชันเสริม: แสดงสีตามความแข็งแรงของรหัสผ่าน
  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength === 'อ่อนแอ') return 'weak';
    if (strength === 'ปานกลาง') return 'medium';
    if (strength === 'แข็งแรง') return 'strong';
    return '';
  }

  phoneError = false;

// บังคับให้พิมพ์ได้เฉพาะตัวเลข
onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;

  // ตัดอักษรที่ไม่ใช่ตัวเลขออก
  input.value = input.value.replace(/[^0-9]/g, '');

  this.newUser.phone = input.value;

  // เช็คว่าครบ 10 หลักไหม
  this.phoneError = this.newUser.phone.length !== 10;
}

}