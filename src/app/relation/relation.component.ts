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

import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-relation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './relation.component.html',
  styleUrl: './relation.component.css',
})
export class RelationComponent {

  boardData:BoardItemPos[]=[];
  documents:DocumentItemPos[]=[];
  searchText = '';
  docMap = new Map<number, any>();
  announcements = this.boardData;

  constructor(private dialog: MatDialog,
    private backend:Backend,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object  // ✅ เพิ่มบรรทัดนี้
  ) {}

  async ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    await this.loadData();
  }
}
  async loadData(){
    const [boards, docs] = await Promise.all([
    this.backend.GetBoard(),
    this.backend.GetFile()
  ]);

  this.boardData = boards;
  this.documents = docs;

  // สร้าง Map: did → document
  docs.forEach(doc => {
    this.docMap.set(doc.did, doc);
  });

  console.log('Boards:', this.boardData);
  console.log('Docs:', this.documents);
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
  if (!result) return;
});

}

  filteredAnnouncements() {
    return this.announcements.filter(a =>
      a.harder.includes(this.searchText) ||
      a.detail.includes(this.searchText)
    );
  }

  
}
