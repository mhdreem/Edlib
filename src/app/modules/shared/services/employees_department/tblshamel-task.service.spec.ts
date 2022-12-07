import { TestBed } from '@angular/core/testing';

import { TblshamelTaskService } from './tblshamel-task.service';

describe('TblshamelTaskService', () => {
  let service: TblshamelTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TblshamelTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
