import { TestBed } from '@angular/core/testing';

import { TblshamelFooterh1Service } from './tblshamel-footerh1.service';

describe('TblshamelFooterh1Service', () => {
  let service: TblshamelFooterh1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TblshamelFooterh1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
