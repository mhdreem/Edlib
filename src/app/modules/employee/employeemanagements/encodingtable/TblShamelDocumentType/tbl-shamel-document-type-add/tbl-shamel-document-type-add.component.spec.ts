import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TblShamelDocumentTypeAddComponent } from './tbl-shamel-document-type-add.component';

describe('TblShamelDocumentTypeAddComponent', () => {
  let component: TblShamelDocumentTypeAddComponent;
  let fixture: ComponentFixture<TblShamelDocumentTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TblShamelDocumentTypeAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TblShamelDocumentTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
