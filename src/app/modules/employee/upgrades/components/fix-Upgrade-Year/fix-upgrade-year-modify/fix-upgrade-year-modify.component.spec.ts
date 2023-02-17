import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixUpgradeYearModifyComponent } from './fix-upgrade-year-modify.component';

describe('FixUpgradeYearModifyComponent', () => {
  let component: FixUpgradeYearModifyComponent;
  let fixture: ComponentFixture<FixUpgradeYearModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixUpgradeYearModifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixUpgradeYearModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
