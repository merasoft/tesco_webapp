import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: false,
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  searchTerm = '';
  categoryId?: number;
  brandId?: number;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.categoryId = params['categoryId'] ? +params['categoryId'] : undefined;
      this.brandId = params['brandId'] ? +params['brandId'] : undefined;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.dataService.getProducts(this.categoryId, this.brandId, this.searchTerm)
      .subscribe(data => {
        this.products = data;
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
