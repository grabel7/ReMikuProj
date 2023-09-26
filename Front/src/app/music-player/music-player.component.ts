import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal-component/modal-component.component'; // Importe o componente do Modal
import { Subscription } from 'rxjs';

//Services
import { VideoImportService } from '../video-import.service';
import { HttpClient } from '@angular/common/http';
import { FavoriteService } from '../Services/UserActionsService';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit {

  videoIds: any = [

  ];

  playlistFavorite: any = [{
    videoId: '',
favorite: false}
];



  isPaused: boolean = false;
  isHided: boolean = true;
  isMobile: boolean = false;
  isMuted: boolean = false;
  isCollapsed: boolean = true;

  videoCurrentTime: string = '0:00';
  videoDuration: string = '0:00';
  videoTitle: string = '';
  videoAuthor: string = '';
  videoUrl: string = '';
  iconName: string = this.isPaused ? 'play' : 'pause'

  volume: number = 50;
  currentIndex: number = 0;

  isFavorited: boolean = false;

  player: any;

  /* this.videoIds[this.currentIndex].favorite; //Estudar async */
  //isFavorite: boolean = ;


  private videoSubscription: Subscription  | null = null; // Inicialize com null


  constructor(private modalService: NgbModal,
              private videoImportService: VideoImportService,
              private http: HttpClient,
              private favoriteService: FavoriteService,
              private titleService:Title
              ) {}

  //progressPercentage: number = 50; // Por exemplo, 50% de progresso

  //get progressWidth(): string {
    //return `${this.progressPercentage}%`;
  //}

  ngOnInit() {

    this.isMobile = this.checkIfMobile();
    // Crie uma promessa para aguardar o carregamento da API do YouTube
    const youtubeApiLoadPromise = new Promise<void>((resolve) => {
      // Função global chamada quando a API do YouTube estiver pronta
      (window as any)['onYouTubeIframeAPIReady'] = () => {
        resolve();
      };

      // Carregue o script do YouTube API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    });


    // Aguarde o carregamento da API do YouTube e, em seguida, crie o player
    youtubeApiLoadPromise.then(() => {
      console.log('API do YouTube carregada');
      this.createYouTubePlayer();

    });

    this.videoImportService.callFunc.subscribe(() => {
      this.httpTest(); // Reload the GET function after a POST
    });

    //this.videoSubscription = this.videoImportService.videoUrlChanged.subscribe(
      //(newVideoUrl) => {

       // let newVideo = { id: newVideoUrl, favorite: false };

        //this.videoIds.push(newVideo);
      //}
    //);
    this.httpTest()

    setInterval(() => {
      const playerVid = document.querySelector('#player') as HTMLElement;

      this.isMobile = this.checkIfMobile();

      this.isHided ? (() => {
        playerVid.style.transition = "opacity 0.3s";
        playerVid.style.opacity = "0";

      })() :  playerVid.style.opacity = "1";

      this.updateProgressBar();
    }, 100); // Intervalo definido para 100

  }

  createYouTubePlayer() {
    this.player = new (window as any)['YT'].Player('player', {
      height: '360',
      width: '640',
      //videoId: this.playlistFavorite[this.currentIndex].videoId,
      //videoId: this.videoIds[this.currentIndex].videoId,
      videoId: this.videoIds[this.currentIndex].videoId,
      events: {
        'onReady': () => {
          // Player está pronto
          //this.player.playVideo(); // Começa a reprodução quando estiver pronto
          this.checkFavorites();
          this.refresh()
        },
        'onStateChange': (event: { data: any; }) => {
          // Monitora as alterações de estado de reprodução
          if (event.data === (window as any)['YT'].PlayerState.PLAYING) {
            this.isPaused = true; // Define como true quando está tocando
          } else {
            this.isPaused = false; // Define como false quando não está tocando
          }

          if (event.data === (window as any)['YT'].PlayerState.ENDED) {
            // Chamada à função quando o vídeo termina
            this.skipSong();
          }
        }
      }
    });
    this.checkFavorites();

  }

  pauseVideo() {

    if (this.player && typeof this.player.pauseVideo === 'function') {
      this.player.pauseVideo(); // Chama a função de pausar do player
    }
    if (this.isPaused == false) {
      this.player.playVideo();
      this.isPaused = true;
    }
  }

  // Função para avançar para a próxima música
skipSong() {
  this.refresh();

  if (this.player) {
    this.currentIndex = (this.currentIndex + 1) % this.videoIds.length;

    // Atualize o vídeo atual no player
    this.player.loadVideoById(this.videoIds[this.currentIndex].videoId);

    // Atualize o status de favorito com base nos dados da API
    this.player.addEventListener('onStateChange', (event:any) => {
      // Verificar se o vídeo está começando a ser reproduzido (estado 1)
      if (event.data === 1 ) {
        // Após o início da reprodução, atualize o status de favorito e o indicador visual
      this.checkFavorites();
      }
    });

    if (!this.isPaused) {
      this.player.playVideo();
      this.isPaused = true;
    }
  }
}

// Função para voltar ao vídeo anterior no array
previousVideo() {
  this.refresh();

  if (this.player) {
    // Verifique se há um vídeo anterior no array
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.videoIds.length - 1;
    }

    // Atualize o vídeo atual no player
    this.player.loadVideoById(this.videoIds[this.currentIndex].videoId);

    this.player.addEventListener('onStateChange', (event:any) => {
      // Verificar se o vídeo está começando a ser reproduzido (estado 1)
      if (event.data === 1) {
        // Após o início da reprodução, atualize o status de favorito e o indicador visual
      this.checkFavorites();
      }
    });

    // Inicie a reprodução se o vídeo estiver pausado
    if (!this.isPaused) {
      this.player.playVideo();
      this.isPaused = true;
    }
  }
}

  // Função para atualizar a barra de reprodução
  updateProgressBar() {
    if (this.player && this.isPaused) {
      const currentTime = this.player.getCurrentTime();
      const duration = this.player.getDuration();

      // Atualize a largura da barra de progresso
      const progressBar = document.querySelector('.progress') as HTMLElement;
      const progressPercentage = (currentTime / duration) * 100;
      progressBar.style.width = progressPercentage + '%';

      // Atualize a exibição da duração formatada
      this.videoCurrentTime = this.formatTime(currentTime);
      this.videoDuration = this.formatTime(duration);
    }
  }

  // Função para formatar o tempo em minutos e segundos
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    this.refresh()
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Função para buscar uma posição específica no vídeo com base no clique na barra de progresso
seekToPosition(event: MouseEvent) {
  if (this.player) {

    const progress = document.querySelector(".progress") as HTMLElement;
    const progressBar = event.currentTarget as HTMLElement;
    const progressBarWidth = progressBar.clientWidth;
    const clickX = event.clientX - progressBar.getBoundingClientRect().left;
    const seekToTime = (clickX / progressBarWidth) * this.player.getDuration();

    progress.style.width = (clickX / progressBarWidth) * 100 + '%';

    // Defina a posição do vídeo para o momento correspondente
    this.player.seekTo(seekToTime, true);
  }
}

onVolumeChange(vol: number){
  if (!this.isMuted){
    this.player.setVolume(vol);
  }

}

muted(){
  var actualVol:number = 50; // Armazena volume atual numa var

  if (this.volume > 0) {

    actualVol = this.volume;

  }


  if (!this.isMuted) {

    this.player.setVolume(0);
    this.isMuted = true;

  } else {
    this.player.setVolume(actualVol);
    this.isMuted = false;
  }

}


openModal() {
  const modalRef = this.modalService.open(ModalComponent, { size: 'lg', backdropClass: 'modal-black' });

}
public async httpTest(): Promise<void>{
  try{
    const musicResponse = await this.http.get('http://localhost:5098/api/Music').toPromise();
    this.videoIds = musicResponse;

    const favoritesResponse = await this.http.get('http://localhost:5098/api/Favorites/').toPromise();
    this.playlistFavorite = favoritesResponse;
    this.checkFavorites();

    console.log(this.videoIds);

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }

}

onlyFav(){

}

refresh(){
  try{
    const videoData = this.player.getVideoData();

    this.videoTitle = videoData.title;
    this.videoAuthor = videoData.author;

    this.titleService.setTitle(`${this.videoTitle} - MikuProj`)
    this.videoUrl = this.player.getVideoUrl();
  } catch (error) {
    console.error();
  }
}

private checkIfMobile(): boolean {
  const screenWidth = window.innerWidth;
  return screenWidth <= 960; // Você pode ajustar esse valor conforme necessário para definir quando considerar que é um dispositivo móvel.
}

currentVideo(){
let current;
/*
  //console.log(this.isOnlyFav)
  switch(this.isOnlyFav){
    case false : {
      current = this.videoIds[this.currentIndex].videoId;
      //console.log(this.isOnlyFav);
      break;
    }
    case true : {
      if (this.playlistFavorite.length > 0) {
      this.currentIndex = 1;
      current = this.playlistFavorite[this.currentIndex].videoId;
      }
      //console.log(this.isOnlyFav)
      break;
    }
  }
  return current; */


  current = this.videoIds[this.currentIndex].videoId;

  return current;

}

checkFavorites(){
  this.http.get<any[]>('http://localhost:5098/api/Favorites').subscribe(
    (favoritesData) => {
      // Verifique se a música atual está na lista de favoritos da API
      const currentSongId = this.videoIds[this.currentIndex].songId;
      this.isFavorited = favoritesData.some(item => item.songId === currentSongId);
    },
    error => {
      console.error('Erro ao verificar favoritos:', error);
    }
  );
}

toggleFavorite() {
  const currentSongId = this.videoIds[this.currentIndex].songId;
  const currentvideoId = this.videoIds[this.currentIndex].videoId;
    const isFavorited = !this.isFavorited;

    // Registra a ação do usuário relacionada a favoritos usando o serviço
    this.favoriteService.registerFavoriteAction(currentSongId, currentvideoId, isFavorited);

    // Atualiza o estado local do componente
    this.isFavorited = isFavorited;

    console.log(`Música ${isFavorited ? 'adicionada' : 'removida'} dos favoritos localmente.`);
}


trash(){
  console.log(this.currentIndex)
}

}
