import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

interface Category {
  id: number;
  name: string;
  slug?: string;
  icon?: string;
  count: number;
  children?: Category[];
}

interface CatalogData {
  categories: Category[];
}

@Component({
  selector: 'app-category-list',
  standalone: false,
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  categories: any[] = [];
  displayedCategories: any[] = [];
  catalogData!: CatalogData;
  isDialogOpen = false;
  isLoading = false;
  openPanels = new Set<number>();

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.dataService.getCategories().subscribe((data) => {
      this.categories = data;
      this.catalogData = { categories: data };
      // Show only first 4 categories + "All" button
      this.displayedCategories = [...data.slice(0, 4), { id: 0, name: 'All', icon: 'pi-th-large' }];
    });
  }

  selectCategory(categoryId: number): void {
    if (categoryId === 0) {
      // Show all categories drawer
      this.toggleDrawer();
    } else {
      this.router.navigate(['/products'], {
        queryParams: { categoryId },
      });
    }
  }

  toggleDrawer() {
    this.isDialogOpen = !this.isDialogOpen;
  }

  closeDrawer() {
    this.isDialogOpen = false;
  }

  toggleAccordionPanel(categoryId: number) {
    if (this.openPanels.has(categoryId)) {
      this.openPanels.delete(categoryId);
    } else {
      this.openPanels.clear();
      this.openPanels.add(categoryId);
    }
  }

  isAccordionPanelOpen(categoryId: number): boolean {
    return this.openPanels.has(categoryId);
  }

  trackByCategory(index: number, category: Category): number {
    return category.id;
  }
}
