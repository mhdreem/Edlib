import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { TblShamelUpgradeYearService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-year.service';
import { TblshamelclassService } from 'src/app/modules/shared/services/employees_department/tblshamelclass.service';
import { TblshameljobnameService } from 'src/app/modules/shared/services/employees_department/tblshameljobname.service';
import {map, startWith, switchMap} from 'rxjs/operators';
import { TBLShamelUpgradeService } from 'src/app/modules/shared/services/employees_department/tblshamel-upgrade.service';
import { TblShamelUpgradeYear } from 'src/app/modules/shared/models/employees_department/TblShamelUpgradeYear';
import { Stats4 } from 'src/app/modules/shared/models/employees_department/Stats4';
import { MatTableDataSource } from '@angular/material/table';
import { TblShamelUpgradeGovReport } from 'src/app/modules/shared/models/employees_department/TblShamelUpgradeGovReport';
import { TblShamelUpgradeGovReportService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-gov-report.service';
import { TblShamelUpgradeGovReportSearch } from 'src/app/modules/shared/models/employees_department/tbl-shamel-upgrade-gov-report-search';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TblShamelPrintReferralQararsResult } from 'src/app/modules/shared/models/employees_department/tbl-shamel-print-referral-qarars-result';
import { ITBLShamelClass } from 'src/app/modules/shared/models/employees_department/ITBLShamelClass';
import { ITBLShamelJobName } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobName';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { JobServiceDataAdjustPrintDialogComponent } from '../../../employeemanagements/components/service-data/job-service-data-adjust-print-dialog/job-service-data-adjust-print-dialog.component';
import { PrintReferralsComponent } from '../print/print-referrals/print-referrals.component';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-print-referral-qarars',
  templateUrl: './print-referral-qarars.component.html',
  styleUrls: ['./print-referral-qarars.component.scss']
})
export class PrintReferralQararsComponent implements OnInit, AfterViewInit, OnDestroy {
  formname:string = 'طباعة احالات القرارات';
  LoadingFinish : boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  _Subscription: Subscription;

  dataSource = new MatTableDataSource<TblShamelUpgradeGovReport>();
  displayedColumns: string[] = [
    'upgrade_year','qarar_number','qarar_date','first_name','last_name','class','jobname'];

  Form: FormGroup;
  UpgradeYear: FormControl<string | null>;
  Class: FormControl<string | null>;
  JobName: FormControl<string | null>;
  FirstQararNum: FormControl<number | null>;
  LastQararNum: FormControl<number | null>;


  UpgradeYear_List: TblShamelUpgradeYear[] = [];
  filteredUpgradeYearOptions: Observable<TblShamelUpgradeYear[]>;
  Class_List: ITBLShamelClass[] = [];
  filteredClassOptions: Observable<ITBLShamelClass[]>;
  JobName_List: ITBLShamelJobName[] = [];
  filteredJobNameOptions: Observable<ITBLShamelJobName[]>;

  fixedYear: string;

  //for pagination
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean= false;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(()=>{
          this.pageSize = this.paginator.pageSize;
          this.currentPage = this.paginator.pageIndex + 1;
          return this.Search();
        })
      )
      .subscribe((data) => {
        var array = new Array(data.Item2);
        array.splice((this.currentPage-1)*this.pageSize, this.pageSize,...data.Item1);
        this.dataSource.data = array;
        this.isLoading= false;
      });
  }

  referralInput: any[];

  darkTheme: boolean;

  constructor(
    private upgradeYear: TblShamelUpgradeYearService,
    private tblshamelclassService: TblshamelclassService,
    private tblshameljobnameService: TblshameljobnameService,
    private tblShamelUpgradeService : TBLShamelUpgradeService,
    private tblShamelUpgradeGovReportService : TblShamelUpgradeGovReportService,
    public dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private tblShamelYearService: TBLShamelYearService,
    private themeService: ThemeService
  ) {
    this.LoadingFinish = true;

    this.BuildForm();
    this.Load_Data();

   }

   public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'UpgradeYear: ': this.UpgradeYear = new FormControl<string | null>(null, []),
          'Class: : ': this.Class = new FormControl<string | null>(null, []),
          'JobName: ': this.JobName = new FormControl<string | null>(null, []),
          'FirstQararNum: ': this.FirstQararNum = new FormControl<number | null>(null, []),
          'LastQararNum: ': this.LastQararNum = new FormControl<number | null>(null, []),
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
        console.log("res0",res[0]);
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

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })

    this.tblShamelYearService.GetYearFixed().subscribe(
      res => {
        this.fixedYear = res.year_name;
        this.UpgradeYear.setValue(this.fixedYear);
      }
    );

  }

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }

  jobNameToAdd: string= "";
  getJobName(jobName: string){
    this.jobNameToAdd= jobName;
  }

  onSearchClick(){
    this.currentPage=1;
    this.pageSize=5;
    this.Search().subscribe(data=>{
      var array = new Array(data.Item2);
      array.splice((this.currentPage-1)*this.pageSize, this.pageSize,...data.Item1);
      this.dataSource.data = array;
      this.isLoading= false;
    });
  }

  request :TblShamelUpgradeGovReportSearch = {};

  Search()
  {
    this.isLoading= true;

    let request= {
      year_id: +this.UpgradeYear.value,
      class_name:  this.Class.value,
      jobname_name: this.JobName.value,
      first_qarar_num: +this.FirstQararNum.value,
      last_qarar_num: +this.LastQararNum.value,
      };

    this.tblShamelUpgradeGovReportService.Search(request).subscribe(
      (res: any)=>{
        this.referralInput= res.Item1;
      });

    this.request= {
      year_id: +this.UpgradeYear.value,
      class_name:  this.Class.value,
      jobname_name: this.JobName.value,
      first_qarar_num: +this.FirstQararNum.value,
      last_qarar_num: +this.LastQararNum.value,
      pageSize: this.pageSize,            
      pageNumber: this.currentPage};

    return this.tblShamelUpgradeGovReportService.Search(this.request)


        
    
  }

  list(){
    this.tblShamelUpgradeGovReportService.list().subscribe(
      (res: any)=>{
        console.log('res', res);
        this.dataSource.data= res.Item1;
        this.referralInput= this.dataSource.data;
      }
    );
  }

  

    adjustPrintFooter(){
      const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
        width: '1150px',
        data: 'UpgradePrintE7ala',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }

    print(){

      // const dialogRef = this.dialog.open(PrintReferralsComponent, {
      //   height: '70%',
      //   width: '60%',
      //   data: this.dataSource.data
      // });
  
      // dialogRef.afterClosed().subscribe(result => {
        
      // });
    }

  rowClicked: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  clearDataSource(){
    this.dataSource.data= [];
  }
}
