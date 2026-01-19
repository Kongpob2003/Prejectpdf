import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

import { Backend } from '../services/api/backend';
import { DocumentItemPos } from '../../model/document_Item_pos';

import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserLocalStorge } from '../../model/response';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: UserLocalStorge | null = null;
  document: DocumentItemPos[] = [];
  safeFileUrl: SafeResourceUrl | null = null;
  constructor(
    private router: Router,
    private auth: AuthService,
    private backend: Backend,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  goRelation() {
    this.router.navigate(['/relation']);
  }

  goQualityassurance() {
    this.router.navigate(['/qualityassurance']);
  }

  goJae() {
    this.router.navigate(['/jae']);
  }

  goCategory() {
    this.router.navigate(['/category']);
  }

  goAdddelete() {
    this.router.navigate(['/adddeleteuser']);
  }

  goCalender() {
    this.router.navigate(['/calender']);
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.user = await this.auth.getUser();
      console.log('HOME USER:', this.user);
      await this.loadDocuments();
    }
  }

  // โหลดเอกสารจาก backend
  async loadDocuments() {
    try {
      this.document = await this.backend.GetFile();
      console.log('Documents:', this.document);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  }

  searchText = '';
  activeTab: 'all' | 'sent' | 'unsent' = 'all';

  get filteredFiles() {
    return this.document.filter(file => {
      const matchSearch = file.file_name
        .toLowerCase()
        .includes(this.searchText.toLowerCase());
      const matchTab =
        this.activeTab === 'all' ||
        (this.activeTab === 'sent' && file.statue === '1') ||
        (this.activeTab === 'unsent' && file.statue === '0');
      return matchSearch && matchTab;
    });
  }

  // ===== PREVIEW MODAL =====
  showModal = false;
  selectedFile: any = null;

  openModal(file: DocumentItemPos) {
    this.selectedFile = file;

  this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    file.file_url
  );

  this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async deleteFile(event: Event, file: DocumentItemPos) {
    event.stopPropagation();
    if (confirm('คุณต้องการลบไฟล์นี้ใช่หรือไม่?')) {
      try {
        await this.backend.DeleteFile(file.did);
        await this.loadDocuments();
        alert('ลบไฟล์สำเร็จ');
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('เกิดข้อผิดพลาดในการลบไฟล์');
      }
    }
  }

  // ===== UPLOAD =====
  showUpload = false;
  uploadTitle = '';
  uploadFile: File | null = null;
  uploadFileName = '';
  uploadSuccess = false;

  teachers: string[] = ['อาจารย์ A', 'อาจารย์ B', 'อาจารย์ C', 'อาจารย์ D'];
  selectedTeachers: string[] = [];

  toggleTeacher(t: string) {
    const index = this.selectedTeachers.indexOf(t);
    if (index === -1) {
      this.selectedTeachers.push(t);
    } else {
      this.selectedTeachers.splice(index, 1);
    }
  }

  openUpload() {
    this.showUpload = true;
    // รีเซ็ตค่า
    this.uploadTitle = '';
    this.uploadFile = null;
    this.uploadFileName = '';
    this.selectedTeachers = [];
  }

  closeUpload() {
    this.showUpload = false;
    this.uploadFile = null;
    this.uploadFileName = '';
    this.uploadTitle = '';
    this.selectedTeachers = [];
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile = input.files[0];
      this.uploadFileName = this.uploadFile.name;
      
      // ✅ แก้ไข encoding ของชื่อไฟล์ภาษาไทย
      try {
        // ตรวจสอบว่าชื่อไฟล์มีปัญหา encoding หรือไม่
        const decoded = this.decodeFileName(this.uploadFile.name);
        this.uploadFileName = decoded;
        this.uploadTitle = decoded.replace(/\.[^/.]+$/, ''); // ตัดนามสกุลออก
      } catch (e) {
        // ถ้า decode ไม่ได้ ใช้ชื่อเดิม
        this.uploadTitle = this.uploadFile.name.replace(/\.[^/.]+$/, '');
      }
      
      console.log('Original filename:', this.uploadFile.name);
      console.log('Decoded filename:', this.uploadFileName);
    }
  }

  // ฟังก์ชันแก้ไข encoding ของชื่อไฟล์
  private decodeFileName(filename: string): string {
    try {
      // ตรวจสอบว่าเป็นภาษาไทยที่ encode ผิดหรือไม่
      if (filename.includes('Ã') || filename.includes('à')) {
        // ลอง decode จาก latin1 เป็น utf8
        const encoder = new TextEncoder();
        const decoder = new TextDecoder('utf-8');
        const latin1Bytes = new Uint8Array(
          Array.from(filename).map(char => char.charCodeAt(0) & 0xFF)
        );
        return decoder.decode(latin1Bytes);
      }
      return filename;
    } catch (e) {
      console.error('Error decoding filename:', e);
      return filename;
    }
  }

  async submitUpload() {
    // ตรวจสอบว่ากรอกครบ
    if (!this.uploadFile || this.selectedTeachers.length === 0) {
      alert('กรุณาเลือกไฟล์และอาจารย์');
      return;
    }

    try {
      // ✅ สร้าง File object ใหม่ด้วยชื่อที่ถูกต้อง
      const correctedFile = new File(
        [this.uploadFile], 
        this.uploadFileName, // ใช้ชื่อที่ decode แล้ว
        { type: this.uploadFile.type }
      );

      // สร้าง FormData
      const formData = new FormData();
      formData.append('file', correctedFile); // ใช้ไฟล์ที่มีชื่อถูกต้อง

      console.log('Uploading file:', correctedFile.name);

      // เรียก API
      const response = await this.backend.Upload_File(formData);
      console.log('Upload success:', response);

      // แสดงข้อความสำเร็จ
      this.uploadSuccess = true;

      // ปิด popup
      this.closeUpload();

      // โหลดข้อมูลใหม่
      await this.loadDocuments();

      // ซ่อนข้อความหลัง 2 วินาที
      setTimeout(() => {
        this.uploadSuccess = false;
      }, 2000);
    } catch (error) {
      console.error('Upload error:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
    }
  }
}