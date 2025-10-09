import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '../../components/address-drawer/address-drawer.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-delivery-addresses',
  standalone: false,
  templateUrl: './delivery-addresses.component.html',
  styleUrls: ['./delivery-addresses.component.scss'],
})
export class DeliveryAddressesComponent implements OnInit {
  addresses: Address[] = [];
  showAddressDrawer = false;
  editingAddress: Address | undefined = undefined;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    // Subscribe to addresses from DataService
    this.dataService.addresses$.subscribe((addresses) => {
      this.addresses = addresses;
    });
  }

  goBack(): void {
    this.router.navigate(['/account']);
  }

  addNewAddress(): void {
    this.editingAddress = undefined;
    this.showAddressDrawer = true;
  }

  editAddress(address: Address): void {
    this.editingAddress = { ...address };
    this.showAddressDrawer = true;
  }

  deleteAddress(addressId: string): void {
    this.dataService.deleteAddress(addressId);
  }

  onAddressSaved(address: Address): void {
    if (this.editingAddress) {
      // Update existing address
      this.dataService.updateAddress({ ...address, id: this.editingAddress.id });
    } else {
      // Add new address
      this.dataService.addAddress(address);
    }

    this.showAddressDrawer = false;
    this.editingAddress = undefined;
  }

  onDrawerClosed(): void {
    this.showAddressDrawer = false;
    this.editingAddress = undefined;
  }
}
