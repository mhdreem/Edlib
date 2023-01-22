import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationdialogComponent } from '../../common/confirmationdialog/confirmationdialog.component';
import { TblshamelincmarsoommodifyComponent } from '../tblshamelincmarsoommodify/tblshamelincmarsoommodify.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ITBLShamelIncMarsoom } from 'src/app/modules/shared/models/employees_department/ITBLShamelIncMarsoom';
import { IGlobalEmployeeList } from 'src/app/modules/shared/services/employees_department/IGlobalEmployeeList';
import { TblshamelincmarsoomService } from 'src/app/modules/shared/services/employees_department/tblshamelincmarsoom.service';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-tblshamelincmarsoomlist',
  templateUrl: './tblshamelincmarsoomlist.component.html',
  styleUrls: ['./tblshamelincmarsoomlist.component.scss']
})
export class TblshamelincmarsoomlistComponent implements OnInit ,AfterViewInit,OnDestroy  {
  //Join Variable   
  formname:string = 'مراسيم الزيادة';
  LoadingFinish:boolean;
_Subscription:Subscription =new Subscription();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<ITBLShamelIncMarsoom>;

  // List For Table
  IncMarsoom_List :ITBLShamelIncMarsoom []=[];
  selected_IncMarsoom  :ITBLShamelIncMarsoom = {};

  displayedColumns: string[] = [ 'changedate','documenttype_name', 'document_number',
                                'documentdate', 'changereason_name' , 'incpercentage','additionalvalue','begindate','action'];


  darkTheme: boolean;

  constructor(
    public IncMarsoomService : TblshamelincmarsoomService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    public GlobalEmployeeList:IGlobalEmployeeList,
    private _snackBar: MatSnackBar,
    private themeService: ThemeService ) {

      this.dataSource = new MatTableDataSource<ITBLShamelIncMarsoom>([]);
      this.IncMarsoom_List =[];
      this.dataSource.data = this.IncMarsoom_List;
    
this.Load_Data();
      

this.IncMarsoomService.List_ITBLShamelIncMarsoom_BehaviorSubject.subscribe(
  data=>
  {
    this.dataSource.data = data;
  }
)
     
        
     }

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }
    
    Load_ITBLShamelIncMarsoom():Observable<ITBLShamelIncMarsoom[]>
    {

      if (this.IncMarsoomService.List_ITBLShamelIncMarsoom == null||
        this.IncMarsoomService.List_ITBLShamelIncMarsoom.length ==0 )
          return    this.IncMarsoomService.list();  

          return of(this.IncMarsoomService.List_ITBLShamelIncMarsoom);
          

    }

    Load_Data()
    {
      this.LoadingFinish =false;

      this._Subscription.add(
      forkJoin(
this.Load_ITBLShamelIncMarsoom()
      ).subscribe(res=>
        {
          this.LoadingFinish =true;
          this.IncMarsoomService.List_ITBLShamelIncMarsoom= res[0];
          this.IncMarsoomService.List_ITBLShamelIncMarsoom_BehaviorSubject.next(res[0]) ;
          this.dataSource.data =  res[0];


        },
        error=>
        {
          this.LoadingFinish =true;
          this._snackBar.open('حدث خطأ','موافق');
        }
        )
      );

    }
 
 
   ngOnInit(): void {
     this.dataSource = new MatTableDataSource(this.IncMarsoom_List);
     this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
   }
   
   ngAfterViewInit() {
     this.dataSource = new MatTableDataSource(this.IncMarsoom_List);
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
   }
 
 
 
 
   public async LoadFromServer() {
     try {
       
     
      this.IncMarsoomService.fill();
 
 
     } catch (ex: any) { }
 
 
   }
 
 
 

   

 
    



  


  Add(): void {

    this.selected_IncMarsoom  = {};


    const dialogRef = this.dialog.open(TblshamelincmarsoommodifyComponent, {
      height: '60%',
      width: '35%',
      data: {obj: this.selected_IncMarsoom}
    });
   
    dialogRef.afterClosed().toPromise().then(result => {
     
      this.LoadFromServer();
      
    });
  }


  async Delete(element:ITBLShamelIncMarsoom)
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
     
         

          if (element.incmarsoom_id != null )
          {

          this.IncMarsoomService.delete(element.incmarsoom_id).toPromise().then(res=> 
            {

              console.log(res);
              if (res==1){

              this.snackBar.open('تم الحذف بنجاح', '', {
                duration: 3000,
              });
                this.LoadFromServer();
              }

            });

            

 
          }
        }
      });
}catch(ex:any)  
{

}

  }


  async Update(element:ITBLShamelIncMarsoom)
  {
    if (element != null  && element.incmarsoom_id != null &&   element.incmarsoom_id >0)
    {
      this.selected_IncMarsoom = element;

      const dialogRef = this.dialog.open(TblshamelincmarsoommodifyComponent, {
        height: '60%',
        width: '35%',
        data: {obj: this.selected_IncMarsoom}
      });
  
      dialogRef.afterClosed().toPromise().then(result => {
        this.LoadFromServer();        
      });

    }


  }




}
