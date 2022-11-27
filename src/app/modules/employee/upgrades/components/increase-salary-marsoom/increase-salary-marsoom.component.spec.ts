import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncreaseSalaryMarsoomComponent } from './increase-salary-marsoom.component';

describe('IncreaseSalaryMarsoomComponent', () => {
  let component: IncreaseSalaryMarsoomComponent;
  let fixture: ComponentFixture<IncreaseSalaryMarsoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncreaseSalaryMarsoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncreaseSalaryMarsoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
