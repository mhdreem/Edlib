import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import {forkJoin, Observable, of, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ITBLShamelClass } from 'src/app/modules/shared/models/employees_department/ITBLShamelClass';
import { TblShamelUpgradeYear } from 'src/app/modules/shared/models/employees_department/TblShamelUpgradeYear';
import { CountEmployeeAndQararRequest } from 'src/app/modules/shared/models/employees_department/tblshamelupgrade_help/CountEmployeeAndQararRequest';
import { CountEmployeeAndQararResponse } from 'src/app/modules/shared/models/employees_department/tblshamelupgrade_help/CountEmployeeAndQararResponse';
import { TblShamelUpgradeGovReportService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-gov-report.service';
import { TblShamelUpgradeYearService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-year.service';
import { TBLShamelUpgradeService } from 'src/app/modules/shared/services/employees_department/tblshamel-upgrade.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TblshamelclassService } from 'src/app/modules/shared/services/employees_department/tblshamelclass.service';
import { TblshameljobnameService } from 'src/app/modules/shared/services/employees_department/tblshameljobname.service';
import {ITBLShamelJobName} from '../../../../../modules/shared/models/employees_department/ITBLShamelJobName';
@Component({
  selector: 'app-upgrade-promotion-qarars',
  templateUrl: './upgrade-promotion-qarars.component.html',
  styleUrls: ['./upgrade-promotion-qarars.component.scss']
})
export class UpgradePromotionQararsComponent implements OnInit {
  LoadingFinish : boolean;

  fixedYear: string;

  _Subscription: Subscription;

  Form: FormGroup;
  UpgradeYear: FormControl<number | null>;
  Class: FormControl<string | null>;
  JobName: FormControl<string | null>;
  MaxQararNum: FormControl<number | null>;
  day: FormControl<number | null>;
  month: FormControl<number | null>;
  year: FormControl<number | null>;


  // Filtering
  UpgradeYear_List: TblShamelUpgradeYear[] = [];
  filteredUpgradeYearOptions: Observable<TblShamelUpgradeYear[]>;
  Class_List: ITBLShamelClass[] = [];
  filteredClassOptions: Observable<ITBLShamelClass[]>;
  JobName_List: ITBLShamelJobName[] = [];
  filteredJobNameOptions: Observable<ITBLShamelJobName[]>;


  addedJobNames : ITBLShamelJobName[] = [];
  jobNameToAdd: ITBLShamelJobName= {jobname_id: 0, jobname_name: ""};
  jobNameToDelete: ITBLShamelJobName= {jobname_id: 0, jobname_name: ""};

  constructor(
    private upgradeYear: TblShamelUpgradeYearService,
    private tblshamelclassService: TblshamelclassService,
    private tblshameljobnameService: TblshameljobnameService,
    private tblShamelUpgradeService : TBLShamelUpgradeService,
    private tblShamelUpgradeGovReportService: TblShamelUpgradeGovReportService,
    private fb: UntypedFormBuilder,
    private tblShamelYearService: TBLShamelYearService,
    private snackBar: MatSnackBar,) {
      this.LoadingFinish = true;

      this.BuildForm();
      this.Load_Data();

   }

   public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'UpgradeYear: ': this.UpgradeYear = new FormControl<number | null>(null, [Validators.required]),
          'Class: : ': this.Class = new FormControl<string | null>(null, [Validators.required]),
          'JobName: ': this.JobName = new FormControl<string | null>(null, []),
          'MaxQararNum: ': this.MaxQararNum = new FormControl<number | null>(null, [Validators.required]),
          'day: ': this.day = new FormControl<number | null>(null, [Validators.required]),
          'month: ': this.month = new FormControl<number | null>(null, [Validators.required]),
          'year: ': this.year = new FormControl<number | null>(null, [Validators.required]),
        }
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    this.LoadingFinish = false;
    
    this._Subscription = forkJoin(
      this.Load_TBLShamelUpgradeYear(),
      this.Load_TBLShamelClass(),
      this.Load_TBLJobName(),
    ).subscribe(
      res => {
        this.UpgradeYear_List = res[0];
        this.filteredUpgradeYearOptions = of(this.UpgradeYear_List);
        this.upgradeYear.List_TblShamelUpgradeYear = this.UpgradeYear_List;
        this.upgradeYear.List_TblShamelUpgradeYear_BehaviorSubject.next(this.UpgradeYear_List);

        this.Class_List = res[1];
        this.filteredClassOptions = of(this.Class_List);
        this.tblshamelclassService.List_ITBLShamelClass = this.Class_List;
        this.tblshamelclassService.List_ITBLShamelClass_BehaviorSubject.next(this.Class_List);

        this.JobName_List = res[2];
        this.filteredJobNameOptions = of(this.JobName_List);
        this.tblshameljobnameService.list_ITBLShamelJobName = this.JobName_List;
        this.tblshameljobnameService.List_ITBLShamelJobName_BehaviorSubject.next(this.JobName_List);

        this.Init_AutoComplete();

        this.setDefaultUpgradeYear();
        this.LoadingFinish = true;
        
      }
      
    )
  }

  Load_TBLShamelUpgradeYear(){
    if (this.upgradeYear.List_TblShamelUpgradeYear == null ||
      this.upgradeYear.List_TblShamelUpgradeYear == undefined ||
      this.upgradeYear.List_TblShamelUpgradeYear.length == 0)
      return this.upgradeYear.list();
    return of(this.upgradeYear.List_TblShamelUpgradeYear);
  }

  Load_TBLShamelClass(){
    if (this.tblshamelclassService.List_ITBLShamelClass == null ||
      this.tblshamelclassService.List_ITBLShamelClass == undefined ||
      this.tblshamelclassService.List_ITBLShamelClass.length == 0)
      return this.tblshamelclassService.list();
    return of(this.tblshamelclassService.List_ITBLShamelClass);
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
      this.filteredUpgradeYearOptions = this.UpgradeYear.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterUpgradeYear(value) : this.UpgradeYear_List.slice())
        );

      this.filteredClassOptions = this.Class.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterClass(value) : this.Class_List.slice())
        );

        this.filteredJobNameOptions = this.JobName.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterJobName(value) : this.JobName_List.slice())
        );

    } catch (Exception: any) { }
  }

  private _filterUpgradeYear(value: string): TblShamelUpgradeYear[] {
    const filterValue = value.toLowerCase();

    return this.UpgradeYear_List.filter(option => option.YEAR_ID == +filterValue);
  }
  private _filterClass(value: string): ITBLShamelClass[] {
    const filterValue = value.toLowerCase();

    return this.Class_List.filter(option => option.class_name.toLowerCase().includes(filterValue));
  }
  private _filterJobName(value: string): ITBLShamelJobName[] {
    const filterValue = value.toLowerCase();

    return this.JobName_List.filter(option => option.jobname_name.toLowerCase().includes(filterValue));
  }

  public displayUpgradeYearProperty(value: string): string {
    if (value && this.UpgradeYear_List) {
      let cer: any = this.UpgradeYear_List.find(cer => cer.YEAR_ID.toString() == value);
      if (cer)
        return cer.YEAR_ID;
    }
    return '';
  }

  public displayClassProperty(value: string): string {
    if (value && this.Class_List) {
      let cer: any = this.Class_List.find(cer => cer.class_id.toString() == value);
      if (cer)
        return cer.class_name;
    }
    return '';
  }

  public displayJobNameProperty(value: string): string {
    if (value && this.JobName_List) {
      let cer: any = this.JobName_List.find(cer => cer.jobname_id.toString() == value);
      if (cer)
        return cer.jobname_name;
    }
    return '';
  }

  setDefaultUpgradeYear(){
    this.tblShamelYearService.GetYearFixed().subscribe(
      res => {
        this.fixedYear = res.year_name;
        this.UpgradeYear.setValue(+this.fixedYear);
        this.generateLastQararNum();
      }
    );
  }
  ngOnInit(): void {
    
    
  }

  deleteQararNumbers(){
    this.tblShamelUpgradeGovReportService.delete(+this.UpgradeYear.value);
  }

  blocked!: number;
  legalChecked(){
    this.blocked= 2;
  }
  delayChecked(){
    this.blocked= 3;
  }
  
  generateQararNumbers(){
    this.tblShamelUpgradeGovReportService.GenerateUpgradeRreport({
      list_tblshameljobName: this.addedJobNames,
      year_id: +this.UpgradeYear.value,
      tblShamelClass: this.Class_List.filter(classItem => classItem.class_id== +this.Class.value)[0],
      blocked: this.blocked,
      qarar_num: +this.MaxQararNum.value,
      qarar_date: moment(this.month.value+'/'+this.day.value+'/'+this.year.value).toDate()}).subscribe(res =>{
        if (res != null)
        console.log('res123', res);
        this.snackBar.open('تم توليد أرقام القرارات', '', {
          duration: 3000,
        });
      });
  }

  generateLastQararNum(){
    console.log('aaa', this.UpgradeYear.value);
    this.tblShamelUpgradeService.Get_Upgrade_Max_Qarar_Num(+this.UpgradeYear.value).subscribe(
      res =>{
        this.MaxQararNum.setValue(res??0);
      }
    );
  }

  getJobNameToAdd(jobNameId: string){
    //get id
    this.jobNameToAdd.jobname_id= +jobNameId;
    //get name
    this.JobName_List.forEach(
      JobName =>{
        if (JobName.jobname_id == this.jobNameToAdd.jobname_id)
          this.jobNameToAdd.jobname_name = JobName.jobname_name;
      }
    );
  }
  selectToDelete(jobName: ITBLShamelJobName){
    this.jobNameToDelete= jobName;

    //remove highlighted background color from all added jobnames
    for(let i= 0; i<this.addedJobNames.length; i++){
      this.addedJobNames.forEach(addedJobName=>{
        const element = document.getElementById(addedJobName.jobname_id+'');
        element.classList.remove('clicked');
      })
    }
    // add a highlighted background color to the selected jobname
    const element = document.getElementById(jobName.jobname_id+'');
    element.classList.add('clicked');

  }

  addJobName(){
    //clear the input field
    this.JobName.setValue(null);

    for(let i= 0; i<this.addedJobNames.length ; i++)
    if(this.addedJobNames[i].jobname_name == this.jobNameToAdd.jobname_name)
      //exists already
      return;
      if(this.addedJobNames.length == 0)
        this.addedJobNames.push({jobname_id: this.jobNameToAdd.jobname_id ,jobname_name: this.jobNameToAdd.jobname_name});
      else
        this.addedJobNames.push({jobname_id: this.jobNameToAdd.jobname_id ,jobname_name: this.jobNameToAdd.jobname_name});

      //fill the output fields: employees_count, qarars_count
      this.tblShamelUpgradeService.CountEmployeeAndQarar({list_tblshameljobName: this.addedJobNames, class_id: +this.Class.value, year_id: +this.UpgradeYear.value, blocked: this.blocked}).subscribe(
        (res: CountEmployeeAndQararResponse) => {
          
          document.getElementById('employees_count').innerText= res.employees_count==undefined? 0+'': res.employees_count+'';
          document.getElementById('qarars_count').innerText= res.qarars_count==undefined? 0+'' : res.qarars_count+'';
        }
      );

  }
  deleteJobNameFromAddedJobNames(){
    for(let i= 0; i<this.addedJobNames.length ; i++)
      if (this.addedJobNames[i].jobname_id == this.jobNameToDelete.jobname_id)
        this.addedJobNames.splice(i,1);

  }

}

