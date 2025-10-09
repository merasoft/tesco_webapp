import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

interface AccountMenuItem {
  icon: string;
  title: string;
  description: string;
  route?: string;
  action?: string;
  badge?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: Date;
  totalOrders: number;
  totalSaved: number;
}

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  cartCount = 0;
  showLogoutModal = false;

  userProfile: UserProfile = {
    name: 'Иван Иванов',
    email: 'ivan.ivanov@example.com',
    phone: '+998 90 123-45-67',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    memberSince: new Date('2023-01-15'),
    totalOrders: 24,
    totalSaved: 156,
  };

  accountMenuItems: AccountMenuItem[] = [
    {
      icon: 'pi-user',
      title: 'Редактировать профиль',
      description: 'Обновить личную информацию',
      route: '/profile/edit',
    },
    {
      icon: 'pi-map-marker',
      title: 'Адреса доставки',
      description: 'Управление адресами доставки',
      route: '/delivery-addresses',
    },
    {
      icon: 'pi-credit-card',
      title: 'Способы оплаты',
      description: 'Управление картами и способами оплаты',
      route: '/payment-methods',
    },
    {
      icon: 'pi-bell',
      title: 'Уведомления',
      description: 'Настройки уведомлений',
      route: '/notifications',
      badge: '3',
    },
    // {
    //   icon: 'pi-shield',
    //   title: 'Privacy & Security',
    //   description: 'Password and security settings',
    //   route: '/security',
    // },
    // {
    //   icon: 'pi-question-circle',
    //   title: 'Help & Support',
    //   description: 'Get help and contact support',
    //   route: '/support',
    // },
    // {
    //   icon: 'pi-info-circle',
    //   title: 'About App',
    //   description: 'App version and information',
    //   action: 'about',
    // },
    {
      icon: 'pi-sign-out',
      title: 'Выйти',
      description: 'Выйти из аккаунта',
      action: 'logout',
    },
  ];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to cart count for header badge
    this.dataService.cartItems$.subscribe((items) => {
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  handleMenuItemClick(item: AccountMenuItem): void {
    if (item.route) {
      if (item.route === '/delivery-addresses') {
        // Navigate to delivery addresses page
        this.router.navigate(['/delivery-addresses']);
      } else {
        // Navigate to other routes (placeholder - these routes don't exist yet)
        this.dataService['messageService'].add({
          severity: 'info',
          summary: 'Скоро',
          detail: `Функция "${item.title}" будет доступна в ближайшее время`,
        });
      }
    } else if (item.action) {
      this.handleAction(item.action);
    }
  }

  handleAction(action: string): void {
    switch (action) {
      case 'logout':
        this.showLogoutModal = true;
        break;
      case 'about':
        this.showAboutInfo();
        break;
    }
  }

  showAboutInfo(): void {
    this.dataService['messageService'].add({
      severity: 'info',
      summary: 'Tesco App',
      detail: 'Версия 1.0.0 - Создано с помощью Angular & PrimeNG',
    });
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    // Clear user session data
    localStorage.removeItem('userSession');

    this.dataService['messageService'].add({
      severity: 'success',
      summary: 'Выход выполнен',
      detail: 'Вы успешно вышли из аккаунта',
    });

    // Navigate to login or home
    this.router.navigate(['/']);
  }

  cancelLogout(): void {
    this.showLogoutModal = false;
  }

  editProfile(): void {
    this.dataService['messageService'].add({
      severity: 'info',
      summary: 'Скоро',
      detail: 'Функция редактирования профиля будет доступна в ближайшее время',
    });
  }

  getMembershipDuration(): string {
    const now = new Date();
    const diff = now.getTime() - this.userProfile.memberSince.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));

    if (years > 0) {
      let result = `${years} ${this.getRussianYearForm(years)}`;
      if (months > 0) {
        result += ` ${months} ${this.getRussianMonthForm(months)}`;
      }
      return result;
    } else {
      return `${months} ${this.getRussianMonthForm(months)}`;
    }
  }

  private getRussianYearForm(count: number): string {
    if (count % 10 === 1 && count % 100 !== 11) {
      return 'год';
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
      return 'года';
    } else {
      return 'лет';
    }
  }

  private getRussianMonthForm(count: number): string {
    if (count % 10 === 1 && count % 100 !== 11) {
      return 'месяц';
    } else if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
      return 'месяца';
    } else {
      return 'месяцев';
    }
  }
}
