import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Backend } from '../services/api/backend';

@Component({
  selector: 'app-announcement-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    TextFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './announcement-dialog.component.html',
  styleUrl: './announcement-dialog.component.css'
})
export class AnnouncementDialogComponent implements OnInit {

  form!: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    private snackBar: MatSnackBar,
    private backend: Backend,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      detail: ['', Validators.required],
      fileName: ['']
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // ตรวจสอบว่าเป็น PDF
    if (file.type !== 'application/pdf') {
      this.snackBar.open('⚠️ กรุณาเลือกไฟล์ PDF เท่านั้น', 'ปิด', {
        duration: 3000
      });
      return;
    }

    this.selectedFile = file;
    
    // แก้ไข encoding ของชื่อไฟล์
    const decodedFileName = this.decodeFileName(file.name);
    
    this.form.patchValue({
      fileName: decodedFileName
    });
  }

  // ฟังก์ชันแก้ไข encoding ของชื่อไฟล์
  private decodeFileName(filename: string): string {
    try {
      if (filename.includes('Ã') || filename.includes('à')) {
        const decoder = new TextDecoder('utf-8');
        const latin1Bytes = new Uint8Array(
          Array.from(filename).map(char => char.charCodeAt(0) & 0xFF)
        );
        return decoder.decode(latin1Bytes);
      }
      return filename;
    } catch (e) {
      console.error('Error decoding filename:', e);
      return filename;
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  async submit() {
  if (this.form.invalid || !this.selectedFile) {
    this.snackBar.open('⚠️ กรุณากรอกข้อมูลให้ครบถ้วนและแนบไฟล์', 'ปิด', {
      duration: 3000
    });
    return;
  }

  this.isSubmitting = true;

  try {
    /* ==============================
       1️⃣ Upload file
    ============================== */
    const fileFormData = new FormData();

    const correctedFile = new File(
      [this.selectedFile],
      this.form.value.fileName,
      { type: this.selectedFile.type }
    );

    fileFormData.append('file', correctedFile);

    await this.backend.Upload_File(fileFormData);

    /* ==============================
       2️⃣ ดึง document ล่าสุด
    ============================== */
    const documents: any[] = await this.backend.GetFile();

    if (!documents || documents.length === 0) {
      throw new Error('ไม่พบข้อมูล document');
    }

    // ✅ เอาแถวล่าสุด (id มากสุด)
    const latestDocument = documents.reduce((prev, curr) =>
      curr.did > prev.did ? curr : prev
    );

    const documentId = latestDocument.did;

    /* ==============================
       3️⃣ Create board
    ============================== */
    const boardData = {
      detail: this.form.value.detail,
      did: documentId,
      harder: this.form.value.title
    };

    const boardResponse = await this.backend.AddBoard(boardData);

    /* ==============================
       4️⃣ Success
    ============================== */
    this.snackBar.open('✅ อัปโหลดสำเร็จ', 'ปิด', {
      duration: 2500
    });

    // ✅ ส่ง document ล่าสุดกลับไปให้ table update
    this.dialogRef.close({
      success: true,
      document: latestDocument,
      board: boardResponse
    });

  } catch (error: any) {
    console.error(error);

    this.snackBar.open(
      '❌ เกิดข้อผิดพลาดในการอัปโหลด',
      'ปิด',
      { duration: 4000 }
    );
  } finally {
    this.isSubmitting = false;
  }
}

}