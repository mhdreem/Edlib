import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblShamelFooterh2AddComponent } from './tbl-shamel-footerh2-add.component';

describe('TblShamelFooterh2AddComponent', () => {
  let component: TblShamelFooterh2AddComponent;
  let fixture: ComponentFixture<TblShamelFooterh2AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblShamelFooterh2AddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TblShamelFooterh2AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
