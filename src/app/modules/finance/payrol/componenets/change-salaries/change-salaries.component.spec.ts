import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSalariesComponent } from './change-salaries.component';

describe('ChangeSalariesComponent', () => {
  let component: ChangeSalariesComponent;
  let fixture: ComponentFixture<ChangeSalariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeSalariesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeSalariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
