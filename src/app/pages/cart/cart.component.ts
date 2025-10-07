import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  cartCount = 0;
  deliveryLocation = 'Salatiga City, Central Java';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.dataService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
      this.total = this.dataService.getCartTotal();
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  updateQuantity(productId: number, change: number): void {
    const item = this.cartItems.find((i) => i.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      this.dataService.updateQuantity(productId, newQuantity, item.selectedColor);
    }
  }

  removeItem(productId: number): void {
    const item = this.cartItems.find((i) => i.id === productId);
    if (item) {
      this.dataService.removeFromCart(productId, item.selectedColor);
    }
  }

  proceedToCheckout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}
