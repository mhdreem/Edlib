import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, finalize, forkJoin, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import {TBLShamelShatebHealth} from '../../../../../../modules/shared/models/finance_department/shatebtax/TBLShamelShatebHealth';
import {TBLShamelShatebHealthRequest} from '../../../../../../modules/shared/models/finance_department/shatebtax/TBLShamelShatebHealthRequest'


import { AccounterService } from '../../../../../../modules/shared/services/employees_department/accounter.service';
import { TBLShamelShatebHealthService } from '../../../../../../modules/shared/services/finance_department/shatebtax/tblshamel-shateb-health.service';
import { HealthDeleteDialogComponent } from '../health-delete-dialog/health-delete-dialog.component';
import { HealthEditDialogComponent } from '../health-edit-dialog/health-edit-dialog.component';
import { ITBLShamelDocumentType } from '../../../../../../modules/shared/models/employees_department/ITBLShamelDocumentType';
import { ViewTBLShamelEmployee } from '../../../../../../modules/shared/models/employees_department/ViewTBLSamelEmployee';
import { TbLShamelHealthNoSalary } from '../../../../../../modules/shared/models/finance_department/shatebtax/TbLShamelHealthNoSalary';
import { TBLShamelMonthService } from '../../../../../../modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from '../../../../../../modules/shared/services/employees_department/tblshamel-year.service';
import { TblshameldocumenttypeService } from '../../../../../../modules/shared/services/employees_department/tblshameldocumenttype.service';
import { TBLShamelNewShatebService } from '../../../../../../modules/shared/services/finance_department/payrol/tblshamel-new-shateb.service';
import { TbLShamelHealthNoSalaryService } from '../../../../../../modules/shared/services/finance_department/shatebtax/tbl-shamel-health-no-salary.service';
import { ITBLShamelAccounter } from '../../../../../shared/models/employees_department/TBLShamelAccounter';
import { TBLShamelMonth } from '../../../../../../modules/shared/models/employees_department/TBLShamelMonth';
import { TBLShamelYear } from '../../../../../../modules/shared/models/employees_department/TBLShamelYear';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';


@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent implements OnInit, AfterViewInit {
  formname:string = 'بلا أجر \ صحية';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  List_TBLShamelShatebHealth:TBLShamelShatebHealth[] = [];

 
  dataSource = new MatTableDataSource<TBLShamelShatebHealth>();
  displayedColumns: string[] = [
    'id','payrol_id','fullname','healthnosalary_name','duration','startdate','documenttype_id', 'documentnum', 'documentdate', 'salary','amount', 'month_id','year_id', 'edit', 'delete'];

    Form: FormGroup;

    pageSize = 5;
    currentPage = 0;
    pageSizeOptions: number[] = [5, 10, 25, 100];

  LoadingFinish : boolean;


  List_DocumentType: ITBLShamelDocumentType[] = [];
  List_DocumentType_Filter: Observable<ITBLShamelDocumentType[]> = of([]);

  List_HealthNoSalary: TbLShamelHealthNoSalary[] = [];
  List_HealthNoSalary_Filter: Observable<TbLShamelHealthNoSalary[]> = of([]);

  List_Accounter: ITBLShamelAccounter[] = [];
  List_Accounter_Filter: Observable<ITBLShamelAccounter[]> = of([]);


  List_Employee: ViewTBLShamelEmployee[] = [];
  List_Employee_Filter: Observable<ViewTBLShamelEmployee[]> = of([]);

  Fixed_Month:TBLShamelMonth;
  Fixed_Year:TBLShamelYear;
 

  request: TBLShamelShatebHealthRequest ;
  
  darkTheme: boolean;

  isLoading: boolean= false;

  constructor(
    public dialog: MatDialog,
    private healthService: TBLShamelShatebHealthService,
    private frmBuilder : FormBuilder,
    private _snackBar: MatSnackBar,
    public shamelHealthNoSalaryService: TbLShamelHealthNoSalaryService,
    public shameldocumenttypeService: TblshameldocumenttypeService,
    public ShamelNewShatebService: TBLShamelNewShatebService,
    public ShamelMonthService: TBLShamelMonthService,
    public ShamelYearService: TBLShamelYearService,
    private ShamelAccounterService: AccounterService,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService
    ) 
  { 
    this.LoadingFinish = true;
   
    this.Form = this. frmBuilder.group({
      startdate_From_Day: new FormControl(''),
      startdate_From_Month: new FormControl(''),
      startdate_From_Year: new FormControl(''),
      startdate_To_Day: new FormControl(''),
      startdate_To_Month: new FormControl(''),
      startdate_To_Year: new FormControl(''),
      id: new FormControl(''),
      fname: new FormControl(''),
      lname: new FormControl(''),
      father: new FormControl(''),
      documenttype_id:new FormControl(''),
      documentnum: new FormControl(''),
      documentdate_From_Day: new FormControl(''),
      documentdate_From_Month: new FormControl(''),
      documentdate_From_Year: new FormControl(''),
      documentdate_To_Day: new FormControl(''),
      documentdate_To_Month: new FormControl(''),
      documentdate_To_Year: new FormControl(''),
      eisaltnum: new FormControl(''),
      eisaldate_From_Day: new FormControl(''),
      eisaldate_From_Month: new FormControl(''),
      eisaldate_From_Year: new FormControl(''),
      eisaldate_To_Day: new FormControl(''),
      eisaldate_To_Month: new FormControl(''),
      eisaldate_To_Year: new FormControl(''),
      accounter_id: new FormControl(''),
      healthnosalary_name: new FormControl(''),
      tax_status: new FormControl(''),
      pageindex:new FormControl(''),
      rowinpage:new FormControl(''),
  

    });

    this.LoadData();

   

    
  }

  
  LoadDocument(): Observable<ITBLShamelDocumentType[]> {
    if (this.shameldocumenttypeService.List_ITBLShamelDocumentType == null ||
      this.shameldocumenttypeService.List_ITBLShamelDocumentType == undefined ||
      this.shameldocumenttypeService.List_ITBLShamelDocumentType.length == 0)
      return this.shameldocumenttypeService.list();
    return of(this.shameldocumenttypeService.List_ITBLShamelDocumentType);
  }


 

  LoadMonth(): Observable<TBLShamelMonth> {
    return this.ShamelMonthService.GetMonthFixed();

  }


  LoadYear(): Observable<TBLShamelYear> {

    return this.ShamelYearService.GetYearFixed();

  }


  LoadHealthNoSalaray(): Observable<TbLShamelHealthNoSalary[]> {
    if (this.shamelHealthNoSalaryService.List_TbLShamelHealthNoSalary == null ||
      this.shamelHealthNoSalaryService.List_TbLShamelHealthNoSalary == undefined ||
      this.shamelHealthNoSalaryService.List_TbLShamelHealthNoSalary.length == 0)
      return this.shamelHealthNoSalaryService.list();
    return of(this.shamelHealthNoSalaryService.List_TbLShamelHealthNoSalary);
  }

  LoadAccounter(): Observable<ITBLShamelAccounter[]> {
    if (this.ShamelAccounterService.List_TblShamelAccounterService == null ||
      this.ShamelAccounterService.List_TblShamelAccounterService == undefined ||
      this.ShamelAccounterService.List_TblShamelAccounterService.length == 0)
      return this.ShamelAccounterService.list();
    return of(this.ShamelAccounterService.List_TblShamelAccounterService);
  }

  LoadData() {
  this.LoadingFinish = false;

    forkJoin(
      [this.LoadDocument(),
      this.LoadHealthNoSalaray(),
      this.LoadMonth(),
      this.LoadYear(),
      this.LoadAccounter(),



      ]
    ).subscribe(res => {

      this.shameldocumenttypeService.List_ITBLShamelDocumentType = res[0];
      this.shameldocumenttypeService.List_ITBLShamelDocumentType_BehaviorSubject.next(res[0]);
      this.List_DocumentType = res[0];
      this.List_DocumentType_Filter = of(res[0]);

      this.shamelHealthNoSalaryService.List_TbLShamelHealthNoSalary = res[1];
      this.shamelHealthNoSalaryService.List_TbLShamelHealthNoSalary_BehaviorSubject.next(res[1]);
      this.List_HealthNoSalary = res[1];
      this.List_HealthNoSalary_Filter = of(res[1]);


      


      this.Fixed_Month = res[2];
      this.Fixed_Year = res[3];

     
      this.List_Accounter =  res[4];
      this.List_Accounter_Filter = of( res[4]) ;

      this.ShamelAccounterService.List_TblShamelAccounterService = res[4];
      this.ShamelAccounterService.List_TblShamelAccounterServicet_BehaviorSubject .next(res[4]) ;

      if (this.Form!= null)
      {

     


    

    this.List_DocumentType_Filter = this.Form.controls['documenttype_id'].valueChanges
      .pipe(
        startWith(''),
        map(value => value && typeof value === 'string' ? this._filteredDocumentType(value) : this.List_DocumentType.slice())
      );

      this.List_Accounter_Filter = this.Form.controls['accounter_id'].valueChanges
      .pipe(
        startWith(''),
        map(value => value && typeof value === 'string' ? this._filteredAccounter(value) : this.List_Accounter.slice())
      );


    this.List_HealthNoSalary_Filter = this.Form.controls['healthnosalary_name'].valueChanges
      .pipe(
        startWith(''),
        map(value => value && typeof value === 'string' ? this._filteredHealthNoSalary(value) : this.List_HealthNoSalary.slice())
      );
    }

     

    }    , 
    (error) => console.log(error));
    this.LoadingFinish = true;

  }



  private _filteredAccounter(value: string): ITBLShamelAccounter[] {
    if (value) {
      const filterValue = value;
      return this.List_Accounter.filter(obj => obj.accounter_name.includes(filterValue));

    }
    return this.List_Accounter.slice();
  }

  private _filteredDocumentType(value: string): ITBLShamelDocumentType[] {
    if (value) {
      const filterValue = value;
      return this.List_DocumentType.filter(obj => obj.documenttype_name.includes(filterValue));

    }
    return this.List_DocumentType.slice();
  }

 

  onDocumentSelected(event: MatAutocompleteSelectedEvent) {
    if (event.option.value == null || event.option.value.id == null || event.option.value.id <= 0)
      return;

    var document = event.option.value as ITBLShamelDocumentType;

    const id = document.documenttype_id;
    if (id != null) {
      this.Form.controls['documenttype_id'].setValue(id);

    }

  }
  //#region  Display Display Member
  public displayDocumentTypeProperty(value: string): string {
    if (value && this.List_DocumentType) {
      let documentType: any = this.List_DocumentType.find(crs => crs.documenttype_id.toString() == value);
      if (documentType)
        return documentType.documenttype_name;
    }
    return '';
  }

  private _filteredHealthNoSalary(value: string): TbLShamelHealthNoSalary[] {
    if (value) {
      const filterValue = value;
      return this.List_HealthNoSalary.filter(obj => obj.healthnosalary_name.includes(filterValue));

    }
    return this.List_HealthNoSalary.slice();
  }

  DisplayAccounterProperty(value: string)
  {
    if (value && this.List_Accounter) {
      let accounter: any = this.List_Accounter.find(crs => crs.accounter_id.toString() == value);
      if (accounter)
        return accounter.accounter_name;
    }
    return '';
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


  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
   
  }
  btnSearchClick()
  {
    this.currentPage=1;
    this.pageSize=5;
    this.Search().subscribe(data=>{
      var array = new Array(data.Item2);
      array.splice((this.currentPage-1)*this.pageSize, this.pageSize,...data.Item1);
      this.dataSource.data = array;
      this.isLoading= false;
    }); 
  }
  Search(){
    this.isLoading= true;

    return this.healthService.list({
      'pageIndex': this.currentPage,
      'rowInPage': this.pageSize,
      'id': this.Form.controls['id'].value,
      'fname': this.Form.controls['fname'].value,
      'lname': this.Form.controls['lname'].value,
      'father': this.Form.controls['father'].value,
      'documenttype_id': this.Form.controls['documenttype_id'].value,
      'documentnum': this.Form.controls['documentnum'].value,
      'eisalnum': this.Form.controls['eisaltnum'].value,
      'accounter_id': this.Form.controls['accounter_id'].value,
      'healthnosalary_name': this.Form.controls['healthnosalary_name'].value,
      'tax_status': this.Form.controls['tax_status'].value,
      'startdate_From': moment(this.Form.controls['startdate_From_Month'].value+'/'+this.Form.controls['startdate_From_Day'].value+'/'+this.Form.controls['startdate_From_Year'].value).set({hour: 4}).toDate(),
      'startdate_To': moment(this.Form.controls['startdate_To_Month'].value+'/'+this.Form.controls['startdate_To_Day'].value+'/'+this.Form.controls['startdate_To_Year'].value).set({hour: 4}).toDate(),
      'documentdate_From': moment(this.Form.controls['documentdate_From_Month'].value+'/'+this.Form.controls['documentdate_From_Day'].value+'/'+this.Form.controls['documentdate_From_Year'].value).set({hour: 4}).toDate(),
      'documentdate_To': moment(this.Form.controls['documentdate_To_Month'].value+'/'+this.Form.controls['documentdate_To_Day'].value+'/'+this.Form.controls['documentdate_To_Year'].value).set({hour: 4}).toDate(),
      'eisaldate_From': moment(this.Form.controls['eisaldate_From_Month'].value+'/'+this.Form.controls['eisaldate_From_Day'].value+'/'+this.Form.controls['eisaldate_From_Year'].value).set({hour: 4}).toDate(),
      'eisaldate_To': moment(this.Form.controls['eisaldate_To_Month'].value+'/'+this.Form.controls['eisaldate_To_Day'].value+'/'+this.Form.controls['eisaldate_To_Year'].value).set({hour: 4}).toDate(),
    });

  }

  editRec(element: TBLShamelShatebHealth){
    const dialogRef = this.dialog.open(HealthEditDialogComponent, {
      width: '900px',
      position: {top: '40%'},
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("result", result);
      this.currentPage=1;
        this.pageSize=5;
      this.Search();
    });
  }

  deleteRec(element: TBLShamelShatebHealth){
    const dialogRef = this.dialog.open(HealthDeleteDialogComponent, {
      width: '350px',
      
      data: {
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.healthService.delete(element.serial).subscribe(
          (result: any) => {
            if(result.Result == 1) {
              this._snackBar.open("تم الحذف بنجاح","" ,{ duration: 3000 , panelClass: ['green-snackbar']});
              this.currentPage=1;
              this.pageSize=5;
              this.Search();
            }});
    });
  }

  insert(){
    const dialogRef = this.dialog.open(HealthEditDialogComponent, {
      width: '60%',
      height: '65%',
      position: {top: '30%'},
      data: {
        
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.currentPage=1;
        this.pageSize=5;
        this.Search();
      }
      console.log('ccc',result);
    });
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }
}
