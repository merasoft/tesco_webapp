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
      summary: 'Added to Cart',
      detail: `${product.name}`,
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
      summary: 'Removed',
      detail: 'Product removed from cart',
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
        summary: 'Added to Wishlist',
        detail: `${product.name}`,
      });
    }
  }

  removeFromWishlist(productId: number): void {
    const currentWishlist = this.wishlistItems.value.filter((item) => item.id !== productId);
    this.wishlistItems.next(currentWishlist);
    this.saveWishlist();

    this.messageService.add({
      severity: 'info',
      summary: 'Removed',
      detail: 'Product removed from wishlist',
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
      summary: 'Cleared',
      detail: 'Wishlist cleared successfully',
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
}
