import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixUpgradeYearListComponent } from './fix-upgrade-year-list.component';

describe('FixUpgradeYearListComponent', () => {
  let component: FixUpgradeYearListComponent;
  let fixture: ComponentFixture<FixUpgradeYearListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixUpgradeYearListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixUpgradeYearListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
