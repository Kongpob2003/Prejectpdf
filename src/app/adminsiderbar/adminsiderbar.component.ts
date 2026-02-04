import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminsidebar',
  standalone: true,
  imports: [CommonModule], // ✅ ต้องมี
  templateUrl: './adminsiderbar.component.html',
  styleUrls: ['./adminsiderbar.component.css']
})
export class AdminsiderbarComponent {

  @Input() mode: 'full' | 'minimal' = 'full';

  constructor(private router: Router) {}

  go(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
