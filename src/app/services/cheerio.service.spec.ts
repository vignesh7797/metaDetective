import { TestBed } from '@angular/core/testing';

import { CheerioService } from './cheerio.service';

describe('CheerioService', () => {
  let service: CheerioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheerioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
