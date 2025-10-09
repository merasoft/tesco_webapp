import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Address } from '../address-drawer/address-drawer.component';

interface Location {
  name: string;
  value: string;
  isAddNew?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartCount = 0;
  selectedLocation: Location | null = null;
  showAddressDrawer = false;
  private cartSubscription: Subscription = new Subscription();
  private addressSubscription: Subscription = new Subscription();
  private selectedAddressSubscription: Subscription = new Subscription();
  locations: Location[] = [];

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

    this.cartSubscription = this.dataService.cartItems$.subscribe((items) => {
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
    this.addressSubscription.unsubscribe();
    this.selectedAddressSubscription.unsubscribe();
  }

  onLocationChange(location: Location): void {
    if (location.isAddNew) {
      this.showAddressDrawer = true;
      // Keep the selection on "Add new address" temporarily to avoid flickering
      // The actual reset will happen when the drawer closes or address is saved
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

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
