import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

interface FilterOption {
  id: string;
  name: string;
  count: number;
  checked: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  count?: number;
  children?: Category[];
}

interface Filter {
  id: string;
  name: string;
  type: 'range' | 'checkbox' | 'radio';
  options?: FilterOption[];
  min?: number;
  max?: number;
  currentMin?: number;
  currentMax?: number;
  range?: [number, number];
}

@Component({
  selector: 'app-filters',
  standalone: false,
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  @Input() filtersOpen = false;
  @Output() filtersOpenChange = new EventEmitter<boolean>();
  @Output() filtersApplied = new EventEmitter<Filter[]>();
  @Output() filtersCancelled = new EventEmitter<void>();
  @Output() categorySelected = new EventEmitter<Category>();

  accordionActiveValues: string[] = ['price', 'brand', 'rating'];
  tempFilters: Filter[] = [];
  originalFilters: Filter[] = [];

  // Category data - managed internally like in catalog component
  categories: Category[] = [];
  currentCategory: Category | null = null;
  currentSubcategory: Category | null = null;
  currentLeaf: Category | null = null;

  // Route parameters
  categorySlug: string | null = null;
  subcategorySlug: string | null = null;
  leafSlug: string | null = null;

  get shouldShowCategories(): boolean {
    return this.subcategories && this.subcategories.length > 0;
  }

  get subcategories(): Category[] {
    if (!this.currentCategory) return [];

    // If we're at the main category level, show subcategories
    if (!this.currentSubcategory) {
      return this.currentCategory.children || [];
    }

    // If we're in a subcategory but not in a leaf, show the leaf categories
    if (this.currentSubcategory && !this.currentLeaf) {
      return this.currentSubcategory.children || [];
    }

    return [];
  }

  get dynamicAccordionValues(): string[] {
    const values = ['price'];
    if (this.shouldShowCategories) {
      values.push('categories');
    }
    values.push('brand', 'rating');
    return values;
  }

  ngOnInit(): void {
    // Initialize accordion values
    this.accordionActiveValues = this.getDefaultAccordionValues();
    // Load categories data
    this.loadCategories();
  }

  constructor(private dataService: DataService, private router: Router) {}

  private loadCategories(): void {
    // Load categories from DataService
    this.dataService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        this.updateCurrentCategory();
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
        // Fallback to empty categories
        this.categories = [];
      },
    });
  }

  private findCurrentCategory(): void {
    this.currentCategory = this.categories.find((cat) => cat.slug === this.categorySlug) || null;
    this.currentSubcategory = null;
    this.currentLeaf = null;

    if (this.currentCategory && this.subcategorySlug) {
      this.currentSubcategory = this.currentCategory.children?.find((sub) => sub.slug === this.subcategorySlug) || null;

      if (this.currentSubcategory && this.leafSlug) {
        // Third level - find leaf in subcategory's children
        this.currentLeaf = this.currentSubcategory.children?.find((leaf) => leaf.slug === this.leafSlug) || null;
      }
    }
  }

  private updateCurrentCategory(): void {
    // This would normally be called when route changes
    // For now, we'll set a default category to show subcategories
    this.categorySlug = 'electronic'; // Updated to match JSON structure
    this.findCurrentCategory();
  }

  filters: Filter[] = [
    {
      id: 'price',
      name: 'Price',
      type: 'range',
      min: 569000,
      max: 52314918,
      currentMin: 569000,
      currentMax: 52314918,
      range: [569000, 52314918],
    },
    {
      id: 'brand',
      name: 'Brand',
      type: 'checkbox',
      options: [
        { id: 'honor', name: 'Honor', count: 2, checked: false },
        { id: 'samsung', name: 'Samsung', count: 3, checked: false },
        { id: 'vivo', name: 'Vivo', count: 1, checked: false },
        { id: 'lenovo', name: 'Lenovo', count: 1, checked: false },
        { id: 'apple', name: 'Apple', count: 1, checked: false },
      ],
    },
    {
      id: 'rating',
      name: 'Rating',
      type: 'checkbox',
      options: [
        { id: '5', name: '<span class="text-lg text-yellow-400">★★★★★</span>', count: 25, checked: false },
        { id: '4', name: '<span class="text-lg text-yellow-400">★★★★</span><span class="text-lg text-gray-400">☆</span> & up', count: 45, checked: false },
        { id: '3', name: '<span class="text-lg text-yellow-400">★★★</span><span class="text-lg text-gray-400">☆☆</span> & up', count: 78, checked: false },
        { id: '2', name: '<span class="text-lg text-yellow-400">★★</span><span class="text-lg text-gray-400">☆☆☆</span> & up', count: 92, checked: false },
      ],
    },
  ];

  onMobileFilterOpen(): void {
    // Store current filter state as backup
    this.originalFilters = JSON.parse(JSON.stringify(this.filters));
    // Create temporary filters for mobile drawer
    this.tempFilters = JSON.parse(JSON.stringify(this.filters));
    // Initialize mobile accordion with all panels open
    this.accordionActiveValues = this.getDefaultAccordionValues();
  }

  onCategoryClick(category: Category): void {
    // Navigate to products page with category filter
    this.router.navigate(['/products'], {
      queryParams: { categoryId: category.id },
    });
    // Close the filters drawer after category selection
    this.filtersOpen = false;
    this.filtersOpenChange.emit(false);
    this.categorySelected.emit(category);
  }

  onTempPriceRangeChange(event: any): void {
    const tempPriceFilter = this.tempFilters[0];
    if (event == null || typeof event === 'number') {
      tempPriceFilter.range = [tempPriceFilter.currentMin!, tempPriceFilter.currentMax!];
    } else if (typeof event === 'object' && Array.isArray(event.values) && event.values.length === 2) {
      tempPriceFilter.currentMin = event.values[0];
      tempPriceFilter.currentMax = event.values[1];
    }
  }

  getTempFilterCheckedCount(filter: Filter): number {
    if (!filter.options) return 0;
    return filter.options.filter((option) => option.checked).length;
  }

  onTempFilterOptionChange(filter: Filter, option: FilterOption): void {
    // Update temporary filter state without applying
    const tempFilter = this.tempFilters.find((f) => f.id === filter.id);
    if (tempFilter && tempFilter.options) {
      const tempOption = tempFilter.options.find((opt) => opt.id === option.id);
      if (tempOption) {
        tempOption.checked = !tempOption.checked;
      }
    }
  }

  onMobileFilterCancel(): void {
    // Restore original filter state
    this.filters = JSON.parse(JSON.stringify(this.originalFilters));
    this.filtersOpen = false;
    this.filtersOpenChange.emit(false);
    this.filtersCancelled.emit();
  }

  onMobileFilterApply(): void {
    // Apply the temporary filter changes
    this.filters = JSON.parse(JSON.stringify(this.tempFilters));

    // Navigate with filter parameters
    this.navigateWithFilters();

    this.filtersOpen = false;
    this.filtersOpenChange.emit(false);
    this.filtersApplied.emit(this.filters);
  }

  private navigateWithFilters(): void {
    const queryParams: any = {};

    // Build query parameters from filters
    this.filters.forEach((filter) => {
      if (filter.type === 'range' && filter.id === 'price') {
        if (filter.currentMin !== filter.min || filter.currentMax !== filter.max) {
          queryParams.minPrice = filter.currentMin;
          queryParams.maxPrice = filter.currentMax;
        }
      } else if (filter.type === 'checkbox' && filter.options) {
        const selectedOptions = filter.options.filter((option) => option.checked).map((option) => option.id);

        if (selectedOptions.length > 0) {
          if (filter.id === 'brand') {
            queryParams.brandIds = selectedOptions.join(',');
          } else if (filter.id === 'rating') {
            queryParams.minRating = Math.min(...selectedOptions.map((id) => parseInt(id)));
          }
        }
      }
    });

    // Navigate to products page with filter parameters
    this.router.navigate(['/products'], { queryParams });
  }

  clearFilters(): void {
    this.filters.forEach((filter) => {
      if (filter.options) {
        filter.options.forEach((option) => (option.checked = false));
      }
      if (filter.type === 'range') {
        filter.currentMin = filter.min;
        filter.currentMax = filter.max;
        filter.range = [filter.min!, filter.max!];
      }
    });

    // Navigate to products page with no filters
    this.router.navigate(['/products']);

    this.filtersApplied.emit(this.filters);
  }

  // Get count of checked options for filter
  getCheckedCount(filter: Filter): number {
    if (!filter.options) return 0;
    return filter.options.filter((option) => option.checked).length;
  }

  onFilterOptionChange(filter: Filter, option: FilterOption): void {
    option.checked = !option.checked;
    this.filtersApplied.emit(this.filters);
  }

  onPriceRangeChange(event: any): void {
    if (event == null || typeof event === 'number') {
      this.filters[0].range = [this.filters[0].currentMin!, this.filters[0].currentMax!];
    } else if (typeof event === 'object' && Array.isArray(event.values) && event.values.length === 2) {
      this.filters[0].currentMin = event.values[0];
      this.filters[0].currentMax = event.values[1];
    }

    this.filtersApplied.emit(this.filters);
  }

  // Additional methods from catalog component reference
  getSubcategoryLink(subcategory: Category): string[] {
    if (!this.currentCategory) return ['/catalog'];

    // If we're at the main category level, link to subcategory
    if (!this.subcategorySlug) {
      return ['/catalog', this.currentCategory.slug, subcategory.slug];
    }

    // If we're in a subcategory, link to leaf category
    if (this.currentSubcategory) {
      return ['/catalog', this.currentCategory.slug, this.currentSubcategory.slug, subcategory.slug];
    }

    return ['/catalog', this.currentCategory.slug, subcategory.slug];
  }

  isActiveSubcategory(subcategory: Category): boolean {
    // If we're at the main category level, check if this is the active subcategory
    if (!this.subcategorySlug) {
      return false; // No active subcategory yet
    }

    // If we're in a subcategory, check if this is the active leaf
    if (this.currentSubcategory && !this.leafSlug) {
      return subcategory.slug === this.subcategorySlug;
    }

    // If we're in a leaf, check if this is the active leaf
    if (this.leafSlug) {
      return subcategory.slug === this.leafSlug;
    }

    return subcategory.slug === this.subcategorySlug;
  }

  getDefaultAccordionValues(): string[] {
    const values = ['price', 'brand', 'rating'];
    if (this.shouldShowCategories) {
      values.unshift('categories'); // Add categories at the beginning
    }
    return values;
  }
}
