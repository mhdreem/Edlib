import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, finalize, forkJoin, map, Observable, of, startWith, Subscription, switchMap, tap } from 'rxjs';
import { IEmployeeNameList } from 'src/app/modules/shared/models/employees_department/IEmployeeNameList';
import { ITBLShamelClass } from 'src/app/modules/shared/models/employees_department/ITBLShamelClass';
import { ITBLShamelJobName } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobName';
import { ITBLShamelRank } from 'src/app/modules/shared/models/employees_department/ITBLShamelRank';
import { ITBLShamelUpgrade } from 'src/app/modules/shared/models/employees_department/ITBLShamelUpgrade';
import { ITBLShamelAccounter } from 'src/app/modules/shared/models/employees_department/TBLShamelAccounter';
import { TblShamelUpgradeYear } from 'src/app/modules/shared/models/employees_department/TblShamelUpgradeYear';
import { ViewTBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/ViewTBLSamelEmployee';
import { TblShamelUpgradeGovReportService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-gov-report.service';
import { TblShamelUpgradeYearService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-year.service';
import { TBLShamelAccounterService } from 'src/app/modules/shared/services/employees_department/tblshamel-accounter.service';
import { TBLShamelUpgradeService } from 'src/app/modules/shared/services/employees_department/tblshamel-upgrade.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TblshamelclassService } from 'src/app/modules/shared/services/employees_department/tblshamelclass.service';
import { TblshameljobnameService } from 'src/app/modules/shared/services/employees_department/tblshameljobname.service';
import { TblshamelrankService } from 'src/app/modules/shared/services/employees_department/tblshamelrank.service';
import { ViewTBLShamelEmployeeService } from 'src/app/modules/shared/services/employees_department/view-tbl-shamel-employee.service';
import { JobServiceDataAdjustPrintDialogComponent } from '../../../employeemanagements/components/service-data/job-service-data-adjust-print-dialog/job-service-data-adjust-print-dialog.component';
import { PrintRankComponent } from '../print/print-rank/print-rank.component';

@Component({
  selector: 'app-display-upgrade-data',
  templateUrl: './display-upgrade-data.component.html',
  styleUrls: ['./display-upgrade-data.component.scss']
})
export class DisplayUpgradeDataComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<ITBLShamelUpgrade>();
  displayedColumns: string[] = [
    'Year_ID', 'ID', 'Computer_ID', 'Global_ID', 'FName', 'LName', 'Father', 'Mother', 'class_name',
    'jobname_name', 'SalaryBefore', 'QualityGrade', 'GradePercent', 'Duration', 'BonusAmount', 'SalaryAfter', 
    'Qarar_Date', 'Qarar_Num', 'accounter_name', 'AccounterSerial', 'blockcases_name', 'BlockReason_Name', ];

  fixedYear: string;

  _Subscription: Subscription;

  Form: FormGroup;
  UpgradeYear: FormControl<number | null>;
  Class: FormControl<string | null>;
  JobName: FormControl<string | null>;
  Rank: FormControl<string | null>;
  Accounter: FormControl<string | null>;
  EmployeeName: FormControl<string | null>;
  Autocomplete_EmployeeName_Ctrl: FormControl<string | null>;
  idStart: FormControl<number | null>;
  idEnd: FormControl<number | null>;
  TypeDisplay: FormControl<number | null>;

  // Filtering
  UpgradeYear_List: TblShamelUpgradeYear[] = [];
  filteredUpgradeYearOptions: Observable<TblShamelUpgradeYear[]>;
  Class_List: ITBLShamelClass[] = [];
  filteredClassOptions: Observable<ITBLShamelClass[]>;
  JobName_List: ITBLShamelJobName[] = [];
  filteredJobNameOptions: Observable<ITBLShamelJobName[]>;
  Rank_List: ITBLShamelRank[] = [];
  filteredRankOptions: Observable<ITBLShamelRank[]>;
  Accounter_List: ITBLShamelAccounter[] = [];
  filteredAccounterOptions: Observable<ITBLShamelAccounter[]>;
  filteredEmployeeNameList: ViewTBLShamelEmployee[] = [];
  isLoading = false;

  totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.View();
  }

  constructor(private upgradeYear: TblShamelUpgradeYearService,
    private tblshamelclassService: TblshamelclassService,
    private tblshameljobnameService: TblshameljobnameService,
    private tblShamelUpgradeService : TBLShamelUpgradeService,
    private tblShamelUpgradeGovReportService: TblShamelUpgradeGovReportService,
    private fb: UntypedFormBuilder,
    private tblShamelYearService: TBLShamelYearService,
    private snackBar: MatSnackBar,
    private shamelrankService: TblshamelrankService,
    private tblShamelAccounterService: TBLShamelAccounterService,
    public viewTBLShamelEmployeeService:ViewTBLShamelEmployeeService,
    public dialog: MatDialog,) {
      this.BuildForm();
      this.Load_Data();
     }

     public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'UpgradeYear: ': this.UpgradeYear = new FormControl<number | null>(null, []),
            'Class: : ': this.Class = new FormControl<string | null>(null, []),
            'JobName: ': this.JobName = new FormControl<string | null>(null, []),
            'Rank: ': this.Rank = new FormControl<string | null>(null, []),
            'Accounter: ': this.Accounter = new FormControl<string | null>(null, []),
            'EmployeeName: ': this.EmployeeName = new FormControl<string | null>(null, []),
            'Autocomplete_EmployeeName_Ctrl: ': this.Autocomplete_EmployeeName_Ctrl = new FormControl<string | null>(null, []),
            'idStart: ': this.idStart = new FormControl<number | null>(null, []),
            'idEnd: ': this.idEnd = new FormControl<number | null>(null, []),
            'TypeDisplay: ': this.TypeDisplay = new FormControl<number | null>(null, []),
          }
        );
  
      } catch (Exception: any) {
        console.log(Exception);
      }
    }
  
    Load_Data() {
      
      this._Subscription = forkJoin(
        this.Load_TBLShamelUpgradeYear(),
        this.Load_TBLShamelClass(),
        this.Load_TBLJobName(),
        this.Load_TBLRank(),
        this.Load_TBLAccounter(),
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

          this.Rank_List = res[3];
          this.filteredRankOptions = of(this.Rank_List);
          this.shamelrankService.list_ITBLShamelRank = this.Rank_List;
          this.shamelrankService.List_ITBLShamelRank_BehaviorSubject.next(this.Rank_List);

          this.Accounter_List = res[4];
          this.filteredAccounterOptions = of(this.Accounter_List);
          this.tblShamelAccounterService.List_TBLShamelAccounter = this.Accounter_List;
          this.tblShamelAccounterService.List_TBLShamelAccounter_BehaviorSubject.next(this.Accounter_List);
  
          this.Init_AutoComplete();
  
          this.setDefaultUpgradeYear();
          
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

    Load_TBLRank(){
      if (this.shamelrankService.list_ITBLShamelRank == null ||
        this.shamelrankService.list_ITBLShamelRank == undefined ||
        this.shamelrankService.list_ITBLShamelRank.length == 0)
        return this.shamelrankService.list();
      return of(this.shamelrankService.list_ITBLShamelRank);
    }

    Load_TBLAccounter(){
      if (this.tblShamelAccounterService.List_TBLShamelAccounter == null ||
        this.tblShamelAccounterService.List_TBLShamelAccounter == undefined ||
        this.tblShamelAccounterService.List_TBLShamelAccounter.length == 0)
        return this.tblShamelAccounterService.list();
      return of(this.tblShamelAccounterService.List_TBLShamelAccounter);
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

          this.filteredRankOptions = this.Rank.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterRank(value) : this.Rank_List.slice())
          );

          this.filteredAccounterOptions = this.Accounter.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterAccounterName(value) : this.Accounter_List.slice())
          );

          this.Autocomplete_EmployeeName_Ctrl
          .valueChanges
          .pipe(
            debounceTime(300),
            tap(() => this.isLoading = true),
            switchMap((value:string) => this.viewTBLShamelEmployeeService.getEmpFullName2( value)
            .pipe(
              finalize(() => {this.isLoading = false; this.viewTBLShamelEmployeeService.getEmpFullName2( value).subscribe(res => {console.log("value1", res);} )}),
              )
            )
          )
          .subscribe(
            emps => {
              this.filteredEmployeeNameList = emps; 
              
            });
  
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

    private _filterRank(value: string): ITBLShamelRank[] {
      const filterValue = value.toLowerCase();
  
      return this.Rank_List.filter(option => option.rank_name.toLowerCase().includes(filterValue));
    }

    private _filterAccounterName(value: string): ITBLShamelAccounter[] {
      const filterValue = value.toLowerCase();
  
      return this.Accounter_List.filter(option => option.accounter_name.toLowerCase().includes(filterValue));
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

    public displayRankProperty(value: string): string {
      if (value && this.Rank_List) {
        let cer: any = this.Rank_List.find(cer => cer.rank_id.toString() == value);
        if (cer)
          return cer.rank_name;
      }
      return '';
    }

    public displayAccounterNameProperty(value: string): string {
      if (value && this.Accounter_List) {
        let cer: any = this.Accounter_List.find(cer => cer.accounter_id.toString() == value);
        if (cer)
          return cer.accounter_name;
      }
      return '';
    }
  
    setDefaultUpgradeYear(){
      this.tblShamelYearService.GetYearFixed().subscribe(
        res => {
          this.fixedYear = res.year_name;
          this.UpgradeYear.setValue(+this.fixedYear);
        }
      );
    }

    displayFn(emp: IEmployeeNameList) {

      if (emp) { return emp.fullname; }
      return '';
       }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }

  rowClicked: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  View(){
    let request= {
      "year_id": this.UpgradeYear.value,
      "class_id": this.Class.value,
      "jobname_id": this.JobName.value,
      "accounter_id": this.Accounter.value,
      "qualitygrade": this.Rank.value,
      "id_start": this.idStart.value,
      "id_end": this.idEnd.value,
      "type_display_Option": this.TypeDisplay.value,
      'pageSize': this.pageSize,            
      'pageNumber': this.currentPage,
    };
    this.tblShamelUpgradeService.list(request).subscribe(
      (res: any) =>{
        this.dataSource.data= res.Item1;
        this.totalRows= res.Item2;
      }
    );
  }

  adjustPrintFooter(){
    const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
      width: '1150px',
      data: 'PrintUpgradeQualityGrade',
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  printRank(){
    let request= {
      "year_id": this.UpgradeYear.value,
      "class_id": this.Class.value,
      "jobname_id": this.JobName.value,
      "accounter_id": this.Accounter.value,
      "qualitygrade": this.Rank.value,
      "id_start": this.idStart.value,
      "id_end": this.idEnd.value,
      "type_display_Option": this.TypeDisplay.value,
    };
    this.tblShamelUpgradeService.list(request).subscribe(
      (res: any) =>{
        const dialogRef = this.dialog.open(PrintRankComponent, {
          height: '70%',
          width: '60%',
          data: res
        });
    
        dialogRef.afterClosed().subscribe(result => {
          
        });
      }
    );
    
  }

  printUpgradeData(){
    // const dialogRef = this.dialog.open(ServiceDataPrintComponent, {
    //   height: '70%',
    //   width: '60%',
    //   data: this.Selected_Emp,
    // });

    // dialogRef.afterClosed().subscribe(result => {
      
    // });
  }

}
