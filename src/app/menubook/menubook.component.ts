import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminsiderbarComponent } from "../adminsiderbar/adminsiderbar.component";

@Component({
  selector: 'app-menubook',
  imports: [AdminsiderbarComponent,CommonModule],
  templateUrl: './menubook.component.html',
  styleUrl: './menubook.component.css',
})
export class Menubook {
manuals = [
  {
    name: "คู่มือการใช้งานระบบ.pdf",
    url: "https://cdn.csmsu.net/extproj_mypdf/939eeea0-ced5-4911-81ff-9e7d8c13e1e3.pdf"
  },
];

openFile(url: string) {
  window.open(url, '_blank');
}

downloadFile(url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'https://cdn.csmsu.net/extproj_mypdf/939eeea0-ced5-4911-81ff-9e7d8c13e1e3.pdf?download=true';
  link.click();
}
}
