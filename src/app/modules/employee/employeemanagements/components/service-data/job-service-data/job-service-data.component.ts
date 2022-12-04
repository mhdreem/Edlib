import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { ITBLShamelJobName } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobName';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { TblshameljobnameService } from 'src/app/modules/shared/services/employees_department/tblshameljobname.service';
import { EmployeePageService } from '../../employee-page-service';
import { EmployeeStateDataPrintComponent } from '../employee-state-data-print/employee-state-data-print.component';
import { ExperienceCertificatePrintComponent } from '../experience-certificate-print/experience-certificate-print.component';
import { JobServiceDataAdjustPrintDialogComponent } from '../job-service-data-adjust-print-dialog/job-service-data-adjust-print-dialog.component';
import { ServiceDataPrintComponent } from '../service-data-print/service-data-print.component';

@Component({
  selector: 'app-job-service-data',
  templateUrl: './job-service-data.component.html',
  styleUrls: ['./job-service-data.component.scss']
})
export class JobServiceDataComponent implements OnInit {

  _Subscription: Subscription;

  Selected_Emp: TBLShamelEmployee = {};

  Form: UntypedFormGroup;
  checkBoxGroup: FormControl;
  jobName: FormControl;
  employeeDataCheckbox: FormControl;
  certificateCheckbox: FormControl;
  bonusCheckbox: FormControl;
  punishmentCheckbox: FormControl;
  freeHolidaysCheckbox: FormControl;
  mergeServiceCheckbox: FormControl;
  jobStateCheckbox: FormControl;

  JobName_List: ITBLShamelJobName[] = [];
  filteredJobNameOptions: Observable<ITBLShamelJobName[]>;


  constructor(public dialog: MatDialog,
    private tblshameljobnameService: TblshameljobnameService,
    public PageService:EmployeePageService,) { 

      this.BuildForm();
    this.Load_Data();

      this.PageService.Subject_Selected_TBLShamelEmployee.subscribe(
        data => {
          this.Selected_Emp = data;
        }
      );

  }

  BuildForm() {
    this.Form = new FormGroup({
      'checkBoxGroup': this.checkBoxGroup = new FormControl<number | null>(null, [Validators.required],),
      'jobName': this.jobName = new FormControl<number | null>(null),
      'employeeDataCheckbox': this.employeeDataCheckbox = new FormControl<number | null>(null),
      'certificateCheckbox': this.certificateCheckbox = new FormControl<number | null>(null),
      'bonusCheckbox': this.bonusCheckbox = new FormControl<number | null>(null),
      'punishmentCheckbox': this.punishmentCheckbox = new FormControl<number | null>(null),
      'freeHolidaysCheckbox': this.freeHolidaysCheckbox = new FormControl<number | null>(null),
      'mergeServiceCheckbox': this.mergeServiceCheckbox = new FormControl<number | null>(null),
      'jobStateCheckbox': this.jobStateCheckbox = new FormControl<number | null>(null),

      });

    }
  
    Load_Data() {
      
      this._Subscription = forkJoin(
        this.Load_TBLJobName(),
        ).subscribe(
          res => {
            
    
            this.JobName_List = res[0];
            this.filteredJobNameOptions = of(this.JobName_List);
            this.tblshameljobnameService.list_ITBLShamelJobName = this.JobName_List;
            this.tblshameljobnameService.List_ITBLShamelJobName_BehaviorSubject.next(this.JobName_List);

            this.Init_AutoComplete();
            
          }
      )
    }

    Load_TBLJobName(){
      if (this.tblshameljobnameService.list_ITBLShamelJobName == null ||
        this.tblshameljobnameService.list_ITBLShamelJobName == undefined ||
        this.tblshameljobnameService.list_ITBLShamelJobName.length == 0)
        return this.tblshameljobnameService.list();
      return of(this.tblshameljobnameService.list_ITBLShamelJobName);
    }

    public async Init_AutoComplete() {
      try {
          this.filteredJobNameOptions = this.jobName.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterJobName(value) : this.JobName_List.slice())
          );
        } catch (Exception: any) { }
      }

      private _filterJobName(value: string): ITBLShamelJobName[] {
        const filterValue = value.toLowerCase();
    
        return this.JobName_List.filter(option => option.jobname_name.toLowerCase().includes(filterValue));
      }

      public displayJobNameProperty(value: string): string {
        if (value && this.JobName_List) {
          let cer: any = this.JobName_List.find(cer => cer.jobname_id.toString() == value);
          if (cer)
            return cer.jobname_name;
        }
        return '';
      }

  ngOnInit(): void {
    this.Form.get('jobName').disable();
    this.employeeDataCheckbox.setValue(1);
    this.certificateCheckbox.setValue(1);
    this.bonusCheckbox.setValue(1);
    this.punishmentCheckbox.setValue(1);
    this.freeHolidaysCheckbox.setValue(1);
    this.mergeServiceCheckbox.setValue(1);
    this.jobStateCheckbox.setValue(1);
  }

  jobNameChecked(){
  }

  change1(event: any){
    if (event.source.checked)
    this.Form.get('jobName').enable();
  }

  change2(event: any){
    if (event.source.checked)
    this.Form.get('jobName').disable();
  }

  change3(event: any){
    if (event.source.checked)
    this.Form.get('jobName').disable();
  }


  adjustPrintFooter1(){
    const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
      width: '1150px',
      data: 'PrintEmpExperience',
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  adjustPrintFooter2(){
    const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
      width: '1150px',
      data: 'PrintEmpState',
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  adjustPrintFooter3(){
    const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
      width: '1150px',
      data: 'PrintEmpService',
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  serviceDataPrint(){
    const dialogRef = this.dialog.open(ServiceDataPrintComponent, {
      height: '70%',
      width: '60%',
      data: this.Selected_Emp,
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  certificatePrint(){
    const dialogRef = this.dialog.open(ExperienceCertificatePrintComponent, {
      height: '70%',
      width: '60%',
      data: [this.Selected_Emp, {checkBoxGroup: this.checkBoxGroup.value, jobName: this.jobName.value}],
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  employeeStateDataPrint(){
    const dialogRef = this.dialog.open(EmployeeStateDataPrintComponent, {
      height: '70%',
      width: '60%',
      data: [this.Selected_Emp,
        {
          employeeDataCheckbox: this.employeeDataCheckbox.value,
          certificateCheckbox: this.certificateCheckbox.value,
          bonusCheckbox: this.bonusCheckbox.value,
          punishmentCheckbox: this.punishmentCheckbox.value,
          freeHolidaysCheckbox: this.freeHolidaysCheckbox.value,
          mergeServiceCheckbox: this.mergeServiceCheckbox.value,
          jobStateCheckbox: this.jobStateCheckbox.value
        }],
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
