import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblshamelProgramTreeModifyComponent } from './tblshamel-program-tree-modify.component';

describe('TblshamelProgramTreeModifyComponent', () => {
  let component: TblshamelProgramTreeModifyComponent;
  let fixture: ComponentFixture<TblshamelProgramTreeModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblshamelProgramTreeModifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TblshamelProgramTreeModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
