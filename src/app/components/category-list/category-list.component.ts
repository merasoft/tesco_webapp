import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { finalize } from 'rxjs';

interface Category {
  id: number;
  name: string;
  image?: string;
  count: number;
  children?: Category[];
}

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  openPanels = new Set<number>();

  constructor(private dataService: DataService, private router: Router) {}

  loadCategories(): void {
    this.isLoading = false;
    this.dataService
      .getCategories()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data) => {
        this.categories = data;
      });
  }

  selectCategory(categoryId: number): void {
    if (categoryId === 0) {
      // Navigate to products page without category filter
    } else {
      this.router.navigate(['/products'], {
        queryParams: { categoryId },
      });
    }
  }

  ngOnInit(): void {
    this.loadCategories();
  }
}
