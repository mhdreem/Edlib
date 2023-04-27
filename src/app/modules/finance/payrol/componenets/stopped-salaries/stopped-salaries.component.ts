import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TBLShamelMonth } from 'src/app/modules/shared/models/employees_department/TBLShamelMonth';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TBLShamelNewShatebService } from 'src/app/modules/shared/services/finance_department/payrol/tblshamel-new-shateb.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-stopped-salaries',
  templateUrl: './stopped-salaries.component.html',
  styleUrls: ['./stopped-salaries.component.scss']
})
export class StoppedSalariesComponent implements OnInit, AfterViewInit {
  formname:string = 'الرواتب المتوقفة';

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean= false;

  rowClicked: number;

  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  displayedColumns: string[] = ['id', 'FName', 'LName', 'Father', 'Mother', 'Accounter_Name',
    'AccounterSerial'];

  //Data Source For MatTable
  dataSource = new MatTableDataSource<any>();

  fixedYear: string;
  fixedMonth: TBLShamelMonth;

  darkTheme: boolean;

  constructor(private tblShamelYearService: TBLShamelYearService,
    public ShamelMonthService: TBLShamelMonthService,
    private tblShamelNewShatebService: TBLShamelNewShatebService,
    private themeService: ThemeService) { }

  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(()=>{
          this.pageSize = this.paginator.pageSize;
          this.currentPage = this.paginator.pageIndex + 1;
          return this.View();
        })
      )
      .subscribe((data: any) => {
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
    
    this.tblShamelYearService.GetYearFixed().subscribe(
      res => {
        this.fixedYear = res.year_name;
      }
    );

    this.ShamelMonthService.GetMonthFixed().subscribe(
      res => {
        this.fixedMonth = res;
      }
    );
  }

  onViewClick(){
    this.currentPage=1;
    this.pageSize=5;
    this.View().subscribe((data: any)=>{
      var array = new Array(data.Item2);
      array.splice((this.currentPage-1)*this.pageSize, this.pageSize,...data.Item1);
      this.dataSource.data = array;
      this.isLoading= false;
    });  
  }

  View(){
    this.isLoading= true;

    let request= {
      "year_id": this.fixedYear,
      "month_id": this.fixedMonth.month_id,
      'pagesize': this.pageSize,            
      'pagenumber': this.currentPage,
    };
    return this.tblShamelNewShatebService.stoppedSalaries(request);
  }

  clearDataSource(){
    this.dataSource.data= [];
  }
}
