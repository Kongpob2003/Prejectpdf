import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-preview-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent],
  template: `
    <h2 mat-dialog-title>{{ data.name }}</h2>

    <mat-dialog-content>
      <iframe
        [src]="data.url"
        width="100%"
        height="500px">
      </iframe>
    </mat-dialog-content>
  `
})
export class PdfPreviewDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
