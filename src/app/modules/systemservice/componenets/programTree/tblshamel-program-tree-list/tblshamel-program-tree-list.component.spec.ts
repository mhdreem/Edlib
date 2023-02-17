import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblshamelProgramTreeListComponent } from './tblshamel-program-tree-list.component';

describe('TblshamelProgramTreeListComponent', () => {
  let component: TblshamelProgramTreeListComponent;
  let fixture: ComponentFixture<TblshamelProgramTreeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblshamelProgramTreeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TblshamelProgramTreeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
