import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: false,
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  searchText = '';
  @Output() search = new EventEmitter<string>();

  constructor(private router: Router) {}

  onSearch(): void {
    if (this.searchText.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchText },
      });
    }
  }

  onInputChange(): void {
    if (!this.searchText.trim()) {
      this.search.emit('');
    }
  }
}
