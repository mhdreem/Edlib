import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { JobServiceDataAdjustPrintDialogComponent } from 'src/app/modules/employee/employeemanagements/components/service-data/job-service-data-adjust-print-dialog/job-service-data-adjust-print-dialog.component';
import { TblShamelUpgradeYear } from 'src/app/modules/shared/models/employees_department/TblShamelUpgradeYear';
import { TblShamelUpgradeYearService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-year.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TBLShamelShatebPageStatisticsService } from 'src/app/modules/shared/services/finance_department/payrol/tblshamel-shateb-page-statistics.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelNewPayrolAddPageServiceService } from '../newpayroladd/TbLShamelNewPayrol/tbl-shamel-new-payrol-add-page-service.service';

@Component({
  selector: 'app-employee-page-shateb',
  templateUrl: './employee-page-shateb.component.html',
  styleUrls: ['./employee-page-shateb.component.scss']
})
export class EmployeePageShatebComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  LoadingFinish : boolean;

  rowClicked: number;

  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  displayedColumns: string[] = ['serial', 'itemp_name', 'month1', 'month2', 'month3', 'month4',
    'month5', 'month6', 'month7', 'month8', 'month9', 'month10', 'month11', 'month12'];

  //Data Source For MatTable
  dataSource = new MatTableDataSource<any>();

  pageSizeOptions: number[] = [5, 10, 25, 100];

  _Subscription: Subscription;
  Form: FormGroup;
  UpgradeYear: FormControl<number | null>;

  UpgradeYear_List: TblShamelUpgradeYear[] = [];
  filteredUpgradeYearOptions: Observable<TblShamelUpgradeYear[]>;
  
  fixedYear: string;

  isLoading: boolean= false;
  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  darkTheme: boolean;

  constructor(private upgradeYear: TblShamelUpgradeYearService,
    private fb: UntypedFormBuilder,
    private tblShamelYearService: TBLShamelYearService,
    public dialog: MatDialog,
    private tblShamelShatebPageStatisticsService: TBLShamelShatebPageStatisticsService,
    public pageService: TblShamelNewPayrolAddPageServiceService,
    private themeService: ThemeService) { 
    this.LoadingFinish = true;
    this.BuildForm();
    if (this.pageService.id_BehaviorSubject != null)
      this.pageService.id_BehaviorSubject.subscribe
        (
          emp => {
            console.log('emp', emp);
            if (emp == null || emp <= 0)
              return;

            this.Load_Data();

          }
        )
    // this.Load_Data();
  }

  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'UpgradeYear: ': this.UpgradeYear = new FormControl<number | null>(null, []),
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
        ).subscribe(
          res => {
            this.UpgradeYear_List = res[0];
            this.filteredUpgradeYearOptions = of(this.UpgradeYear_List);
            this.upgradeYear.List_TblShamelUpgradeYear = this.UpgradeYear_List;
            this.upgradeYear.List_TblShamelUpgradeYear_BehaviorSubject.next(this.UpgradeYear_List);
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

    public async Init_AutoComplete() {
      try {
        this.filteredUpgradeYearOptions = this.UpgradeYear.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterUpgradeYear(value) : this.UpgradeYear_List.slice())
          );
        } catch (Exception: any) { }
      }

      private _filterUpgradeYear(value: string): TblShamelUpgradeYear[] {
        const filterValue = value.toLowerCase();
    
        return this.UpgradeYear_List.filter(option => option.YEAR_ID == +filterValue);
      }

      public displayUpgradeYearProperty(value: string): string {
        if (value && this.UpgradeYear_List) {
          let cer: any = this.UpgradeYear_List.find(cer => cer.YEAR_ID.toString() == value);
          if (cer)
            return cer.YEAR_ID;
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

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

  adjustPrintFooter(){
    const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
      width: '1150px',
      data: 'MoneyM2PrintShatebPage',
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  View(){
    this.isLoading= true;

    this.tblShamelShatebPageStatisticsService.list(this.pageService.id,this.UpgradeYear.value).subscribe((res: any) =>{
      this.dataSource.data = [res];
      this.isLoading= false;
    });
  }

  clearDataSource(){
    this.dataSource.data = [];
  }
}
