import { Component, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../services/auth.service';
import { Backend } from '../services/api/backend';
import { DocumentItemPos } from '../../model/document_Item_pos';
import { UserLocalStorge } from '../../model/response';


interface DocUser {
  did:       number;
  file_url:  string;
  title:     string;
  create_at: Date;
  uid:       number;
  file_name: string;
}

@Component({
  selector: 'app-userhome',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './userhome.component.html',
  styleUrls: ['./userhome.component.css'],
})
export class UserHomeComponent {

  /* ======================
     USER
  ====================== */
  user: UserLocalStorge | null = null;
  displayRole = 'user';

  /* ======================
     DATA
  ====================== */
  document: DocUser[] = [];
  selectedFile: DocUser | null = null;
  safeFileUrl: SafeResourceUrl | null = null;

  /* ======================
     SEARCH / TAB
  ====================== */
  searchText = '';

  /* ======================
     MODAL
  ====================== */
  showModal = false;

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
      console.log(this.user?.uid)
      await this.loadDocuments(this.user?.uid);
    }
  }

  async loadDocuments(uid: any) {
    this.document = await this.backend.FileUser(uid);
    this.cdr.detectChanges();
  }

  /* ======================
     NAVIGATION
  ====================== */
  goUserprofile() { this.router.navigate(['/userprofile']); }
  goUsercalender() { this.router.navigate(['/usercalender']); }
  goUserrelation() { this.router.navigate(['/userrelation']); }
  goUserJae() { this.router.navigate(['/userjae']); }
  goUserQualityassurance() { this.router.navigate(['/userqualityassurance']); }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  /* ======================
     FILTER
  ====================== */
  get filteredFiles() {
    return this.document.filter(file =>
      file.file_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  /* ======================
     TODAY DOCUMENTS (UI)
  ====================== */
  get todayDocuments() {
    const today = new Date();
    
    return this.document.filter(d => {
      // ตรวจสอบว่ามีข้อมูลวันที่หรือไม่ (field ชื่อ create_at ตาม Interface DocUser)
      if (!d.create_at) return false;

      const docDate = new Date(d.create_at);

      // เปรียบเทียบ วัน/เดือน/ปี ให้ตรงกับวันนี้ปัจจุบัน
      return docDate.getDate() === today.getDate() &&
             docDate.getMonth() === today.getMonth() &&
             docDate.getFullYear() === today.getFullYear();
    });
  }

  /* ======================
     PREVIEW
  ====================== */
  openModal(file: DocUser) {
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
}
