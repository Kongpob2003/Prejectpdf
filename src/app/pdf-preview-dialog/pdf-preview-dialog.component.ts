
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
   
    
 templateUrl: './pdf-preview-dialog.component.html',
  styleUrls: ['./pdf-preview-dialog.component.css']
})
export class PdfPreviewDialogComponent {
  safeUrl: SafeResourceUrl | null = null;
  hasError = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<PdfPreviewDialogComponent>,
) {
    // ประมวลผล URL ทันทีใน constructor
    this.processUrl();
  }

  processUrl() {
    const rawUrl = this.data?.url || this.data?.file_url;

    if (rawUrl) {
      try {
        // ✅ สำคัญ: ต้องใช้ bypassSecurityTrustResourceUrl สำหรับ iframe src
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
        console.log('PDF URL loaded:', rawUrl);
      } catch (error) {
        console.error('Error sanitizing URL:', error);
        this.hasError = true;
      }
    } else {
      console.warn('No URL found in data:', this.data);
this.hasError = true;
}
}

  close() {
    this.dialogRef.close();
  }
 toggleFullscreen() {
  const el = document.documentElement;
  if (!document.fullscreenElement) {
    el.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
}