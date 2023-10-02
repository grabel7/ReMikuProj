import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalComponent } from './modal-screens/modal-component/modal-component.component';

//Views
import { MusicViewComponent } from './views/music-view/music-view.component';

const routes: Routes = [
  { path: 'musicplayer', component: MusicViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
