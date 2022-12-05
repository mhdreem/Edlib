import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stats3PrintComponent } from './stats3-print.component';

describe('Stats3PrintComponent', () => {
  let component: Stats3PrintComponent;
  let fixture: ComponentFixture<Stats3PrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Stats3PrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stats3PrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
