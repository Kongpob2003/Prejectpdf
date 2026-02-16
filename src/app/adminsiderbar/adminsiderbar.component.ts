import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-adminsidebar',
  standalone: true,
  imports: [CommonModule], // ✅ ต้องมี
  templateUrl: './adminsiderbar.component.html',
  styleUrls: ['./adminsiderbar.component.css']
})
export class AdminsiderbarComponent {

  @Input() mode: 'full' | 'minimal' = 'full';

  constructor(private router: Router,
    private auth: AuthService,
  ) {}

  go(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
