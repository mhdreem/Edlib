import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintRankComponent } from './print-rank.component';

describe('PrintRankComponent', () => {
  let component: PrintRankComponent;
  let fixture: ComponentFixture<PrintRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintRankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
