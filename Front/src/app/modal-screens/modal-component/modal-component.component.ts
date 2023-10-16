import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VideoImportService } from '../../Services/video-import.service';
import { HttpClient } from '@angular/common/http';
import { PlaylistImportService } from 'src/app/Services/playlist-import.service';


@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.css']
})
export class ModalComponent {
  constructor(
    public activeModal: NgbActiveModal,
    private videoImportService: VideoImportService,
    private playlistImportService: PlaylistImportService,
    private http: HttpClient
  ) {  }

  closeModal() {
    this.activeModal.close('Modal fechado');
  }

  videoUrl: string = '';
  historyImport: string[] = [] // Only contains new values
  videoId: string | null = null;
  invalidUrl: boolean = false;
  favorite: boolean = false;
  teste: any;
  videoName: string = '';

  @Output() callParent = new EventEmitter<any>();

  postData(videoId: string, favorite: boolean) {
    const url = 'http://localhost:5098/api/Music'; // Substitua pela URL do seu backend

    // Crie o objeto JSON omitindo o campo 'songId'
    const dataToPost = {
      videoId: videoId,
      favorite: this.favorite
    };
    this.teste = dataToPost

    return this.http.post(url, dataToPost);
  }

  getVideoName(videoId: string){
    this.http.get('http://localhost:5098/api/Music/' + videoId + '/name', { responseType: 'text' })
    .subscribe((response: string) => {
      this.videoName = response; // Atribui a string diretamente à variável videoName
      console.log(this.videoName);
    });
  }



  async extractVideoId() {
    const regex = /(?:\?v=|youtu.be\/)([A-Za-z0-9_-]{11})/;
    const match = this.videoUrl.match(regex);

    if (match && match[1].length === 11) {
      this.videoId = match[1];
      this.invalidUrl = false;

      if (this.historyImport.indexOf(this.videoId)){

        this.historyImport.push(this.videoId)

        this.postData(this.videoId, this.favorite).subscribe((response) => {
          console.log('Resposta do servidor:', response);
          this.videoImportService.callFunc.emit(); // Reload GET function
          this.playlistImportService.reload.emit();
        }, (error) => {
          console.error('Erro:', error);
        });

        this.getVideoName(this.videoId);
        console.log('passou')

      }

    } else {
      this.videoId = null;
      this.invalidUrl = true;
    }
  }
}
