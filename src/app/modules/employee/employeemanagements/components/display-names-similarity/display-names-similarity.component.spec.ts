import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNamesSimilarityComponent } from './display-names-similarity.component';

describe('DisplayNamesSimilarityComponent', () => {
  let component: DisplayNamesSimilarityComponent;
  let fixture: ComponentFixture<DisplayNamesSimilarityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayNamesSimilarityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayNamesSimilarityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
