import { CommonModule , isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


import { AuthService } from '../services/auth.service';
import { Backend } from '../services/api/backend';
import { DocumentItemPos } from '../../model/document_Item_pos';
import { UserLocalStorge } from '../../model/response';
import { CategoryItemPos } from '../../model/category_Item_pos';

interface QAFile {
  name: string;
  file?: File; // เก็บไฟล์ไว้ เผื่ออัปโหลดจริง
}

interface Folder {
  id?: number;  // เก็บ qid ไว้ใช้ตอนอัปโหลดไฟล์
  name: string; // ตรงกับ q_name
  files: QAFile[];
}



@Component({
  selector: 'app-qualityassurance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './qualityassurance.component.html',
  styleUrl: './qualityassurance.component.css',
})
export class QualityassuranceComponent {

  folders: Folder[] = [];
  
  selectedFolder: Folder | null = null;

  newFolderName = '';
  
  constructor(
    private auth: AuthService,
    private backend: Backend,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  /// แสดงข้อมูลทั้งหมด ///
  async ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      await this.loadQuality();
    }
  }

  async loadQuality(){
    const data = await this.backend.getQuailty();
    console.log(data);
    this.folders = data.map((item: any) => ({
        id: item.qid,         // เก็บ qid
        name: item.q_name,    // เก็บชื่อ folder
        files: []             // สร้าง array ว่างรอไว้ใส่ไฟล์
      }));
    this.cdr.detectChanges();
    
  }
  async createFolder() {
    if (!this.newFolderName.trim()) return;

    const body = { name: this.newFolderName };
    await this.backend.AddQuality(body);
    await this.loadQuality();
    this.newFolderName = '';
    this.cdr.detectChanges();
  }

  async openFolder(folder: Folder) {
    this.selectedFolder = folder;

    // เช็คว่ามี id ไหม (เผื่อกรณี folder ใหม่ที่ยังไม่มี id แต่ปกติควรมี)
    if (folder.id) {
      try {
        // เรียก API ดึงไฟล์ (แก้ชื่อฟังก์ชันตามข้อ 1)
        const files: any = await this.backend.getQualityFiles(folder.id);
        
        console.log('Files in folder:', files); // ดู log ว่าข้อมูลมาไหม

        // Map ข้อมูลจาก Database (file_name, file_url) เข้า Interface QAFile (name, url)
        this.selectedFolder.files = files.map((f: any) => ({
          name: f.file_name,  // ชื่อไฟล์จาก DB
          url: f.file_url,    // URL ไฟล์จาก DB
          file: undefined     // ไม่ใช่ไฟล์อัปโหลดใหม่ เลยเป็น undefined
        }));

        this.cdr.detectChanges(); // อัปเดตหน้าจอ

      } catch (error) {
        console.error('Error loading files:', error);
        // ถ้า error ให้เคลียร์ไฟล์เป็นว่างๆ ไว้ก่อน
        this.selectedFolder.files = []; 
      }
    }
  }

  backToFolders() {
    this.selectedFolder = null;
    
  }


  async onFileSelected(event: Event) {
    // 1. ตรวจสอบว่ามีโฟลเดอร์ถูกเลือกอยู่ไหม
    if (!this.selectedFolder || !this.selectedFolder.id) {
      alert('ไม่พบข้อมูลโฟลเดอร์');
      return;
    }

    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const qid = this.selectedFolder.id; // จำ ID โฟลเดอร์ไว้ก่อน

    try {
      // --- ขั้นตอนที่ 1: อัปโหลดไฟล์ ---
      const fileFormData = new FormData();
      // แก้ชื่อไฟล์ภาษาไทย (ถ้ามี logic นี้ใน backend service แล้วก็ไม่ต้องทำตรงนี้ก็ได้)
      const correctedFile = new File([file], file.name, { type: file.type });
      fileFormData.append('file', correctedFile);

      await this.backend.Upload_File(fileFormData);

      // --- ขั้นตอนที่ 2: หา did ของไฟล์ล่าสุด ---
      // (ถ้า Backend คุณ return did กลับมาตอน Upload เลยจะดีมาก แต่ถ้าไม่ ก็ใช้วิธีเดิมคือดึงทั้งหมดมาหาตัวล่าสุด)
      const documents: any[] = await this.backend.GetFile();
      if (!documents || documents.length === 0) throw new Error('ไม่พบข้อมูลไฟล์');
      
      const latestDocument = documents.reduce((prev, curr) => 
        curr.did > prev.did ? curr : prev
      );

      // --- ขั้นตอนที่ 3: เชื่อมไฟล์เข้ากับโฟลเดอร์ Quality ---
      const body = {
        qid: qid,
        did: latestDocument.did
      };
      
      await this.backend.AddQualityDocument(body);

      // --- ขั้นตอนที่ 4: รีเฟรชรายการไฟล์ในโฟลเดอร์ ---
      await this.openFolder(this.selectedFolder);
      
      console.log('Upload success');

    } catch (error) {
      console.error('Upload error:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      // เคลียร์ค่า input ให้ว่าง เพื่อให้เลือกไฟล์เดิมซ้ำได้ถ้าต้องการ
      input.value = '';
    }
  }

}
