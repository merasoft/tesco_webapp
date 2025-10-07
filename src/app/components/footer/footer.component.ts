import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';

interface NavigationItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  hasWishlistItems = false;
  navigationItems: NavigationItem[] = [
    { icon: 'pi pi-home', label: 'Home', route: '' },
    { icon: 'pi pi-heart', label: 'Wishlist', route: '/wishlist' },
    { icon: 'pi pi-file', label: 'History', route: '/history' },
    { icon: 'pi pi-user', label: 'Account', route: '/account' },
  ];
  private wishlistSubscription: Subscription = new Subscription();

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.wishlistSubscription = this.dataService.wishlistItems$.subscribe((items) => {
      this.hasWishlistItems = items.length > 0;
    });
  }

  ngOnDestroy(): void {
    this.wishlistSubscription.unsubscribe();
  }

  isActiveRoute(route: string): boolean {
    if (route === '') {
      return this.router.url === '/' || this.router.url === '';
    }
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  isWishlistActive(route: string): boolean {
    return route === '/wishlist' && this.hasWishlistItems;
  }

  navigateTo(route: string): void {
    const navigationRoute = route === '' ? ['/'] : [route];
    this.router.navigate(navigationRoute);
  }
}
