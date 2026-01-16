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
  user: UserLoginRes | null = null;
  constructor(private router: Router,
    private auth: AuthService,
    private backend: Backend,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.user = await this.auth.getUser();
      console.log('HOME USER:', this.user);
    }
    if (this.user){
      this.profile = {
        username: this.user.username,
        email: this.user.email,
        password: this.user.password,
        phone: this.user.phone
      };
    }
  }
    profile = {
        username: '',
        email: '',
        password: '',
        phone: ''
      };

  isEditing = false;

  editProfile() {
    this.isEditing = true;
  }

  async saveProfile() {
  if (!this.user) return;

  const payload = {
    uid: this.user.uid,          // สำคัญมาก
    username: this.profile.username,
    email: this.profile.email,
    password: this.profile.password,
    phone: this.profile.phone
  };

  try {
    const res = await this.backend.EditUser(payload,payload.uid);

    // ✅ อัปเดต user ใน localStorage
    this.user = {
      ...this.user,
      ...this.profile
    };

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
