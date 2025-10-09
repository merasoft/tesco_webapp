import { Component } from '@angular/core';
import { Carousel } from 'primeng/carousel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tesco_webapp';

  constructor() {
    Carousel.prototype.onTouchMove = function (event: TouchEvent) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.startPos.x;
      const deltaY = touch.clientY - this.startPos.y;

      if (Math.abs(deltaX) > Math.abs(deltaY) && event.cancelable) {
        event.preventDefault();
      }
    };
  }
}
