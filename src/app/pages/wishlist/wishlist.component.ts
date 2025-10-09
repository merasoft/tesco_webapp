import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-wishlist',
  standalone: false,
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];
  isLoading = false;
  cartCount = 0;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to cart count for header badge
    this.dataService.cartItems$.subscribe((items) => {
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
    });

    // Subscribe to wishlist items
    this.dataService.wishlistItems$.subscribe((items) => {
      this.wishlistItems = items;
    });
  }

  loadWishlist(): void {
    // No longer needed since we're using the service subscription
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  removeFromWishlist(productId: number): void {
    this.dataService.removeFromWishlist(productId);
  }

  addToCart(product: any): void {
    this.dataService.addToCart(product, 1);
    // Optionally remove from wishlist after adding to cart
    // this.removeFromWishlist(product.id);
  }

  clearWishlist(): void {
    this.dataService.clearWishlist();
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
}
