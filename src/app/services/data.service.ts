import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl = 'assets/data/products.json';
  private cartItems = new BehaviorSubject<any[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
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
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ ...product, quantity });
    }

    this.cartItems.next(currentCart);
    this.saveCart();
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartItems.value.filter((item) => item.id !== productId);
    this.cartItems.next(currentCart);
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartItems.value;
    const item = currentCart.find((item) => item.id === productId);

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
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
}
