import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VideoImportService } from '../video-import.service';


@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.css']
})
export class ModalComponent {
  constructor(
    public activeModal: NgbActiveModal,
    private videoImportService: VideoImportService
  ) {  }

  closeModal() {
    this.activeModal.close('Modal fechado');
  }

  videoUrl: string = '';
  historyImport: string[] = [] // Only contains new values
  videoId: string | null = null;
  invalidUrl: boolean = false;

  extractVideoId() {
    const regex = /(?:\?v=|youtu.be\/)([A-Za-z0-9_-]{11})/;
    const match = this.videoUrl.match(regex);

    if (match && match[1].length === 11) {
      this.videoId = match[1];
      this.invalidUrl = false;

      if (this.historyImport.indexOf(this.videoId)){

        this.videoImportService.videoUrl = this.videoId;
        this.historyImport.push(this.videoId)
      }

    } else {
      this.videoId = null;
      this.invalidUrl = true;
    }
  }
}
