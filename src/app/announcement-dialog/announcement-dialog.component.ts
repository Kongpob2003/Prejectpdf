import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AnnouncementDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      detail: ['', Validators.required],
      file: [null as File | null],
      fileName: ['']
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.form.patchValue({
      file,
      fileName: file.name
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.invalid) return;

    this.snackBar.open('✅ อัปโหลดสำเร็จ', 'ปิด', {
      duration: 2500
    });

    this.dialogRef.close(this.form.value);
  }
}
