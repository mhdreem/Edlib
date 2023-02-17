import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshAccounterMalakComponent } from './refresh-accounter-malak.component';


describe('RefreshAccounterMalakComponent', () => {
  let component: RefreshAccounterMalakComponent;
  let fixture: ComponentFixture<RefreshAccounterMalakComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefreshAccounterMalakComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefreshAccounterMalakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
