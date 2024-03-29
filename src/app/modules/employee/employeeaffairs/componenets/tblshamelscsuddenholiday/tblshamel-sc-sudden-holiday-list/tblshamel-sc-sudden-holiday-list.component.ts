import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { TBLShamelSCSuddenHoliday } from 'src/app/modules/shared/models/employees_department/TBLShamelSCSuddenHoliday';
import { TBLShamelSCSuddenHolidayService } from 'src/app/modules/shared/services/employees_department/tblshamel-sc-sudden-holiday.service';
import { TBLShamelSuddenHolidayService } from 'src/app/modules/shared/services/employees_department/tblshamel-sudden-holiday.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { EmployeePageService } from '../../pageservice/employee-page-service';

import { TBLShamelSCSuddenHolidayAddComponent } from '../tblshamel-sc-sudden-holiday-add/tblshamel-sc-sudden-holiday-add.component';

@Component({
  selector: 'app-tblshamel-sc-sudden-holiday-list',
  templateUrl: './tblshamel-sc-sudden-holiday-list.component.html',
  styleUrls: ['./tblshamel-sc-sudden-holiday-list.component.scss']
})
export class TBLShamelSCSuddenHolidayListComponent implements OnInit,AfterViewInit {
  formname:string = 'الإجازات الاضطرارية';
//Join Variable   
Selected_Emp: TBLShamelEmployee = {};
@ViewChild('paginator') paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;
dataSource: MatTableDataSource<TBLShamelSCSuddenHoliday>;
@Input() id:number;
  
// List For Table
employee_SuddenHoliday_List :TBLShamelSCSuddenHoliday []=[];
selected_employee_SuddenHoliday :TBLShamelSCSuddenHoliday;
displayedColumns: string[] = [ 'startdate', 'enddate','duration','suddenholiday_id','documenttype_id', 'document_number',
                              'documentdate','action'];
isLoading: boolean= false;
darkTheme: boolean;


constructor(
  public PageService: EmployeePageService,
  public ShamelSCSuddenHolidayService : TBLShamelSCSuddenHolidayService,
  public ShamelSuddenHolidayService : TBLShamelSuddenHolidayService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar,
  private themeService: ThemeService) {

this.dataSource = new MatTableDataSource([]);
    
this.employee_SuddenHoliday_List=[]
      this.dataSource.data = this.employee_SuddenHoliday_List;
  
      this.PageService.Subject_Selected_TBLShamelEmployee.subscribe(
        data => {
          this.Selected_Emp = data;
          this.id = this.Selected_Emp .id;
        }
      )
  
  
      this.PageService.Subject_Selected_TBLShamelEmployee.subscribe
        (
          data => {
            this.employee_SuddenHoliday_List = data.TBLShamelSCSuddenHolidays;
            this.dataSource.data = this.employee_SuddenHoliday_List;
          }
        )

     
     }

    
ngOnInit(): void {
  this.dataSource = new MatTableDataSource(this.employee_SuddenHoliday_List);
  this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
    this.darkTheme= res;
  })
}
ngAfterViewInit() {
  this.dataSource = new MatTableDataSource(this.employee_SuddenHoliday_List);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}


   
 


    public async FillTable()
    {
     try{
      this.isLoading= true;

      console.log('Fill Table ID = ' + this.Selected_Emp.id); 

      if (this.Selected_Emp && this.Selected_Emp.id != null && this.Selected_Emp.id > 0) {

      await this.ShamelSCSuddenHolidayService.list(this.Selected_Emp.id).subscribe(
        (data:any)=>
        {      
          this.employee_SuddenHoliday_List=data;  
          this.PageService.Selected_TBLShamelEmployee.TBLShamelSCSuddenHolidays = data;
            
          this.dataSource.data =this.employee_SuddenHoliday_List;  
          this.isLoading= false;
   
        }
      );
     }



   }catch(ex :any){}


  }


  






Add(): void {

  this.selected_employee_SuddenHoliday =  {  };
  this.selected_employee_SuddenHoliday.id = this.Selected_Emp.id;

  const dialogRef = this.dialog.open(TBLShamelSCSuddenHolidayAddComponent, {
    height: '70%',
    width: '60%',
    position: {top: '10%', left: '10%'},
    data: {obj: this.selected_employee_SuddenHoliday,id:this.Selected_Emp.id}
  });
 
  dialogRef.afterClosed().toPromise().then(result => {
   
    this.FillTable();
    
  });
}


async Delete(element:TBLShamelSCSuddenHoliday)
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
       

if (element.serial != null )
{
  this.ShamelSCSuddenHolidayService.delete(element.serial).toPromise().then(res=> 
    {
      snack.dismiss();

      console.log(res);
      if (res==1)
        this.FillTable();
        this.snackBar.open('تم الحذف', 'Fechar', {
          duration: 2000,
          panelClass: ['green-snackbar']
        });

    });

    this.snackBar.dismiss();
}
  

       
      }
    });
}catch(ex:any)  
{

}

}


async Update(element:TBLShamelSCSuddenHoliday)
{
  if (element)
  {
    this.selected_employee_SuddenHoliday = element;
    this.selected_employee_SuddenHoliday .id = this.Selected_Emp.id;
    

    const dialogRef = this.dialog.open(TBLShamelSCSuddenHolidayAddComponent, {
      height: '70%',
      width: '60%',
      position: {top: '10%', left: '10%'},
      data: {obj: this.selected_employee_SuddenHoliday,id:this.Selected_Emp.id}
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
