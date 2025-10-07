import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  isInWishlist = false;

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    // Check if product is in wishlist
    this.dataService.wishlistItems$.subscribe((items) => {
      this.isInWishlist = items.some((item) => item.id === this.product.id);
    });
  }

  viewProduct(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    this.dataService.addToCart(this.product, 1);
  }

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    this.dataService.toggleWishlist(this.product);
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
