import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl = 'assets/data/products.json';
  private cartItems = new BehaviorSubject<any[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  private wishlistItems = new BehaviorSubject<any[]>([]);
  public wishlistItems$ = this.wishlistItems.asObservable();

  constructor(private http: HttpClient, private messageService: MessageService) {
    this.loadCart();
    this.loadWishlist();
    this.loadAddressesFromStorage();
  }

  getData(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }

  getCategories(): Observable<any[]> {
    return this.getData().pipe(map((data) => data.categories));
  }

  getBrands(): Observable<any[]> {
    return this.getData().pipe(map((data) => data.brands));
  }

  getBanners(): Observable<any[]> {
    return this.getData().pipe(map((data) => data.banners));
  }

  getProducts(categoryId?: number, brandId?: number, search?: string): Observable<any[]> {
    return this.getData().pipe(
      map((data) => {
        let products = data.products;

        if (categoryId && categoryId !== 5) {
          products = products.filter((p: any) => p.categoryId === categoryId);
        }

        if (brandId) {
          products = products.filter((p: any) => p.brandId === brandId);
        }

        if (search) {
          const searchLower = search.toLowerCase();
          products = products.filter((p: any) => p.name.toLowerCase().includes(searchLower));
        }

        return products;
      })
    );
  }

  getProductById(id: number): Observable<any> {
    return this.getData().pipe(map((data) => data.products.find((p: any) => p.id === id)));
  }

  // Cart methods
  addToCart(product: any, quantity: number = 1): void {
    const currentCart = [...this.cartItems.value];
    const existingItem = currentCart.find((item) => item.id === product.id && (!product.selectedColor || item.selectedColor === product.selectedColor));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ ...product, quantity });
    }

    this.cartItems.next(currentCart);
    this.saveCart();

    this.messageService.add({
      severity: 'success',
      summary: 'Добавлено в корзину',
      detail: `${product.name}`,
      life: 2000,
    });
  }

  addToCartSilent(product: any, quantity: number = 1): void {
    const currentCart = [...this.cartItems.value];
    const existingItem = currentCart.find((item) => item.id === product.id && (!product.selectedColor || item.selectedColor === product.selectedColor));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ ...product, quantity });
    }

    this.cartItems.next(currentCart);
    this.saveCart();
  }

  removeFromCart(productId: number, selectedColor?: string): void {
    const currentCart = this.cartItems.value.filter((item) => !(item.id === productId && (!selectedColor || item.selectedColor === selectedColor)));
    this.cartItems.next(currentCart);
    this.saveCart();

    this.messageService.add({
      severity: 'info',
      summary: 'Удалено',
      detail: 'Товар удален из корзины',
      life: 2000,
    });
  }

  updateQuantity(productId: number, quantity: number, selectedColor?: string): void {
    const currentCart = [...this.cartItems.value];
    const item = currentCart.find((item) => item.id === productId && (!selectedColor || item.selectedColor === selectedColor));

    if (item) {
      item.quantity = quantity;

      if (item.quantity <= 0) {
        this.removeFromCart(productId, selectedColor);
      } else {
        this.cartItems.next(currentCart);
        this.saveCart();
      }
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCart();
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  // Wishlist methods
  addToWishlist(product: any): void {
    const currentWishlist = [...this.wishlistItems.value];
    const existingItem = currentWishlist.find((item) => item.id === product.id);

    if (!existingItem) {
      currentWishlist.push({ ...product, addedDate: new Date() });
      this.wishlistItems.next(currentWishlist);
      this.saveWishlist();

      this.messageService.add({
        severity: 'success',
        summary: 'Добавлено в избранное',
        detail: `${product.name}`,
        life: 2000,
      });
    }
  }

  removeFromWishlist(productId: number): void {
    const currentWishlist = this.wishlistItems.value.filter((item) => item.id !== productId);
    this.wishlistItems.next(currentWishlist);
    this.saveWishlist();

    this.messageService.add({
      severity: 'info',
      summary: 'Удалено',
      detail: 'Товар удален из избранного',
      life: 2000,
    });
  }

  toggleWishlist(product: any): boolean {
    const isInWishlist = this.isInWishlist(product.id);

    if (isInWishlist) {
      this.removeFromWishlist(product.id);
      return false;
    } else {
      this.addToWishlist(product);
      return true;
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.value.some((item) => item.id === productId);
  }

  clearWishlist(): void {
    this.wishlistItems.next([]);
    this.saveWishlist();

    this.messageService.add({
      severity: 'info',
      summary: 'Очищено',
      detail: 'Избранное очищено',
      life: 2000,
    });
  }

  private saveWishlist(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems.value));
  }

  private loadWishlist(): void {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistItems.next(JSON.parse(savedWishlist));
    }
  }

  // Address Management Methods
  private addressesSubject = new BehaviorSubject<any[]>([]);
  public addresses$ = this.addressesSubject.asObservable();

  // Selected address management - shared across all components
  private selectedAddressSubject = new BehaviorSubject<any>(null);
  public selectedAddress$ = this.selectedAddressSubject.asObservable();

  getAddresses(): Observable<any[]> {
    return this.getData().pipe(map((data) => data.addresses || []));
  }

  loadAddressesFromStorage(): void {
    const savedAddresses = localStorage.getItem('delivery-addresses');
    if (savedAddresses) {
      this.addressesSubject.next(JSON.parse(savedAddresses));
      // Load selected address after addresses are loaded
      this.loadSelectedAddress();
    } else {
      // Load initial addresses from JSON and save to localStorage
      this.getAddresses().subscribe((addresses) => {
        this.addressesSubject.next(addresses);
        this.saveAddresses();
        // Load selected address after addresses are loaded
        this.loadSelectedAddress();
      });
    }
  }

  // Selected address management methods
  setSelectedAddress(location: any): void {
    this.selectedAddressSubject.next(location);
    localStorage.setItem('selected-address', JSON.stringify(location));
  }

  getSelectedAddress(): any {
    return this.selectedAddressSubject.value;
  }

  private loadSelectedAddress(): void {
    const savedSelected = localStorage.getItem('selected-address');
    if (savedSelected) {
      this.selectedAddressSubject.next(JSON.parse(savedSelected));
    } else {
      // Set first non-"add new" address as default
      const addresses = this.getAddressesForDropdown();
      const firstRealAddress = addresses.find((addr) => !addr.isAddNew);
      if (firstRealAddress) {
        this.setSelectedAddress(firstRealAddress);
      }
    }
  }

  getAllAddresses(): any[] {
    return this.addressesSubject.value;
  }

  addAddress(address: any): void {
    const currentAddresses = this.addressesSubject.value;
    address.id = Date.now().toString();

    const updatedAddresses = [...currentAddresses, address];
    this.addressesSubject.next(updatedAddresses);
    this.saveAddresses();

    // Automatically select the newly added address
    const newLocation = {
      name: `${address.label} - ${address.address}`,
      value: address.id,
      isAddNew: false,
    };
    this.setSelectedAddress(newLocation);

    this.messageService.add({
      severity: 'success',
      summary: 'Адрес добавлен',
      detail: 'Новый адрес доставки успешно добавлен',
      life: 2000,
    });
  }
  updateAddress(updatedAddress: any): void {
    const currentAddresses = this.addressesSubject.value;
    const index = currentAddresses.findIndex((addr) => addr.id === updatedAddress.id);

    if (index !== -1) {
      currentAddresses[index] = updatedAddress;
      this.addressesSubject.next([...currentAddresses]);
      this.saveAddresses();

      this.messageService.add({
        severity: 'success',
        summary: 'Адрес обновлен',
        detail: 'Адрес доставки успешно обновлен',
        life: 2000,
      });
    }
  }

  deleteAddress(addressId: string): void {
    const currentAddresses = this.addressesSubject.value;
    const updatedAddresses = currentAddresses.filter((addr) => addr.id !== addressId);
    this.addressesSubject.next(updatedAddresses);
    this.saveAddresses();

    // If the deleted address was selected, select another one
    const currentSelected = this.getSelectedAddress();
    if (currentSelected && currentSelected.value === addressId) {
      const availableAddresses = this.getAddressesForDropdown();
      const firstRealAddress = availableAddresses.find((addr) => !addr.isAddNew);
      if (firstRealAddress) {
        this.setSelectedAddress(firstRealAddress);
      } else {
        this.setSelectedAddress(null);
      }
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Адрес удален',
      detail: 'Адрес доставки успешно удален',
      life: 2000,
    });
  }

  getAddressesForDropdown(): any[] {
    const addresses = this.getAllAddresses();
    const dropdownOptions = [{ name: 'Добавить новый адрес', value: 'add-new', isAddNew: true }];

    addresses.forEach((address) => {
      dropdownOptions.push({
        name: `${address.label} - ${address.address}`,
        value: address.id,
        isAddNew: false,
      });
    });

    return dropdownOptions;
  }

  private saveAddresses(): void {
    localStorage.setItem('delivery-addresses', JSON.stringify(this.addressesSubject.value));
  }
}
