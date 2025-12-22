import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule   // ✅ สำคัญมาก
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }

  isEditing = false;

  profile = {
    username: 'ชื่อผู้ใช้',
    email: 'user@email.com',
    password: '123456',
    phone: '0999999999'
  };

  editProfile() {
    this.isEditing = true;
  }

  saveProfile() {
    this.isEditing = false;
    alert('บันทึกข้อมูลเรียบร้อย');
  }

  goHome() {
  this.router.navigate(['/home']);
}

}
