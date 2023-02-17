import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintUpgradeQararsModifyComponent } from './print-upgrade-qarars-modify.component';

describe('PrintUpgradeQararsModifyComponent', () => {
  let component: PrintUpgradeQararsModifyComponent;
  let fixture: ComponentFixture<PrintUpgradeQararsModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintUpgradeQararsModifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintUpgradeQararsModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
