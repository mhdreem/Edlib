import { TestBed } from '@angular/core/testing';

import { NumberToWordService } from './number-to-word.service';

describe('NumberToWordService', () => {
  let service: NumberToWordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumberToWordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
