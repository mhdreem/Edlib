import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TBLShamelMonth } from 'src/app/modules/shared/models/employees_department/TBLShamelMonth';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TBLShamelNewShatebService } from 'src/app/modules/shared/services/finance_department/payrol/tblshamel-new-shateb.service';

@Component({
  selector: 'app-stopped-salaries',
  templateUrl: './stopped-salaries.component.html',
  styleUrls: ['./stopped-salaries.component.scss']
})
export class StoppedSalariesComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
  constructor(private tblShamelYearService: TBLShamelYearService,
    public ShamelMonthService: TBLShamelMonthService,
    private tblShamelNewShatebService: TBLShamelNewShatebService) { }

  ngAfterViewInit() {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
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

  View(){
    let request= {
      "year_id": this.fixedYear,
      "month_id": this.fixedMonth.month_id,
      'pagesize': this.pageSize,            
      'pagenumber': this.currentPage,
    };
    this.tblShamelNewShatebService.stoppedSalaries(request).subscribe((res: any) =>{
      this.dataSource.paginator= this.paginator;
      this.allData.push(...res.Item1);
      this.dataSource.data = this.allData;
      this.totalRows= res.Item2;
      this.dataSource._updatePaginator(this.totalRows);
    });
  }

  clearDataSource(){
    this.allData= [];
  }
}
