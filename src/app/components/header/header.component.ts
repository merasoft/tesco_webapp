import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';

interface Location {
  name: string;
  value: string;
}

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartCount = 0;
  selectedLocation: Location | null = null;
  private cartSubscription: Subscription = new Subscription();
  locations: Location[] = [
    { name: 'Salatiga City, Central Java', value: 'salatiga' },
    { name: 'Jakarta, DKI Jakarta', value: 'jakarta' },
    { name: 'Surabaya, East Java', value: 'surabaya' },
    { name: 'Bandung, West Java', value: 'bandung' },
    { name: 'Yogyakarta, DIY', value: 'yogyakarta' },
  ];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.selectedLocation = this.locations[0];

    this.cartSubscription = this.dataService.cartItems$.subscribe((items) => {
      console.log('CHANGED CART ITEMS', items);
      this.cartCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
