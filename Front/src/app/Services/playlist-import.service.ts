import { Injectable, EventEmitter  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaylistImportService {

  idNum: number = -1;
  uploadLength: number = 0;
  favLength: number = 0;
  lastUpload: string = '';
  favoriteImg: string = '';
  playlistChanged = new EventEmitter<number>();
  reload = new EventEmitter<void>();
  favoriteSelect = new EventEmitter<boolean>();
  homeSelect = new EventEmitter<void>();

 playlist(id: number) {
  this.idNum = id;
  }

  imgChange(url: string) {
    this.lastUpload = url;
  }

  imgFavChange(url: string) {
    this.favoriteImg = url;
  }
}
