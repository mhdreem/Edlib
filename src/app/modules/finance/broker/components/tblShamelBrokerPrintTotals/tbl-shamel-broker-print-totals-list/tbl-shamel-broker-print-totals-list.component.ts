import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { forkJoin, map, Observable, of, startWith } from 'rxjs';
import { TBLShamelArea } from 'src/app/modules/shared/models/employees_department/TBLShamelArea';
import { TblShamelBrokerPrintTotals } from 'src/app/modules/shared/models/finance_department/broker/TblShamelBrokerPrintTotals';
import { TBLShamelAreaService } from 'src/app/modules/shared/services/employees_department/tblshamel-area.service';
import { TblShamelBrokerShatebService } from 'src/app/modules/shared/services/finance_department/broker/tbl-shamel-broker-shateb.service';
import { ExportToCsv } from 'export-to-csv';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-tbl-shamel-broker-print-totals-list',
  templateUrl: './tbl-shamel-broker-print-totals-list.component.html',
  styleUrls: ['./tbl-shamel-broker-print-totals-list.component.scss']
})
export class TblShamelBrokerPrintTotalsListComponent implements OnInit {

  formname:string = 'احصائيات';
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  LoadingFinish : boolean;

  rowClicked: number;

  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }
  
  // pageIndex: number = 1;
  // rowInPage = 100;

  Form: FormGroup;
  broker_print_totals_List: any[] = [];

  dataSource = new MatTableDataSource<TblShamelBrokerPrintTotals>(this.broker_print_totals_List);


  List_AREA: TBLShamelArea[] = [];
  List_AREA_Filter: Observable<TBLShamelArea[]> = of([]);

  displayedColumns: string[] = ['area_name', 'fullname', 'daycount', 'totaldaycount'];
  
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
  }
  
  isLoading: boolean= false;
  darkTheme: boolean;


  constructor(private frmBuilder : FormBuilder,
    private tblShamelAreaService: TBLShamelAreaService,
    private tblShamelBrokerShatebService: TblShamelBrokerShatebService,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService) { 

      this.dataSource = new MatTableDataSource<TblShamelBrokerPrintTotals>(this.broker_print_totals_List);

      this.Form = this. frmBuilder.group({
        area_name: new FormControl<string|undefined|null>(null),
        startdateDay: new FormControl<number|undefined|null>(null),
      startdateMonth: new FormControl<number|undefined|null>(null),
      startdateYear: new FormControl<number|undefined|null>(null),
      enddateDay: new FormControl<number|undefined|null>(null),
      enddateMonth: new FormControl<number|undefined|null>(null),
      enddateYear: new FormControl<number|undefined|null>(null)
      });
      this.LoadingFinish = true;
  
      this.LoadData();
    }

    Load_Area() : Observable<TBLShamelArea[]>
{
  if (this.tblShamelAreaService.List_TBLShamelArea == null ||
    this.tblShamelAreaService.List_TBLShamelArea == undefined ||
    this.tblShamelAreaService.List_TBLShamelArea .length == 0)
    return this.tblShamelAreaService.list();

    return of (this.tblShamelAreaService.List_TBLShamelArea );
}

LoadData() {
  this.LoadingFinish = false;

  forkJoin(
    [this.Load_Area()]
  ).subscribe(res => {
    this.List_AREA = res[0];
    this.List_AREA_Filter = of(res[0]);

  
    if (this.Form != null) {

      this.List_AREA_Filter = this.Form.controls['area_name'].valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._Filtered_AREA(value) : this.List_AREA.slice())
        );


       
    }


  },
    (error) => console.log(error));
    this.LoadingFinish = true;

}

private _Filtered_AREA(value: string): TBLShamelArea[] {
  if (value != null && this.List_AREA!= null && this.List_AREA.length>0) {
    const filterValue = value;
    return this.List_AREA.filter(obj => obj.Area_Name.includes(filterValue));
  }
  return this.List_AREA.slice();
}

public displayAreaProperty(value: string): string {
  if (value!= null  && this.List_AREA!= null ) {
    let tBLShameArea: any = this.List_AREA.find(crs => crs.Area_ID== +value);
    if (tBLShameArea!= null)
      return tBLShameArea.Area_Name;
  }
  return '';
}

OnSearch()
  {
    this.isLoading= true;

    if(this.Form.controls['startdateDay'].value == null || this.Form.controls['startdateMonth'].value == null || this.Form.controls['startdateYear'].value == null || this.Form.controls['enddateDay'].value == null || this.Form.controls['enddateMonth'].value == null || this.Form.controls['enddateYear'].value == null){
    this.snackBar.open('الرجاء إدخال التواريخ', '', {
      duration: 3000,
      panelClass: ['red-snackbar']
    });
    this.isLoading= false;
    return;
  }
    // this.pageIndex =1;
    this.broker_print_totals_List = [];
    this.dataSource.data = this.broker_print_totals_List;
    this.FillTable();
  }

  public async FillTable() {


    try {

      console.log(this.Form.value);
      // call Search
      this.tblShamelBrokerShatebService.statistics({
        area_name: this.Form.controls['area_name'].value,
        start_date: moment(this.Form.controls['startdateMonth'].value+'/'+this.Form.controls['startdateDay'].value+'/'+this.Form.controls['startdateYear'].value).set({hour: 4}).toDate(),
        end_date: moment(this.Form.controls['enddateMonth'].value+'/'+this.Form.controls['enddateDay'].value+'/'+this.Form.controls['enddateYear'].value).set({hour: 4}).toDate()
      }).subscribe(
        (data: TblShamelBrokerPrintTotals[] )=> {

         console.log('data1', data);
          // if Success 
          if (data != null && data .length >0) {
            this.broker_print_totals_List = this.broker_print_totals_List.concat(data);
          }
          this.dataSource.data = this.broker_print_totals_List;
          this.isLoading= false;

          this.broker_print_totals_List.forEach((datum, index) =>{
            this.excelData[index]= {
                                    'المنطقة': datum?.area_name,
                                    'اسم الوكيل': datum?.fullname,
                                    'أيام الخدمة': datum?.daycount,
                                    'مجموع أيام الخدمة': datum?.totaldaycount,
                                    }; 
  
          });

        }
      )

    } catch (ex: any) { }


  }

  // onScroll() {

  //   this.pageIndex = this.pageIndex + 1;

  //   this.overtime_print_totals_List = []; 

  //   this.FillTable();
  // }

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
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
