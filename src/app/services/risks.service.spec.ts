import { TestBed } from '@angular/core/testing';

import { RisksService } from './risks.service';

describe('RisksService', () => {
  let service: RisksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RisksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
