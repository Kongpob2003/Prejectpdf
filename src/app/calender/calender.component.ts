import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule   // ✅ สำคัญมาก
  ],
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent {

  role: 'admin' | 'user' = 'user';

  monthName = 'ธันวาคม';
  year = 2025;

  // ===== ADMIN =====
  totalSent = 128;

  // ===== USER =====
  todayReceived = 3;

  days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  calendarDays = Array.from({ length: 31 }, (_, i) => ({
    date: i + 1,

    // จำนวน "เอกสารที่ถูกส่งมาให้ user ในวันนั้น"
    receivedCount: Math.floor(Math.random() * 4),

    isToday: i + 1 === new Date().getDate()
  }));
todayCount: any;
}

