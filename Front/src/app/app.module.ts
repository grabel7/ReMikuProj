import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './modal-component/modal-component.component';


@NgModule({
  declarations: [
    AppComponent,
    MusicPlayerComponent,
    HeaderComponent,
    ModalComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    YouTubePlayerModule,
    FormsModule
  ],
  bootstrap: [  AppComponent  ],
  schemas: [  CUSTOM_ELEMENTS_SCHEMA  ]
})
export class AppModule { }
