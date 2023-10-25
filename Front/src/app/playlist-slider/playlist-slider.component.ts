import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PlaylistImportService } from '../Services/playlist-import.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlist-slider',
  templateUrl: './playlist-slider.component.html',
  styleUrls: ['./playlist-slider.component.scss']
})
export class PlaylistSliderComponent implements OnInit {
  playlist: any = [  ];
  currentIndex = 0; // Índice atual do item no carrossel
  lastUpload: string =  this.playlistImportService.lastUpload;
  favImg: string = this.playlistImportService.favoriteImg;
  favLength: number = 0;

  private callFuncSubscription: Subscription | undefined;
  uploadLength: number = 0;

  constructor(
    private http: HttpClient,
    private playlistImportService: PlaylistImportService
    ) {}

  ngOnInit(): void {

    this.httpTest();

    this.callFuncSubscription = this.playlistImportService.reload.subscribe(() => {
      this.httpTest(); // Reload the GET function after a POST
    });

    setInterval(() => {
      this.next(); // Chame a função para avançar para o próximo item
    }, 5000); // Defina o tempo em milissegundos
  }

  public async httpTest(): Promise<void>{

      const playlistResponse = await this.http.get('http://localhost:5098/api/Playlist').toPromise();
      this.playlist = playlistResponse;
      this.lastUpload =  this.playlistImportService.lastUpload;
      this.favImg = this.playlistImportService.favoriteImg;
      this.favLength = this.playlistImportService.favLength;
      this.uploadLength = this.playlistImportService.uploadLength;
  }

  next(): void {
    // Lógica para avançar para o próximo item do carrossel
    if (this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Volte ao primeiro item quando chegar ao último
    }
  }

  playclick(id: number) {
    this.playlistImportService.playlist(id);
    this.playlistImportService.playlistChanged.emit();
    console.log(this.lastUpload)
  }

  otherclicks(string: string) {
    switch(string){
      case 'fav':
        this.playlistImportService.favoriteSelect.emit(true);
        break

      case 'home':
        this.playlistImportService.homeSelect.emit();
        break
    }

  }
}
