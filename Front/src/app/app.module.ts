import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
import { HeaderComponent } from './header/header.component';
import { ModalComponent } from './modal-screens/modal-component/modal-component.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './loading/loading.component';
import { MusicViewComponent } from './views/music-view/music-view.component';
import { EraseComponent } from './modal-screens/erase/erase.component';
import { PlaylistHubComponent } from './modal-screens/playlist-hub/playlist-hub.component';



@NgModule({
  declarations: [
    AppComponent,
    MusicPlayerComponent,
    HeaderComponent,
    ModalComponent,
    LoadingComponent,
    MusicViewComponent,
    EraseComponent,
    PlaylistHubComponent
  ],
  providers: [DatePipe],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    YouTubePlayerModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4000, // 4 seconds
      closeButton: true,
      progressBar: true,
    }),
    CollapseModule
  ],
  bootstrap: [  AppComponent  ],
  schemas: [  CUSTOM_ELEMENTS_SCHEMA  ]
})
export class AppModule { }
