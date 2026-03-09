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
    url: "https://cdn.csmsu.net/extproj_mypdf/adb18786-c983-4fd4-9cea-c56c7914280c.pdf"
  },
];

openFile(url: string) {
  window.open(url, '_blank');
}

downloadFile(url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'https://cdn.csmsu.net/extproj_mypdf/adb18786-c983-4fd4-9cea-c56c7914280c.pdf?download=true';
  link.click();
}
}
