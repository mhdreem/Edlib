import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrolDifferenceComponent } from './payrol-difference.component';

describe('PayrolDifferenceComponent', () => {
  let component: PayrolDifferenceComponent;
  let fixture: ComponentFixture<PayrolDifferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrolDifferenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrolDifferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
