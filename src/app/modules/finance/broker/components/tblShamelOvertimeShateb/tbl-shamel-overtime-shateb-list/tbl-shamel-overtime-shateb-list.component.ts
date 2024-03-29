import { DataSource } from '@angular/cdk/collections';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, finalize, forkJoin, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { JobServiceDataAdjustPrintDialogComponent } from 'src/app/modules/employee/employeemanagements/components/service-data/job-service-data-adjust-print-dialog/job-service-data-adjust-print-dialog.component';
import { TBLShamelArea } from 'src/app/modules/shared/models/employees_department/TBLShamelArea';
import { TBLShamelMonth } from 'src/app/modules/shared/models/employees_department/TBLShamelMonth';
import { TBLShamelYear } from 'src/app/modules/shared/models/employees_department/TBLShamelYear';
import { TblShamelBrokerShateb } from 'src/app/modules/shared/models/finance_department/broker/TblShamelBrokerShateb';
import { TBLShamelOvertimeEmployee } from 'src/app/modules/shared/models/finance_department/broker/TBLShamelOvertimeEmployee';
import { TBLShamelOverTimeShateb } from 'src/app/modules/shared/models/finance_department/broker/TBLShamelOverTimeShateb';
import { TBLShamelAreaService } from 'src/app/modules/shared/services/employees_department/tblshamel-area.service';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TblShamelMoneyM3PayDestService } from 'src/app/modules/shared/services/finance_department/broker/tbl-shamel-money-m3-pay-dest.service';
import { TBLShamelOvertimeEmployeeService } from 'src/app/modules/shared/services/finance_department/broker/tblshamel-overtime-employee.service';
import { TBLShamelOverTimeShatebService } from 'src/app/modules/shared/services/finance_department/broker/tblshamel-overtime-shateb.service';
import { TblShamelMoneyM3PayDest } from 'src/app/modules/shared/services/finance_department/broker/TblShamelMoneyM3PayDest';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { TblShamelOvertimeShatebModifyComponent } from '../tbl-shamel-overtime-shateb-modify/tbl-shamel-overtime-shateb-modify.component';
import { ExportToCsv } from 'export-to-csv';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-tbl-shamel-overtime-shateb-list',
  templateUrl: './tbl-shamel-overtime-shateb-list.component.html',
  styleUrls: ['./tbl-shamel-overtime-shateb-list.component.scss']
})
export class TblShamelOvertimeShatebListComponent implements OnInit, AfterViewInit {
  formname:string = 'سجل الشطب';
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  LoadingFinish : boolean;

  rowClicked: number;

  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }
  
  
  
  overtime_shateb_List: TBLShamelOverTimeShateb[] = [];
  selected_overtime_shateb: TBLShamelOverTimeShateb;

  dataSource = new MatTableDataSource<TBLShamelOverTimeShateb>(this.overtime_shateb_List);


  TblShamelBrokerShateb_List: TBLShamelOverTimeShateb[] = [];
  Selected_TBLShamelOverTimeShateb: TBLShamelOverTimeShateb;

  displayedColumns: string[] = ['area_id', 'payrol_id', 'year_id', 'month_id', 'school_id', 'broker_id',
    'daycount', 'action'];

  Form: FormGroup;
  Fixed_Month: TBLShamelMonth;
  Fixed_Year: TBLShamelYear;
  List_Area_Id: TBLShamelArea[] = [];
  List_Area_Id_Filter: Observable<TBLShamelArea[]> = of([]);
  List_Overtime_employee_Name: TBLShamelOvertimeEmployee[] = [];
  List_Overtime_employee_Name_Filter: Observable<TBLShamelOvertimeEmployee[]> = of([]);
  List_ShamelMoneyM3PayDest: TblShamelMoneyM3PayDest[];
  List_ShamelMoneyM3PayDest_Filter: Observable<TblShamelMoneyM3PayDest[]>;
  List_TBLShamelMonth: TBLShamelMonth[];
  List_TBLShamelMonth_Filter: Observable<TBLShamelMonth[]> = of([]);
  List_TBLShamelYear: TBLShamelYear[];
  List_TBLShamelYear_Filter: Observable<TBLShamelYear[]> = of([]);

  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean= false;

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

  darkTheme: boolean;

  constructor(private frmBuilder: FormBuilder,
    private tblShamelAreaService: TBLShamelAreaService,
    public ShamelOvertimeEmployeeService: TBLShamelOvertimeEmployeeService,
    public ShamelMonthService: TBLShamelMonthService,
    public ShamelYearService: TBLShamelYearService,
    public ShamelMoneyM3PayDestService: TblShamelMoneyM3PayDestService,
    private tblShamelOverTimeShatebService: TBLShamelOverTimeShatebService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService) {

    this.dataSource = new MatTableDataSource<TBLShamelOverTimeShateb>(this.overtime_shateb_List);

    this.LoadingFinish = true;

    this.Form = this.frmBuilder.group({

      broker_id: new FormControl<number | undefined | null>(null),
      fullname: new FormControl<TBLShamelOvertimeEmployee | undefined | null>(null),
      area_id: new FormControl<number | undefined | null>(null),
      year_id: new FormControl<number | undefined | null>(null),
      month_id: new FormControl<number | undefined | null>(null),
      school_id: new FormControl<number | undefined | null>(null),
      book: new FormControl<number | undefined | null>(null),
      shateb: new FormControl<number | undefined | null>(null),

    });

    this.LoadData();
  }

  Load_Area(): Observable<TBLShamelArea[]> {
    if (this.tblShamelAreaService.List_TBLShamelArea != null ||
      this.tblShamelAreaService.List_TBLShamelArea != undefined ||
      this.tblShamelAreaService.List_TBLShamelArea.length == 0)
      return this.tblShamelAreaService.list();

    return of(this.tblShamelAreaService.List_TBLShamelArea);
  }



  Load_School(): Observable<TblShamelMoneyM3PayDest[]> {
    if (this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest != null ||
      this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest != undefined ||
      this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest.length == 0)
      return this.ShamelMoneyM3PayDestService.list();

    return of(this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest);
  }


  LoadMonth(): Observable<TBLShamelMonth[]> {
    if (this.ShamelMonthService.List_TBLShamelMonth != null ||
      this.ShamelMonthService.List_TBLShamelMonth != undefined ||
      this.ShamelMonthService.List_TBLShamelMonth.length == 0)
      return this.ShamelMonthService.list();

    return of(this.ShamelMonthService.List_TBLShamelMonth);

  }
  LoadYear(): Observable<TBLShamelYear[]> {
    if (this.ShamelYearService.List_TBLShamelYear != null ||
      this.ShamelYearService.List_TBLShamelYear != undefined ||
      this.ShamelYearService.List_TBLShamelYear.length == 0)
      return this.ShamelYearService.list();
    return of(this.ShamelYearService.List_TBLShamelYear);

  }



  LoadData() {
    this.LoadingFinish = false;

    forkJoin(
      [this.Load_Area(),
      this.LoadMonth(),
      this.LoadYear(),
      this.Load_School()]
    ).subscribe(res => {
      this.List_Area_Id = res[0];
      this.List_Area_Id_Filter = of(res[0]);
      this.tblShamelAreaService.List_TBLShamelArea = this.List_Area_Id;
      this.tblShamelAreaService.List_TBLShamelArea_BehaviorSubject.next(this.List_Area_Id);
      console.log("222",this.List_Area_Id);

      this.List_TBLShamelMonth = res[1];
      this.List_TBLShamelMonth_Filter = of(res[1]);
      this.ShamelMonthService.List_TBLShamelMonth = this.List_TBLShamelMonth;
      this.ShamelMonthService.List_TBLShamelMonth_BehaviorSubject.next(this.List_TBLShamelMonth);


      this.List_TBLShamelYear = res[2];
      this.List_TBLShamelYear_Filter = of(res[2]);
      this.ShamelYearService.List_TBLShamelYear = this.List_TBLShamelYear;
      this.ShamelYearService.List_TBLShamelYear_BehaviorSubject.next(this.List_TBLShamelYear);




      this.List_ShamelMoneyM3PayDest = res[3];
      this.List_ShamelMoneyM3PayDest_Filter = of(res[3]);
      this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest = this.List_ShamelMoneyM3PayDest;
      this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest_BehaviorSubject.next(this.List_ShamelMoneyM3PayDest);



      if (this.Form != null) {

        this.Form.controls['fullname']
          .valueChanges
          .pipe(
            debounceTime(300),
            tap(() => { }),
            switchMap((value: string) => this.ShamelOvertimeEmployeeService.EmployeeFullName(value)
              .pipe(
                finalize(() => { }),
              )
            )
          )
          .subscribe(emps => {
            if (emps != null && (emps as TBLShamelOvertimeEmployee[]).length > 0
            ) {
              this.List_Overtime_employee_Name = emps as TBLShamelOvertimeEmployee[];
              this.List_Overtime_employee_Name_Filter = of(this.List_Overtime_employee_Name);

            }
          });


        this.List_Area_Id_Filter = this.Form.controls['area_id'].valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._Filtered_Aria_Id(value) : this.List_Area_Id.slice())
          );

        this.List_ShamelMoneyM3PayDest_Filter = this.Form.controls['school_id'].valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._Filtered_School_ID(value) : this.List_ShamelMoneyM3PayDest.slice())
          );

        this.List_TBLShamelMonth_Filter = this.Form.controls['month_id'].valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._Filtered_Month_Id(value) : this.List_TBLShamelMonth.slice())
          );


        this.List_TBLShamelYear_Filter = this.Form.controls['year_id'].valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._Filtered_Year_Id(value) : this.List_TBLShamelYear.slice())
          );

      }




    },
      (error) => console.log(error));
      this.LoadingFinish = true;

  }


  Display_OverTimeEmployee_Fn(emp: TBLShamelOvertimeEmployee) {
    if (emp != null && emp.serial > 0) {

      return emp.fullname;
    }
    return '';
  }

  private _Filtered_Month_Id(value: string): TBLShamelMonth[] {
    if (value != null) {
      const filterValue = value;
      return this.List_TBLShamelMonth.filter(obj => obj.month_name.includes(filterValue));
    }
    return this.List_TBLShamelMonth.slice();
  }

  private _Filtered_Year_Id(value: string): TBLShamelYear[] {
    if (value != null) {
      const filterValue = value;
      return this.List_TBLShamelYear.filter(obj => obj.year_name.includes(filterValue));
    }
    return this.List_TBLShamelYear.slice();
  }
  OnOverTimeEmployeeSelected(event: MatAutocompleteSelectedEvent) {
    if (event.option.value == null)
      return;
    var emp = event.option.value;

    const id = emp.serail;

    this.Form.controls['broker_id'].setValue(id);




  }


  private _Filtered_Aria_Id(value: string): TBLShamelArea[] {
    if (value != null && this.List_Area_Id != null && this.List_Area_Id.length > 0) {
      const filterValue = value;
      return this.List_Area_Id.filter(obj => obj.Area_Name.includes(filterValue));
    }
    return this.List_Area_Id.slice();
  }


  private _Filtered_School_ID(value: string): TblShamelMoneyM3PayDest[] {
    if (value != null && this.List_ShamelMoneyM3PayDest != null && this.List_ShamelMoneyM3PayDest.length > 0) {
      const filterValue = value;
      return this.List_ShamelMoneyM3PayDest.filter(obj => obj.paydest_name.includes(filterValue));
    }
    return this.List_ShamelMoneyM3PayDest.slice();
  }

  public Display_Month_Property(value: number): string {
    if (value != null && this.List_TBLShamelMonth != null && this.List_TBLShamelMonth.length > 0) {
      let Month: any = this.List_TBLShamelMonth.find(crs => crs.month_id == value);
      if (Month != null)
        return Month.month_name;
    }
    return '';
  }

  public Display_Year_Property(value: number): string {
    if (value != null && this.List_TBLShamelYear != null && this.List_TBLShamelMonth.length > 0) {
      let Year: any = this.List_TBLShamelYear.find(crs => crs.year_id == value);
      if (Year != null)
        return Year.year_name;
    }
    return '';
  }


  public Display_Area_Property(value: number): string {
    if (value != null && this.List_Area_Id != null && this.List_Area_Id.length > 0) {
      let Area: any = this.List_Area_Id.find(crs => crs.Area_ID == value);
      if (Area != null)
        return Area.Area_Name;
    }
    return '';
  }

  public Display_School_Property(value: number): string {
    if (value != null && this.List_ShamelMoneyM3PayDest != null && this.List_ShamelMoneyM3PayDest.length > 0) {
      let ShamelMoneyM3PayDest: any = this.List_ShamelMoneyM3PayDest.find(crs => crs.serial == value);
      if (ShamelMoneyM3PayDest != null)
        return ShamelMoneyM3PayDest.paydest_name;
    }
    return '';
  }

  OnSearch()
  {
    this.currentPage=1;
    this.pageSize=5;
    this.FillTable().subscribe(data=>{
      var array = new Array(data.Item2);
      array.splice((this.currentPage-1)*this.pageSize, this.pageSize,...data.Item1);
      this.dataSource.data = array;
      this.isLoading= false;
    });
  }

  public FillTable() {

    this.isLoading= true;

      console.log('form',this.Form.value);
      // call Search
      return this.tblShamelOverTimeShatebService.Search(this.Form.value, this.currentPage, this.pageSize);

            // this.allData.forEach((datum, index) =>{
            //   this.excelData[index]= {
            //                           'المنطقة': datum?.area_id,
            //                           'رقم الشطب': datum?.payrol_id,
            //                           'العام': datum?.year_id,
            //                           'الشهر': datum?.month_id,
            //                           'المدرسة': datum?.school_id,
            //                           'اسم المعلم المكلف': datum?.broker_id,
            //                           'أيام الخدمة': datum?.daycount,
            //                           }; 
    
            // });
  }


  Add(name: string): void {
    // Init selected_overtime_employee
    this.selected_overtime_shateb = {
      // serial: 0,
      // broker_id: 0,
      // area_id: 0,
      // month_id: 0,
      // year_id: 0,
      // school_id: 0,
    };

    const dialogRef = this.dialog.open(TblShamelOvertimeShatebModifyComponent, {
      height: '40%',
      width: '60%',
      data: null
    });

    dialogRef.afterClosed().toPromise().then(result => {
      console.log(result);
      if (result) {
        this.OnSearch();
        
      }
    });
  }

  Refresh() {

  }
  Delete(element: TBLShamelOverTimeShateb) { 
    try {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'هل أنت متأكد من الحذف?',
          buttonText: {
            ok: 'نعم',
            cancel: 'لا'
          }
        }
      });

      dialogRef.afterClosed().toPromise().then((confirmed: boolean) => {
        if (confirmed) {
          if (element?.serial != null && element.serial > 0)
            this.tblShamelOverTimeShatebService.delete(element?.serial).subscribe
              (
                data => {
                  this.OnSearch();
                  this.dataSource.paginator = this.paginator;
                  this.snackBar.open('تم الحذف', '', {
                    duration: 2000,
                    panelClass: ['green-snackbar']
                  });
                }
              )
        }
      });
    } catch (ex: any) {

    }

  }

  Update(element: TBLShamelOverTimeShateb) { 
    if (element) {
      this.selected_overtime_shateb = element;

      const dialogRef = this.dialog.open(TblShamelOvertimeShatebModifyComponent, {
        height: '40%',
        width: '60%',
        data: this.selected_overtime_shateb
      });

      dialogRef.afterClosed().toPromise().then(result => {
        this.OnSearch();

        if (result){
          this.dataSource.paginator = this.paginator;
        
          this.snackBar.open('تم التعديل', '', {
            duration: 2000,
            panelClass: ['green-snackbar']
          });
        }
      });
  }
  }

  adjustPrintFooter(){
    const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
      width: '1150px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }


  OnSelectYear(event: MatAutocompleteSelectedEvent) {

  }

  OnSelectMonth(event: MatAutocompleteSelectedEvent) {

  }

  OnSelectTblShamelMoneyM3PayDest(event: MatAutocompleteSelectedEvent) {

  }
  OnSelectArea(event: MatAutocompleteSelectedEvent) {


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
        return this.FillTable();
      })
      )
      .subscribe((data) => {
        var array = new Array(data.Item2);
        array.splice((this.currentPage-1)*this.pageSize, this.pageSize,...data.Item1);
        this.dataSource.data = array ;
        this.isLoading= false;
      });
  }

  clearDataSource(){
    this.dataSource.data= [];
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  } 

  exportToExcel() {
    const csvExporter = new ExportToCsv(this.excelOptions);
   csvExporter.generateCsv(this.excelData);
 }
}
