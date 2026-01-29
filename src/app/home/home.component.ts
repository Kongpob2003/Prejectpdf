import { Component, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../services/auth.service';
import { Backend } from '../services/api/backend';
import { DocumentItemPos } from '../../model/document_Item_pos';
import { UserLocalStorge } from '../../model/response';
import { CategoryItemPos } from '../../model/category_Item_pos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  /* ======================
     MODE
  ====================== */
  isEditMode = false;

  /* ======================
     USER
  ====================== */
  displayRole = 'user';
  user: UserLocalStorge | null = null;

  /* ======================
     DATA
  ====================== */
  document: DocumentItemPos[] = [];
  selectedFile: DocumentItemPos | null = null;
  safeFileUrl: SafeResourceUrl | null = null;

  /* ======================
     SEARCH / TAB
  ====================== */
  searchText = '';
  activeTab: 'all' | 'sent' | 'unsent' = 'all';

  /* ======================
     MODAL STATES
  ====================== */
  showModal = false;
  showUpload = false;
  showSendTeacher = false;

  /* ======================
     UPLOAD
  ====================== */
  uploadTitle = '';
  uploadFile: File | null = null;
  uploadFileName = '';
  uploadSuccess = false;

  /* ======================
     SEND TEACHER
  ====================== */
  person: UserLocalStorge[] = [];
  selectedTeachers: number[] = [];

  /* ======================
     CATEGORY
  ====================== */
  category: CategoryItemPos[] = [];
  selectedCategories: number[] = [];
  sendSubject = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private backend: Backend,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /* ======================
     LIFECYCLE
  ====================== */
  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.user = await this.auth.getUser();
      await this.loadDocuments();
    }
  }

  async loadDocuments() {
    this.document = await this.backend.GetFile();
    this.person = await this.backend.GetUser();
    this.category = (await this.backend.getCategory()) as CategoryItemPos[];
    this.cdr.detectChanges();
  }

  /* ======================
     NAVIGATION
  ====================== */
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

  /* ======================
     FILTER
  ====================== */
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

  /* ======================
     PREVIEW MODAL
  ====================== */
  openModal(file: DocumentItemPos) {
    this.selectedFile = file;
    this.safeFileUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(file.file_url);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedFile = null;
    this.safeFileUrl = null;
  }

  closeAllModals() {
    this.showModal = false;
    this.showSendTeacher = false;
    this.showUpload = false;
  }

  /* ======================
     DELETE FILE
  ====================== */
  async deleteFile(event: Event, file: DocumentItemPos) {
    event.stopPropagation();
    if (!confirm('คุณต้องการลบไฟล์นี้หรือไม่?')) return;
    await this.backend.DeleteFile(file.did);
    await this.loadDocuments();
  }

  /* ======================
     UPLOAD
  ====================== */
  openUpload() {
    this.closeAllModals();
    this.showUpload = true;
    this.uploadFile = null;
    this.uploadFileName = '';
    this.uploadTitle = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.uploadFile = input.files[0];
    this.uploadFileName = this.uploadFile.name;
    this.uploadTitle = this.uploadFileName.replace(/\.[^/.]+$/, '');
  }

  async submitUpload() {
    if (!this.uploadFile) return;

    const formData = new FormData();
    formData.append('file', this.uploadFile);
    await this.backend.Upload_File(formData);

    this.uploadSuccess = true;
    this.closeAllModals();
    await this.loadDocuments();
    setTimeout(() => (this.uploadSuccess = false), 2000);
  }

  /* ======================
     SEND / EDIT TEACHER
  ====================== */
  openSendTeacher() {
    this.isEditMode = false;
    this.showModal = false;
    this.showSendTeacher = true;
    this.selectedTeachers = [];
    this.selectedCategories = [];
    this.sendSubject = '';
  }

  openEditSendTeacher() {
    if (!this.selectedFile) return;

    this.isEditMode = true;
    this.showModal = false;
    this.showSendTeacher = true;

    this.sendSubject = this.selectedFile.text || '';
    this.selectedTeachers = this.selectedFile.teacher_ids
      ? [...this.selectedFile.teacher_ids]
      : [];
    this.selectedCategories = this.selectedFile.category_ids
      ? [...this.selectedFile.category_ids]
      : [];
  }

  async sendToTeacher() {
    if (!this.selectedFile) return;

    const payload = {
      document_id: this.selectedFile.did,
      teacher_ids: this.selectedTeachers,
      category_ids: this.selectedCategories,
      text: this.sendSubject,
    };

    await this.backend.sendTeacher(payload);
    alert('ส่งเอกสารสำเร็จ');
    this.closeAllModals();
    await this.loadDocuments();
  }

  updateSendTeacher() {
    alert('บันทึกการแก้ไขแล้ว (UI เท่านั้น)');
    this.closeAllModals();
  }

  /* ======================
     SELECT
  ====================== */
  toggleTeacher(uid: number) {
    const i = this.selectedTeachers.indexOf(uid);
    i === -1 ? this.selectedTeachers.push(uid) : this.selectedTeachers.splice(i, 1);
  }

  toggleCategory(cid: number) {
    const i = this.selectedCategories.indexOf(cid);
    i === -1 ? this.selectedCategories.push(cid) : this.selectedCategories.splice(i, 1);
  }

  selectAllTeachers() {
    this.selectedTeachers = this.person.map(p => p.uid);
  }

  clearAllTeachers() {
    this.selectedTeachers = [];
  }

  selectAllCategories() {
    this.selectedCategories = this.category.map(c => c.category_id);
  }

  clearAllCategories() {
    this.selectedCategories = [];
  }
}
