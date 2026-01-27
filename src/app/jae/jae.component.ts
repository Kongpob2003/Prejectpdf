import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PdfPreviewDialogComponent } from '../pdf-preview-dialog/pdf-preview-dialog.component';
import { UserLocalStorge } from '../../model/response';


import { Backend } from '../services/api/backend';

interface JaeFile {
  name: string;
  url: string;
}

interface Term {
  term: 1 | 2;
  files: JaeFile[];
}

interface YearGroup {
  year: string;
  terms: Term[];
}

interface Teacher {
  name: string;
  years: YearGroup[];
}

@Component({
  selector: 'app-jae',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule
  ],
  templateUrl: './jae.component.html',
  styleUrl: './jae.component.css',
})
export class JaeComponent {

  
  selectedTeacher: Teacher | null = null;
  selectedYear: YearGroup | null = null;
  selectedTerm: Term | null = null;
  teachers : UserLocalStorge[]=[];
  
  constructor(private dialog: MatDialog,
    private backend: Backend,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    await this.loadUsers();

  }

  async loadUsers() {
   const teachers = await this.backend.GetUser();
   console.log(teachers);
   this.teachers = teachers;
  }
  // teachers: Teacher[] = [
  //   {
  //     name: 'อาจารย์สมชาย',
  //     years: [
  //       {
  //         year: '2567',
  //         terms: [
  //           {
  //             term: 1,
  //             files: [
  //               { name: 'JAE-1.pdf', url: 'assets/sample.pdf' }
  //             ]
  //           },
  //           {
  //             term: 2,
  //             files: [
  //               { name: 'JAE-2.pdf', url: 'assets/sample.pdf' }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'อาจารย์สมหญิง',
  //     years: [
  //       {
  //         year: '2567',
  //         terms: [
  //           {
  //             term: 1,
  //             files: [
  //               { name: 'ประเมินผล.pdf', url: 'assets/sample.pdf' }
  //             ]
  //           },
  //           {
  //             term: 2,
  //             files: []
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ];
  //รับเป็น uid แล้วแสดงออกมา
  async openTeacher(t: any) {
    this.selectedTeacher = t;
    console.log();
    const fileUser = await this.backend.FileUser(t);
    console.log(fileUser);
  // if (t.years.length > 0) {
  //   this.selectedYear = t.years[0];

  //   if (this.selectedYear.terms.length > 0) {
  //     this.selectedTerm = this.selectedYear.terms[0];
  //   } else {
  //     this.selectedTerm = null;
  //   }

  // } else {
  //   this.selectedYear = null;
  //   this.selectedTerm = null;
  // }
}

  backToFolders() {
    this.selectedTeacher = null;
    this.selectedYear = null;
    this.selectedTerm = null;
  }

  openPreview(file: JaeFile) {
    this.dialog.open(PdfPreviewDialogComponent, {
      width: '80vw',
      maxWidth: '900px',
      data: file
    });
  }

  addYear() {
  if (!this.selectedTeacher) return;

  // หา "ปีล่าสุด"
  const years = this.selectedTeacher.years;
  const lastYear = years.length
    ? Math.max(...years.map(y => Number(y.year)))
    : new Date().getFullYear() + 543;

  const newYear: YearGroup = {
    year: String(lastYear + 1),
    terms: [
      { term: 1, files: [] },
      { term: 2, files: [] }
    ]
  };

  this.selectedTeacher.years.push(newYear);

  // auto select
  this.selectedYear = newYear;
  this.selectedTerm = newYear.terms[0];
}

}
