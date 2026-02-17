import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Backend } from '../services/api/backend';
import { DocumentItemPos } from '../../model/document_Item_pos';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from "../sidebar/sidebar.component";
interface CalendarDay {
  date: number;
  month: number; // 0-11
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  documentCount: number;
  documents: DocumentItemPos[];
}

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './usercalender.component.html',
  styleUrls: ['./usercalender.component.css']
})
export class UserCalenderComponent implements OnInit {
  role: 'admin' | 'user' = 'user';
  
  // ข้อมูลปฏิทิน
  currentMonth: number = new Date().getMonth(); // 0-11
  currentYear: number = new Date().getFullYear();
  
  // ชื่อเดือนภาษาไทย
  monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  
  calendarDays: CalendarDay[] = [];
  allDocuments: DocumentItemPos[] = [];
  
  // ✅ เพิ่มตัวแปรสำหรับ Modal
  showModal: boolean = false;
  selectedDocuments: DocumentItemPos[] = [];
  selectedDateText: string = '';

  // สถิติ
  totalSent = 0;
  todayReceived = 0;

  constructor(
    private backend: Backend,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    // ดึง role จาก user
    const user = await this.auth.getUser();
    this.role = user?.type === 'admin' ? 'admin' : 'user';
    
    // โหลดข้อมูลเอกสาร
    // 2. ถ้ามี User ID ให้โหลดเอกสารของคนนั้น
    if (user && user.uid) {
      console.log('Current User ID:', user.uid);
      await this.loadDocuments(user.uid); // ✅ ส่ง UID ไป
    } else {
      console.warn('User ID not found');
    }
    
    // สร้างปฏิทิน
    this.generateCalendar();
  }

  // โหลดข้อมูลเอกสารทั้งหมด
  async loadDocuments(uid : number) {
    try {
      this.allDocuments = await this.backend.getReceivedDocuments(uid);
      console.log('Documents loaded:', this.allDocuments);
      
      // คำนวณสถิติ
      this.calculateStats();
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }

  // คำนวณสถิติ
  calculateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // เอกสารที่ส่งแล้วทั้งหมด (สำหรับ admin)
    this.totalSent = this.allDocuments.filter(doc => doc.statue === '1').length;
    
    // เอกสารที่ได้รับวันนี้ (สำหรับ user)
    this.todayReceived = this.allDocuments.filter(doc => {
      const docDate = new Date(doc.create_at);
      docDate.setHours(0, 0, 0, 0);
      return docDate.getTime() === today.getTime();
    }).length;
  }

  // สร้างปฏิทิน
  generateCalendar() {
    this.calendarDays = [];
    
    // หาวันแรกและวันสุดท้ายของเดือน
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    // หาวันที่เริ่มต้นของปฏิทิน (อาจเป็นวันสุดท้ายของเดือนก่อนหน้า)
    const startDay = firstDay.getDay(); // 0-6 (อาทิตย์-เสาร์)
    
    // วันที่ปัจจุบัน
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // เติมวันจากเดือนก่อนหน้า
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(this.currentYear, this.currentMonth, -i);
      this.calendarDays.push(this.createCalendarDay(date, false));
    }
    
    // เติมวันในเดือนปัจจุบัน
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      this.calendarDays.push(this.createCalendarDay(date, true));
    }
    
    // เติมวันจากเดือนถัดไป
    const remainingDays = 42 - this.calendarDays.length; // 6 แถว x 7 วัน
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, day);
      this.calendarDays.push(this.createCalendarDay(date, false));
    }
    this.cdr.detectChanges();
  }

  // สร้างวันในปฏิทิน
  createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    // หาเอกสารในวันนี้
    const documentsOnThisDay = this.allDocuments.filter(doc => {
      const docDate = new Date(doc.create_at);
      docDate.setHours(0, 0, 0, 0);
      return docDate.getTime() === dayStart.getTime();
    });
    
    return {
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      isCurrentMonth: isCurrentMonth,
      isToday: dayStart.getTime() === today.getTime(),
      documentCount: documentsOnThisDay.length,
      documents: documentsOnThisDay
    };
  }

  // เดือนก่อนหน้า
  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  // เดือนถัดไป
  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  // ไปยังวันนี้
  goToToday() {
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
    this.generateCalendar();
  }

  // เปลี่ยนเดือน/ปี
  onMonthChange() {
    this.generateCalendar();
  }

  // Getter สำหรับชื่อเดือนและปี
  get monthName(): string {
    return this.monthNames[this.currentMonth];
  }

  get year(): number {
    return this.currentYear;
  }

  // สร้าง array ของปี (ย้อนหลัง 5 ปี ถึง อนาคต 2 ปี)
  get years(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 2; i++) {
      years.push(i);
    }
    return years;
  }

  // แสดงรายละเอียดเอกสารในวันที่คลิก (ถ้าต้องการ)
  onDayClick(day: CalendarDay) {
    if (day.documentCount > 0) {
      this.selectedDocuments = day.documents;
      
      // 2. สร้างข้อความวันที่เพื่อแสดงบนหัว Modal (เช่น 15 กุมภาพันธ์ 2569)
      this.selectedDateText = `${day.date} ${this.monthNames[day.month]} ${day.year + 543}`;
      
      // 3. เปิด Modal
      this.showModal = true;
      
      console.log('Documents on this day:', day.documents);

    }
  }
  // ✅ เพิ่มฟังก์ชันปิด Modal
  closeModal() {
    this.showModal = false;
    this.selectedDocuments = [];
  }

  // ✅ เพิ่มฟังก์ชันเปิดไฟล์ (ถ้าต้องการให้กดที่ชื่อแล้วเปิดไฟล์ได้เลย)
  openDocument(fileUrl: string) {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }
}
