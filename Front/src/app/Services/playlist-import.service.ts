import { Injectable, EventEmitter  } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaylistImportService {

  idNum: number = -1;
  playlistChanged = new EventEmitter<number>();
  reload = new EventEmitter<void>();


/*     private _videoUrl: string = '';
  videoUrlChanged = new EventEmitter<string>();

  set videoUrl(url: string) {
    this._videoUrl = url;
    this.videoUrlChanged.emit(url);
  }

  get videoUrl() {
    return this._videoUrl;
  } */

 playlist(id: number) {
  this.idNum = id;
  }
}
