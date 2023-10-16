import { TestBed } from '@angular/core/testing';

import { PlaylistImportService } from './playlist-import.service';

describe('PlaylistImportService', () => {
  let service: PlaylistImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaylistImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
