import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainingOldQararsComponent } from './remaining-old-qarars.component';

describe('RemainingOldQararsComponent', () => {
  let component: RemainingOldQararsComponent;
  let fixture: ComponentFixture<RemainingOldQararsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemainingOldQararsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemainingOldQararsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
