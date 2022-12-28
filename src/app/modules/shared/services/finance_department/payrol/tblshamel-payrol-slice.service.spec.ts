import { TestBed } from '@angular/core/testing';

import { TblshamelPayrolSliceService } from './tblshamel-payrol-slice.service';

describe('TblshamelPayrolSliceService', () => {
  let service: TblshamelPayrolSliceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TblshamelPayrolSliceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
