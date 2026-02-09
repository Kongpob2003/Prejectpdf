import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Backend } from '../services/api/backend';
import { SidebarComponent } from '../sidebar/sidebar.component';

interface QAFile {
  name: string;
  url?: string;
}

interface Folder {
  id?: number;
  name: string;
  files: QAFile[];
}

@Component({
  selector: 'app-userqualityassurance',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './userqualityassurance.component.html',
  styleUrl: './userqualityassurance.component.css',
})
export class UserQualityassuranceComponent {
openFile(_t31: QAFile) {
throw new Error('Method not implemented.');
}

  folders: Folder[] = [];
  selectedFolder: Folder | null = null;

  constructor(
    private backend: Backend,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadQuality();
    }
  }

  async loadQuality() {
    const data = await this.backend.getQuailty();

    this.folders = data.map((item: any) => ({
      id: item.qid,
      name: item.q_name,
      files: []
    }));

    this.cdr.detectChanges();
  }

  async openFolder(folder: Folder) {
    this.selectedFolder = folder;

    if (!folder.id) return;

    try {
      const files: any[] = await this.backend.getQualityFiles(folder.id);

      this.selectedFolder.files = files.map(f => ({
        name: f.file_name,
        url: f.file_url
      }));

      this.cdr.detectChanges();

    } catch (err) {
      console.error('Load files error', err);
      this.selectedFolder.files = [];
    }
  }

  backToFolders() {
    this.selectedFolder = null;
  }
}
