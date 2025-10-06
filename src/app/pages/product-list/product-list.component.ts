import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  showSearchSuggestions = false;
  recentSearches: string[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {
    // Initialize with some default recent searches
    this.recentSearches = this.getRecentSearches();
  }

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

  onSearchInput(): void {
    // Only filter recent searches, don't perform navigation
    // The filtering is handled by the filteredRecentSearches getter
  }

  onSearchFocus(): void {
    this.showSearchSuggestions = true;
  }

  onSearchBlur(): void {
    // Delay hiding to allow clicking on suggestions
    setTimeout(() => {
      this.showSearchSuggestions = false;
    }, 200);
  }

  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.searchTerm.trim()) {
      // Perform the actual search
      this.performSearch(this.searchTerm.trim());
    }
  }

  performSearch(searchQuery: string): void {
    // Add to recent searches
    this.addToRecentSearches(searchQuery);
    this.showSearchSuggestions = false;

    // Perform the search navigation
    const currentParams = { ...this.route.snapshot.queryParams };
    currentParams['search'] = searchQuery;
    this.router.navigate(['/products'], { queryParams: currentParams });

    // Remove focus but keep the search term
    this.searchInput.nativeElement.blur();
  }

  clearSearchInput(): void {
    this.searchTerm = '';
    this.showSearchSuggestions = false;

    // Focus the input after clearing
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 100);
  }

  selectRecentSearch(search: string): void {
    this.searchTerm = search;
    this.performSearch(search);
  }

  clearRecentSearches(): void {
    this.recentSearches = [];
    localStorage.removeItem('recentSearches');
  }

  removeRecentSearch(index: number): void {
    this.recentSearches.splice(index, 1);
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }

  removeRecentSearchByValue(search: string): void {
    const index = this.recentSearches.findIndex((s) => s === search);
    if (index !== -1) {
      this.recentSearches.splice(index, 1);
      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    }
  }

  get filteredRecentSearches(): string[] {
    if (!this.searchTerm.trim()) {
      return this.recentSearches;
    }
    return this.recentSearches.filter((search) => search.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  private getRecentSearches(): string[] {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default recent searches
    return ['iPhone', 'Samsung Galaxy', 'Laptop', 'Headphones', 'Nike shoes'];
  }

  private addToRecentSearches(search: string): void {
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter((s) => s.toLowerCase() !== search.toLowerCase());
    // Add to beginning
    this.recentSearches.unshift(search);
    // Keep only last 8 searches
    this.recentSearches = this.recentSearches.slice(0, 8);
    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }
}
