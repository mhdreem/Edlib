import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblShamelClassAddComponent } from './tbl-shamel-class-add.component';

describe('TblShamelClassAddComponent', () => {
  let component: TblShamelClassAddComponent;
  let fixture: ComponentFixture<TblShamelClassAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblShamelClassAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TblShamelClassAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
