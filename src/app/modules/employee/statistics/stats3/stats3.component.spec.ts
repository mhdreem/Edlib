import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stats3Component } from './stats3.component';

describe('Stats3Component', () => {
  let component: Stats3Component;
  let fixture: ComponentFixture<Stats3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Stats3Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stats3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
