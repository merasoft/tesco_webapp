import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
export class FiltersComponent implements OnInit, OnChanges {
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
    // Load filters from URL parameters and update current category
    this.loadFiltersFromUrl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When filtersOpen changes to true, refresh filters from URL
    if (changes['filtersOpen'] && changes['filtersOpen'].currentValue === true) {
      this.loadFiltersFromUrl();
    }
  }

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) {}

  private loadCategories(): void {
    // Load categories from DataService
    this.dataService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        // Update current category after categories are loaded
        this.updateCurrentCategoryFromRoute();
      },
      error: (error: any) => {
        console.error('Ошибка загрузки категорий:', error);
        // Fallback to empty categories
        this.categories = [];
      },
    });
  }

  private findCurrentCategory(): void {
    // Find category by ID instead of slug
    this.currentCategory = this.categories.find((cat) => cat.id.toString() === this.route.snapshot.queryParams['categoryId']) || null;
    this.currentSubcategory = null;
    this.currentLeaf = null;

    if (this.currentCategory && this.route.snapshot.queryParams['subcategoryId']) {
      const subcategoryId = this.route.snapshot.queryParams['subcategoryId'];
      this.currentSubcategory = this.currentCategory.children?.find((sub) => sub.id.toString() === subcategoryId) || null;

      if (this.currentSubcategory && this.route.snapshot.queryParams['leafId']) {
        // Third level - find leaf in subcategory's children
        const leafId = this.route.snapshot.queryParams['leafId'];
        this.currentLeaf = this.currentSubcategory.children?.find((leaf) => leaf.id.toString() === leafId) || null;
      }
    }
  }

  private updateCurrentCategoryFromRoute(): void {
    // Get current category from route parameters
    this.findCurrentCategory();
  }

  filters: Filter[] = [
    {
      id: 'price',
      name: 'Цена',
      type: 'range',
      min: 569000,
      max: 52314918,
      currentMin: 569000,
      currentMax: 52314918,
      range: [569000, 52314918],
    },
    {
      id: 'brand',
      name: 'Бренд',
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
      name: 'Рейтинг',
      type: 'checkbox',
      options: [
        { id: '5', name: '<span class="text-lg text-yellow-400">★★★★★</span>', count: 25, checked: false },
        { id: '4', name: '<span class="text-lg text-yellow-400">★★★★</span><span class="text-lg text-gray-400">☆</span> и выше', count: 45, checked: false },
        { id: '3', name: '<span class="text-lg text-yellow-400">★★★</span><span class="text-lg text-gray-400">☆☆</span> и выше', count: 78, checked: false },
        { id: '2', name: '<span class="text-lg text-yellow-400">★★</span><span class="text-lg text-gray-400">☆☆☆</span> и выше', count: 92, checked: false },
      ],
    },
  ];

  onMobileFilterOpen(): void {
    this.originalFilters = JSON.parse(JSON.stringify(this.filters));
    this.loadFiltersFromUrl();
    this.tempFilters = JSON.parse(JSON.stringify(this.filters));
    this.accordionActiveValues = this.getDefaultAccordionValues();
  }

  onCategoryClick(category: Category): void {
    const currentParams = { ...this.route.snapshot.queryParams };

    // If this is a subcategory (second level), add subcategoryId
    if (this.currentCategory && !this.currentSubcategory) {
      currentParams['subcategoryId'] = category.id.toString();
    }
    // If this is a leaf category (third level), add leafId
    else if (this.currentCategory && this.currentSubcategory) {
      currentParams['leafId'] = category.id.toString();
    }
    // If somehow this is a main category, set categoryId
    else {
      currentParams['categoryId'] = category.id.toString();
    }

    this.router.navigate(['/products'], {
      queryParams: currentParams,
    });

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
    // Get current query parameters to preserve non-filter parameters like search, categoryId
    const currentParams = { ...this.route.snapshot.queryParams };

    // Remove existing filter parameters
    delete currentParams['minPrice'];
    delete currentParams['maxPrice'];
    delete currentParams['brandIds'];
    delete currentParams['minRating'];

    const queryParams: any = { ...currentParams };

    // Build query parameters from filters
    this.filters.forEach((filter) => {
      if (filter.type === 'range' && filter.id === 'price') {
        if (filter.currentMin !== filter.min || filter.currentMax !== filter.max) {
          queryParams.minPrice = filter.currentMin;
          queryParams.maxPrice = filter.currentMax;
        }
      } else if (filter.type === 'checkbox' && filter.options) {
        const selectedOptions = filter.options.filter((option) => option.checked);

        if (selectedOptions.length > 0) {
          if (filter.id === 'brand') {
            queryParams.brandIds = selectedOptions.map((option) => option.id).join(',');
          } else if (filter.id === 'rating') {
            queryParams.minRating = Math.min(...selectedOptions.map((option) => parseInt(option.id)));
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

    // Get current query parameters to preserve non-filter parameters like search, categoryId
    const currentParams = { ...this.route.snapshot.queryParams };

    // Remove existing filter parameters
    delete currentParams['minPrice'];
    delete currentParams['maxPrice'];
    delete currentParams['brandIds'];
    delete currentParams['minRating'];

    // Navigate to products page with preserved non-filter parameters
    this.router.navigate(['/products'], { queryParams: currentParams });

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

  // Additional methods for category navigation
  isActiveSubcategory(subcategory: Category): boolean {
    // Check if this subcategory is currently selected
    if (this.currentSubcategory) {
      return subcategory.id === this.currentSubcategory.id;
    }

    // Check if this leaf category is currently selected
    if (this.currentLeaf) {
      return subcategory.id === this.currentLeaf.id;
    }

    return false;
  }

  getDefaultAccordionValues(): string[] {
    const values = ['price', 'brand', 'rating'];
    if (this.shouldShowCategories) {
      values.unshift('categories'); // Add categories at the beginning
    }
    return values;
  }

  private loadFiltersFromUrl(): void {
    this.route.queryParams.subscribe((params) => {
      // Reset all filters to default state first
      this.resetFiltersToDefault();

      // Update current category based on route parameters
      this.updateCurrentCategoryFromRoute();

      // Load price range filter
      const priceFilter = this.filters.find((f) => f.id === 'price');
      if (priceFilter) {
        if (params['minPrice']) {
          priceFilter.currentMin = +params['minPrice'];
        }
        if (params['maxPrice']) {
          priceFilter.currentMax = +params['maxPrice'];
        }
        priceFilter.range = [priceFilter.currentMin!, priceFilter.currentMax!];
      }

      // Load brand filters
      const brandFilter = this.filters.find((f) => f.id === 'brand');
      if (brandFilter && brandFilter.options && params['brandIds']) {
        const selectedBrandIds = params['brandIds'].split(',');
        brandFilter.options.forEach((option) => {
          option.checked = selectedBrandIds.includes(option.id);
        });
      }

      // Load rating filter
      const ratingFilter = this.filters.find((f) => f.id === 'rating');
      if (ratingFilter && ratingFilter.options && params['minRating']) {
        const minRating = +params['minRating'];
        ratingFilter.options.forEach((option) => {
          // Check the exact rating that matches minRating
          // Since rating options represent "X stars & up", we check if the option's rating <= minRating
          option.checked = +option.id === minRating;
        });
      }
    });
  }

  private resetFiltersToDefault(): void {
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
  }
}
