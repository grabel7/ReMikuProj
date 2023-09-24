import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VideoImportService {

  private _videoUrl: string = '';
  videoUrlChanged = new EventEmitter<string>();

  set videoUrl(url: string) {
    this._videoUrl = url;
    this.videoUrlChanged.emit(url);
  }

  get videoUrl() {
    return this._videoUrl;
  }
}
