import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Backend } from '../services/api/backend';
import { UserLoginRes } from '../../model/response';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = ''

  constructor(private router: Router,
    private backend : Backend,
    private auth: AuthService
  ) {}

  async login() {

    if (!this.email || !this.password) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }


    // ✅ สร้าง body ให้ตรงกับ backend
    const body = {
      identifier: this.email,   // หรือ username
      password: this.password
    };
   
    try {
      const response = await this.backend.login(body);

      if(!response){
        alert('ข้อมูลไม่ถูกต้อง');
        return;
      }

      const user = response as UserLoginRes;

      if (user.status === '0') {
        alert('บัญชีนี้ของคุณถูกระงับการใช้งาน');
        return; // ⛔ จบการทำงานทันที ไม่ให้ Login
      }
      // ใช้งาน AuthService ใน LoginComponent
      this.auth.setUser(user);

      // ✅ เช็ค role / type (ถ้ามี)
      if (user.type === 'admin') {
        this.router.navigate(['/home']);
      }
      else {
        this.router.navigate(['/userhome']);
      }
    } catch (error : any) {
      console.error(error);
      const backendMessage = error.error?.message || error.response?.data?.message;
      const statusCode = error.status || error.response?.status;
      //  เช็คเงื่อนไขและ Alert แจ้งเตือนผู้ใช้ให้ตรงจุด
      if (statusCode === 403 || backendMessage === "Account disabled") {
        alert('บัญชีนี้ถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ');

      } else if (statusCode === 401) {
        alert('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');

      } else if (statusCode === 400) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');

      } else {
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
      }
    }
  }
 

    

}
