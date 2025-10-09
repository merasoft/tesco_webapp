import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../services/data.service';

export interface Address {
  id?: string;
  label: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

@Component({
  selector: 'app-address-drawer',
  standalone: false,
  templateUrl: './address-drawer.component.html',
  styleUrls: ['./address-drawer.component.scss'],
})
export class AddressDrawerComponent implements OnInit {
  @Input() visible = false;
  @Input() initialAddress?: Address;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() addressSaved = new EventEmitter<Address>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('addressLabelInput') addressLabelInput!: ElementRef<HTMLInputElement>;

  newAddress: Address = {
    label: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    if (this.initialAddress) {
      this.newAddress = { ...this.initialAddress };
    }
  }

  closeDrawer(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
    this.closed.emit();
  }

  saveAddress(): void {
    if (this.newAddress.address && this.newAddress.city) {
      // Use DataService to save address
      if (this.initialAddress?.id) {
        // Update existing address
        this.dataService.updateAddress({ ...this.newAddress, id: this.initialAddress.id });
      } else {
        // Add new address
        this.dataService.addAddress({ ...this.newAddress });
      }

      this.addressSaved.emit({ ...this.newAddress });
      this.closeDrawer();
    }
  }

  private resetForm(): void {
    this.newAddress = {
      label: '',
      address: '',
      city: '',
      zipCode: '',
      phone: '',
    };
  }

  focusInput(): void {
    if (this.addressLabelInput) {
      setTimeout(() => {
        this.addressLabelInput.nativeElement.focus();
      }, 100);
    }
  }
}
