import { TestBed } from '@angular/core/testing';

import { GuestsService } from './guests.service';

describe('GuestsService', () => {
  let service: GuestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
