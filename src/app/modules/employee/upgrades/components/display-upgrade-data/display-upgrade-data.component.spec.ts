import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayUpgradeDataComponent } from './display-upgrade-data.component';

describe('DisplayUpgradeDataComponent', () => {
  let component: DisplayUpgradeDataComponent;
  let fixture: ComponentFixture<DisplayUpgradeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayUpgradeDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayUpgradeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
