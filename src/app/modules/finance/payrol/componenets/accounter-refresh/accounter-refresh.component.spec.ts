import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccounterRefreshComponent } from './accounter-refresh.component';

describe('AccounterRefreshComponent', () => {
  let component: AccounterRefreshComponent;
  let fixture: ComponentFixture<AccounterRefreshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccounterRefreshComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccounterRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
