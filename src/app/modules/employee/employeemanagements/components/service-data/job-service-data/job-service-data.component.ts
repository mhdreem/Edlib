import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { ITBLShamelJobName } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobName';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { TblshameljobnameService } from 'src/app/modules/shared/services/employees_department/tblshameljobname.service';
import { EmployeePageService } from '../../employee-page-service';
import { JobServiceDataAdjustPrintDialogComponent } from '../job-service-data-adjust-print-dialog/job-service-data-adjust-print-dialog.component';

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
  oneCheckbox: FormControl;
  twoCheckbox: FormControl;
  threeCheckbox: FormControl;
  fourCheckbox: FormControl;
  fiveCheckbox: FormControl;
  sixCheckbox: FormControl;
  sevenCheckbox: FormControl;

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
      'oneCheckbox': this.oneCheckbox = new FormControl<number | null>(null),
      'twoCheckbox': this.twoCheckbox = new FormControl<number | null>(null),
      'threeCheckbox': this.threeCheckbox = new FormControl<number | null>(null),
      'fourCheckbox': this.fourCheckbox = new FormControl<number | null>(null),
      'fiveCheckbox': this.fiveCheckbox = new FormControl<number | null>(null),
      'sixCheckbox': this.sixCheckbox = new FormControl<number | null>(null),
      'sevenCheckbox': this.sevenCheckbox = new FormControl<number | null>(null),

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
    this.oneCheckbox.setValue(1);
    this.twoCheckbox.setValue(1);
    this.threeCheckbox.setValue(1);
    this.fourCheckbox.setValue(1);
    this.fiveCheckbox.setValue(1);
    this.sixCheckbox.setValue(1);
    this.sevenCheckbox.setValue(1);
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

  change4(event: any){

  }

  adjustPrintFooter(){
    const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
      width: '1150px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  print(){
    
  }

}
