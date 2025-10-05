import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-banner-slider',
  standalone: false,
  templateUrl: './banner-slider.component.html',
  styleUrls: ['./banner-slider.component.scss'],
})
export class BannerSliderComponent implements OnInit {
  banners: any[] = [];
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getBanners().subscribe((data) => {
      this.banners = data;
    });
  }
}
