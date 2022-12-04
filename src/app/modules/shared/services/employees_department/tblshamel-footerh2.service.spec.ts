import { TestBed } from '@angular/core/testing';

import { TblshamelFooterh2Service } from './tblshamel-footerh2.service';

describe('TblshamelFooterh2Service', () => {
  let service: TblshamelFooterh2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TblshamelFooterh2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
