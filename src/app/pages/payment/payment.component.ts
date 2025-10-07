import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  cartCount = 0;
  deliveryOption = '';
  showSuccessModal = false;
  selectedPaymentMethod = 'card';
  cardNumber = '**** **** **** 1934';

  paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'pi-credit-card' },
    { id: 'paypal', name: 'PayPal', icon: 'pi-paypal' },
    { id: 'apple-pay', name: 'Apple Pay', icon: 'pi-apple' },
    { id: 'google-pay', name: 'Google Pay', icon: 'pi-google' },
  ];

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get cart data
    this.dataService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
    });

    // Get parameters from checkout
    this.route.queryParams.subscribe((params) => {
      this.total = Number(params['total']) || this.dataService.getCartTotal();
      this.deliveryOption = params['delivery'] || 'standard';
    });
  }

  goBack(): void {
    this.router.navigate(['/checkout']);
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
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
