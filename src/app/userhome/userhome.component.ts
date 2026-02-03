import { Component, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../services/auth.service';
import { Backend } from '../services/api/backend';
import { UserLocalStorge } from '../../model/response';

interface DocUser {
  did: number;
  file_url: string;
  title: string;
  create_at: Date;
  uid: number;
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
     SEARCH / FILTER
  ====================== */
  searchText = '';
  viewMode: 'all' | 'today' = 'all';   // ⭐ สำคัญ

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
     TODAY DOCUMENTS
  ====================== */
  get todayDocuments() {
    const today = new Date();

    return this.document.filter(d => {
      if (!d.create_at) return false;
      const docDate = new Date(d.create_at);
      return (
        docDate.getDate() === today.getDate() &&
        docDate.getMonth() === today.getMonth() &&
        docDate.getFullYear() === today.getFullYear()
      );
    });
  }

  /* ======================
     CLICK SUMMARY
  ====================== */
  showAll() {
    this.viewMode = 'all';
  }

  showToday() {
    this.viewMode = 'today';
  }

  /* ======================
     FINAL FILTER (HTML ใช้ตัวนี้)
  ====================== */
  get filteredFilesBySearch() {
    const source =
      this.viewMode === 'today' ? this.todayDocuments : this.document;

    return source.filter(file =>
      file.file_name.toLowerCase().includes(this.searchText.toLowerCase())
    );
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
