import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { AuthService } from '../services/auth.service';
import { Backend } from '../services/api/backend';
import { DocumentItemPos } from '../../model/document_Item_pos';
import { UserLocalStorge } from '../../model/response';
import { CategoryItemPos } from '../../model/category_Item_pos';
import { SidebarComponent } from "../sidebar/sidebar.component";

interface QAFile {
  name: string;
  url?: string;
  file?: File;
}

interface Folder {
  id?: number;
  name: string;
  files: QAFile[];
}

@Component({
  selector: 'app-userqualityassurance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  templateUrl: './userqualityassurance.component.html',
  styleUrl: './userqualityassurance.component.css',
})
export class UserQualityassuranceComponent {

  folders: Folder[] = [];
  filteredFolders: Folder[] = []; // ✅ เพิ่มตัวนี้สำหรับแสดงผลการค้นหา
  selectedFolder: Folder | null = null;

  searchFolderName = ''; // ✅ เปลี่ยนจาก newFolderName
  
  constructor(
    private auth: AuthService,
    private backend: Backend,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadQuality();
    }
  }

  async loadQuality() {
    const data = await this.backend.getQuailty();
    console.log(data);
    this.folders = data.map((item: any) => ({
      id: item.qid,
      name: item.q_name,
      files: []
    }));
    
    // ✅ เริ่มต้นให้แสดงทั้งหมด
    this.filteredFolders = [...this.folders];
    this.cdr.detectChanges();
  }

  // ✅ ฟังก์ชันค้นหา
  onSearchChange() {
    const searchTerm = this.searchFolderName.trim().toLowerCase();
    
    if (!searchTerm) {
      // ถ้าไม่มีคำค้นหา แสดงทั้งหมด
      this.filteredFolders = [...this.folders];
    } else {
      // กรองเฉพาะที่ตรงกับคำค้นหา
      this.filteredFolders = this.folders.filter(folder =>
        folder.name.toLowerCase().includes(searchTerm)
      );
    }
  }

  // ✅ ฟังก์ชันล้างการค้นหา
  clearSearch() {
    this.searchFolderName = '';
    this.filteredFolders = [...this.folders];
  }

  async openFolder(folder: Folder) {
    this.selectedFolder = folder;

    if (folder.id) {
      try {
        const files: any = await this.backend.getQualityFiles(folder.id);
        console.log('Files in folder:', files);

        this.selectedFolder.files = files.map((f: any) => ({
          name: f.file_name,
          url: f.file_url,
          file: undefined
        }));

        this.cdr.detectChanges();

      } catch (error) {
        console.error('Error loading files:', error);
        this.selectedFolder.files = [];
      }
    }
  }

  backToFolders() {
    this.selectedFolder = null;
  }

  async onFileSelected(event: Event) {
    if (!this.selectedFolder || !this.selectedFolder.id) {
      alert('ไม่พบข้อมูลโฟลเดอร์');
      return;
    }

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const qid = this.selectedFolder.id;

    try {
      const fileFormData = new FormData();
      const correctedFile = new File([file], file.name, { type: file.type });
      fileFormData.append('file', correctedFile);

      await this.backend.Upload_File(fileFormData);

      const documents: any[] = await this.backend.GetFile();
      if (!documents || documents.length === 0) throw new Error('ไม่พบข้อมูลไฟล์');
      
      const latestDocument = documents.reduce((prev, curr) => 
        curr.did > prev.did ? curr : prev
      );

      const body = {
        qid: qid,
        did: latestDocument.did
      };
      
      await this.backend.AddQualityDocument(body);
      await this.openFolder(this.selectedFolder);
      
      console.log('Upload success');

    } catch (error) {
      console.error('Upload error:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      input.value = '';
    }
  }
}