import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product: any;

  constructor(private dataService: DataService, private router: Router) {}

  viewProduct(): void {
    this.router.navigate(['/products', this.product.id]);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    this.dataService.addToCart(this.product);
  }
}
