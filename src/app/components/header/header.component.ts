import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartCount = 0;
  location = 'Salatiga City, Central Java';

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.cartItems$.subscribe(items => {
      this.cartCount = this.dataService.getCartCount();
    });
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
