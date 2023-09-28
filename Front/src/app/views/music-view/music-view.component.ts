import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-view',
  templateUrl: './music-view.component.html',
  styleUrls: ['./music-view.component.scss']
})
export class MusicViewComponent implements OnInit {

  isLoadingFromParent:boolean = true; // Defina o valor conforme necessário

  ngOnInit() {
    this.isLoadingFromParent = true; // Inicie o carregamento
  }

}
