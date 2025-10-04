import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  standalone: false,
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  searchText = '';
  @Output() search = new EventEmitter<string>();

  constructor(private router: Router) {}

  onSearch(): void {
    if (this.searchText.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchText }
      });
    }
  }

  onInputChange(): void {
    if (!this.searchText.trim()) {
      this.search.emit('');
    }
  }
}
