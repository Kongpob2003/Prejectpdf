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
      console.log(response);
      console.log(user.type);
      // ใช้งาน AuthService ใน LoginComponent
      this.auth.setUser(user);

      // ✅ เช็ค role / type (ถ้ามี)
      if (user.type === 'admin') {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error(error);
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    }
  }
 

    

}
