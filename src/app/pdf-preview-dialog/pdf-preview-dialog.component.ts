import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule 
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>{{ data?.file_name || data?.name || 'Preview' }}</h2>
      <button mat-icon-button (click)="close()">
        <span class="material-icons">close</span>
      </button>
    </div>

    <mat-dialog-content>
      <div class="pdf-container">
        
        <iframe
          *ngIf="safeUrl"
          [src]="safeUrl"
          width="100%"
          height="100%"
          frameborder="0"
          style="border: none;">
        </iframe>
        
        <div *ngIf="!safeUrl" class="loading-container">
          <p>กำลังโหลดเอกสาร...</p>
          <small *ngIf="hasError" class="error-text">
            ไม่พบไฟล์เอกสาร หรือ URL ไม่ถูกต้อง
          </small>
        </div>

      </div>
    </mat-dialog-content>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    .pdf-container {
      height: 600px;
      width: 100%;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      flex-direction: column;
    }

    .error-text {
      color: red;
      margin-top: 8px;
    }

    mat-dialog-content {
      padding: 0 !important;
      margin: 0 !important;
      overflow: hidden;
    }
  `]
})
export class PdfPreviewDialogComponent {
  safeUrl: SafeResourceUrl | null = null;
  hasError = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<PdfPreviewDialogComponent>
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
}