import {
  Component,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './pdf-preview-dialog.component.html',
  styleUrls: ['./pdf-preview-dialog.component.css'],
})
export class PdfPreviewDialogComponent implements AfterViewInit {
  @ViewChild('pdfCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private pdfjsLib: any;
  pdfDoc: any;
  page: any;

  scale = 1.2;
  isFullscreen = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PdfPreviewDialogComponent>,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  async ngAfterViewInit() {
    // ✅ กัน SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // ✅ import pdfjs เฉพาะ browser
    const pdfjs = await import('pdfjs-dist');
    this.pdfjsLib = pdfjs;

    // ✅ ตั้ง worker
    this.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const url = this.data?.url || this.data?.file_url;
    if (!url) return;

    const loadingTask = this.pdfjsLib.getDocument(url);
    this.pdfDoc = await loadingTask.promise;
    this.page = await this.pdfDoc.getPage(1);

    this.render();
  }

  render() {
    if (!this.page || !this.canvasRef) return;

    const viewport = this.page.getViewport({ scale: this.scale });
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d')!;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    this.page.render({
      canvasContext: context,
      viewport,
    });
  }

  zoomIn() {
    this.scale += 0.2;
    this.render();
  }

  zoomOut() {
    if (this.scale > 0.4) {
      this.scale -= 0.2;
      this.render();
    }
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;

    if (this.isFullscreen) {
      this.dialogRef.updateSize('100vw', '100vh');
      this.dialogRef.addPanelClass('pdf-fullscreen-dialog');
    } else {
      this.dialogRef.updateSize('80vw', '80vh');
      this.dialogRef.removePanelClass('pdf-fullscreen-dialog');
    }
  }

  close() {
    this.dialogRef.close();
  }
}
