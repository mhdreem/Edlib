import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, forkJoin, Observable, of, Subscription } from 'rxjs';
import { ITBLShamelChangeReason } from 'src/app/modules/shared/models/employees_department/ITBLShamelChangeReason';
import { ITBLShamelMalakState } from 'src/app/modules/shared/models/employees_department/ITBLShamelMalakState';
import { Stats4 } from 'src/app/modules/shared/models/employees_department/Stats4';
import { TBLShamelSuddenHoliday } from 'src/app/modules/shared/models/employees_department/TBLShamelSuddenHoliday';
import { EmployeeStatsService } from 'src/app/modules/shared/services/employees_department/employee-stats.service';
import { TBLShamelSuddenHolidayService } from 'src/app/modules/shared/services/employees_department/tblshamel-sudden-holiday.service';
import { TblshamelchangereasonService } from 'src/app/modules/shared/services/employees_department/tblshamelchangereason.service';
import { TblshamelmalakstateService } from 'src/app/modules/shared/services/employees_department/tblshamelmalakstate.service';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort } from '@angular/material/sort';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { ExportToCsv } from 'export-to-csv';


@Component({
  selector: 'app-stats4',
  templateUrl: './stats4.component.html',
  styleUrls: ['./stats4.component.scss']
})
export class stats4 implements OnInit, OnDestroy {
  formname:string = 'احصائيات بين تاريخين';
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // request for post api
  request :Stats4 = {};

  _Subscription: Subscription;

  // form controls
  Form: FormGroup;
  MalakState: FormControl<string | null>;
  SuddenHoliday: FormControl<number | null>;
  ChangeReason: FormControl<number | null>;
  FirstDateDay: FormControl<number | null>;
  FirstDateMonth: FormControl<number | null>;
  FirstDateYear: FormControl<number | null>;
  EndDateDay: FormControl<number | null>;
  EndDateMonth: FormControl<number | null>;
  EndDateYear: FormControl<number | null>;


  // Filtering
  MalakStateList: ITBLShamelMalakState[]= [];
  filteredMalakStateOptions: Observable<ITBLShamelMalakState[]>;

  SuddenHolidayList: TBLShamelSuddenHoliday[]= [];
  filteredSuddenHolidayOptions: Observable<TBLShamelSuddenHoliday[]>;

  ChangeReasonList: ITBLShamelChangeReason[]= [];
  filteredChangeReasonOptions: Observable<ITBLShamelChangeReason[]>;

  
  

  dataSource = new MatTableDataSource<Stats4>();
  displayedColumns: string[] = [
    'file_number', 'computer_number', 'first_name',
    'last_name', 'father', 'mother',
    'category','job_adjective',  'bitrh_date',
    'commencement_date', 'malak_state',
    'document_number', 'document_date', 'document_type'];

  
  //for pagination
  totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  allData: any[]= [];

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.Search();
  }

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

  constructor(private service: EmployeeStatsService,
    private tblshamelmalakstateService:TblshamelmalakstateService,
    private tBLShamelSuddenHolidayService:TBLShamelSuddenHolidayService,
    private tblshamelchangereasonService:TblshamelchangereasonService,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private _liveAnnouncer: LiveAnnouncer,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService) {


      this.BuildForm();
      this.Load_Data();


      





   }

   ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
          'MalakState: ': this.MalakState = new FormControl<string | null>(null, []),
          'SuddenHoliday: : ': this.SuddenHoliday = new FormControl<number | null>(null, []),
          'ChangeReason: ': this.ChangeReason = new FormControl<number | null>(null, []),
          'FirstDateDay: ': this.FirstDateDay = new FormControl<number | null>(null, [Validators.required]),
          'FirstDateMonth: ': this.FirstDateMonth = new FormControl<number | null>(null, [Validators.required]),
          'FirstDateYear: ': this.FirstDateYear = new FormControl<number | null>(null, [Validators.required]),
          'EndDateDay: ': this.EndDateDay = new FormControl<number | null>(null, [Validators.required]),
          'EndDateMonth: ': this.EndDateMonth = new FormControl<number | null>(null, [Validators.required]),
          'EndDateYear: ': this.EndDateYear = new FormControl<number | null>(null, [Validators.required]),
        }
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    
    this._Subscription = forkJoin(
      this.Load_TBLShamelMalakState(),
      this.Load_TBLSHAMELSUDDENHOLIDAY(),
      this.Load_TBLShamelChangeReason()
    ).subscribe(
      res => {
        this.MalakStateList = res[0];
        this.filteredMalakStateOptions = of(this.MalakStateList);
        this.tblshamelmalakstateService.list_ITBLShamelMalakState = this.MalakStateList;
        this.tblshamelmalakstateService.List_ITBLShamelMalakState_BehaviorSubject.next(this.MalakStateList);

        this.SuddenHolidayList = res[1];
        this.filteredSuddenHolidayOptions = of(this.SuddenHolidayList);
        this.tBLShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService = this.SuddenHolidayList;
        this.tBLShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService_BehaviorSubject.next(this.SuddenHolidayList);

        this.ChangeReasonList = res[2];
        this.filteredChangeReasonOptions = of(this.ChangeReasonList);
        this.tblshamelchangereasonService.List_ITBLShamelChangeReason = this.ChangeReasonList;
        this.tblshamelchangereasonService.List_ITBLShamelChangeReason_BehaviorSubject.next(this.ChangeReasonList);
        this.Init_AutoComplete();
      }
      
    )
  }

  Load_TBLShamelMalakState(){
    if (this.tblshamelmalakstateService.list_ITBLShamelMalakState == null ||
      this.tblshamelmalakstateService.list_ITBLShamelMalakState == undefined ||
      this.tblshamelmalakstateService.list_ITBLShamelMalakState.length == 0)
      return this.tblshamelmalakstateService.list();
    return of(this.tblshamelmalakstateService.list_ITBLShamelMalakState);
  }

  Load_TBLSHAMELSUDDENHOLIDAY(){
    if (this.tBLShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService == null ||
      this.tBLShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService == undefined ||
      this.tBLShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService.length == 0)
      return this.tBLShamelSuddenHolidayService.list();
    return of(this.tBLShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService);
  }

  Load_TBLShamelChangeReason(){
    if (this.tblshamelchangereasonService.List_ITBLShamelChangeReason == null ||
      this.tblshamelchangereasonService.List_ITBLShamelChangeReason == undefined ||
      this.tblshamelchangereasonService.List_ITBLShamelChangeReason.length == 0)
      return this.tblshamelchangereasonService.list();
    return of(this.tblshamelchangereasonService.List_ITBLShamelChangeReason);
  }

  public async Init_AutoComplete() {
    try {
      this.filteredMalakStateOptions = this.MalakState.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterMalakState(value) : this.MalakStateList.slice())
        );

      this.filteredSuddenHolidayOptions = this.SuddenHoliday.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterSuddenHoliday(value) : this.SuddenHolidayList.slice())
        );

        this.filteredChangeReasonOptions = this.ChangeReason.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterChangeReason(value) : this.ChangeReasonList.slice())
        );
    } catch (Exception: any) { }
  }

  private _filterMalakState(value: string): ITBLShamelMalakState[] {
    if (value){
      const filterValue = value.toLowerCase();
      return this.MalakStateList.filter(option => option.malakstate_name.toLowerCase().includes(filterValue));
    }
    return this.MalakStateList.slice();
  }

  private _filterSuddenHoliday(value: string): TBLShamelSuddenHoliday[] {
    if (value){
      const filterValue = value.toLowerCase();
      return this.SuddenHolidayList.filter(option => option.suddenholiday_name.toLowerCase().includes(filterValue));
    }
    return this.SuddenHolidayList.slice();
  }

  private _filterChangeReason(value: string): ITBLShamelChangeReason[] {
    if (value){
      const filterValue = value.toLowerCase();
      return this.ChangeReasonList.filter(option => option.changereason_name.toLowerCase().includes(filterValue));
    }
    return this.ChangeReasonList.slice();
  }

  public displayMalakStateProperty(value: string): string {
    if (value && this.MalakStateList) {
      let MalakState: any = this.MalakStateList.find(crs => crs.malakstate_id.toString() == value);
      if (MalakState)
        return MalakState.malakstate_name;
    }
    return '';
  }

  public displaySuddenHolidayProperty(value: string): string {
    if (value && this.SuddenHolidayList) {
      let SuddenHoliday: any = this.SuddenHolidayList.find(crs => crs.suddenholiday_id.toString() == value);
      if (SuddenHoliday)
        return SuddenHoliday.suddenholiday_name;
    }
    return '';
  }

  public displayChangeReasonProperty(value: string): string {
    if (value && this.ChangeReasonList) {
      let ChangeReason: any = this.ChangeReasonList.find(crs => crs.changereason_id.toString() == value);
      if (ChangeReason)
        return ChangeReason.changereason_name;
    }
    return '';
  }


   ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })

    // disable both select at start
    this.SuddenHoliday.disable();
    this.ChangeReason.disable();
    
    
  }

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }

  SearchClicked(){
    this.currentPage=1;
    this.pageSize=5;
    this.Search();
  }

  Search()
  {
    if (this.FirstDateMonth.value == null || this.FirstDateDay.value == null || this.FirstDateYear.value == null ||
      this.EndDateMonth.value == null || this.EndDateDay.value == null || this.EndDateYear.value == null){
      this.snackBar.open('يجب تحديد تاريخي البداية والنهاية', '', {
        duration: 4000,
        panelClass: ['red-snackbar']
      });
    return;
    }

    this.request= {...this.request,
      malakState_Name: this.MalakState.value,
      first_Date: moment(this.FirstDateMonth.value+'/'+this.FirstDateDay.value+'/'+this.FirstDateYear.value).set({hour: 4}).toDate(),
      end_Date: moment(this.EndDateMonth.value+'/'+this.EndDateDay.value+'/'+this.EndDateYear.value).set({hour: 4}).toDate(),
      pageSize: this.pageSize,            
      pageNumber: this.currentPage};
    this.service.Stats4(this.request).subscribe(
      (res: any)=>{
        this.dataSource.paginator= this.paginator;
        this.allData.push(...res.Item1);
        this.dataSource.data = this.allData;
        this.totalRows= res.Item2;
        this.dataSource._updatePaginator(this.totalRows);

        this.allData.forEach((data, index) =>{
          this.excelData[index]= {
                                  'رقم الإضبارة': data?.ID,
                                  'رقم الحاسوب': data?.COMPUTER_ID,
                                  'الاسم': data?.FNAME,
                                  'الكنية': data?.LNAME,
                                  'الأب': data?.FATHER,
                                  'الأم': data?.MOTHER,
                                  'الفئة': data?.CLASS_NAME,
                                  'الصفة الوظيفة': data?.JOBNAME_NAME,
                                  'تاريخ الولادة': data?.BIRTHDATE,
                                  'تاريخ المباشرة': data?.STARTDATE,
                                  'الوضع بالملاك': data?.MALAKSTATE_NAME,
                                  'نوع المستند': data?.DOCUMENTTYPE_NAME,
                                  'رقم المستند': data?.DOC_NUMBER, 
                                  'تاريخ المستند': data?.DOC_DATE
                                  }; 

        });
      }
    );
    
  }


  //enable sudden holiday select and disable change reason select
  enableSuddenHoliday(){
    this.ChangeReason.disable();
    this.SuddenHoliday.enable();
  }

  //enable change reason select and disable sudden holiday select
  enableChangeReason(){
    this.ChangeReason.enable();
    this.SuddenHoliday.disable();
  }

  //disable change reason select and sudden holiday select
  desableAllSelects(){
    this.ChangeReason.disable();
    this.SuddenHoliday.disable();

  }

  // add birthdate to the request
  birthdateChecked(){
    this.desableAllSelects();
    this.request= {is_birthdate: true};
  }

  // add first job to the request
  firstJobDateChecked(){
    this.desableAllSelects();
    this.request= {is_FirstJobState: true};
  }

  // add punishment to the request
  punishmentsChecked(){
    this.desableAllSelects();
    this.request= {is_TBLShamelSCPunishment: true};
  }

  // add bonus to the request
  bonusChecked(){
    this.desableAllSelects();
    this.request= {is_TBLShamelSCBonus: true};
  }

  // add free holiday to the request
  freeHolidayChecked(){
    this.desableAllSelects();
    this.request= {is_TBLShamelSCFreeHoliday: true};
  }

  // add legal holiday to the request
  legalHolidayChecked(){
    this.desableAllSelects();
    this.request= {is_TBLShamelSCLegalHoliday: true};
  }

  // add health holiday to the request
  healthHolidayChecked(){
    this.desableAllSelects();
    this.request= {is_TBLShamelSCHealthHoliday: true};
  }

  // add sudden holiday to the request
  suddenHolidayChecked(){
    this.enableSuddenHoliday();
  }

  suddenHolidayChanged(){
    this.request= {is_TBLShamelSCSuddenHoliday: true, suddenholidaY_ID: this.SuddenHoliday.value };
  }

  // add change reason to the request
  changeReasonChecked(){
    this.enableChangeReason();
  }

  changeReasonChanged(){
    this.request= {is_TBLShamelSCJobState: true, changereason_id: this.ChangeReason.value};
  }


  rowClicked: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  clearDataSource(){
    this.allData= [];
  }

  exportToExcel() {
    const csvExporter = new ExportToCsv(this.excelOptions);
   csvExporter.generateCsv(this.excelData);
 }
}
