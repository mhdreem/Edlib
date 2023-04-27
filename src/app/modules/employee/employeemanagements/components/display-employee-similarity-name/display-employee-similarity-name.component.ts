import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeServiceService } from 'src/app/modules/shared/services/employees_department/employee-service.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { map, startWith, switchMap } from 'rxjs/operators';

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

  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: boolean= false;

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
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(()=>{
          this.pageSize = this.paginator.pageSize;
          this.currentPage = this.paginator.pageIndex + 1;
          return this.view();
        })
      )
      .subscribe((data) => {
        var array = new Array(data.Item2);
        array.splice((this.currentPage-1)*this.pageSize, this.pageSize,...data.Item1);
        this.dataSource.data = array;
        this.isLoading= false;

      });
  }

  onViewClick(){
    this.currentPage=1;
    this.pageSize=5;
    this.view().subscribe(data=>{
      var array = new Array(data.Item2);
      array.splice((this.currentPage-1)*this.pageSize, this.pageSize,...data.Item1);
      this.dataSource.data = array;
      this.isLoading= false;
    });
  }

  view(){
    this.isLoading= true;
    return this.employeeServiceService.Display_Employee_Similarity_Name(this.currentPage, this.pageSize);
  }

  rowClicked: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }
}
