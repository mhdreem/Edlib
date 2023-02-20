import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { ITBLShamelAccounter } from 'src/app/modules/shared/models/employees_department/TBLShamelAccounter';
import { TBLShamelMonth } from 'src/app/modules/shared/models/employees_department/TBLShamelMonth';
import { TBLShamelYear } from 'src/app/modules/shared/models/employees_department/TBLShamelYear';
import { TblShamelPayrolSlice } from 'src/app/modules/shared/models/finance_department/payrol/tblShamelPayrolSlice';
import { TBLShamelAccounterService } from 'src/app/modules/shared/services/employees_department/tblshamel-accounter.service';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TBLShamelNewShatebService } from 'src/app/modules/shared/services/finance_department/payrol/tblshamel-new-shateb.service';
import { TblshamelPayrolSliceService } from 'src/app/modules/shared/services/finance_department/payrol/tblshamel-payrol-slice.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-payrol-difference',
  templateUrl: './payrol-difference.component.html',
  styleUrls: ['./payrol-difference.component.scss']
})
export class PayrolDifferenceComponent implements OnInit, AfterViewInit {
  formname:string = 'فروقات ترفيعات وزيادات';

  LoadingFinish : boolean;

  _Subscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'Year_ID', 'ID', 'Computer_ID', 'Global_ID', 'FName', 'LName', 'Father', 'Mother', 'class_name',
    'jobname_name', 'SalaryBefore', 'QualityGrade', 'GradePercent', 'Duration', 'BonusAmount', 'SalaryAfter', 
    'Qarar_Date', 'Qarar_Num', 'accounter_name', 'AccounterSerial', 'blockcases_name', 'BlockReason_Name', ];


  fixedYear: string;
  fixedMonth: TBLShamelMonth;

  Form: FormGroup;
  Accounter: FormControl<string | null>;
  monthCount: FormControl<number | null>;
  monthNaturekWorkTawidCount: FormControl<number | null>;
  payrolSlice: FormControl<string | null>;
  year_id_last: FormControl<number | null>;
  month_id_last: FormControl<number | null>;
  year_id_first: FormControl<number | null>;
  month_id_first: FormControl<number | null>;

  Accounter_List: ITBLShamelAccounter[] = [];
  filteredAccounterOptions: Observable<ITBLShamelAccounter[]>;
  payrolSlice_List: TblShamelPayrolSlice[] = [];
  filteredPayrolSliceOptions: Observable<TblShamelPayrolSlice[]>;
  List_TBLShamelMonth: TBLShamelMonth[];
  List_TBLShamelMonth_Filter: Observable<TBLShamelMonth[]> = of([]);
  List_TBLShamelYear: TBLShamelYear[];
  List_TBLShamelYear_Filter: Observable<TBLShamelYear[]> = of([]);

  totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  allData: any[]= [];

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.View();
  }

  darkTheme: boolean;


  constructor(@Inject(DOCUMENT) private _document: Document,
    private tblShamelYearService: TBLShamelYearService,
    public ShamelMonthService: TBLShamelMonthService,
    private tblShamelAccounterService: TBLShamelAccounterService,
    private fb: UntypedFormBuilder,
    private tblShamelNewShatebService: TBLShamelNewShatebService,
    private tblshamelPayrolSliceService: TblshamelPayrolSliceService,
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
            'Accounter: ': this.Accounter = new FormControl<string | null>(null, []),
            'monthCount: ': this.monthCount = new FormControl<number | null>(null, []),
            'monthNaturekWorkTawidCount: ': this.monthNaturekWorkTawidCount = new FormControl<number | null>(null, []),
            'payrolSlice: ': this.payrolSlice = new FormControl<string | null>(null, []),
            'year_id_last: ': this.year_id_last = new FormControl<number | null>(null, []),
            'month_id_last: ': this.month_id_last = new FormControl<number | null>(null, []),
            'year_id_first: ': this.year_id_first = new FormControl<number | null>(null, []),
            'month_id_first: ': this.month_id_first = new FormControl<number | null>(null, []),
          }
        );
  
      } catch (Exception: any) {
        console.log(Exception);
      }
    }

    Load_Data() {
      this.LoadingFinish = false;
        
        this._Subscription = forkJoin(
          this.Load_TBLAccounter(),
          this.Load_PayrolSlice(),
          this.LoadMonth(),
        this.LoadYear(),
        ).subscribe(
          res => {
            this.Accounter_List = res[0];
            this.filteredAccounterOptions = of(this.Accounter_List);
            this.tblShamelAccounterService.List_TBLShamelAccounter = this.Accounter_List;
            this.tblShamelAccounterService.List_TBLShamelAccounter_BehaviorSubject.next(this.Accounter_List);
            
            this.payrolSlice_List = res[1];
            this.filteredPayrolSliceOptions = of(this.payrolSlice_List);
            this.tblshamelPayrolSliceService.List_payrolSlice = this.payrolSlice_List;
            this.tblshamelPayrolSliceService.List_payrolSlice_BehaviorSubject.next(this.payrolSlice_List);
    
            this.List_TBLShamelMonth = res[2];
            this.List_TBLShamelMonth_Filter = of(res[2]);
            this.ShamelMonthService.List_TBLShamelMonth = this.List_TBLShamelMonth;
            this.ShamelMonthService.List_TBLShamelMonth_BehaviorSubject.next(this.List_TBLShamelMonth);
      
      
            this.List_TBLShamelYear = res[3];
            this.List_TBLShamelYear_Filter = of(res[3]);
            this.tblShamelYearService.List_TBLShamelYear = this.List_TBLShamelYear;
            this.tblShamelYearService.List_TBLShamelYear_BehaviorSubject.next(this.List_TBLShamelYear);
            this.Init_AutoComplete();
            this.LoadingFinish = true;

        }
        
        )
      }

      Load_TBLAccounter(){
        if (this.tblShamelAccounterService.List_TBLShamelAccounter == null ||
          this.tblShamelAccounterService.List_TBLShamelAccounter == undefined ||
          this.tblShamelAccounterService.List_TBLShamelAccounter.length == 0)
          return this.tblShamelAccounterService.list();
        return of(this.tblShamelAccounterService.List_TBLShamelAccounter);
      }

      Load_PayrolSlice(){
        if (this.tblshamelPayrolSliceService.List_payrolSlice == null ||
          this.tblshamelPayrolSliceService.List_payrolSlice == undefined ||
          this.tblshamelPayrolSliceService.List_payrolSlice.length == 0)
          return this.tblshamelPayrolSliceService.list();
        return of(this.tblshamelPayrolSliceService.List_payrolSlice);
      }

      LoadMonth(): Observable<TBLShamelMonth[]> {
        if (this.ShamelMonthService.List_TBLShamelMonth != null ||
          this.ShamelMonthService.List_TBLShamelMonth != undefined ||
          this.ShamelMonthService.List_TBLShamelMonth.length == 0)
          return this.ShamelMonthService.list();
    
        return of(this.ShamelMonthService.List_TBLShamelMonth);
    
      }
      LoadYear(): Observable<TBLShamelYear[]> {
        if (this.tblShamelYearService.List_TBLShamelYear != null ||
          this.tblShamelYearService.List_TBLShamelYear != undefined ||
          this.tblShamelYearService.List_TBLShamelYear.length == 0)
          return this.tblShamelYearService.list();
        return of(this.tblShamelYearService.List_TBLShamelYear);
    
      }

      public async Init_AutoComplete() {
        try {
          this.filteredAccounterOptions = this.Accounter.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterAccounterName(value) : this.Accounter_List.slice())
          );

          this.filteredPayrolSliceOptions = this.payrolSlice.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterPayrolSlice(value) : this.payrolSlice_List.slice())
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
        } catch (Exception: any) { }
      }

      private _filterAccounterName(value: string): ITBLShamelAccounter[] {
        const filterValue = value.toLowerCase();
    
        return this.Accounter_List.filter(option => option.accounter_name.toLowerCase().includes(filterValue));
      }
      
      private _filterPayrolSlice(value: string): TblShamelPayrolSlice[] {
        const filterValue = value.toLowerCase();
    
        return this.payrolSlice_List.filter(option => option.slice_name.toLowerCase().includes(filterValue));
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
      

      public displayAccounterNameProperty(value: string): string {
        if (value && this.Accounter_List) {
          let cer: any = this.Accounter_List.find(cer => cer.accounter_id.toString() == value);
          if (cer)
            return cer.accounter_name;
        }
        return '';
      }

      public displayPayrolSlice(value: string): string {
        if (value && this.payrolSlice_List) {
          let cer: any = this.payrolSlice_List.find(cer => cer.slice_id.toString() == value);
          if (cer)
            return cer.slice_name;
        }
        return '';
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

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
    this.tblShamelYearService.GetYearFixed().subscribe(
      res => {
        this.fixedYear = res.year_name;

        this.year_id_last.setValue(res.year_id);
        this.year_id_first.setValue(res.year_id);
      }
    );

    this.ShamelMonthService.GetMonthFixed().subscribe(
      res => {
        this.fixedMonth = res;

        this.month_id_last.setValue(res.month_id);
        this.month_id_first.setValue(res.month_id);

      }
    );

    



  }

  clearDataSource(){
    this.allData= [];
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
      "year_id_start": this.year_id_first.value,
      "year_id_end": this.year_id_last.value,
      "month_id_first": this.month_id_first.value,
      "month_id_last": this.month_id_last.value,
      "month_count": this.monthCount.value,
      "month_naturk_work_tawid_count": this.monthNaturekWorkTawidCount.value,
      "accounter_name": this.displayAccounterNameProperty(this.Accounter.value),
      "accounter_id": this.Accounter.value,
      "tblShamelPayrolSlice": {
        "slice_id": this.payrolSlice.value,
        "slice_name": this.displayPayrolSlice(this.payrolSlice.value),
        "slice_from": this.payrolSlice_List.filter(item => item.slice_id== +this.payrolSlice.value)[0].slice_from,
        "slice_to": this.payrolSlice_List.filter(item => item.slice_id== +this.payrolSlice.value)[0].slice_to
      },
      'page_size': this.pageSize,            
      'page_index': this.currentPage,
    };
    this.tblShamelNewShatebService.newPayrolDifference(request).subscribe(
      (res: any) =>{
        this.dataSource.paginator= this.paginator;
        this.allData.push(...res.Item1);
        this.dataSource.data = this.allData;
        this.totalRows= res.Item2;
        this.dataSource._updatePaginator(this.totalRows);
      }
    );
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }
}
