import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Backend } from '../services/api/backend';
import { CategoryItemPos } from '../../model/category_Item_pos';

interface DocumentFile {
  did: number;
  file_name: string;
  file_url: string;
  semester: string;
  create_at: string;
}

interface CategoryWithFiles {
  category_id: number;
  category_name: string;
  count: number;
  files: DocumentFile[];
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {

  categories: CategoryItemPos[] = [];
  categoriesWithFiles: CategoryWithFiles[] = [];
  selectedCategory: CategoryWithFiles | null = null;
  isLoading = false;

  constructor(
    private backend: Backend,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.loadCategories();
    }
  }

  // โหลดหมวดหมู่ทั้งหมด
  async loadCategories() {
  try {
    this.isLoading = true;

    // ดึงรายการหมวดหมู่
    const categories  = await this.backend.getCategory();
    
    this.categories = categories as any;
    console.log('Categories:', categories);

    // ดึงไฟล์ของแต่ละหมวด
    const promises = this.categories.map(async (cat) => {
      try {
        const result: any =
          await this.backend.GetFilesByCategory(cat.category_id);

        return {
          category_id: cat.category_id,
          category_name: cat.Name,
          count: result.count || 0,
          files: result.data || []
        };
      } catch (error) {
        console.error(
          `Error loading files for category ${cat.category_id}:`,
          error
        );
        return {
          category_id: cat.category_id,
          category_name: cat.Name,
          count: 0,
          files: []
        };
      }
    });

    this.categoriesWithFiles = await Promise.all(promises);

    console.log('Categories with files:', this.categoriesWithFiles);
    this.cdr.detectChanges();

  } catch (error) {
    console.error('Error loading categories:', error);
  } finally {
    this.isLoading = false;
  }
}


  // เปิดดูหมวดหมู่
  openCategory(category: CategoryWithFiles) {
    this.selectedCategory = category;
  }

  // กลับไปดูหมวดหมู่ทั้งหมด
  backToCategories() {
    this.selectedCategory = null;
  }

  // เปิดไฟล์
  openFile(file: DocumentFile) {
    window.open(file.file_url, '_blank');
  }

  // ฟอร์แมตวันที่
  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear() + 543;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // คำนวณขนาดไฟล์ (ถ้า backend ส่งมา)
  formatFileSize(bytes: number | undefined): string {
    if (!bytes) return 'ไม่ทราบขนาด';
    
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // ดึงนามสกุลไฟล์
  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
  }

  // เลือก icon ตามนามสกุล
  getFileIcon(filename: string): string {
    const ext = this.getFileExtension(filename).toLowerCase();
    
    switch (ext) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'table_chart';
      case 'png':
      case 'jpg':
      case 'jpeg':
        return 'image';
      default:
        return 'insert_drive_file';
    }
  }
}