import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface DeliveryAddress {
  name: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  total = 0;
  subtotal = 0;
  cartCount = 0;
  selectedDeliveryFee = 0;
  selectedDeliveryOption = 'standard';
  selectedPaymentMethod = '**** **** **** 1934';
  deliveryLocation = 'Salatiga City, Central Java';

  deliveryOptions: DeliveryOption[] = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '2-3 business days',
      price: 0,
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Next business day',
      price: 5000,
    },
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      description: 'Within 24 hours',
      price: 10000,
    },
  ];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.dataService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
      this.subtotal = this.dataService.getCartTotal();
      this.calculateTotal();
    });
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  selectDeliveryOption(optionId: string): void {
    this.selectedDeliveryOption = optionId;
    const option = this.deliveryOptions.find((opt) => opt.id === optionId);
    this.selectedDeliveryFee = option ? option.price : 0;
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.subtotal + this.selectedDeliveryFee;
  }

  proceedToPayment(): void {
    // Navigate to payment page with order details
    this.router.navigate(['/payment'], {
      queryParams: {
        total: this.total,
        delivery: this.selectedDeliveryOption,
      },
    });
  }

  processPayment(): void {
    // Keep the old method for compatibility
    this.proceedToPayment();
  }
}
