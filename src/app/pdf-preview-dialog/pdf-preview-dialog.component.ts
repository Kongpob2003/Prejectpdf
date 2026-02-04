import { Component, Inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './pdf-preview-dialog.component.html',
  styleUrls: ['./pdf-preview-dialog.component.css'],
})
export class PdfPreviewDialogComponent {
  safeUrl: SafeResourceUrl | null = null;
  hasError = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<PdfPreviewDialogComponent>,
    private elementRef: ElementRef
  ) {
    this.processUrl();
  }

  processUrl() {
    const rawUrl = this.data?.url || this.data?.file_url;

    if (!rawUrl || typeof rawUrl !== 'string') {
      this.hasError = true;
      return;
    }

    this.safeUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  close() {
    this.dialogRef.close();
  }

  toggleFullscreen() {
    const el = this.elementRef.nativeElement as HTMLElement;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen();
    }
  }
}
