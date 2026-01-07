import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextFieldModule } from '@angular/cdk/text-field';


@Component({
  selector: 'app-announcement-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TextFieldModule
  ],
  templateUrl: './announcement-dialog.component.html',
  styleUrl: './announcement-dialog.component.css'
})
export class AnnouncementDialogComponent {

  data = {
    title: '',
    detail: '',
    fileName: ''
  };

  constructor(
    private dialogRef: MatDialogRef<AnnouncementDialogComponent>
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.data.fileName = file.name;
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
  const title = this.data.title?.trim();
  const detail = this.data.detail?.trim();

  if (!title || !detail) {
    return; // ❌ ไม่ต้อง alert แล้ว เพราะปุ่มถูก disable อยู่
  }

  // ✅ ปิด dialog + ส่งข้อมูลกลับ
  this.dialogRef.close({
    title,
    detail,
    fileName: this.data.fileName
  });
}
}
