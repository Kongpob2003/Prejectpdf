import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router) {}

  logout() {
    this.router.navigate(['/login']);
  }

  files = [
    {
      name: 'เอกสาร_1.pdf',
      status: 'sent',
      url: 'assets/sample.pdf'
    },
    {
      name: 'เอกสาร_2.pdf',
      status: 'unsent',
      url: 'assets/sample.pdf'
    },
    {
      name: 'เอกสาร_3.pdf',
      status: 'sent',
      url: 'assets/sample.pdf'
    }
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
}
