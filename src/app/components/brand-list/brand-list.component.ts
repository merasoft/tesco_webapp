import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-brand-list',
  standalone: false,
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})
export class BrandListComponent implements OnInit {
  brands: any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.getBrands().subscribe(data => {
      this.brands = data;
    });
  }

  selectBrand(brandId: number): void {
    this.router.navigate(['/products'], {
      queryParams: { brandId }
    });
  }
}
