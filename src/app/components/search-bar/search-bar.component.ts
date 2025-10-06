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
    const trimmedSearch = this.searchText.trim();
    if (trimmedSearch) {
      this.router.navigate(['/products'], {
        queryParams: { search: trimmedSearch },
      });
      this.search.emit(trimmedSearch);
    } else {
      // Navigate to products without search parameter if empty
      this.router.navigate(['/products']);
      this.search.emit('');
    }
  }

  onInputChange(): void {
    const trimmedSearch = this.searchText.trim();
    if (!trimmedSearch) {
      this.search.emit('');
    }
  }

  onClear(): void {
    this.searchText = '';
    this.search.emit('');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.onSearch();
    }
  }
}
