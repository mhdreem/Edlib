import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePageShatebComponent } from './employee-page-shateb.component';

describe('EmployeePageShatebComponent', () => {
  let component: EmployeePageShatebComponent;
  let fixture: ComponentFixture<EmployeePageShatebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePageShatebComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePageShatebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
