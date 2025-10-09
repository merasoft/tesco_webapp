import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

interface OrderItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  date: Date;
  status: 'delivered' | 'processing' | 'shipped' | 'cancelled';
  total: number;
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = false;
  cartCount = 0;
  selectedFilter = 'all';
  showOrderDialog = false;
  selectedOrder: Order | null = null;

  filterOptions = [
    { label: 'Все заказы', value: 'all' },
    { label: 'Доставлено', value: 'delivered' },
    { label: 'В обработке', value: 'processing' },
    { label: 'Отправлено', value: 'shipped' },
    { label: 'Отменено', value: 'cancelled' },
  ];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to cart count for header badge
    this.dataService.cartItems$.subscribe((items) => {
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
    });

    this.loadOrderHistory();
  }

  loadOrderHistory(): void {
    this.isLoading = true;
    // Simulate loading order history - in real app this would come from a service
    setTimeout(() => {
      this.dataService.getProducts().subscribe((products) => {
        // Mock order history data
        this.orders = this.generateMockOrders(products);
        this.filteredOrders = [...this.orders];
        this.isLoading = false;
      });
    }, 800);
  }

  generateMockOrders(products: any[]): Order[] {
    const statuses: ('delivered' | 'processing' | 'shipped' | 'cancelled')[] = ['delivered', 'processing', 'shipped', 'cancelled'];

    const mockOrders: Order[] = [];

    for (let i = 0; i < 8; i++) {
      const orderItems = products.slice(i, i + Math.floor(Math.random() * 3) + 1).map((product) => ({
        id: product.id,
        name: product.name,
        image: product.images?.[0] || product.image || 'https://via.placeholder.com/400x400?text=No+Image',
        price: product.price,
        quantity: Math.floor(Math.random() * 3) + 1,
      }));

      const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      mockOrders.push({
        id: `ORD-${1000 + i}`,
        date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        total: total,
        items: orderItems,
        deliveryAddress: 'г. Ташкент, Юнусабадский район',
        paymentMethod: '**** **** **** 1934',
      });
    }

    return mockOrders.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Filter by status
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === this.selectedFilter);
    }

    this.filteredOrders = filtered;
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'delivered':
        return 'pi-check-circle';
      case 'processing':
        return 'pi-clock';
      case 'shipped':
        return 'pi-truck';
      case 'cancelled':
        return 'pi-times-circle';
      default:
        return 'pi-info-circle';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'delivered':
        return 'Доставлено';
      case 'processing':
        return 'В обработке';
      case 'shipped':
        return 'Отправлено';
      case 'cancelled':
        return 'Отменено';
      default:
        return status;
    }
  }

  reorderItems(order: Order): void {
    // Add all items from the order to cart
    order.items.forEach((item) => {
      // Find the original product to get all details
      this.dataService.getProducts().subscribe((products) => {
        const product = products.find((p) => p.id === item.id);
        if (product) {
          this.dataService.addToCartSilent(product, item.quantity);
        }
      });
    });

    this.dataService['messageService'].add({
      severity: 'success',
      summary: 'Добавлено в корзину',
      detail: `${order.items.length} товаров добавлено в корзину`,
    });
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDialog = true;
  }

  closeOrderDialog(): void {
    this.showOrderDialog = false;
    this.selectedOrder = null;
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}
