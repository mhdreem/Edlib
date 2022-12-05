import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblShamelJobNameAddComponent } from './tbl-shamel-job-name-add.component';

describe('TblShamelJobNameAddComponent', () => {
  let component: TblShamelJobNameAddComponent;
  let fixture: ComponentFixture<TblShamelJobNameAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblShamelJobNameAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TblShamelJobNameAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
