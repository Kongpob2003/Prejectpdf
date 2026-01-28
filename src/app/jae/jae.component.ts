import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PdfPreviewDialogComponent } from '../pdf-preview-dialog/pdf-preview-dialog.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserLocalStorge } from '../../model/response';
import { Backend } from '../services/api/backend';

@Component({
  selector: 'app-jae',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './jae.component.html',
  styleUrl: './jae.component.css',
})
export class JaeComponent implements OnInit {
  teachers: any[] = [];
  selectedTeacher: any = null;
  
  groupedFiles: { year: string; files: any[] }[] = [];
  selectedYearFiles: any[] = []; // ไฟล์ที่แสดงผลปัจจุบัน
  activeYear: string = '';
  
  // เพิ่มตัวแปรสำหรับเช็คสถานะเทอม (0=ทั้งหมด, 1=เทอม1, 2=เทอม2)
  activeTerm: number = 0; 
  // เก็บไฟล์ตั้งต้นของปีนั้นๆ ไว้เวลากดปุ่ม "ทั้งหมด" จะได้ไม่ต้องโหลดใหม่
  originalYearFiles: any[] = []; 

  constructor(
    private dialog: MatDialog,
    private backend: Backend,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadUsers();
    }
  }

  async loadUsers() {
    try {
      this.teachers = await this.backend.GetUser();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  async openTeacher(user: UserLocalStorge) {
    this.selectedTeacher = user;
    try {
      // ดึงไฟล์ทั้งหมดก่อนเพื่อจัดกลุ่มปี
      const files: any = await this.backend.FileUser(user.uid);
      this.groupFilesByYear(files);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading files:', error);
      this.groupedFiles = [];
    }
  }

  groupFilesByYear(files: any[]) {
    const groups: { [key: string]: any[] } = {};

    files.forEach(file => {
      const date = new Date(file.create_at);
      const year = (date.getFullYear() + 543).toString();

      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(file);
    });

    this.groupedFiles = Object.keys(groups).map(year => ({
      year,
      files: groups[year]
    })).sort((a, b) => b.year.localeCompare(a.year));

    if (this.groupedFiles.length > 0) {
      this.selectYear(this.groupedFiles[0]);
    } else {
      this.selectedYearFiles = [];
      this.activeYear = '';
    }
  }

  // เลือกปี (Reset เทอมเป็นทั้งหมด)
  selectYear(group: any) {
    this.activeYear = group.year;
    this.originalYearFiles = group.files; // จำไฟล์ทั้งหมดของปีนี้ไว้
    this.selectedYearFiles = group.files; // แสดงไฟล์ทั้งหมดก่อน
    this.activeTerm = 0; // รีเซ็ตปุ่มเทอม
  }

  // ฟังก์ชันโหลดข้อมูลตามเทอม
  async loadTerm(term: number) {
    if (!this.selectedTeacher) return;

    this.activeTerm = term;
    this.selectedYearFiles = []; // เคลียร์หน้าจอก่อนโหลด

    try {
      let files: any = [];
      const uid = this.selectedTeacher.uid;

      // เรียก API ตามเทอมที่เลือก
      if (term === 1) {
        files = await this.backend.FileUserTerm1(uid);
      } else if (term === 2) {
        files = await this.backend.FileUserTerm2(uid);
      }

      // *** สำคัญ: กรองเฉพาะไฟล์ที่ตรงกับ Active Year ***
      // API ส่งมาทุกปี เราต้องเลือกเฉพาะปีปัจจุบันที่ User ดูอยู่
      // ✅ แก้ไข: เช็คว่า files ไม่เป็น null และเป็น Array จริงๆ ก่อนใช้ .filter
      if (files && Array.isArray(files)) {
        this.selectedYearFiles = files.filter((f: any) => {
          const date = new Date(f.create_at);
          const year = (date.getFullYear() + 543).toString();
          return year === this.activeYear;
        });
      } else {
        // ถ้าไม่มีข้อมูล (files เป็น null) ให้เป็น array ว่าง
        this.selectedYearFiles = [];
      }

      this.cdr.detectChanges();

    } catch (error) {
      console.error(`Error loading term ${term}:`, error);
      this.selectedYearFiles = [];
    }
  }

  // ปุ่มกดกลับมาดูทั้งหมดของปีนั้น (ไม่ต้องโหลด API ใหม่ ใช้ข้อมูลเดิม)
  resetToAllFiles() {
    this.activeTerm = 0;
    this.selectedYearFiles = this.originalYearFiles;
  }

  backToFolders() {
    this.selectedTeacher = null;
    this.groupedFiles = [];
    this.selectedYearFiles = [];
    this.activeTerm = 0;
  }

  openPreview(file: any) {
    this.dialog.open(PdfPreviewDialogComponent, {
      width: '80vw',
      maxWidth: '900px',
      data: {
        name: file.file_name,
        url: file.file_url
      }
    });
  }
}