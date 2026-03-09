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
    url: "assets/manuals/manual1.pdf"
  },
];

openFile(url: string) {
  window.open(url, '_blank');
}

downloadFile(url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = '';
  link.click();
}
}
