import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  showSuccessModal = false;
  cardNumber = '**** **** **** 1934';

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
    this.router.navigate(['/cart']);
  }

  processPayment(): void {
    this.showSuccessModal = true;
  }

  closeModal(): void {
    this.showSuccessModal = false;
    this.dataService.clearCart();
    this.router.navigate(['/']);
  }
}
