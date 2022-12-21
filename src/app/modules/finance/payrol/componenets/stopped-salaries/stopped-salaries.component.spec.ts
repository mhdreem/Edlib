import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoppedSalariesComponent } from './stopped-salaries.component';

describe('StoppedSalariesComponent', () => {
  let component: StoppedSalariesComponent;
  let fixture: ComponentFixture<StoppedSalariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoppedSalariesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoppedSalariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
