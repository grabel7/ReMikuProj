import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchServiceService } from 'src/app/Services/search-service.service';

@Component({
  selector: 'app-playlist-hub',
  templateUrl: './playlist-hub.component.html',
  styleUrls: ['./playlist-hub.component.scss']
})
export class PlaylistHubComponent implements OnInit{
/*   private intervalId: any; */
  playlists: any = [  ];
  selected: any;
  selectedMusic: any;
  playName: string = '';
  isCollapsed: boolean = true;
  isCollapseChange: boolean = true;
  searchQuery: string = '';
  searchResults: any[] = [];

  ngOnInit(): void {
    this.httpLoad();
/*     this.intervalId = setInterval(() => {
      console.log(this.selected);
    }, 1000); // Intervalo definido para 100 */
  }


  constructor(public activeModal: NgbActiveModal,
              private http: HttpClient,
              private searchService: SearchServiceService,) { }

  closeModal() {
    this.activeModal.close('Modal fechado');
  }

  optionChange(){
    console.log(this.selected)
    this.selectedMusic = null;
  }

  musicChange(){
    console.log(this.selectedMusic);
  }

 createPlaylist(){
    const url = 'http://localhost:5098/api/Playlist'; // Substitua pela URL do seu backend

    if (this.playName == '') {
      this.playName = 'My Random Playlist';
    }
    // Crie o objeto JSON omitindo o campo 'songId'
    const dataToPost = {
      name: this.playName
    };

    this.http.post(url, dataToPost).subscribe(
      (response) => {
        this.httpLoad();},
        (error) => {
          this.httpLoad();
        }
        );
  }

  updatePlaylist(){
    const body = {name: this.playName};

    this.http.put<any>("http://localhost:5098/api/Playlist/" + this.selected.playlistId, body).subscribe(
              (response) => {
                this.httpLoad();
              },
              (error) => {
                this.httpLoad();
              }
              );
  }

  deletePlaylist(){
    this.http.delete(`http://localhost:5098/api/Playlist/` + this.selected.playlistId).subscribe(
      (response) => {console.log('Deleted with success')
            this.httpLoad()},
            (error) => {
              this.httpLoad();
            });
  }

  deleteSong(){
    this.http.delete(`http://localhost:5098/api/Playlist/`+ this.selected.playlistId + `/remove-music/` + this.selectedMusic.songId).subscribe(
      (response) => {console.log('Deleted with success', response)
            this.httpLoad()},
            (error) => {
              this.httpLoad();
            });
  }

  addMusic(songId: string){
    this.http.post(`http://localhost:5098/api/Playlist/`+ this.selected.playlistId + `/add-music/` + songId, '').subscribe(
      (response) => {console.log('Added with success')
            this.httpLoad()},
            (error) => {
              this.httpLoad();
            });
    console.log(songId)
  }

  public async httpLoad(): Promise<void>{
    try{
        const plResponse = await this.http.get('http://localhost:5098/api/Playlist').toPromise();
        this.playlists = plResponse;

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }

  }

  onSearchInput() {
    this.searchService.search(this.searchQuery).subscribe((data: any) => {
    this.searchResults = data;
    });
  }
}
