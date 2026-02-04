import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarComponent], // ✅ ต้องมี
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  @Input() mode: 'full' | 'minimal' = 'full';

  constructor(private router: Router) {}

  go(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
