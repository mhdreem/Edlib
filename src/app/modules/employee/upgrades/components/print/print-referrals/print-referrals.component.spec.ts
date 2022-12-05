import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintReferralsComponent } from './print-referrals.component';

describe('PrintReferralsComponent', () => {
  let component: PrintReferralsComponent;
  let fixture: ComponentFixture<PrintReferralsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintReferralsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
