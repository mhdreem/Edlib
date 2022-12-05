import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeStatsService } from 'src/app/modules/shared/services/employees_department/employee-stats.service';
import { JobServiceDataAdjustPrintDialogComponent } from '../../employeemanagements/components/service-data/job-service-data-adjust-print-dialog/job-service-data-adjust-print-dialog.component';
import { Stats3PrintComponent } from '../print/stats3-print/stats3-print.component';

@Component({
  selector: 'app-stats3',
  templateUrl: './stats3.component.html',
  styleUrls: ['./stats3.component.scss']
})
export class Stats3Component implements OnInit {


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'CLASS_NAME',  'JOBNAME_NAME', 'MALESCOUNT', 'FEMALESCOUNT'
  ];

  //for pagination
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(public EmployeeStatsService :EmployeeStatsService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,) { 
    this.dataSource = new MatTableDataSource<any>([]);
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
  
  ngOnInit(): void {
  }

  Search(){
    this.EmployeeStatsService.Stats3().subscribe
    (
      data=>
      {
        console.log('data1', data);
        if (data!= null ){
          this.dataSource.data = (data as any[]);
          this.fillOutputs(data);
        }
        else 
          this.dataSource.data = [];
      }
    )
  }

  fillOutputs(data: any){
    const malesInClass1 = document.getElementById('malesInClass1');
    const malesInClass2 = document.getElementById('malesInClass2');
    const malesInClass3 = document.getElementById('malesInClass3');
    const malesInClass4 = document.getElementById('malesInClass4');
    const malesInClass5 = document.getElementById('malesInClass5');
    const maleTotal = document.getElementById('maleTotal');

    const femalesInClass1 = document.getElementById('femalesInClass1');
    const femalesInClass2 = document.getElementById('femalesInClass2');
    const femalesInClass3 = document.getElementById('femalesInClass3');
    const femalesInClass4 = document.getElementById('femalesInClass4');
    const femalesInClass5 = document.getElementById('femalesInClass5');
    const femaleTotal = document.getElementById('femaleTotal');

    const totalOfClass1 = document.getElementById('totalOfClass1');
    const totalOfClass2 = document.getElementById('totalOfClass2');
    const totalOfClass3 = document.getElementById('totalOfClass3');
    const totalOfClass4 = document.getElementById('totalOfClass4');
    const totalOfClass5 = document.getElementById('totalOfClass5');
    const Total = document.getElementById('Total');

    let male1 :number = 0;
    let male2 :number = 0;
    let male3 :number = 0;
    let male4 :number = 0;
    let male5 :number = 0;

    let female1 :number = 0;
    let female2 :number = 0;
    let female3 :number = 0;
    let female4 :number = 0;
    let female5 :number = 0;

    data.forEach((element: any) => {
      if (element.CLASS_ID == 1){
        male1+= element.MALESCOUNT;
        female1+= element.FEMALESCOUNT;
      }
      else if (element.CLASS_ID == 2){
        male2+= element.MALESCOUNT;
        female2+= element.FEMALESCOUNT;
      }
      else if (element.CLASS_ID == 2){
        male3+= element.MALESCOUNT;
        female3+= element.FEMALESCOUNT;
      }
      else if (element.CLASS_ID == 2){
        male4+= element.MALESCOUNT;
        female4+= element.FEMALESCOUNT;
      }
      else if (element.CLASS_ID == 2){
        male5+= element.MALESCOUNT;
        female5+= element.FEMALESCOUNT;
      }
    });

    malesInClass1.textContent= male1+'';
    malesInClass2.textContent= male2+'';
    malesInClass3.textContent= male3+'';
    malesInClass4.textContent= male4+'';
    malesInClass5.textContent= male5+'';

    maleTotal.textContent= (male1+ male2+ male3+ male4+ male5)+ '';

    femalesInClass1.textContent= female1+'';
    femalesInClass2.textContent= female2+'';
    femalesInClass3.textContent= female3+'';
    femalesInClass4.textContent= female4+'';
    femalesInClass5.textContent= female5+'';

    femaleTotal.textContent = (female1+ female2+ female3+ female4+ female5)+ '';

    totalOfClass1.textContent= (male1+ female1)+'';
    totalOfClass2.textContent= (male2+ female2)+'';
    totalOfClass3.textContent= (male3+ female3)+'';
    totalOfClass4.textContent= (male4+ female4)+'';
    totalOfClass5.textContent= (male5+ female5)+'';

    Total.textContent= ((male1+ female1)+ (male2+ female2)+ (male3+ female3)+ (male4+ female4)+ (male5+ female5))+ '';
  }

  rowClicked: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  adjustPrintFooter(){
    const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
      width: '1150px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  print(){
    const malesInClass1 = document.getElementById('malesInClass1');
    const malesInClass2 = document.getElementById('malesInClass2');
    const malesInClass3 = document.getElementById('malesInClass3');
    const malesInClass4 = document.getElementById('malesInClass4');
    const malesInClass5 = document.getElementById('malesInClass5');
    const maleTotal = document.getElementById('maleTotal');

    const femalesInClass1 = document.getElementById('femalesInClass1');
    const femalesInClass2 = document.getElementById('femalesInClass2');
    const femalesInClass3 = document.getElementById('femalesInClass3');
    const femalesInClass4 = document.getElementById('femalesInClass4');
    const femalesInClass5 = document.getElementById('femalesInClass5');
    const femaleTotal = document.getElementById('femaleTotal');

    const totalOfClass1 = document.getElementById('totalOfClass1');
    const totalOfClass2 = document.getElementById('totalOfClass2');
    const totalOfClass3 = document.getElementById('totalOfClass3');
    const totalOfClass4 = document.getElementById('totalOfClass4');
    const totalOfClass5 = document.getElementById('totalOfClass5');
    const Total = document.getElementById('Total');

    const dialogRef = this.dialog.open(Stats3PrintComponent, {
      width: '1150px',
      data: [this.dataSource.data, [
        [malesInClass1.textContent, femalesInClass1.textContent, totalOfClass1.textContent],
        [malesInClass2.textContent, femalesInClass2.textContent, totalOfClass2.textContent],
        [malesInClass3.textContent, femalesInClass3.textContent, totalOfClass3.textContent],
        [malesInClass4.textContent, femalesInClass4.textContent, totalOfClass4.textContent],
        [malesInClass5.textContent, femalesInClass5.textContent, totalOfClass5.textContent],
        [maleTotal.textContent, femaleTotal.textContent, Total.textContent]
      ]],
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
