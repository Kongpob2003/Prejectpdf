import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relation',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule
  ],
  templateUrl: './relation.component.html',
  styleUrl: './relation.component.css',
})
export class RelationComponent {

}
