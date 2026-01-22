import { Component, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../services/auth.service';
import { Backend } from '../services/api/backend';
import { DocumentItemPos } from '../../model/document_Item_pos';
import { UserLocalStorge } from '../../model/response';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  // ======================
  // USER
  // ======================
  user: UserLocalStorge | null = null;

  // ======================
  // DATA
  // ======================
  document: DocumentItemPos[] = [];
  selectedFile: DocumentItemPos | null = null;
  safeFileUrl: SafeResourceUrl | null = null;

  // ======================
  // SEARCH / TAB
  // ======================
  searchText = '';
  activeTab: 'all' | 'sent' | 'unsent' = 'all';

  // ======================
  // MODAL STATES
  // ======================
  showModal = false;
  showUpload = false;
  showSendTeacher = false;

  // ======================
  // UPLOAD
  // ======================
  uploadTitle = '';
  uploadFile: File | null = null;
  uploadFileName = '';
  uploadSuccess = false;

  // ======================
  // SEND TEACHER
  // ======================
  teachers: string[] = ['อาจารย์ A', 'อาจารย์ B', 'อาจารย์ C'];
  person: UserLocalStorge[] = [];
  selectedTeachers: string[] = [];


  // ===== CATEGORY (MULTI) =====
categories: string[] = ['วิจัย', 'งบประมาณ', 'กิจกรรม', 'ทั่วไป'];
selectedCategories: string[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private backend: Backend,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ======================
  // LIFECYCLE
  // ======================
  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.user = await this.auth.getUser();
      await this.loadDocuments();
    }
  }

  async loadDocuments() {
    this.document = await this.backend.GetFile();
    this.person = await this.backend.GetUser();
    this.cdr.detectChanges();
  }

  // ======================
  // NAVIGATION
  // ======================
  goProfile() { this.router.navigate(['/profile']); }
  goCalender() { this.router.navigate(['/calender']); }
  goAdddelete() { this.router.navigate(['/adddeleteuser']); }
  goRelation() { this.router.navigate(['/relation']); }
  goJae() { this.router.navigate(['/jae']); }
  goQualityassurance() { this.router.navigate(['/qualityassurance']); }
  goCategory() { this.router.navigate(['/category']); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // ======================
  // FILTER
  // ======================
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

  // ======================
  // PREVIEW MODAL
  // ======================
  openModal(file: DocumentItemPos) {
    this.selectedFile = file;
    this.safeFileUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(file.file_url);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedFile = null;
  }

  // ======================
  // DELETE FILE
  // ======================
  async deleteFile(event: Event, file: DocumentItemPos) {
    event.stopPropagation();
    if (!confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) return;

    await this.backend.DeleteFile(file.did);
    await this.loadDocuments();
  }

  // ======================
  // UPLOAD
  // ======================
  openUpload() {
    this.showUpload = true;
    this.uploadFile = null;
    this.uploadFileName = '';
    this.uploadTitle = '';
  }

  closeUpload() {
    this.showUpload = false;
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.uploadFile = file;
    this.uploadFileName = this.decodeFileName(file.name);
    this.uploadTitle = this.uploadFileName.replace(/\.[^/.]+$/, '');
  }

  private decodeFileName(filename: string): string {
    try {
      if (filename.includes('Ã') || filename.includes('à')) {
        const bytes = new Uint8Array(
          Array.from(filename).map(c => c.charCodeAt(0) & 0xff)
        );
        return new TextDecoder('utf-8').decode(bytes);
      }
      return filename;
    } catch {
      return filename;
    }
  }

  async submitUpload() {
    if (!this.uploadFile) {
      alert('กรุณาเลือกไฟล์');
      return;
    }

    const correctedFile = new File(
      [this.uploadFile],
      this.uploadFileName,
      { type: this.uploadFile.type }
    );

    const formData = new FormData();
    formData.append('file', correctedFile);

    await this.backend.Upload_File(formData);

    this.uploadSuccess = true;
    this.closeUpload();
    await this.loadDocuments();

    setTimeout(() => (this.uploadSuccess = false), 2000);
  }

  // ======================
  // SEND TEACHER
  // ======================
  openSendTeacher() {
  this.showSendTeacher = true;
  this.selectedTeachers = [];
  this.selectedCategories = [];
}

  closeSendTeacher() {
    this.showSendTeacher = false;
  }

  toggleTeacher(t: string) {
    const index = this.selectedTeachers.indexOf(t);
    index === -1
      ? this.selectedTeachers.push(t)
      : this.selectedTeachers.splice(index, 1);
  }

  async sendToTeacher() {
  if (!this.selectedFile) return;
  if (this.selectedCategories.length === 0) {
    alert('กรุณาเลือกหมวดหมู่อย่างน้อย 1 หมวด');
    return;
  }

  await this.backend.SendToTeacher(
    this.selectedFile.did,
    this.selectedTeachers,
    this.selectedCategories // 👈 ส่งเป็น array
  );

  this.closeSendTeacher();
  this.closeModal();
  await this.loadDocuments();
}


toggleCategory(category: string) {
  const index = this.selectedCategories.indexOf(category);
  if (index === -1) {
    this.selectedCategories.push(category);
  } else {
    this.selectedCategories.splice(index, 1);
  }
}

}
