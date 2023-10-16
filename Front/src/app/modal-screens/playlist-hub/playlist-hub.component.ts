import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SearchServiceService } from 'src/app/Services/search-service.service';
import { PlaylistImportService } from 'src/app/Services/playlist-import.service';

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
  changeName: string = '';
  isCollapsed: boolean = true;
  isCollapseChange: boolean = true;
  collapseQuery: boolean = true;
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
              private searchService: SearchServiceService,
              private toastrService: ToastrService,
              private playlistImportService: PlaylistImportService) { }

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
        this.httpLoad();
        this.toastrService.success(`Congratulations! ${this.playName} was created with success!`,'Playlist Created!');
        this.playlistImportService.reload.emit();},
      (error) => {
          this.toastrService.error('Something happened.', 'Error!');;
        }
        );
  }

  updatePlaylist(){
    const body = {name: this.changeName};

    this.http.put<any>("http://localhost:5098/api/Playlist/" + this.selected.playlistId, body).subscribe(
              (response) => {
                this.httpLoad();
                this.toastrService.info('Your playlist name has been changed!', 'Playlist updated!');
                this.playlistImportService.reload.emit();
              },
              (error) => {
                this.httpLoad();
              }
              );
  }

  deletePlaylist(){
    this.http.delete(`http://localhost:5098/api/Playlist/` + this.selected.playlistId).subscribe(
      (response) => {
            this.httpLoad()
            this.toastrService.warning(`Your playlist ${this.selected.name} was deleted!`, 'Deleted Playlist!');
            this.playlistImportService.reload.emit();},
            (error) => {
              this.httpLoad();
            });
  }

  deleteSong(){
    this.http.delete(`http://localhost:5098/api/Playlist/`+ this.selected.playlistId + `/remove-music/` + this.selectedMusic.songId).subscribe(
      (response) => {console.log('Deleted with success', response)
            this.httpLoad();
            this.toastrService.warning(`Your song was removed!`, 'Removed song!');},
            (error) => {
              this.httpLoad();
            });
  }

  addMusic(songId: string){
    this.http.post(`http://localhost:5098/api/Playlist/`+ this.selected.playlistId + `/add-music/` + songId, '').subscribe(
      (response) => {console.log('Added with success')
            this.toastrService.success(`Congratulations! Your music has been added with sucess!`,'Music Added!');
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
