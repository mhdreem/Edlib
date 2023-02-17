import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshEmployeeCartComponent } from './refresh-employee-cart.component';

describe('RefreshEmployeeCartComponent', () => {
  let component: RefreshEmployeeCartComponent;
  let fixture: ComponentFixture<RefreshEmployeeCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefreshEmployeeCartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefreshEmployeeCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
