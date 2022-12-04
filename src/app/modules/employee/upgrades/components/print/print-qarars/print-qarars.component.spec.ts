import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintQararsComponent } from './print-qarars.component';

describe('PrintQararsComponent', () => {
  let component: PrintQararsComponent;
  let fixture: ComponentFixture<PrintQararsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintQararsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintQararsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
