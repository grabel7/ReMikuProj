import { Component, EventEmitter, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';

import {Title} from "@angular/platform-browser";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal-screens/modal-component/modal-component.component'; // Importe o componente do Modal
import { Subscription } from 'rxjs';

//Services
import { PlaylistImportService } from '../Services/playlist-import.service';
import { VideoImportService } from '../Services/video-import.service';
import { HttpClient } from '@angular/common/http';
import { FavoriteService } from '../Services/UserActionsService';

import { Router, NavigationEnd } from '@angular/router';
import { EraseComponent } from '../modal-screens/erase/erase.component';
import { PlaylistHubComponent } from '../modal-screens/playlist-hub/playlist-hub.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit, OnDestroy {

  videoIds: any = [  ];

  playlist: any = [  ];

  playlistFavorite: any = [{
      videoId: '',
      favorite: false}
    ];

  playlistId: number = -1;
  private eventListeners: Function[] = []

  isPaused: boolean = false;
  isHided: boolean = true;
  isMobile: boolean = false;
  isMuted: boolean = false;

  //Collapse
  isCollapsed: boolean = true;
  isCollapsedInfo: boolean = true;
  longDescriptionCollapsed: boolean = true;
  isPlaylistCollapsed: boolean = true;

  @Output() isLoadingChange = new EventEmitter<boolean>();

  videoCurrentTime: string = '0:00';
  videoDuration: string = '0:00';
  videoTitle: string | undefined;
  videoAuthor: string | undefined;
  videoUrl: string | undefined;
  iconName: string = this.isPaused ? 'play' : 'pause'

  //API
  videoBroken: string = 'https://i.ytimg.com/vi/break/default.jpg';
  videoDescription: string | undefined;
  videoChannelId: string | undefined;
  videoViews: string = '';
  videoLanguage: string | undefined;
  videoUploadDate: string| null = null;
  videoUserUpload: string | undefined;

  formattedDate: string = '';
  formattedViews: string = '';

  volume: number = 50;
  currentIndex: number = 0;

  isFavorited: boolean = false;
  isOnlyFav:boolean = false;
  isOnlyPlaylist: boolean = false;

  player: any;

  private playerCreated: any;
  private youtubeApiLoadPromise: Promise<void> | undefined;
  private youtubeApiLoaded: boolean | undefined;
  private callFuncSubscription: Subscription | undefined; // Declare como uma propriedade da classe
  private intervalId: any;
  private srcCreated: boolean | undefined;

  private videoSubscription: Subscription  | null = null; // Inicialize com null


  constructor(private modalService: NgbModal,
              private videoImportService: VideoImportService,
              private http: HttpClient,
              private favoriteService: FavoriteService,
              private titleService:Title,
              private router: Router,
              private datePipe: DatePipe,
              private playlistImportService: PlaylistImportService,
              private toastrService: ToastrService
              ) {}

  async ngOnInit() {
    this.loadYouTubeApi(); // Aguarda o carregamento da API do YouTube

    this.isLoadingChange.emit(true);

    this.isMobile = this.checkIfMobile();

    //After a new Uploaded Music:
    this.callFuncSubscription = this.videoImportService.callFunc.subscribe(async () => {
      await this.httpTest(); // Reload the GET function after a POST
      this.isOnlyPlaylist = false; //Turn off Only PL.

      this.UploadedImg();
    });

    //After a playlist select:
    this.callFuncSubscription = this.playlistImportService.playlistChanged.subscribe(async () => {
      this.isOnlyFav = false; //Close the Only Fav function
      this.playlistId = this.playlistImportService.idNum;
      this.isOnlyPlaylist = true; //Turn on the Only Playlist Function
      await this.httpTest();

      this.isPlaylistCollapsed = true; //Close Playlist Component
      this.refresh; // Update Music Data
    });

    this.playlistImportService.favoriteSelect.subscribe(async() => {
      this.isOnlyFav = true; //Open the Only Fav Function
      await this.httpTest();

      this.isPlaylistCollapsed = true; //Close Playlist Component
      this.refresh; // Update Music Data
    })

    this.playlistImportService.homeSelect.subscribe(async() => {
      this.isOnlyFav = false; //Close the Only Fav function
      this.isOnlyPlaylist = false; //Turn off Only PL.
      await this.httpTest();

      this.isPlaylistCollapsed = true; //Close Playlist Component
      this.refresh; // Update Music Data
    })

    await this.httpTest(); // Aguarda a conclusão do carregamento
    this.UploadedImg();
    this.FavImg();

    this.intervalId = setInterval(() => {
      const playerVid = document.querySelector('#player') as HTMLElement;

      this.isMobile = this.checkIfMobile();

      this.isHided ? (() => {
        playerVid.style.transition = "opacity 0.3s";
        playerVid.style.opacity = "0";
      })() :  playerVid.style.opacity = "1";

      this.updateProgressBar();
    }, 100); // Intervalo definido para 100

    this.createYouTubePlayer();
  }

  UploadedImg(){
    if (this.videoIds[this.videoIds.length - 1].thumbImgUrl != null){
      this.playlistImportService.imgChange(this.videoIds[this.videoIds.length - 1].thumbImgUrl);
      this.playlistImportService.uploadLength = this.videoIds.length;
      this.playlistImportService.reload.emit();
    } else {
      this.playlistImportService.imgChange(this.videoBroken);
      this.playlistImportService.reload.emit();
    }
  }

  FavImg(){
    if (this.playlistFavorite[this.playlistFavorite.length - 1].thumbImgUrl != null){
      this.playlistImportService.imgFavChange(this.playlistFavorite[this.playlistFavorite.length - 1].thumbImgUrl)
      this.playlistImportService.favLength = this.playlistFavorite.length;
      this.playlistImportService.reload.emit();
    } else {
      console.log('anulou')
      this.playlistImportService.imgFavChange(this.videoBroken);
      this.playlistImportService.reload.emit();
    }
  }

/*   ngOnChanges(changes: SimpleChanges): void {
    // Este método é chamado sempre que a originalDate muda
    if (changes['videoUploadDate'] && this.videoUploadDate) {
      // Use o DatePipe para formatar a nova data
      this.formattedDate = this.datePipe.transform(new Date(this.videoUploadDate), 'short') || '';
      console.log(this.formattedDate);
    }
  } */

  ngDoCheck(): void {
    const newDate = this.videoIds[this.currentIndex]?.videoUploaded;
    if (newDate !== this.videoUploadDate) {
      // A data mudou, formate-a
      this.videoUploadDate = newDate;
      this.formatDate();
    }
  }

  private formatDate(): void {
    if (this.videoUploadDate) {
      // Use o DatePipe para formatar a data
      this.formattedDate = this.datePipe.transform(new Date(this.videoUploadDate), 'short') || '';
    } else {
      this.formattedDate = '';
    }
  }

  ngOnDestroy(): void {
    this.isLoadingChange.emit(false);
    this.destroyYouTubePlayer();

    if (this.callFuncSubscription) {
      this.callFuncSubscription.unsubscribe();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadYouTubeApi() {
    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');

    if (!existingScript){
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

     (window as any)['onYouTubeIframeAPIReady'] = () => {
      // Execute a lógica necessária quando a API do YouTube estiver pronta
      this.createYouTubePlayer();
    };

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
/*
    if (!this.isPaused) {
      this.player.playVideo();
      this.isPaused = true;
    } */
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
/*     if (!this.isPaused) {
      this.player.playVideo();
      this.isPaused = true;
    } */
  }
}

public async createYouTubePlayer() {

  this.playerCreated = true;

  await this.destroyYouTubePlayer();
  this.player = new (window as any)['YT'].Player('player', {
    height: '360',
    width: '640',
    videoId: this.videoIds[this.currentIndex].videoId,
    events: {
      'onReady': () => {
        //this.player.playVideo(); // Começa a reprodução quando estiver pronto
        this.checkFavorites();
        this.refresh();
        this.isLoadingChange.emit(false);
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
    let musicResponse; // for the switch response

    switch (true) {

      default:
        this.currentIndex = 0;
        musicResponse = await this.http.get('http://localhost:5098/api/Music').toPromise();
        this.videoIds = musicResponse;
        this.skipSong();
        this.previousVideo();
        break;

      case (this.isOnlyFav):
        this.currentIndex = 0;

        try {
          musicResponse = await this.http.get('http://localhost:5098/playlist/favorites').toPromise();
          this.videoIds = musicResponse;
          if (!this.videoIds.length){
            this.toastrService.warning(`Now playing your uploaded musics`, `No Favorite Musics`);
            throw new Error("There is no Favorite Musics.");
          }
          this.skipSong();
          this.previousVideo();
        } catch(error){
          this.isOnlyFav = false;
          this.httpTest();
        }

        break;

      case (this.isOnlyPlaylist && this.playlistId !== -1):
        this.currentIndex = 0;

        try {
          const response = await this.http.get(`http://localhost:5098/api/Playlist/${this.playlistId}/musics`).toPromise();
          this.videoIds = response;
          console.log(this.videoIds);
          if (!this.videoIds.length){
            this.toastrService.warning(`Now playing your uploaded musics`, `Empty Playlist`);
            throw new Error("Empty playlist.");
          }
          this.skipSong();
          this.previousVideo();
        } catch (error) {
          this.isOnlyPlaylist = false;
          this.httpTest();
        }

        break;
    }

    const playlistResponse = await this.http.get('http://localhost:5098/api/Playlist').toPromise();
    this.playlist = playlistResponse;

    const favoritesResponse = await this.http.get('http://localhost:5098/api/Favorites/').toPromise();
    this.playlistFavorite = favoritesResponse;
    this.checkFavorites();

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }

}

async onlyFav(){
  this.isOnlyFav = !this.isOnlyFav;

  await this.httpTest();
  this.skipSong();

}

refresh(){
  try{
    const videoData = this.player.getVideoData();

    this.videoTitle = videoData.title;
    this.videoAuthor = videoData.author;

    this.videoDescription = this.videoIds[this.currentIndex].description;

    this.videoChannelId = this.videoIds[this.currentIndex].channelId;
    this.videoLanguage = this.videoIds[this.currentIndex].language;
    this.videoViews = this.videoIds[this.currentIndex].views;
    this.videoUploadDate = this.videoIds[this.currentIndex].videoUploaded;

    const viewsNumber = parseInt(this.videoViews, 10);

    // Formata o número com divisões de milhares
    this.formattedViews = viewsNumber.toLocaleString();

    this.titleService.setTitle(`${this.videoTitle} - MikuProj`)
    this.videoUrl = this.player.getVideoUrl();
    this.thumbImg();
  } catch (error) {
    console.error();
  }

/*   const thumb = document.querySelector('#thumb') as HTMLImageElement;
  let thumbnailUrl = this.videoIds[this.currentIndex].thumbImgUrl;
  thumb.src = thumbnailUrl;
  console.log(thumb)

  try{
    console.log(thumb.src);

    if(this.videoIds.thumbImgUrl){
      console.log('teste2')
      thumb.src = this.videoIds.thumbImgUrl
    } else {
      thumb.src = "assets/vynil.png"
    }
  } catch (error) {
    console.log('teste3')
    console.log(error)
  } */
}

private checkIfMobile(): boolean {
  const screenWidth = window.innerWidth;
  return screenWidth <= 1060; // Você pode ajustar esse valor conforme necessário para definir quando considerar que é um dispositivo móvel.
}

async thumbImg(){
  const thumb = document.querySelector('#thumb') as HTMLImageElement;
  let thumbnailUrl = this.videoIds[this.currentIndex].thumbImgUrl;

  // Use uma Promessa para aguardar a carga completa da imagem
  await new Promise<void>((resolve) => {
    thumb.onload = () => {
      // Após a carga completa da imagem, resolva a Promessa
      resolve();
    };
    if (thumbnailUrl){
      thumb.src = thumbnailUrl; // Defina o src da imagem
      thumb.classList.add("imported")
    } else {
      thumb.src = "assets/vynil.png"
      thumb.classList.remove("imported")
    }
  });

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
    this.FavImg();

    console.log(`Música ${isFavorited ? 'adicionada' : 'removida'} dos favoritos localmente.`);
}


openTrash(){
  const modalRef = this.modalService.open(EraseComponent, { size: 'lg', backdropClass: 'modal-black' });

}

openPlaylistHub(){
  const modalRef = this.modalService.open(PlaylistHubComponent, { size: 'lg', backdropClass: 'modal-black' });
}

destroyYouTubePlayer() {
  if (this.player) {
    this.player.destroy();
    this.playerCreated = false;
    this.player = null; // Defina o player como null para indicar que não está mais em uso
    console.log('Player destruído.')

  }
}

}
