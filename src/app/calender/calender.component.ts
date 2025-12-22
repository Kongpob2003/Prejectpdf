import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule   // ✅ สำคัญมาก
  ],
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent {

}
