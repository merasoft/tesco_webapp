import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
export class FooterComponent implements OnInit {
  navigationItems: NavigationItem[] = [
    { icon: 'pi pi-home', label: 'Home', route: '' },
    { icon: 'pi pi-heart', label: 'Wishlist', route: '/wishlist' },
    { icon: 'pi pi-file', label: 'History', route: '/history' },
    { icon: 'pi pi-user', label: 'Account', route: '/account' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Component initialization
  }

  isActiveRoute(route: string): boolean {
    if (route === '') {
      return this.router.url === '/' || this.router.url === '';
    }
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  navigateTo(route: string): void {
    const navigationRoute = route === '' ? ['/'] : [route];
    this.router.navigate(navigationRoute);
  }
}
