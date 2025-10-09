import { Component, ElementRef, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class AddressDrawerComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() initialAddress?: Address;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() addressSaved = new EventEmitter<Address>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('addressLabelInput') addressLabelInput!: ElementRef<HTMLInputElement>;

  addressForm: FormGroup;

  constructor(private dataService: DataService, private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      label: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      phone: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadInitialAddress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialAddress']) {
      this.loadInitialAddress();
    }
  }

  private loadInitialAddress(): void {
    if (this.initialAddress) {
      setTimeout(() => {
        this.addressForm.patchValue({
          label: this.initialAddress!.label,
          address: this.initialAddress!.address,
          city: this.initialAddress!.city,
          zipCode: this.initialAddress!.zipCode,
          phone: this.initialAddress!.phone,
        });
      }, 0);
    } else {
      this.resetForm();
    }
  }

  closeDrawer(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.closed.emit();
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      const formValue = this.addressForm.value;

      if (this.initialAddress?.id) {
        this.dataService.updateAddress({ ...formValue, id: this.initialAddress.id });
      } else {
        this.dataService.addAddress({ ...formValue });
      }

      this.addressSaved.emit({ ...formValue });
      this.closeDrawer();
    }
  }

  private resetForm(): void {
    this.addressForm.reset({
      label: '',
      address: '',
      city: '',
      zipCode: '',
      phone: '',
    });
  }

  focusInput(): void {
    if (this.addressLabelInput) {
      setTimeout(() => {
        this.addressLabelInput.nativeElement.focus();
      }, 100);
    }
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.addressForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.addressForm.get(fieldName);
    if (field?.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return 'Это поле обязательно для заполнения';
      }
    }
    return '';
  }
}
