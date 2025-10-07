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
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    memberSince: new Date('2023-01-15'),
    totalOrders: 24,
    totalSaved: 156,
  };

  accountMenuItems: AccountMenuItem[] = [
    {
      icon: 'pi-user',
      title: 'Edit Profile',
      description: 'Update your personal information',
      route: '/profile/edit',
    },
    {
      icon: 'pi-map-marker',
      title: 'Shipping Addresses',
      description: 'Manage your delivery addresses',
      route: '/addresses',
    },
    {
      icon: 'pi-credit-card',
      title: 'Payment Methods',
      description: 'Manage cards and payment options',
      route: '/payment-methods',
    },
    {
      icon: 'pi-bell',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      route: '/notifications',
      badge: '3',
    },
    {
      icon: 'pi-shield',
      title: 'Privacy & Security',
      description: 'Password and security settings',
      route: '/security',
    },
    {
      icon: 'pi-question-circle',
      title: 'Help & Support',
      description: 'Get help and contact support',
      route: '/support',
    },
    {
      icon: 'pi-info-circle',
      title: 'About App',
      description: 'App version and information',
      action: 'about',
    },
    {
      icon: 'pi-sign-out',
      title: 'Logout',
      description: 'Sign out of your account',
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
      // Navigate to route (placeholder - these routes don't exist yet)
      this.dataService['messageService'].add({
        severity: 'info',
        summary: 'Coming Soon',
        detail: `${item.title} feature will be available soon`,
      });
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
      detail: 'Version 1.0.0 - Built with Angular & PrimeNG',
    });
  }

  confirmLogout(): void {
    this.showLogoutModal = false;
    // Clear user session data
    localStorage.removeItem('userSession');

    this.dataService['messageService'].add({
      severity: 'success',
      summary: 'Logged Out',
      detail: 'You have been logged out successfully',
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
      summary: 'Coming Soon',
      detail: 'Profile editing feature will be available soon',
    });
  }

  getMembershipDuration(): string {
    const now = new Date();
    const diff = now.getTime() - this.userProfile.memberSince.getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));

    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    } else {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
  }
}
