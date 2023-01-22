import { Component, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TBLShamelUserEditComponent } from '../tblshamel-user-edit/tblshamel-user-edit.component';
import { ConfirmationdialogComponent } from 'src/app/modules/shared/components/confirmationdialog/confirmationdialog.component';
import { MatIcon } from '@angular/material/icon';
import { MatTable } from '@angular/material/table';
import { TBLShamelUser } from 'src/app/modules/shared/models/employees_department/TBLShamelUser';
import { TBLShamelUserService } from 'src/app/modules/shared/services/employees_department/tblshamel-user.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';


@Component({
  selector: 'app-tblshamel-user-list',
  templateUrl: './tblshamel-user-list.component.html',
  styleUrls: ['./tblshamel-user-list.component.scss']
})
export class TBLShamelUserListComponent implements OnInit ,OnChanges  {
  formname:string = 'حسابات المستخدمين';

  // List For Table
  public User_List :TBLShamelUser []=[];
  public selected_User :TBLShamelUser;
  public displayedColumns: string[] = ['User_ID', 'FullName', 'Daera_Name', 'UserName',
                                'HDSERIAL', 'EnterMinTime','EnterMaxTime',
                                'SEnabled','AccountCreationDate','AccountCreationTime',
                                'AccountModificationDate','AccountModificationTime',
                                'Action'];

  // Select Object
  selected_User_Rows = new Set<TBLShamelUser>();                              
 
  darkTheme: boolean;


  constructor(public ShamelUserService:TBLShamelUserService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private themeService: ThemeService) {
      this.User_List =[];
      this.FillTable();
     }


  ngOnChanges() {  
    this.FillTable();
   }

   
  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }



    public async FillTable()
    {
     try{     
        this.ShamelUserService.list().toPromise().then(
          (data:any)=>
          {      
            this.User_List=data;                   
          }
        );
     }catch(ex :any){}
    }

  Add(): void {
    this.selected_User = {};
    const dialogRef = this.dialog.open(TBLShamelUserEditComponent, {
      height: '80%',
      width: '50%',
      position: {top: '7%', left: '20%'},
      data: {obj: this.selected_User}
    });
   
    dialogRef.afterClosed().toPromise().then(result => {     
      this.FillTable();      
    });
  }


  async Delete(element:TBLShamelUser)
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
     
          this.ShamelUserService.delete(element.user_id).toPromise().then((res :any)=> 
            {
              console.log(res);
              if (res==1)
                this.FillTable();
                this.snackBar.open('تم الحذف', '', {
                  duration: 2000,
                });
            });
         
        }
      });
}catch(ex:any)  
{

}

  }


  async Update(element:TBLShamelUser)
  {
    if (element)
    {
      this.selected_User = element;

      const dialogRef = this.dialog.open(TBLShamelUserEditComponent, {
        height: '80%',
        width: '50%',
        position: {top: '7%', left: '20%'},
        data: {obj: this.selected_User}
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
}
