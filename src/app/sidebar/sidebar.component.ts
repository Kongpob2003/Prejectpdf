import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

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
