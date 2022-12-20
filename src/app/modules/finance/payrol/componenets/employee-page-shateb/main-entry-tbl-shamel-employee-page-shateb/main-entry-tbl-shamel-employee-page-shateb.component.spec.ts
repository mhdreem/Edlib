import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEntryTblShamelEmployeePageShatebComponent } from './main-entry-tbl-shamel-employee-page-shateb.component';

describe('MainEntryTblShamelEmployeePageShatebComponent', () => {
  let component: MainEntryTblShamelEmployeePageShatebComponent;
  let fixture: ComponentFixture<MainEntryTblShamelEmployeePageShatebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainEntryTblShamelEmployeePageShatebComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainEntryTblShamelEmployeePageShatebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
