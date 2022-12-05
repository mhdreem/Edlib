import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeStateDataPrintComponent } from './employee-state-data-print.component';

describe('EmployeeStateDataPrintComponent', () => {
  let component: EmployeeStateDataPrintComponent;
  let fixture: ComponentFixture<EmployeeStateDataPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeStateDataPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeStateDataPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
