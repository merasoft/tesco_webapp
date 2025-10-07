import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: any;
  selectedColor: string = '';
  isFavorite = false;
  isLoading = true;
  selectedImageIndex = 0;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.loadProduct(id);
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.dataService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        if (this.product && this.product.colors && this.product.colors.length > 0) {
          this.selectedColor = this.product.colors[0];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  addToCart(): void {
    if (this.product) {
      this.dataService.addToCart(this.product);
    }
  }

  buyNow(): void {
    if (this.product) {
      this.dataService.addToCart(this.product);
      this.router.navigate(['/checkout']);
    }
  }

  getStarArray(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push('half');
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }

    return stars;
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  onCarouselPageChange(event: any): void {
    this.selectedImageIndex = event.page;
    // Scroll to active thumbnail for better UX
    setTimeout(() => {
      const activeButton = document.querySelector('.prod-image-button.active');
      activeButton?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }, 100);
  }
}
