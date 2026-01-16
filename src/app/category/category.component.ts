import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface CategoryFile {
  name: string;
  type: 'pdf' | 'doc' | 'xls';
  size: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  files: CategoryFile[];
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {

  selectedCategory: Category | null = null;

  categories: Category[] = [
    {
      id: 1,
      name: 'ประกันคุณภาพ',
      description: 'เอกสารด้านการประเมินคุณภาพ',
      files: [
        { name: 'SAR-2567.pdf', type: 'pdf', size: '2.4 MB' },
        { name: 'รายงานคุณภาพ.pdf', type: 'pdf', size: '1.8 MB' }
      ]
    },
    {
      id: 2,
      name: 'JAE',
      description: 'เอกสาร JAE ของอาจารย์',
      files: [
        { name: 'JAE-สมชาย.pdf', type: 'pdf', size: '900 KB' }
      ]
    },
    {
      id: 3,
      name: 'หลักสูตร',
      description: 'เอกสารหลักสูตรและแผนการสอน',
      files: []
    }
  ];
cat: any;

  openCategory(c: Category) {
    this.selectedCategory = c;
  }

  backToCategories() {
    this.selectedCategory = null;
  }
}
