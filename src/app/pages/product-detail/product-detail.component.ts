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
  quantity = 0;
  private cartItems: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.loadProduct(id);

    // Subscribe to cart changes to keep quantity in sync
    this.dataService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.updateQuantityFromCart();
    });
  }

  private updateQuantityFromCart(): void {
    if (!this.product) return;

    // Get current cart items from the observable
    const existingItem = this.cartItems.find((item: any) => item.id === this.product.id && (!this.selectedColor || item.selectedColor === this.selectedColor));

    this.quantity = existingItem ? existingItem.quantity : 0;
  }

  increaseQuantity(): void {
    this.quantity++;
    this.dataService.updateQuantity(this.product.id, this.quantity, this.selectedColor);
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.dataService.updateQuantity(this.product.id, this.quantity, this.selectedColor);
    } else {
      this.dataService.removeFromCart(this.product.id, this.selectedColor);
      this.quantity = 0;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.quantity = 1;
      const cartItem = {
        ...this.product,
        selectedColor: this.selectedColor,
      };

      this.dataService.addToCart(cartItem, 1);
    }
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
    this.updateQuantityFromCart(); // Update quantity when color changes
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  buyNow(): void {
    if (this.product) {
      const cartItem = {
        ...this.product,
        selectedColor: this.selectedColor,
      };

      this.dataService.addToCartSilent(cartItem, 1);
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
