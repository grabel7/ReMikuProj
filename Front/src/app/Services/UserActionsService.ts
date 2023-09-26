import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private userActionsSubject = new BehaviorSubject<any[]>([]);
  userActions$ = this.userActionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Registra uma ação do usuário relacionada a favoritos
  registerFavoriteAction(songId: number, videoId: string, isFavorited: boolean) {
    const userActions = this.userActionsSubject.value;
    userActions.push({ songId, videoId, isFavorited });
    this.userActionsSubject.next(userActions);

    // Envia a ação para a API em segundo plano
    this.sendFavoriteActionToApi(songId, videoId, isFavorited);
  }

  // Envia a ação para a API
  private sendFavoriteActionToApi(songId: number, videoId: string, isFavorited: boolean) {
    // Faça uma solicitação HTTP para atualizar o estado de favoritos na API
    // Use a URL e os dados corretos para sua API
    const apiUrl = `http://localhost:5098/api/Music/${songId}`;
    const requestData = {songId: songId, videoId: videoId, favorite: isFavorited };

    this.http.put(apiUrl, requestData).subscribe(
      () => {
        console.log('Ação de favorito enviada para a API com sucesso.');
      },
      error => {
        console.error('Erro ao enviar ação de favorito para a API:', error);
      }
    );
  }
}
