import { Component } from '@angular/core';
import { SearchServiceService } from 'src/app/Services/search-service.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-erase',
  templateUrl: './erase.component.html',
  styleUrls: ['./erase.component.scss']
})
export class EraseComponent {
  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(public activeModal: NgbActiveModal,
              private searchService: SearchServiceService,
              private http: HttpClient) {  }

  onSearchInput() {
    this.searchService.search(this.searchQuery).subscribe((data: any) => {
    this.searchResults = data;
    });
  }

  async deleteResult(songId: string) {
    await this.http.delete(`http://localhost:5098/api/Music/` + songId)
            .subscribe(() => console.log('Delete successful', this.onSearchInput()));
  }

  closeModal() {
    this.activeModal.close('Modal fechado');
  }
}
