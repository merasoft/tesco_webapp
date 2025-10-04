import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  deliveryLocation = 'Salatiga City, Central Java';

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.dataService.getCartTotal();
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  updateQuantity(productId: number, change: number): void {
    const item = this.cartItems.find(i => i.id === productId);
    if (item) {
      const newQuantity = item.quantity + change;
      this.dataService.updateQuantity(productId, newQuantity);
    }
  }

  removeItem(productId: number): void {
    this.dataService.removeFromCart(productId);
  }

  proceedToCheckout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    }
  }
}
