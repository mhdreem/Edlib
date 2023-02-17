import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareUpgradesFileComponent } from './prepare-upgrades-file.component';

describe('PrepareUpgradesFileComponent', () => {
  let component: PrepareUpgradesFileComponent;
  let fixture: ComponentFixture<PrepareUpgradesFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepareUpgradesFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrepareUpgradesFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
