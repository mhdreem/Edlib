import { AfterViewInit,Component, Inject, OnInit , ViewChild } from '@angular/core';
import { debounceTime, finalize, forkJoin, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { TBLShamelShatebPunishment } from 'src/app/modules/shared/models/finance_department/shatebtax/TBLShamelShatebPunishment';
import { TBLShamelShatebPunishmentRequest } from 'src/app/modules/shared/models/finance_department/shatebtax/TBLShamelShatebPunishmentRequest';
import { AccounterService } from 'src/app/modules/shared/services/employees_department/accounter.service';
import { TBLShamelShatebPunishmentService } from 'src/app/modules/shared/services/finance_department/shatebtax/tblshamel-shateb-punishment.service';
import { PunishmentDeleteDialogComponent } from '../punishment-delete-dialog/punishment-delete-dialog.component';
import { PunishmentEditDialogComponent } from '../punishment-edit-dialog/punishment-edit-dialog.component';
import { ITBLShamelDocumentType } from 'src/app/modules/shared/models/employees_department/ITBLShamelDocumentType';
import { TBLShamelMonth } from 'src/app/modules/shared/models/employees_department/TBLShamelMonth';
import { TBLShamelYear } from 'src/app/modules/shared/models/employees_department/TBLShamelYear';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TblshameldocumenttypeService } from 'src/app/modules/shared/services/employees_department/tblshameldocumenttype.service';
import { ViewTBLShamelEmployeeService } from 'src/app/modules/shared/services/employees_department/view-tbl-shamel-employee.service';
import { TBLShamelNewShatebService } from 'src/app/modules/shared/services/finance_department/payrol/tblshamel-new-shateb.service';
import { ITBLShamelAccounter } from 'src/app/modules/shared/models/employees_department/TBLShamelAccounter';
import { ViewTBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/ViewTBLSamelEmployee';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-punishment',
  templateUrl: './punishment.component.html',
  styleUrls: ['./punishment.component.scss']
})
export class PunishmentComponent implements OnInit {
  formname:string = 'عقوبات';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  dataSource = new MatTableDataSource<TBLShamelShatebPunishment>();
  displayedColumns: string[] = [
    'id','payrol_ID','fullName','percent','duration','documenttype_id', 'documentnum', 'documentdate', 'salary','amount', 'month_id','year_id', 'edit', 'delete'];

    totalRows = 0;
    pageSize = 5;
    currentPage = 1;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    allData: any[]= [];
  
    pageChanged(event: PageEvent) {
      console.log('event', event);
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex;
      this.Search();
    }

  LoadingFinish : boolean;

    List_DocumentType: ITBLShamelDocumentType[] = [];
    List_DocumentType_Filter: Observable<ITBLShamelDocumentType[]> = of([]);
  
    List_Employee: ViewTBLShamelEmployee[] = [];
    List_Employee_Filter: Observable<ViewTBLShamelEmployee[]> = of([]);
  
  
    List_Accounter: ITBLShamelAccounter[] = [];
    List_Accounter_Filter: Observable<ITBLShamelAccounter[]> = of([]);
  
    Fixed_Month: TBLShamelMonth;
    Fixed_Year: TBLShamelYear;
  
    List_TBLShamelShatebPunishment : TBLShamelShatebPunishment[];


    Form : FormGroup;


    request: TBLShamelShatebPunishmentRequest ;

    darkTheme: boolean;
  
  constructor(
    public dialog: MatDialog,
    private ShamelShatebPunishmentService: TBLShamelShatebPunishmentService,
    private ShamelAccounterService: AccounterService,
    public frmBuild: FormBuilder,
    public viewTBLShamelEmployeeService: ViewTBLShamelEmployeeService,
    public shameldocumenttypeService: TblshameldocumenttypeService,   
    public ShamelMonthService: TBLShamelMonthService,
    public ShamelYearService: TBLShamelYearService,
    private _snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService) 
  { 
    this.LoadingFinish = true;

    this.BuilForm();

    this.LoadData();
  }
BuilForm()
{
  this.Form = this.frmBuild.group({
    pageindex:new FormControl<number | undefined|null>(undefined),
    rowinpage: new FormControl<number | undefined|null>(undefined),
    serial: new FormControl<number | undefined|null>(undefined),

    id: new FormControl<number | undefined|null>(undefined),
    percent: new FormControl<number | undefined|null>(undefined),
    duration: new FormControl<number | undefined|null>(undefined),
    documenttype_id: new FormControl<string | undefined|null>(undefined),
    documentnum: new FormControl<string| undefined|null>(undefined),
    documentdate_From_Day: new FormControl<number | undefined|null>(undefined),
    documentdate_From_Month: new FormControl<number | undefined|null>(undefined),
    documentdate_From_Year: new FormControl<number | undefined|null>(undefined),
    documentdate_To_Day: new FormControl<number | undefined|null>(undefined),
    documentdate_To_Month: new FormControl<number | undefined|null>(undefined),
    documentdate_To_Year: new FormControl<number | undefined|null>(undefined),
    salary: new FormControl<number | undefined|null>(undefined),
    amount: new FormControl<number | undefined|null>(undefined),
    eisalnum: new FormControl<string | undefined|null>(undefined),
    eisaldate_From_Day: new FormControl<number | undefined|null>(undefined),
    eisaldate_From_Month: new FormControl<number | undefined|null>(undefined),
    eisaldate_From_Year: new FormControl<number | undefined|null>(undefined),
    eisaldate_To_Day: new FormControl<number | undefined|null>(undefined),
    eisaldate_To_Month: new FormControl<number | undefined|null>(undefined),
    eisaldate_To_Year: new FormControl<number | undefined|null>(undefined),
    year_id: new FormControl<number | undefined|null>(undefined),
    month_id: new FormControl<number | undefined|null>(undefined),
    fullname: new FormControl<string| undefined|null>(undefined),
    fname: new FormControl<string| undefined|null>(undefined),
    lname: new FormControl<string| undefined|null>(undefined),
    father: new FormControl<string | undefined|null>(undefined),
    mother: new FormControl<string| undefined|null>(undefined),
    tax_status: new FormControl<number | undefined|null>(undefined),
    accounter_id:new FormControl<number | undefined|null>(undefined),


   
  });
}
  LoadAccounter(): Observable<ITBLShamelAccounter[]> {
    if (this.ShamelAccounterService.List_TblShamelAccounterService == null ||
      this.ShamelAccounterService.List_TblShamelAccounterService == undefined ||
      this.ShamelAccounterService.List_TblShamelAccounterService.length == 0)
      return this.ShamelAccounterService.list();
    return of(this.ShamelAccounterService.List_TblShamelAccounterService);
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

  LoadData() {
  this.LoadingFinish = false;

    forkJoin(
      [this.LoadDocument(),
      this.LoadMonth(),
      this.LoadYear(),
      this.LoadAccounter()

      ]
    ).subscribe(res => {

     


      this.shameldocumenttypeService.List_ITBLShamelDocumentType = res[0];
      this.shameldocumenttypeService.List_ITBLShamelDocumentType_BehaviorSubject.next(res[0]);
      this.List_DocumentType = res[0];
      this.List_DocumentType_Filter = of(res[0]);


      this.Fixed_Month = res[1];
      this.Fixed_Year = res[2];


      this.ShamelAccounterService.List_TblShamelAccounterService = res[3];
      this.ShamelAccounterService.List_TblShamelAccounterServicet_BehaviorSubject.next(res[3]);
      this.List_Accounter = res[3];
      this.List_Accounter_Filter = of(res[3]);


      if (this.Form != null) {




        this.Form.controls['fullname']
          .valueChanges
          .pipe(
            debounceTime(300),
            tap(() => {}),
            switchMap((value: string) => this.viewTBLShamelEmployeeService.getEmpFullName2(value)
              .pipe(
                finalize(() => {}),
              )
            )
          )
          .subscribe(emps => {
            if (emps != null && emps.length > 0
            ) {
              this.List_Employee = emps;
              this.List_Employee_Filter = of(emps);
              console.log(emps);
            }
          });


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

          
      }


    },
      (error) => console.log(error));
      this.LoadingFinish = true;

  }

  displayFn(emp: ViewTBLShamelEmployee) {
    if (emp != null && emp.id > 0) {

      return emp.fullname;
    }
    return '';
  }



  onEmployeeSelected(event: MatAutocompleteSelectedEvent) {
    if (event.option.value == null)
      return;
    var emp = event.option.value;

    const id = emp.id;

    this.Form.controls['id'].setValue(id);

    if (id != null && id > 0) {
      this.Form.controls['id'].setValue(id);
    }

  }

  private _filteredDocumentType(value: string): ITBLShamelDocumentType[] {
    if (value) {
      const filterValue = value;
      return this.List_DocumentType.filter(obj => obj.documenttype_name.includes(filterValue));

    }
    return this.List_DocumentType.slice();
  }

  private _filteredAccounter(value: string): ITBLShamelAccounter[] {
    if (value) {
      const filterValue = value;
      return this.List_Accounter.filter(obj => obj.accounter_name.includes(filterValue));

    }
    return this.List_Accounter.slice();
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

  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.Search();  
  }
  Search(){
   
    this.ShamelShatebPunishmentService.list({
      'rowInPage': this.pageSize,
      'pageIndex': this.currentPage,
      'serial': this.Form.controls['serial'].value,
      'id': this.Form.controls['id'].value,
      'duration': this.Form.controls['duration'].value,
      'documenttype_id': this.Form.controls['documenttype_id'].value,
      'documentnum': this.Form.controls['documentnum'].value,
      'salary': this.Form.controls['salary'].value,
      'amount': this.Form.controls['amount'].value,
      'year_id': this.Form.controls['year_id'].value,
      'month_id': this.Form.controls['month_id'].value,
      'fname': this.Form.controls['fname'].value,
      'lname': this.Form.controls['lname'].value,
      'father': this.Form.controls['father'].value,
      'tax_status': this.Form.controls['tax_status'].value,
      'accounter_id': this.Form.controls['accounter_id'].value,
      'documentdate_From': moment(this.Form.controls['documentdate_From_Month'].value+'/'+this.Form.controls['documentdate_From_Day'].value+'/'+this.Form.controls['documentdate_From_Year'].value).set({hour:4}).toDate(),
      'documentdate_To': moment(this.Form.controls['documentdate_To_Month'].value+'/'+this.Form.controls['documentdate_To_Day'].value+'/'+this.Form.controls['documentdate_To_Year'].value).set({hour: 4}).toDate(),
      'eisaldate_From': moment(this.Form.controls['eisaldate_From_Month'].value+'/'+this.Form.controls['eisaldate_From_Day'].value+'/'+this.Form.controls['eisaldate_From_Year'].value).set({hour: 4}).toDate(),
      'eisaldate_To': moment(this.Form.controls['eisaldate_To_Month'].value+'/'+this.Form.controls['eisaldate_To_Day'].value+'/'+this.Form.controls['eisaldate_To_Year'].value).set({hour: 4}).toDate(),

    }).subscribe(data=>{
      if (data.Item1 != null) {
        console.log('data', data);
        this.dataSource.paginator= this.paginator;
        this.allData.push(...data.Item1);
        this.dataSource.data = this.allData;
        this.totalRows= data.Item2;
        this.dataSource._updatePaginator(this.totalRows);
      }
    });

  }

  editRec(element: TBLShamelShatebPunishment){
    const dialogRef = this.dialog.open(PunishmentEditDialogComponent, {
      width: '800px',
      data: {
        id: element.id,
        salary: element.salary,
        amount: element.amount,
        TBLShamelEmployee: element.TBLShamelEmployee,
        percent: element.percent,
        duration: element.duration,
        documenttype_id: element.documenttype_id,
        documentnum: element.documentnum,
        documentdate: element.documentdate,
        serial: element.serial
      },
    });
    console.log("rrr", element);

    dialogRef.afterClosed().subscribe(result => {
      console.log("result", result);
      if (result)
        this.ShamelShatebPunishmentService.update(result).subscribe((result: any) => 
        {
          console.log('rrr', element.serial);
          if(result.Result == 1) {
            this._snackBar.open("تم التعديل بنجاح","" ,{ duration: 3000 , panelClass: ['green-snackbar']});
            this.currentPage=1;
            this.pageSize=5;
            this.Search();
          }});
    });
  }

  deleteRec(element: TBLShamelShatebPunishmentRequest){
    const dialogRef = this.dialog.open(PunishmentDeleteDialogComponent, {
      width: '350px',
      data: {
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.ShamelShatebPunishmentService.delete(element.serial).subscribe((result: any) => 
        {
          console.log('rrr', element.serial);
          if(result.Result == 1){ 
            this._snackBar.open("تم الحذف بنجاح","" ,{ duration: 3000 , panelClass: ['green-snackbar']});
            this.currentPage=1;
            this.pageSize=5;
            this.Search();
          }});
    });
  }

  insert(){
    const dialogRef = this.dialog.open(PunishmentEditDialogComponent, {
      width: '800px',
      data: {
        
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        console.log('res', result);
        this.ShamelShatebPunishmentService.add(result).subscribe((result) => {
          console.log('ddd', result);
          if(result == 1) {
            this._snackBar.open("تمت الإضافة بنجاح","" ,{ duration: 3000 , panelClass: ['green-snackbar']});
            this.currentPage=1;
            this.pageSize=5;
            this.Search();
          }});
      }
    });
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }
}
