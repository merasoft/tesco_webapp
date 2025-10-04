import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import {Carousel} from 'primeng/carousel';

@Component({
  selector: 'app-banner-slider',
  standalone: false,
  templateUrl: './banner-slider.component.html',
  styleUrls: ['./banner-slider.component.scss']
})
export class BannerSliderComponent implements OnInit {
  banners: any[] = [];
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getBanners().subscribe(data => {
      this.banners = data;
    });
  }

}
