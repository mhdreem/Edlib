import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { TBLShamelSCLegalHoliday } from 'src/app/modules/shared/models/employees_department/TBLShamelSCLegalHoliday';
import { TBLShamelSCLEgalHolidayService } from 'src/app/modules/shared/services/employees_department/tblshamel-sc-legal-holiday.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { EmployeePageService } from '../../pageservice/employee-page-service';

import { TBLShamelSCLEgalHolidayAddComponent } from '../tblshamel-sc-legal-holiday-add/tblshamel-sc-legal-holiday-add.component';

@Component({
  selector: 'app-tblshamel-sc-legal-holiday-list',
  templateUrl: './tblshamel-sc-legal-holiday-list.component.html',
  styleUrls: ['./tblshamel-sc-legal-holiday-list.component.scss']
})
export class TBLShamelSCLEgalHolidayListComponent implements OnInit,AfterViewInit {
  formname:string = 'الإجازات الإدارية';
 //Join Variable   
 Selected_Emp: TBLShamelEmployee = {};
 @ViewChild('paginator') paginator: MatPaginator;
 @ViewChild(MatSort) sort: MatSort;
 dataSource: MatTableDataSource<TBLShamelSCLegalHoliday>;

  //Join Variable   
  @Input() id:number;
    
  // List For Table
  employee_List_TBLShamelSCLegalHoliday :TBLShamelSCLegalHoliday []=[];
  selected_employee_ShamelSCLegalHoliday :TBLShamelSCLegalHoliday;
  displayedColumns: string[] = ['duration', 'startdate', 'enddate','documenttype_id','document_number','documentdate','action'];
  darkTheme: boolean;
  isLoading: boolean= false;
  
  constructor(
    public PageService: EmployeePageService,
    public SCLEgalHolidayService : TBLShamelSCLEgalHolidayService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private themeService: ThemeService) {
      this.employee_List_TBLShamelSCLegalHoliday =[];
      this.dataSource = new MatTableDataSource([]);
    
    
      this.dataSource.data = this.employee_List_TBLShamelSCLegalHoliday;
  
      this.PageService.Subject_Selected_TBLShamelEmployee.subscribe(
        data => {
          this.Selected_Emp = data;
          this.id = this.Selected_Emp .id;
        }
      )
  
  
      this.PageService.Subject_Selected_TBLShamelEmployee.subscribe
        (
          data => {
            this.employee_List_TBLShamelSCLegalHoliday = data.TBLShamelSCLegalHolidays;
            this.dataSource.data = this.employee_List_TBLShamelSCLegalHoliday;
          }
        )

     
     }

    
ngOnInit(): void {
  this.dataSource = new MatTableDataSource(this.employee_List_TBLShamelSCLegalHoliday);
  this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
    this.darkTheme= res;
  })
}
ngAfterViewInit() {
  this.dataSource = new MatTableDataSource(this.employee_List_TBLShamelSCLegalHoliday);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}


   
 


    public async FillTable()
    {
     try{
      this.isLoading= true;

      console.log('Fill Table ID = ' + this.Selected_Emp.id); 

      if (this.Selected_Emp && this.Selected_Emp.id != null && this.Selected_Emp.id > 0) {

        await this.SCLEgalHolidayService.list(this.Selected_Emp.id).subscribe(
          (data:any)=>
          {      
            this.employee_List_TBLShamelSCLegalHoliday=data;  
            this.dataSource.data =this.employee_List_TBLShamelSCLegalHoliday;     
            this.isLoading= false;
          }
        );
       }
  
  
  
     }catch(ex :any){}
  
  
    }
  
  
    
  
  
  
  
  
  
  Add(): void {
  
    this.selected_employee_ShamelSCLegalHoliday =  {  };
    this.selected_employee_ShamelSCLegalHoliday.id = this.Selected_Emp.id;
  
    const dialogRef = this.dialog.open(TBLShamelSCLEgalHolidayAddComponent, {
      height: '60%',
      width: '60%',
      position: {top: '10%', left: '10%'},
      data: {obj: this.selected_employee_ShamelSCLegalHoliday,id:this.Selected_Emp.id}
    });
   
    dialogRef.afterClosed().toPromise().then(result => {
     
      this.FillTable();
      
    });
  }
  
  
  async Delete(element:TBLShamelSCLegalHoliday)
  {
    
  try{
      const dialogRef = this.dialog.open(ConfirmationdialogComponent,{
        data:{
          message: 'هل أنت متأكد من الحذف?',
          buttonText: {
            ok: 'نعم',
            cancel: 'لا'
          }
        }
      });
  
      
  
      dialogRef.afterClosed().toPromise().then((confirmed: boolean) => {
        if (confirmed) {
     
          const snack = this.snackBar.open('سوف يتم الآن الحذف');
         
  
  if (element.serial)
  {
    this.SCLEgalHolidayService.delete(element.serial).toPromise().then(res=> 
      {
        snack.dismiss();
  
        console.log(res);
        this.FillTable();
  
      });
      this.snackBar.open('تم الحذف', 'Fechar', {
        duration: 2000,
        panelClass: ['green-snackbar']
      });
  
      this.snackBar.dismiss();
  }
    
  
         
        }
      });
  }catch(ex:any)  
  {
  
  }
  
  }
  
  
  async Update(element:TBLShamelSCLegalHoliday)
  {
    if (element)
    {
      this.selected_employee_ShamelSCLegalHoliday = element;
  
      const dialogRef = this.dialog.open(TBLShamelSCLEgalHolidayAddComponent, {
        height: '60%',
        width: '60%',
        position: {top: '10%', left: '10%'},
        data: {obj: this.selected_employee_ShamelSCLegalHoliday,id:this.Selected_Emp.id}
      });
  
      dialogRef.afterClosed().toPromise().then(result => {
        this.FillTable();        
      });
  
    }
  
  
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
  
  }
  