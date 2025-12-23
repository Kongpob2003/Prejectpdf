import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


  constructor(private router: Router) {}

  goRelation() {
  this.router.navigate(['/relation']);
}

  goQualityassurance() {
  this.router.navigate(['/qualityassurance']);
}

  goJae() {
  this.router.navigate(['/jae']);
}

  goCategory() {
  this.router.navigate(['/category']);
}

  goAdddelete() {
  this.router.navigate(['/adddeleteuser']);
}

  goCalender() {
  this.router.navigate(['/calender']);
}

  goProfile() {
  this.router.navigate(['/profile']);
}

  logout() {
    this.router.navigate(['/login']);
  }

  // ===== FILE LIST =====
  files = [
    { name: 'เอกสาร_1.pdf', status: 'sent', url: 'assets/sample.pdf' },
    { name: 'เอกสาร_2.pdf', status: 'unsent', url: 'assets/sample.pdf' },
    { name: 'เอกสาร_3.pdf', status: 'sent', url: 'assets/sample.pdf' }
  ];

  searchText = '';
  activeTab: 'all' | 'sent' | 'unsent' = 'all';

  get filteredFiles() {
    return this.files.filter(file => {
      const matchSearch =
        file.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchTab =
        this.activeTab === 'all' || file.status === this.activeTab;
      return matchSearch && matchTab;
    });
  }

  // ===== PREVIEW MODAL =====
  showModal = false;
  selectedFile: any = null;

  openModal(file: any) {
    this.selectedFile = file;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteFile(event: Event, index: number) {
    event.stopPropagation();
    this.files.splice(index, 1);
  }

  // ===== UPLOAD =====
  showUpload = false;
  uploadTitle = '';   
  uploadFile: File | null = null;
  uploadFileName = '';

  teachers: string[] = [
  'อาจารย์ A',
  'อาจารย์ B',
  'อาจารย์ C',
  'อาจารย์ D'
];

selectedTeachers: string[] = [];

toggleTeacher(t: string) {
  const index = this.selectedTeachers.indexOf(t);

  if (index === -1) {
    this.selectedTeachers.push(t);
  } else {
    this.selectedTeachers.splice(index, 1);
  }
}


  openUpload() {
    this.showUpload = true;
  }

  closeUpload() {
    this.showUpload = false;
    this.uploadFile = null;
    this.uploadFileName = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile = input.files[0];
      this.uploadFileName = this.uploadFile.name;
    }
  }

  submitUpload() {
  if (!this.uploadTitle || !this.uploadFile) {
    alert('กรุณากรอกข้อมูลให้ครบ');
    return;
  }

  const fileUrl = URL.createObjectURL(this.uploadFile);

  this.files.unshift({
    name: this.uploadTitle + '.pdf',
    status: 'unsent',
    url: fileUrl
  });

  this.closeUpload();
}

  
}
