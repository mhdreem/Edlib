import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { forkJoin, map, Observable, of, startWith, switchMap } from 'rxjs';
import { TBLShamelSex } from 'src/app/modules/shared/models/employees_department/TBLShamelSex';
import { TblShamelBrokerEmployee } from 'src/app/modules/shared/models/finance_department/broker/TblShamelBrokerEmployee';
import { TBLShamelSexService } from 'src/app/modules/shared/services/employees_department/tblshamel-sex.service';
import { TblShamelBrokerEmployeeService } from 'src/app/modules/shared/services/finance_department/broker/tbl-shamel-broker-employee.service';
import { ConfirmationDialogComponent } from '../../common/confirmation-dialog/confirmation-dialog.component';
import { TblshamelBrokerEmployeeModifyComponent } from '../tblshamel-broker-employee-modify/tblshamel-broker-employee-modify.component';
import { ExportToCsv } from 'export-to-csv';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-tblshamel-broker-employee-list',
  templateUrl: './tblshamel-broker-employee-list.component.html',
  styleUrls: ['./tblshamel-broker-employee-list.component.scss']
})
export class TblshamelBrokerEmployeeListComponent implements OnInit, AfterViewInit {
  formname:string = 'ذاتية الوكلاء';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<TblShamelBrokerEmployee>;
  
  LoadingFinish : boolean;

  rowClicked: number;

  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }
  
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean= false;
  Form: FormGroup;

  List_SEX_NAME: TBLShamelSex[] = [];
  List_SEX_NAME_Filter: Observable<TBLShamelSex[]> = of([]);

  broker_employee_List: TblShamelBrokerEmployee[] = [];
  selected_broker_employee: TblShamelBrokerEmployee;

  displayedColumns: string[] = ['serial', 'fname', 'lname', 'father', 'mother', 'birthdate',
    'sexname', 'servicedayes', 'action'];

  //Data Source For MatTable
  dataSource = new MatTableDataSource<TblShamelBrokerEmployee>(this.broker_employee_List);

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
        this.dataSource.data = array;
        this.isLoading= false;
      });
  }

darkTheme: boolean;

  constructor(public tblShamelBrokerEmployeeService: TblShamelBrokerEmployeeService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _liveAnnouncer: LiveAnnouncer,
    private frmBuilder : FormBuilder,
    private tblShamelSexService: TBLShamelSexService,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService) { 

      this.dataSource = new MatTableDataSource<TblShamelBrokerEmployee>(this.broker_employee_List);
      this.LoadingFinish = true;


      this.Form = this. frmBuilder.group({
        serial: new FormControl<number|undefined|null>(null),
        fname: new FormControl<string|undefined|null>(null),
        lname: new FormControl<string|undefined|null>(null),
        father: new FormControl<string|undefined|null>(null),
        mother: new FormControl<string|undefined|null>(null),
        sex_name: new FormControl<string|undefined|null>(null),
        servicedayes: new FormControl<number|undefined|null>(null),     
        servicedayes_operator: new FormControl<string|undefined|null>(null),
        fullname: new FormControl<string|undefined|null>(null),
        birthdateDay: new FormControl<number|undefined|null>(null),
        birthdateMonth: new FormControl<number|undefined|null>(null),
        birthdateYear: new FormControl<number|undefined|null>(null)
      });

      this.LoadData();

      this.selected_broker_employee = {
        serial: 0,
        fname: '',
        lname: '',
        father: '',
        mother: '',
        birthdate: moment("01- 01-2022", 'MM-DD-YYYY').set({hour: 4}).toDate(),
        sex_name: '',
        servicedayes: 0,
      };
    }

    Load_Sex() : Observable<TBLShamelSex[]>
{
  if (this.tblShamelSexService.List_TBLShamelSex == null ||
    this.tblShamelSexService.List_TBLShamelSex == undefined ||
    this.tblShamelSexService.List_TBLShamelSex .length == 0)
    return this.tblShamelSexService.list();

    return of (this.tblShamelSexService.List_TBLShamelSex );
}

LoadData() {
  this.LoadingFinish = false;

  forkJoin(
    [this.Load_Sex()]
  ).subscribe(res => {
    this.List_SEX_NAME = res[0];
    this.List_SEX_NAME_Filter = of(res[0]);

  
    if (this.Form != null) {

      this.List_SEX_NAME_Filter = this.Form.controls['sex_name'].valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._Filtered_SEX_NAME(value) : this.List_SEX_NAME.slice())
        );


       
    }


  },
    (error) => console.log(error));
    this.LoadingFinish = true;

}

private _Filtered_SEX_NAME(value: string): TBLShamelSex[] {
  if (value != null && this.List_SEX_NAME!= null && this.List_SEX_NAME.length>0) {
    const filterValue = value;
    return this.List_SEX_NAME.filter(obj => obj.Sex_Name.includes(filterValue));
  }
  return this.List_SEX_NAME.slice();
}

public displaySexNameProperty(value: string): string {
  if (value!= null  && this.List_SEX_NAME!= null ) {
    let tBLShameSex: any = this.List_SEX_NAME.find(crs => crs.Sex_Name== value);
    if (tBLShameSex!= null)
      return tBLShameSex.Sex_Name;
  }
  return '';
}

public FillTable() {
  this.isLoading= true;

console.log('this.currentPage', this.currentPage);

    console.log(this.Form.value);
    // call Search
    return this.tblShamelBrokerEmployeeService.Search({
      "serial": this.Form.controls['serial'].value,
      "fname": this.Form.controls['fname'].value,
      "lname": this.Form.controls['lname'].value,
      "father": this.Form.controls['father'].value,
      "mother": this.Form.controls['mother'].value,
      "birthdate": moment(this.Form.controls['birthdateMonth'].value+'/'+this.Form.controls['birthdateDay'].value+'/'+this.Form.controls['birthdateYear'].value).set({hour: 4}).toDate(),
      "sex_name": this.Form.controls['sex_name'].value,
      "servicedayes": this.Form.controls['servicedayes'].value,
      "servicedayes_operator": this.Form.controls['servicedayes_operator'].value,
      "pagesize": this.pageSize,
      "pagenumber": this.currentPage
    });

          // this.allData.forEach((datum, index) =>{
          //   this.excelData[index]= {
          //                           'التسلسل': datum?.serial,
          //                           'الأسم': datum?.fname,
          //                           'الكنية': datum?.lname,
          //                           'الأب': datum?.father,
          //                           'الأم': datum?.mother,
          //                           'تاريخ الولادة': datum?.birthdate,
          //                           'الجنس': datum?.sexname,
          //                           'أيام الخدمة': datum?.servicedayes,
          //                           }; 
  
          // });

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

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }


  Add(name: string): void {
    // Init selected_overtime_employee
    this.selected_broker_employee = {
      serial: 0,
      fname: '',
      lname: '',
      father: '',
      mother: '',
      birthdate: moment("01- 01-2022", 'MM-DD-YYYY').set({hour: 4}).toDate(),
      sex_name: '',
      servicedayes: 0,
    };

    const dialogRef = this.dialog.open(TblshamelBrokerEmployeeModifyComponent, {
      height: '40%',
      width: '60%',
      data: { obj: this.selected_broker_employee, source: "add" }
    });

    dialogRef.afterClosed().toPromise().then(result => {
      console.log(result);
      if (result) {
        this.OnSearch();
        
      }
    });
  }


  async Delete(element: TblShamelBrokerEmployee) {
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
            this.tblShamelBrokerEmployeeService.delete(element?.serial).subscribe
              (
                data => {
                  this.OnSearch();
                }

              )




          this.dataSource.paginator = this.paginator;
          this.snackBar.open('تم الحذف', '', {
            duration: 2000,
            panelClass: ['green-snackbar']
          });



        }
      });
    } catch (ex: any) {

    }

  }


  async Update(element: TblShamelBrokerEmployee) {
    if (element) {
      this.selected_broker_employee = element;

      const dialogRef = this.dialog.open(TblshamelBrokerEmployeeModifyComponent, {
        height: '40%',
        width: '60%',
        data: { obj: this.selected_broker_employee , source: "edit"}
      });

      dialogRef.afterClosed().toPromise().then(result => {
        this.OnSearch();

        if (result){
          
        }
          
      });

    }


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
