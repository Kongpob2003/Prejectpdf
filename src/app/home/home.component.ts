import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';



import { AuthService } from '../services/auth.service';
import { UserLocalStorge } from '../../model/response';
import { Backend } from '../services/api/backend';
import { DocumentItemPos } from '../../model/document_Item_pos';

import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
  constructor(private router: Router,
    private auth: AuthService,
    private backend : Backend,
     private cdr: ChangeDetectorRef,
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
  
  // ===== FILE LIST =====
  // files = [
  //   { name: 'เอกสาร_1.pdf', status: 'sent', url: 'assets/sample.pdf' },
  //   { name: 'เอกสาร_2.pdf', status: 'unsent', url: 'assets/sample.pdf' },
  //   { name: 'เอกสาร_3.pdf', status: 'sent', url: 'assets/sample.pdf' }
  // ];
  async ngOnInit() {
    // ข้อมูล user
    if (isPlatformBrowser(this.platformId)) {
      this.user = await this.auth.getUser();
      console.log('HOME USER:', this.user);
      this.document = await this.backend.GetFile();
      console.log(this.document);
      // ⭐ บังคับ Angular re-render
    this.cdr.detectChanges();
    }
  }

  searchText = '';
  activeTab: 'all' | 'sent' | 'unsent' = 'all';

  get filteredFiles() {
  return this.document.filter(file => {
    const matchSearch =
      file.file_name.toLowerCase().includes(this.searchText.toLowerCase());
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

  openModal(file: any) {
    this.selectedFile = file;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteFile(event: Event, index: number) {
    event.stopPropagation();
    this.document.splice(index, 1);
  }

  // ===== UPLOAD =====
  showUpload = false;
  uploadTitle = '';   
  uploadFile: File | null = null;
  uploadFileName = '';

  teachers: string[] = [
  'อาจารย์ A',
  'อาจารย์ B',
  'อาจารย์ C',
  'อาจารย์ D'
];

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
  }

  closeUpload() {
    this.showUpload = false;
    this.uploadFile = null;
    this.uploadFileName = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile = input.files[0];
      this.uploadFileName = this.uploadFile.name;
    }
  }

  submitUpload() {
  // เงื่อนไขกรอกครบ (ถ้าคุณมีอยู่แล้วให้ใช้ของเดิม)
  if (!this.uploadFile || !this.uploadFileName || this.selectedTeachers.length === 0) {
    return;
  }

  // ✅ แสดงข้อความสำเร็จ
  this.uploadSuccess = true;

  // ปิด popup
  this.closeUpload();

  // ⏱ ซ่อนข้อความอัตโนมัติหลัง 2 วินาที
  setTimeout(() => {
    this.uploadSuccess = false;
  }, 2000);
}


uploadSuccess = false;

  
}
