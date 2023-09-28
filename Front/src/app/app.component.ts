import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MikuProj';
  isLoadingFromParent:boolean = false; // Defina o valor conforme necessário

}
