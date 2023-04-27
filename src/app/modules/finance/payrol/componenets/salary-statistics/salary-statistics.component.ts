import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, NgZone, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, map, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { ITBLShamelClass } from 'src/app/modules/shared/models/employees_department/ITBLShamelClass';
import { ITBLShamelDepartment } from 'src/app/modules/shared/models/employees_department/ITBLShamelDepartment';
import { ITBLShamelJobKind } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobKind';
import { ITBLShamelJobName } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobName';
import { ITBLShamelMalakState } from 'src/app/modules/shared/models/employees_department/ITBLShamelMalakState';
import { ITBLShamelAccounter } from 'src/app/modules/shared/models/employees_department/TBLShamelAccounter';
import { EmployeeStatsService } from 'src/app/modules/shared/services/employees_department/employee-stats.service';
import { TBLShamelAccounterService } from 'src/app/modules/shared/services/employees_department/tblshamel-accounter.service';
import { TblshamelclassService } from 'src/app/modules/shared/services/employees_department/tblshamelclass.service';
import { TblshameldepartmentService } from 'src/app/modules/shared/services/employees_department/tblshameldepartment.service';
import { TblshameljobkindService } from 'src/app/modules/shared/services/employees_department/tblshameljobkind.service';
import { TblshameljobnameService } from 'src/app/modules/shared/services/employees_department/tblshameljobname.service';
import { TblshamelmalakstateService } from 'src/app/modules/shared/services/employees_department/tblshamelmalakstate.service';
import { TBLShamelNewShatebService } from 'src/app/modules/shared/services/finance_department/payrol/tblshamel-new-shateb.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-salary-statistics',
  templateUrl: './salary-statistics.component.html',
  styleUrls: ['./salary-statistics.component.scss']
})
export class SalaryStatisticsComponent implements OnInit, AfterViewInit {
  formname:string = 'احصائيات';

  LoadingFinish : boolean;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  _Subscription: Subscription;

  Form: FormGroup;
  ID: FormControl<number | null>;
  PAYROL_ID: FormControl<number | null>;
  COMPUTER_ID: FormControl<number | null>;
  GLOBAL_ID: FormControl<number | null>;
  INSURANCE_ID: FormControl<number | null>;
  FNAME: FormControl<string | null>;
  LNAME: FormControl<string | null>;
  FATHER: FormControl<string | null>;
  MOTHER: FormControl<string | null>;
  MALAKSTATE_NAME: FormControl<string | null>;
  INSURANCESALARY: FormControl<Date | null>;
  ACCOUNTER_ID: FormControl<number | null>;
  ACCOUNTERSERIAL: FormControl<Date | null>;
  AccounterSerail_To: FormControl<number | null>;
  AccounterSerail_From: FormControl<number | null>;
  EMP_IN_MILITARY_SERVICE: FormControl<boolean | null>;
  JobName: FormControl<number | null>;
  Class: FormControl<number | null>;
  JobKind: FormControl<number | null>;
  MalakState: FormControl<Date | null>;
  Salary: FormControl<Date | null>;
  Saldepartmentary: FormControl<Date | null>;
  Department: FormControl<number | null>;


  TBLShamelMalakState_List : ITBLShamelMalakState[]=[];
  filteredMalakStateOptions: Observable< ITBLShamelMalakState[]>;
  
  Accounter_List: ITBLShamelAccounter[] = [];
  filteredAccounterOptions: Observable<ITBLShamelAccounter[]>;


  Department_List: ITBLShamelDepartment[] = [];
  filteredDepartmentOptions: Observable<ITBLShamelDepartment[]>;

  JobName_List: ITBLShamelJobName[] = [];
  filteredJobNameOptions: Observable<ITBLShamelJobName[]>;

  JobKind_List: ITBLShamelJobKind[] = [];
  filteredJobKindOptions: Observable<ITBLShamelJobKind[]>;


  Class_List: ITBLShamelClass[] = [];
  filteredClassOptions: Observable<ITBLShamelClass[]>;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'ID', 'COMPUTER_ID', 'GLOBAL_ID', 'INSURANCE_ID', 'PAYROL_ID', 'FNAME', 'LNAME', 'FATHER', 'MOTHER',
    'ACCOUNTER_NAME', 
    'ACCOUNTER_ID', 'SALARY', 'INSURANCESALARY', 'MALAKSTATE_NAME'
  ];

  //for pagination
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];


  darkTheme: boolean;

  isLoading: boolean= false;
  constructor(
  
    public departmentService: TblshameldepartmentService,
    public jobNameService: TblshameljobnameService,
    public jobKindService: TblshameljobkindService,
    public classService: TblshamelclassService,
    public ShamelAccounterService :TBLShamelAccounterService,
    public ShamelmalakstateService :TblshamelmalakstateService,
    public EmployeeStatsService :EmployeeStatsService,
    private tblShamelNewShatebService: TBLShamelNewShatebService,
    private fb: UntypedFormBuilder,
    private ngZone: NgZone,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService) {

      this.dataSource = new MatTableDataSource<any>([]);
      this.LoadingFinish = true;

      this.BuildForm();
      this.Load_Data();

    }

    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator.page
      .pipe(
        startWith({}),
        switchMap(()=>{
          this.pageSize = this.paginator.pageSize;
          this.currentPage = this.paginator.pageIndex + 1;
          return this.ExcuteSearch();
        })
      )
      .subscribe((data: any) => {
        var array = new Array(data.Item2);
        array.splice((this.currentPage-1)*this.pageSize, this.pageSize,...data.Item1);
        this.dataSource.data = array;
        this.isLoading= false;
      });
    }

    announceSortChange(sortState: any) {
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }
  public BuildForm() {
    try {
      this.Form = this.fb.group(
        {
          'ID: ': this.ID = new FormControl<number | null>(null, []),
          'PAYROL_ID: : ': this.PAYROL_ID = new FormControl<number | null>(null, []),
          'COMPUTER_ID: ': this.COMPUTER_ID = new FormControl<number | null>(null, []),
          'GLOBAL_ID: ': this.GLOBAL_ID = new FormControl<number | null>(null, []),
          'INSURANCE_ID: ': this.INSURANCE_ID = new FormControl<number | null>(null, []),
          'ACCOUNTER_ID: ': this.ACCOUNTER_ID = new FormControl<number | null>(null, []),
          'FNAME: ': this.FNAME = new FormControl<string | null>(null, []),
          'LNAME: ': this.LNAME = new FormControl<string | null>(null, []),
          'FATHER: ': this.FATHER = new FormControl<string | null>(null, []),
          'MOTHER: ': this.MOTHER = new FormControl<string | null>(null, []),
          'MALAKSTATE_NAME: ': this.MALAKSTATE_NAME = new FormControl<string | null>(null, []),
          'INSURANCESALARY: ': this.INSURANCESALARY = new FormControl<Date | null>(null, []),
          'ACCOUNTERSERIAL: ': this.ACCOUNTERSERIAL = new FormControl<Date | null>(null, []),
          'AccounterSerail_To: ': this.AccounterSerail_To = new FormControl<number | null>(null, []),
          'AccounterSerail_From: ': this.AccounterSerail_From = new FormControl<number | null>(null, []),
          'EMP_IN_MILITARY_SERVICE: ': this.EMP_IN_MILITARY_SERVICE = new FormControl<boolean | null>(null, []),
          'JobName: ': this.JobName = new FormControl<number | null>(null, []),
          'Class: ': this.Class = new FormControl<number | null>(null, []),
          'JobKind: ': this.JobKind = new FormControl<number | null>(null, []),
          'MalakState: ': this.MalakState = new FormControl<Date | null>(null, []),
          'Salary: ': this.Salary = new FormControl<Date | null>(null, []),
          'Saldepartmentary: ': this.Saldepartmentary = new FormControl<Date | null>(null, []),
          'Department: ': this.Department = new FormControl<number | null>(null, []),
        }
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    this.LoadingFinish = false;
    
    this._Subscription = forkJoin(
      this.Load_TBLShamelMalakState(),
      this.Load_TBLShamelAccounter(),
      this.Load_TBLShamelDepartment(),
      this.Load_TBLShamelJobName(),
      this.Load_TBLShamelJobKind(),
      this.Load_TBLShamelClass(),
    ).subscribe(
      res => {
        this.TBLShamelMalakState_List = res[0];
        this.filteredMalakStateOptions = of(this.TBLShamelMalakState_List);
        this.ShamelmalakstateService.list_ITBLShamelMalakState = this.TBLShamelMalakState_List;
        this.ShamelmalakstateService.List_ITBLShamelMalakState_BehaviorSubject.next(this.TBLShamelMalakState_List);

        this.Accounter_List = res[1];
        this.filteredAccounterOptions = of(this.Accounter_List);
        this.ShamelAccounterService.List_TBLShamelAccounter = this.Accounter_List;
        this.ShamelAccounterService.List_TBLShamelAccounter_BehaviorSubject.next(this.Accounter_List);

        this.Department_List = res[2];
        this.filteredDepartmentOptions = of(this.Department_List);
        this.departmentService.List_ITBLShamelDepartment = this.Department_List;
        this.departmentService.List_ITBLShamelDepartment_BehaviorSubject.next(this.Department_List);

        this.JobName_List = res[3];
        this.filteredJobNameOptions = of(this.JobName_List);
        this.jobNameService.list_ITBLShamelJobName = this.JobName_List;
        this.jobNameService.List_ITBLShamelJobName_BehaviorSubject.next(this.JobName_List);

        this.JobKind_List = res[4];
        this.filteredJobKindOptions = of(this.JobKind_List);
        this.jobKindService.list_ITBLShamelJobKind = this.JobKind_List;
        this.jobKindService.List_ITBLShamelJobKind_BehaviorSubject.next(this.JobKind_List);

        this.Class_List = res[5];
        this.filteredClassOptions = of(this.Class_List);
        this.classService.List_ITBLShamelClass = this.Class_List;
        this.classService.List_ITBLShamelClass_BehaviorSubject.next(this.Class_List);

        this.Init_AutoComplete();
        this.LoadingFinish = true;

      }
      
    )
  }

  Load_TBLShamelMalakState(){
    if (this.ShamelmalakstateService.list_ITBLShamelMalakState == null ||
      this.ShamelmalakstateService.list_ITBLShamelMalakState == undefined ||
      this.ShamelmalakstateService.list_ITBLShamelMalakState.length == 0)
      return this.ShamelmalakstateService.list();
    return of(this.ShamelmalakstateService.list_ITBLShamelMalakState);
  }

  
  Load_TBLShamelAccounter(){
    if (this.ShamelAccounterService.List_TBLShamelAccounter == null ||
      this.ShamelAccounterService.List_TBLShamelAccounter == undefined ||
      this.ShamelAccounterService.List_TBLShamelAccounter.length == 0)
      return this.ShamelAccounterService.list();
    return of(this.ShamelAccounterService.List_TBLShamelAccounter);
  }
  Load_TBLShamelDepartment(){
    if (this.departmentService.List_ITBLShamelDepartment == null ||
      this.departmentService.List_ITBLShamelDepartment == undefined ||
      this.departmentService.List_ITBLShamelDepartment.length == 0)
      return this.departmentService.list();
    return of(this.departmentService.List_ITBLShamelDepartment);
  }
  
  Load_TBLShamelJobName(){
    if (this.jobNameService.list_ITBLShamelJobName == null ||
      this.jobNameService.list_ITBLShamelJobName == undefined ||
      this.jobNameService.list_ITBLShamelJobName.length == 0)
      return this.jobNameService.list();
    return of(this.jobNameService.list_ITBLShamelJobName);
  }
  
  Load_TBLShamelJobKind(){
    if (this.jobKindService.list_ITBLShamelJobKind == null ||
      this.jobKindService.list_ITBLShamelJobKind == undefined ||
      this.jobKindService.list_ITBLShamelJobKind.length == 0)
      return this.jobKindService.list();
    return of(this.jobKindService.list_ITBLShamelJobKind);
  }
  Load_TBLShamelClass(){
    if (this.classService.List_ITBLShamelClass == null ||
      this.classService.List_ITBLShamelClass == undefined ||
      this.classService.List_ITBLShamelClass.length == 0)
      return this.classService.list();
    return of(this.classService.List_ITBLShamelClass);
  }

  public async Init_AutoComplete() {
    try {
      this.filteredMalakStateOptions = this.MalakState.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterMalakState(value) : this.TBLShamelMalakState_List.slice())
        );

        this.filteredAccounterOptions = this.ACCOUNTER_ID.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterAccounter(value) : this.Accounter_List.slice())
        );

        this.filteredDepartmentOptions = this.Department.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterDepartment(value) : this.Department_List.slice())
        );

        this.filteredJobNameOptions = this.JobName.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterJobName(value) : this.JobName_List.slice())
        );

        this.filteredJobKindOptions = this.JobKind.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterJobKind(value) : this.JobKind_List.slice())
        );

        this.filteredClassOptions = this.Class.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterClass(value) : this.Class_List.slice())
        );
    } catch (Exception: any) { }
  }

  private _filterMalakState(value: string): ITBLShamelMalakState[] {
    if (value){
      const filterValue = value.toLowerCase();
      return this.TBLShamelMalakState_List.filter(option => option.malakstate_name.toLowerCase().includes(filterValue));
    }
    return this.TBLShamelMalakState_List.slice();
  }

  private _filterAccounter(value: string): ITBLShamelAccounter[] {
    if (value){
      const filterValue = value.toLowerCase();
      return this.Accounter_List.filter(option => option.accounter_name.toLowerCase().includes(filterValue));
    }
    return this.Accounter_List.slice();
  }

  private _filterDepartment(value: string): ITBLShamelDepartment[] {
    if (value){
      const filterValue = value.toLowerCase();
      return this.Department_List.filter(option => option.department_name.toLowerCase().includes(filterValue));
    }
    return this.Department_List.slice();
  }

  private _filterJobName(value: string): ITBLShamelJobName[] {
    if (value){
      const filterValue = value.toLowerCase();
      return this.JobName_List.filter(option => option.jobname_name.toLowerCase().includes(filterValue));
    }
    return this.JobName_List.slice();
  }

  private _filterJobKind(value: string): ITBLShamelJobKind[] {
    if (value){
      const filterValue = value.toLowerCase();
      return this.JobKind_List.filter(option => option.jobkind_name.toLowerCase().includes(filterValue));
    }
    return this.JobKind_List.slice();
  }

  private _filterClass(value: string): ITBLShamelClass[] {
    if (value){
      const filterValue = value.toLowerCase();
      return this.Class_List.filter(option => option.class_name.toLowerCase().includes(filterValue));
    }
    return this.Class_List.slice();
  }

  
  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }


  public displayAccounterProperty(value: string): string {
    if (value!= null  && this.Accounter_List != null ) {
      let object: any = this.Accounter_List.find(obj => obj?.accounter_id != null && obj?.accounter_id.toString() == value);
      if (object!= null )
        return object.ACCOUNTER_NAMNE;
    }
    return '';
  }

  public displayClassProperty(value: string): string {
    if (value && this.Class_List) {
      let object: any = this.Class_List.find(obj => obj.class_id.toString() == value);
      if (object)
        return object.class_name;
    }
    return '';
  }


  public displayMalakStateProperty(value: string): string {
    if (value!= null && this.TBLShamelMalakState_List!= null) {
      let object: any = this.TBLShamelMalakState_List.find(obj => obj.malakstate_id.toString() == value);
      if (object!= null)
        return object.malakstate_name;
    }
    return '';
  }

  public displayJobKindProperty(value: string): string {
    if (value && this.JobKind_List) {
      let object: any = this.JobKind_List.find(obj => obj.jobkind_id.toString() == value);
      if (object)
        return object.jobkind_name;
    }
    return '';
  }

  public displayJobNameProperty(value: string): string {
    if (value && this.JobName_List) {
      let object: any = this.JobName_List.find(obj => obj.jobname_id.toString() == value);
      if (object)
        return object.jobname_name;
    }
    return '';
  }

  public displayDeparmentProperty(value: string): string {
    if (value && this.Department_List) {
      let object: any = this.Department_List.find(obj => obj.department_id.toString() == value);
      if (object)
        return object.department_name;
    }
    return '';
  }
  //#endregion

  onSearchClick(){
    this.currentPage=1;
    this.pageSize=5;
    this.ExcuteSearch().subscribe((data: any)=>{
      var array = new Array(data.Item2);
      array.splice((this.currentPage-1)*this.pageSize, this.pageSize,...data.Item1);
      this.dataSource.data = array;
      this.isLoading= false;
    }); 
  }

  ExcuteSearch ()
  {
    this.isLoading= true;

    let SearchRequest =
    {
      'id': (this.ID.value!= null?this.ID.value:null ),
      'computeR_ID': (this.ID.value!= null?this.COMPUTER_ID.value:null ),
      'payroL_ID': (this.ID.value!= null?this.PAYROL_ID.value:null ),
      'insurancE_ID': (this.ID.value!= null?this.INSURANCE_ID.value:null ),
      'globaL_ID': (this.ID.value!= null?this.GLOBAL_ID.value:null ),
      'fname': (this.ID.value!= null?this.FNAME.value:null ),
      'lname': (this.ID.value!= null?this.LNAME.value:null ),
      'father': (this.ID.value!= null?this.FATHER.value:null ),
      'mother': (this.ID.value!= null?this.MOTHER.value:null ),
      'malakstatE_NAME': (this.ID.value!= null?this.MalakState.value:null ),
      'accounteR_ID': (this.ID.value!= null?this.ACCOUNTER_ID.value:null ),
      'emP_IN_MILITARY_SERVICE': (this.ID.value!= null?this.EMP_IN_MILITARY_SERVICE.value:null ),
      'department': (this.ID.value!= null?this.Department.value:null ),
      'class': (this.ID.value!= null?this.Class.value:null ),
      'jobKind': (this.ID.value!= null?this.JobKind.value:null ),
      'jobName': (this.ID.value!= null?this.JobName.value:null ),
      'insurancesalary': (this.ID.value!= null?this.INSURANCESALARY.value:null ),            
      'accounterSerail_From': (this.ID.value!= null?this.AccounterSerail_From.value:null ),            
      'accounterSerail_To': (this.ID.value!= null?this.AccounterSerail_To.value:null ), 
      'pageSize': this.pageSize-1,            
      'pageNumber': this.currentPage,            

    }
    console.log('searchRequest', SearchRequest);
    
    return this.tblShamelNewShatebService.newPayrolShatebStatistics(SearchRequest);
  }

  rowClicked: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  clearForm(){
    this.Form.reset();
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  clearDataSource(){
    this.dataSource.data= [];
  }

}
