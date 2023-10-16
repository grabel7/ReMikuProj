import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist-slider',
  templateUrl: './playlist-slider.component.html',
  styleUrls: ['./playlist-slider.component.scss']
})
export class PlaylistSliderComponent implements OnInit {
  playlist: any = [  ];
  currentIndex = 0; // Índice atual do item no carrossel

  constructor(
    private http: HttpClient
    ) {}

  ngOnInit(): void {

    this.httpTest();
    
    setInterval(() => {
      this.next(); // Chame a função para avançar para o próximo item
    }, 5000); // Defina o tempo em milissegundos
  }

  public async httpTest(): Promise<void>{

      const playlistResponse = await this.http.get('http://localhost:5098/api/Playlist').toPromise();
      this.playlist = playlistResponse;
  }

  next(): void {
    // Lógica para avançar para o próximo item do carrossel
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Volte ao primeiro item quando chegar ao último
    }
  }
}
