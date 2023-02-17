import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearUpgradesFileComponent } from './clear-upgrades-file.component';

describe('ClearUpgradesFileComponent', () => {
  let component: ClearUpgradesFileComponent;
  let fixture: ComponentFixture<ClearUpgradesFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearUpgradesFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClearUpgradesFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
