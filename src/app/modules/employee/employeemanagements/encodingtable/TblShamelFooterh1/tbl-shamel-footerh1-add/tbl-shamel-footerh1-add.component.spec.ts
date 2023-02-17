import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblShamelFooterh1AddComponent } from './tbl-shamel-footerh1-add.component';

describe('TblShamelFooterh1AddComponent', () => {
  let component: TblShamelFooterh1AddComponent;
  let fixture: ComponentFixture<TblShamelFooterh1AddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblShamelFooterh1AddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TblShamelFooterh1AddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
