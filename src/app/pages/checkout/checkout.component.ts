import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Address } from '../../components/address-drawer/address-drawer.component';

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

interface Location {
  name: string;
  value: string;
  isAddNew?: boolean;
}

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  total = 0;
  subtotal = 0;
  cartCount = 0;
  selectedDeliveryFee = 0;
  selectedDeliveryOption = 'standard';
  selectedPaymentMethod = '**** **** **** 1934';
  selectedLocation: Location | null = null;

  // Address management
  showAddressDrawer = false;
  locations: Location[] = [];
  private selectedAddressSubscription: Subscription = new Subscription();
  private addressSubscription: Subscription = new Subscription();
  deliveryOptions: DeliveryOption[] = [
    {
      id: 'standard',
      name: 'Стандартная доставка',
      description: '2-3 рабочих дня',
      price: 0,
    },
    {
      id: 'express',
      name: 'Экспресс доставка',
      description: 'Следующий рабочий день',
      price: 5000,
    },
    {
      id: 'same-day',
      name: 'Доставка в тот же день',
      description: 'В течение 24 часов',
      price: 10000,
    },
  ];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    // Load addresses from DataService
    this.locations = this.dataService.getAddressesForDropdown();

    // Subscribe to selected address changes
    this.selectedAddressSubscription = this.dataService.selectedAddress$.subscribe((selectedAddress) => {
      this.selectedLocation = selectedAddress;
    });

    // Subscribe to address list changes
    this.addressSubscription = this.dataService.addresses$.subscribe(() => {
      this.locations = this.dataService.getAddressesForDropdown();
    });

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

  ngOnDestroy(): void {
    this.selectedAddressSubscription.unsubscribe();
    this.addressSubscription.unsubscribe();
  }

  // Address management methods
  onLocationChange(location: Location): void {
    if (location.isAddNew) {
      this.showAddressDrawer = true;
      // Keep the selection on "Add new address" temporarily
    } else {
      // Update the shared selected address
      this.dataService.setSelectedAddress(location);
    }
  }

  onAddressAdded(newAddress: Address): void {
    // Address is automatically added to DataService and will update via subscription
    this.showAddressDrawer = false;
  }

  onDrawerClosed(): void {
    this.showAddressDrawer = false;
    // Reset to the current shared selected address when drawer is closed without saving
    const currentSelected = this.dataService.getSelectedAddress();
    if (currentSelected) {
      this.selectedLocation = currentSelected;
    }
  }
}
