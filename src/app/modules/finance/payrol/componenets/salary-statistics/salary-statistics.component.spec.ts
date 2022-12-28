import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryStatisticsComponent } from './salary-statistics.component';

describe('SalaryStatisticsComponent', () => {
  let component: SalaryStatisticsComponent;
  let fixture: ComponentFixture<SalaryStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
