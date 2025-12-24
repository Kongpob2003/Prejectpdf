import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AnnouncementDialogComponent }
  from '../announcement-dialog/announcement-dialog.component';


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

  searchText = '';

  announcements = [
    {
      title: 'แจ้งกำหนดส่งเอกสาร',
      detail: 'ขอให้อาจารย์ทุกท่านส่งเอกสารภายในวันที่ 30',
      fileName: '',
      date: new Date()
    }
  ];

  constructor(private dialog: MatDialog) {}

  openPopup() {
    const dialogRef = this.dialog.open(AnnouncementDialogComponent, {
  width: '700px',
  maxWidth: '95vw',
  panelClass: 'custom-dialog'
});




    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.announcements.unshift({
        title: result.title,
        detail: result.detail,
        fileName: result.fileName,
        date: new Date()
      });
    });
  }

  filteredAnnouncements() {
    return this.announcements.filter(a =>
      a.title.includes(this.searchText) ||
      a.detail.includes(this.searchText)
    );
  }

  
}
