import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AnnouncementDialogComponent }
  from '../announcement-dialog/announcement-dialog.component';

import { Backend } from '../services/api/backend';
import { BoardItemPos } from '../../model/board_Item_pos';
import { DocumentItemPos } from '../../model/document_Item_pos';
import { AuthService } from '../services/auth.service';

import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AdminsiderbarComponent } from "../adminsiderbar/adminsiderbar.component";
@Component({
  selector: 'app-relation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
    AdminsiderbarComponent
],
  templateUrl: './relation.component.html',
  styleUrl: './relation.component.css',
})
export class RelationComponent {

  boardData:BoardItemPos[]=[];
  documents:DocumentItemPos[]=[];
  searchText = '';
  docMap = new Map<number, any>();
  homeLink: string = '/home';
  announcements = this.boardData;

  constructor(private dialog: MatDialog,
    private backend:Backend,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object  // ✅ เพิ่มบรรทัดนี้
  ) {}

  async ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    const user = await this.auth.getUser();
      const role = user?.type === 'admin' ? 'admin' : 'user';
      if (role === 'admin') {
        this.homeLink = '/home';
      } else {
        this.homeLink = '/userhome';
      }
    await this.loadData();
  }
}
  async loadData(){
    const [boards, docs] = await Promise.all([
    this.backend.GetBoard(),
    this.backend.GetFileBoard()

    
  ]);
  
  this.boardData = boards;
  this.documents = docs;

  // สร้าง Map: did → document
  docs.forEach(doc => {
    this.docMap.set(doc.did, doc);
  });
  
  // console.log('Boards:', this.boardData);
  // console.log('Docs:', this.documents);
  
  this.cdr.detectChanges();
  }
  get boardsWithFiles() {
  return this.boardData.map(board => {
    const doc = board.did
      ? this.docMap.get(board.did)
      : null;

    return {
      ...board,
      document: doc || null
    };
  });
  
}
  openPopup() {
  const dialogRef = this.dialog.open(AnnouncementDialogComponent, {
    width: '700px',
    maxWidth: '95vw'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
    this.loadData(); // ปล่อยให้ Promise ทำงานเอง
  }
});
}

  // ✅ ฟังก์ชันค้นหาที่ใช้งานได้
  get filteredAnnouncements() {
    // ถ้าไม่มีคำค้นหา ให้แสดงทั้งหมด
    if (!this.searchText || this.searchText.trim() === '') {
      return this.boardsWithFiles;
    }

    const searchLower = this.searchText.toLowerCase().trim();

    return this.boardsWithFiles.filter(a => {
      // ค้นหาในหัวข้อ
      const harderMatch = a.harder?.toLowerCase().includes(searchLower) || false;
      
      // ค้นหาในเนื้อหา
      const detailMatch = a.detail?.toLowerCase().includes(searchLower) || false;
      
      // ค้นหาในชื่อไฟล์
      const fileNameMatch = a.document?.file_name?.toLowerCase().includes(searchLower) || false;

      return harderMatch || detailMatch || fileNameMatch;
    });
  }

  async deleteAnnouncement(a: any) {
    const confirmDelete = confirm(
      `คุณต้องการลบประกาศ "${a.harder}" ใช่หรือไม่?`
    );

    if (!confirmDelete) return;

    try {
      // ✅ 1. เช็คก่อนว่ามี document ไหมก่อนจะ log หรือใช้งาน
      if (a.document && a.document.did) {
        console.log('Document to delete:', a.document.did);
      }
      
      console.log('Board ID to delete:', a.bid);

      // ✅ 2. ลบประกาศ (Board) ก่อน
      await this.backend.DeleteBoard(a.bid);

      // ✅ 3. ลบไฟล์ (ถ้ามี)
      // ใช้ Optional Chaining (?.) เพื่อป้องกัน Error ถ้า a.document เป็น null
      if (a.document?.did) {
        await this.backend.DeleteFile(a.document.did);
      }

      // โหลดข้อมูลใหม่
      await this.loadData();
      alert('ลบประกาศเรียบร้อยแล้ว');

    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('เกิดข้อผิดพลาดในการลบประกาศ');
    }
  }


  
}
