import { TestBed } from '@angular/core/testing';

import { TBLShamelProgramTreeService } from './tblshamel-program-tree.service';

describe('TBLShamelProgramTreeService', () => {
  let service: TBLShamelProgramTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TBLShamelProgramTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
