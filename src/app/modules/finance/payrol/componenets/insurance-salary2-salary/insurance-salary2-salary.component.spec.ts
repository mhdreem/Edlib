import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceSalary2SalaryComponent } from './insurance-salary2-salary.component';

describe('InsuranceSalary2SalaryComponent', () => {
  let component: InsuranceSalary2SalaryComponent;
  let fixture: ComponentFixture<InsuranceSalary2SalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceSalary2SalaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceSalary2SalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
