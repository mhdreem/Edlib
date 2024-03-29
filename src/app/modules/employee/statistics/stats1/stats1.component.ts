import { AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { ITBLShamelAccounter } from '../../../shared/models/employees_department/TBLShamelAccounter';
import { ITBLShamelChangeReason } from '../../../shared/models/employees_department/ITBLShamelChangeReason';
import { ITBLShamelClass } from '../../../shared/models/employees_department/ITBLShamelClass';
import { ITBLShamelDepartment } from '../../../shared/models/employees_department/ITBLShamelDepartment';
import { ITBLShamelDocumentType } from '../../../shared/models/employees_department/ITBLShamelDocumentType';
import { ITBLShamelJobKind } from '../../../shared/models/employees_department/ITBLShamelJobKind';
import { ITBLShamelJobName } from '../../../shared/models/employees_department/ITBLShamelJobName';
import { TBLShamelAccounterService } from '../../../shared/services/employees_department/tblshamel-accounter.service';
import { TblshamelchangereasonService } from '../../../shared/services/employees_department/tblshamelchangereason.service';
import { TblshamelclassService } from '../../../shared/services/employees_department/tblshamelclass.service';
import { TblshameldepartmentService } from '../../../shared/services/employees_department/tblshameldepartment.service';
import { TblshameljobkindService } from '../../../shared/services/employees_department/tblshameljobkind.service';
import { TblshameljobnameService } from '../../../shared/services/employees_department/tblshameljobname.service';

import { map, startWith, switchMap } from 'rxjs/operators';
import { TBLShamelEmployee } from '../../../shared/models/employees_department/TBLShamelEmployee';
import { MatTableDataSource } from '@angular/material/table';
import { TblshamelmalakstateService } from '../../../shared/services/employees_department/tblshamelmalakstate.service';
import { ITBLShamelMalakState } from '../../../shared/models/employees_department/ITBLShamelMalakState';
import { EmployeeStatsService } from '../../../shared/services/employees_department/employee-stats.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { tap} from 'rxjs';
import { ITBLShamelStats1 } from 'src/app/modules/shared/models/employees_department/itblshamelStats1';
import { MatDialog } from '@angular/material/dialog';
import { PrintComponent } from '../../employeemanagements/components/print/print/print.component';
import { PrintCardComponent } from '../../employeemanagements/components/print/print-card/print-card.component';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-stats1',
  templateUrl: './stats1.component.html',
  styleUrls: ['./stats1.component.scss']
})
export class Stats1Component implements OnInit, OnDestroy, AfterViewInit {
  formname:string = 'بحث بسيط';
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
  ID_NUMBER: FormControl<number | null>;
  MALAKSTATE_NAME: FormControl<string | null>;
  INSURANCESALARY: FormControl<Date | null>;
  ACCOUNTER_ID: FormControl<number | null>;
  ACCOUNTERSERIAL: FormControl<Date | null>;
  AccounterSerail_To: FormControl<number | null>;
  AccounterSerail_From: FormControl<number | null>;
  EMP_IN_MILITARY_SERVICE: FormControl<boolean | null>;
  changereason: FormControl<number | null>;
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


  DocumentType_List: ITBLShamelDocumentType[] = [];
  filteredDocumentTypeOptions: Observable<ITBLShamelDocumentType[]>;

  Class_List: ITBLShamelClass[] = [];
  filteredClassOptions: Observable<ITBLShamelClass[]>;

  ChangeReason_List: ITBLShamelChangeReason[] = [];
  filteredChangeReasonOptions: Observable<ITBLShamelChangeReason[]>;

  dataSource = new MatTableDataSource<ITBLShamelStats1>();
  displayedColumns: string[] = [
    'ID', 'COMPUTER_ID', 'GLOBAL_ID', 'INSURANCE_ID', 'PAYROL_ID', 'FNAME', 'LNAME', 'FATHER', 'MOTHER',
    'ACCOUNTER_NAME', 
    'ACCOUNTER_ID', 'SALARY', 'INSURANCESALARY', 'MALAKSTATE_NAME', 'CHANGEDATE', 'CHANGEREASON_NAME',
    'DOC_NUMBER', 'DOC_DATE', 'DOCUMENTTYPE_NAME',
  ];

  //for pagination
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean= false;

  darkTheme: boolean;
  
  excelData: any[] = [];
  excelOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    showTitle: true,
    title: '',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['الحساب', 'كود الحساب']
  };

  constructor(
  
    public departmentService: TblshameldepartmentService,
    public jobNameService: TblshameljobnameService,
    public jobKindService: TblshameljobkindService,
    public classService: TblshamelclassService,
    public changereasonService: TblshamelchangereasonService,
    public ShamelAccounterService :TBLShamelAccounterService,
    public ShamelmalakstateService :TblshamelmalakstateService,
    public EmployeeStatsService :EmployeeStatsService,
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
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator.page
      .pipe(
        startWith({}),
        switchMap(()=>{
          this.pageSize = this.paginator.pageSize;
          this.currentPage = this.paginator.pageIndex + 1;
          return this.ExcuteSearch();
        })
      )
      .subscribe((data) => {
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
          'ID_NUMBER: ': this.ID_NUMBER = new FormControl<number | null>(null, []),
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
          'changereason: ': this.changereason = new FormControl<number | null>(null, []),
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
      this.Load_TBLShamelChangeReason(),
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

        this.ChangeReason_List = res[1];
        this.filteredChangeReasonOptions = of(this.ChangeReason_List);
        this.changereasonService.List_ITBLShamelChangeReason = this.ChangeReason_List;
        this.changereasonService.List_ITBLShamelChangeReason_BehaviorSubject.next(this.ChangeReason_List);

        this.Accounter_List = res[2];
        this.filteredAccounterOptions = of(this.Accounter_List);
        this.ShamelAccounterService.List_TBLShamelAccounter = this.Accounter_List;
        this.ShamelAccounterService.List_TBLShamelAccounter_BehaviorSubject.next(this.Accounter_List);

        this.Department_List = res[3];
        this.filteredDepartmentOptions = of(this.Department_List);
        this.departmentService.List_ITBLShamelDepartment = this.Department_List;
        this.departmentService.List_ITBLShamelDepartment_BehaviorSubject.next(this.Department_List);

        this.JobName_List = res[4];
        this.filteredJobNameOptions = of(this.JobName_List);
        this.jobNameService.list_ITBLShamelJobName = this.JobName_List;
        this.jobNameService.List_ITBLShamelJobName_BehaviorSubject.next(this.JobName_List);

        this.JobKind_List = res[5];
        this.filteredJobKindOptions = of(this.JobKind_List);
        this.jobKindService.list_ITBLShamelJobKind = this.JobKind_List;
        this.jobKindService.List_ITBLShamelJobKind_BehaviorSubject.next(this.JobKind_List);

        this.Class_List = res[6];
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

  Load_TBLShamelChangeReason(){
    if (this.changereasonService.List_ITBLShamelChangeReason == null ||
      this.changereasonService.List_ITBLShamelChangeReason == undefined ||
      this.changereasonService.List_ITBLShamelChangeReason.length == 0)
      return this.changereasonService.list();
    return of(this.changereasonService.List_ITBLShamelChangeReason);
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

      this.filteredChangeReasonOptions = this.changereason.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterChangeReason(value) : this.ChangeReason_List.slice())
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

  private _filterChangeReason(value: string): ITBLShamelChangeReason[] {
    if (value){
      const filterValue = value.toLowerCase();
      return this.ChangeReason_List.filter(option => option.changereason_name.toLowerCase().includes(filterValue));
    }
    return this.ChangeReason_List.slice();
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


  //#region  Display Display Member
  public displayDocumentTypeProperty(value: string): string {
    if (value && this.DocumentType_List) {
      let cer: any = this.DocumentType_List.find(cer => cer.documenttype_id.toString() == value);
      if (cer)
        return cer.documenttype_name;
    }
    return '';
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

  public displayChangeReasonProperty(value: string): string {
    if (value && this.ChangeReason_List) {
      let object: any = this.ChangeReason_List.find(obj => obj.changereason_id.toString() == value);
      if (object)
        return object.changereason_name;
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

  SearchClicked(){
    this.currentPage=1;
    this.pageSize=5;
    this.ExcuteSearch().subscribe(data=>{
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
      'ID': (this.ID.value!= null?this.ID.value:null ),
      'COMPUTER_ID': (this.ID.value!= null?this.COMPUTER_ID.value:null ),
      'PAYROL_ID': (this.ID.value!= null?this.PAYROL_ID.value:null ),
      'INSURANCE_ID': (this.ID.value!= null?this.INSURANCE_ID.value:null ),
      'GLOBAL_ID': (this.ID.value!= null?this.GLOBAL_ID.value:null ),
      'ID_NUMBER': (this.ID.value!= null?this.ID_NUMBER.value:null ),
      'FNAME': (this.ID.value!= null?this.FNAME.value:null ),
      'LNAME': (this.ID.value!= null?this.LNAME.value:null ),
      'FATHER': (this.ID.value!= null?this.FATHER.value:null ),
      'MOTHER': (this.ID.value!= null?this.MOTHER.value:null ),
      'MalakState': (this.ID.value!= null?this.MalakState.value:null ),
      'ACCOUNTER_ID': (this.ID.value!= null?this.ACCOUNTER_ID.value:null ),
      'EMP_IN_MILITARY_SERVICE': (this.ID.value!= null?this.EMP_IN_MILITARY_SERVICE.value:null ),
      'changereason': (this.ID.value!= null?this.changereason.value:null ),
      'department': (this.ID.value!= null?this.Department.value:null ),
      'Class': (this.ID.value!= null?this.Class.value:null ),
      'JobKind': (this.ID.value!= null?this.JobKind.value:null ),
      'JobName': (this.ID.value!= null?this.JobName.value:null ),
      'INSURANCESALARY': (this.ID.value!= null?this.INSURANCESALARY.value:null ),            

      'AccounterSerail_From': (this.ID.value!= null?this.AccounterSerail_From.value:null ),            
      'AccounterSerail_To': (this.ID.value!= null?this.AccounterSerail_To.value:null ), 
      'pageSize': this.pageSize,            
      'pageNumber': this.currentPage,            

    }
    console.log('searchRequest', SearchRequest);
    
    return this.EmployeeStatsService.Stats1(SearchRequest);
    
    //     this.allData.forEach((data, index) =>{
    //       this.excelData[index]= {
    //                               'رقم الإضبارة': data?.ID,
    //                               'رقم الحاسوب': data?.COMPUTER_ID,
    //                               'الرقم الذاتي': data?.GLOBAL_ID,
    //                               'الرقم التأميني': data?.INSURANCE_ID,
    //                               'رقم الشطب': data?.PAYROL_ID,
    //                               'الاسم': data?.FNAME,
    //                               'الكنية': data?.LNAME,
    //                               'الأب': data?.FATHER,
    //                               'الأم': data?.MOTHER,
    //                               'اسم الوظيفة': data?.JOBNAME_NAME,
    //                               'اسم المعتمد': data?.ACCOUNTER_NAME,
    //                               'رقم التسلسل': data?.ACCOUNTER_ID,
    //                               'الراتب المقطوع': data?.SALARY,
    //                               'الراتب التأميني': data?.INSURANCESALARY,
    //                               'الوضع بالملاك': data?.MALAKSTATE_NAME,
    //                               'تاريخ التبديل': data?.CHANGEDATE,
    //                               'آخر سبب تبديل': data?.CHANGEREASON_NAME,
    //                               'نوع المستند': data?.DOCUMENTTYPE_NAME,
    //                               'رقم المستند': data?.DOC_NUMBER, 
    //                               'تاريخ المستند': data?.DOC_DATE
    //                               }; 

    //     });
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

  exportToExcel() {
    const csvExporter = new ExportToCsv(this.excelOptions);
   csvExporter.generateCsv(this.excelData);
 }
}
