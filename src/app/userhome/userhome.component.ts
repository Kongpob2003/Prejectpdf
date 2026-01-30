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
  document: DocumentItemPos[] = [];
  selectedFile: DocumentItemPos | null = null;
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
      await this.loadDocuments();
    }
  }

  async loadDocuments() {
    this.document = await this.backend.GetFile();
    this.cdr.detectChanges();
  }

  /* ======================
     NAVIGATION
  ====================== */
  goUserprofile() { this.router.navigate(['/userprofile']); }
  goCalender() { this.router.navigate(['/calender']); }
  goRelation() { this.router.navigate(['/relation']); }
  goJae() { this.router.navigate(['/jae']); }
  goQualityassurance() { this.router.navigate(['/qualityassurance']); }

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
    const today = new Date().toISOString().slice(0, 10);
    return this.document.filter(d =>
      (d as any).created_at?.startsWith(today)
    );
  }

  /* ======================
     PREVIEW
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
}
