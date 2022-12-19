import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintEmployeeShatebPageComponent } from './print-employee-shateb-page.component';

describe('PrintEmployeeShatebPageComponent', () => {
  let component: PrintEmployeeShatebPageComponent;
  let fixture: ComponentFixture<PrintEmployeeShatebPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintEmployeeShatebPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintEmployeeShatebPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
