import { TestBed } from '@angular/core/testing';

import { VideoImportService } from './video-import.service';

describe('VideoImportService', () => {
  let service: VideoImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
