import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-qualityassurance',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule
  ],
  templateUrl: './qualityassurance.component.html',
  styleUrl: './qualityassurance.component.css',
})
export class QualityassuranceComponent {

}
