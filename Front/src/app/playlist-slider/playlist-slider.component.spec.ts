import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistSliderComponent } from './playlist-slider.component';

describe('PlaylistSliderComponent', () => {
  let component: PlaylistSliderComponent;
  let fixture: ComponentFixture<PlaylistSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaylistSliderComponent]
    });
    fixture = TestBed.createComponent(PlaylistSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
