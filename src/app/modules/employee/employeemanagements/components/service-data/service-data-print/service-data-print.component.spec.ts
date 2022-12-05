import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDataPrintComponent } from './service-data-print.component';

describe('ServiceDataPrintComponent', () => {
  let component: ServiceDataPrintComponent;
  let fixture: ComponentFixture<ServiceDataPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceDataPrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceDataPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
