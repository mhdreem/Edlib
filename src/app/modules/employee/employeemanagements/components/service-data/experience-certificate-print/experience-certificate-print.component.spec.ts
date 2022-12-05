import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceCertificatePrintComponent } from './experience-certificate-print.component';

describe('ExperienceCertificatePrintComponent', () => {
  let component: ExperienceCertificatePrintComponent;
  let fixture: ComponentFixture<ExperienceCertificatePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExperienceCertificatePrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceCertificatePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
