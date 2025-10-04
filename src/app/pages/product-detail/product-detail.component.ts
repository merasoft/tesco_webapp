import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  selectedColor: string = '';
  isFavorite = false;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.dataService.getProductById(id).subscribe(data => {
      this.product = data;
      if (this.product && this.product.colors && this.product.colors.length > 0) {
        this.selectedColor = this.product.colors[0];
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  addToCart(): void {
    this.dataService.addToCart(this.product);
    this.router.navigate(['/cart']);
  }

  buyNow(): void {
    this.dataService.addToCart(this.product);
    this.router.navigate(['/checkout']);
  }
}
