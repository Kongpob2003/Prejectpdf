import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface QAFile {
  name: string;
  file?: File; // เก็บไฟล์ไว้ เผื่ออัปโหลดจริง
}

interface Folder {
  name: string;
  files: QAFile[];
}



@Component({
  selector: 'app-qualityassurance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './qualityassurance.component.html',
  styleUrl: './qualityassurance.component.css',
})
export class QualityassuranceComponent {

  folders: Folder[] = [];

  selectedFolder: Folder | null = null;

  newFolderName = '';
  

  createFolder() {
    if (!this.newFolderName.trim()) return;

    this.folders.push({
      name: this.newFolderName,
      files: []
    });

    this.newFolderName = '';
  }

  openFolder(folder: Folder) {
    this.selectedFolder = folder;
  }

  backToFolders() {
    this.selectedFolder = null;
    
  }


  onFileSelected(event: Event) {
  if (!this.selectedFolder) return;

  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  this.selectedFolder.files.push({
    name: file.name,
    file: file
  });

  // reset input (เลือกไฟล์เดิมซ้ำได้)
  input.value = '';
}

}
