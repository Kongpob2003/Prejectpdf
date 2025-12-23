import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-adddeleteuser',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
  ],
  templateUrl: './adddeleteuser.component.html',
  styleUrl: './adddeleteuser.component.css',
})
export class AdddeleteuserComponent {

  activeTab: 'add' | 'delete' = 'add';

  users = [
    { username: 'admin', password : '1234',email: 'admin@mail.com',phone: '0123456789', role: 'admin' },
    { username: 'user1', password : '1234',email: 'user1@mail.com',phone: '0999999999', role: 'user' }
  ];

  newUser = {
    username: '',
    email: '',
    password: '',
    phone:'',
    role: 'user'
  };
  newPassword: any;
  newPhone: any;

  addUser() {
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    this.users.push({
      username: this.newUser.username,
      password: this.newPassword.password,
      email: this.newUser.email,
      phone: this.newPhone.phone,
      role: this.newUser.role,

    });

    this.newUser = {
      username: '',
      email: '',
      password: '',
      phone:'',
      role: 'user'
    };

    alert('เพิ่มผู้ใช้สำเร็จ');
    this.activeTab = 'delete';
  }

  deleteUser(index: number) {
    if (confirm('ยืนยันการลบผู้ใช้?')) {
      this.users.splice(index, 1);
    }
  }
}

