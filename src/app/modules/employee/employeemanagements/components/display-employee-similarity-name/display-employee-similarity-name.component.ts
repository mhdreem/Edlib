import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeServiceService } from 'src/app/modules/shared/services/employees_department/employee-service.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-display-employee-similarity-name',
  templateUrl: './display-employee-similarity-name.component.html',
  styleUrls: ['./display-employee-similarity-name.component.scss']
})
export class DisplayEmployeeSimilarityNameComponent implements OnInit {
  formname:string = 'عرض تشابه الأسماء';

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['ID', 'FNAME', 'LNAME', 'FATHER', 'MOTHER', 'BIRTHDATE' ];

  dataSource: MatTableDataSource<any>;

  totalRows = 0;
  pageSize = 5;
  currentPage = 1;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  allData: any[]= [];

  pageChanged(event: PageEvent) {
    
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.view();
  }

  darkTheme: boolean;

  constructor(private employeeServiceService: EmployeeServiceService,
    private themeService: ThemeService) {
    this.dataSource = new MatTableDataSource([]);
   }

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  view(){
    this.employeeServiceService.Display_Employee_Similarity_Name(this.currentPage, this.pageSize).subscribe(
      data =>{
        this.dataSource.paginator= this.paginator;
        this.allData.push(...data.Item1);
        this.dataSource.data = this.allData;
        this.totalRows= data.Item2;
        this.dataSource._updatePaginator(this.totalRows);
      }
    )
  }

  rowClicked: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }
}
