import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayEmployeeSimilarityNameComponent } from './display-employee-similarity-name.component';

describe('DisplayEmployeeSimilarityNameComponent', () => {
  let component: DisplayEmployeeSimilarityNameComponent;
  let fixture: ComponentFixture<DisplayEmployeeSimilarityNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayEmployeeSimilarityNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayEmployeeSimilarityNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
