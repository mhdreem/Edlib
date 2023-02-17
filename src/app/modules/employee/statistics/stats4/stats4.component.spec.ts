import { ComponentFixture, TestBed } from '@angular/core/testing';

import { stats4 } from './stats4.component';

describe('StatsBetweenDateComponent', () => {
  let component: stats4;
  let fixture: ComponentFixture<stats4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ stats4 ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(stats4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
