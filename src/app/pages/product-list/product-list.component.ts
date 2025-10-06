import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: false,
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  searchTerm = '';
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brandIds: string[] = [];
  isLoading = false;
  cartCount = 0;
  filtersOpen = false;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchTerm = params['search'] || '';
      this.categoryId = params['categoryId'] ? +params['categoryId'] : undefined;
      this.brandId = params['brandId'] ? +params['brandId'] : undefined;
      this.minPrice = params['minPrice'] ? +params['minPrice'] : undefined;
      this.maxPrice = params['maxPrice'] ? +params['maxPrice'] : undefined;
      this.minRating = params['minRating'] ? +params['minRating'] : undefined;
      this.brandIds = params['brandIds'] ? params['brandIds'].split(',') : [];
      this.loadProducts();
    });

    // Subscribe to cart count
    this.dataService.cartItems$.subscribe((items) => {
      this.cartCount = this.dataService.getCartCount();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.dataService.getProducts(this.categoryId, this.brandId, this.searchTerm).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.isLoading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onFiltersClick(): void {
    this.filtersOpen = true;
  }

  onFiltersApplied(filters: any[]): void {
    // Filters will be applied via URL navigation from the filters component
    this.filtersOpen = false;
  }

  onFiltersCancelled(): void {
    this.filtersOpen = false;
  }
}
