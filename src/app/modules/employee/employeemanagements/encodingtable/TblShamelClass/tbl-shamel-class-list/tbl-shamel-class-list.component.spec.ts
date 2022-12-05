import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblShamelClassListComponent } from './tbl-shamel-class-list.component';

describe('TblShamelClassListComponent', () => {
  let component: TblShamelClassListComponent;
  let fixture: ComponentFixture<TblShamelClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblShamelClassListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TblShamelClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
