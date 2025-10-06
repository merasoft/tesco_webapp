import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  recentProducts: any[] = [];
  filtersOpen = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getProducts().subscribe((data) => {
      this.recentProducts = data.slice(0, 6);
    });
  }

  openFilters(): void {
    this.filtersOpen = true;
  }

  onFiltersApplied(filters: any): void {
    console.log('Filters applied:', filters);
    // Apply filters to products
  }
}
