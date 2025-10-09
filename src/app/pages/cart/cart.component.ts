import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Address } from '../../components/address-drawer/address-drawer.component';

interface Location {
  name: string;
  value: string;
  isAddNew?: boolean;
}

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  total = 0;
  cartCount = 0;
  selectedLocation: Location | null = null;
  showAddressDrawer = false;
  locations: Location[] = [];
  private selectedAddressSubscription: Subscription = new Subscription();
  private addressSubscription: Subscription = new Subscription();

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

  ngOnDestroy(): void {
    this.selectedAddressSubscription.unsubscribe();
    this.addressSubscription.unsubscribe();
  }

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
