import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchServiceService {
  private apiUrl = 'http://localhost:5098/';
  constructor(private http: HttpClient,
    ) { }

  search(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}api/search?query=${query}`);
  }
}
