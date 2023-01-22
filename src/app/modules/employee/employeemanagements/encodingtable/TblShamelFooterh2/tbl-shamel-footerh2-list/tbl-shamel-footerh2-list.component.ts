import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelFooterH2 } from 'src/app/modules/shared/models/employees_department/itblshamelFooterh2';
import { TblshamelFooterh2Service } from 'src/app/modules/shared/services/employees_department/tblshamel-footerh2.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelFooterh2AddComponent } from '../tbl-shamel-footerh2-add/tbl-shamel-footerh2-add.component';

@Component({
  selector: 'app-tbl-shamel-footerh2-list',
  templateUrl: './tbl-shamel-footerh2-list.component.html',
  styleUrls: ['./tbl-shamel-footerh2-list.component.scss']
})
export class TblShamelFooterh2ListComponent implements OnInit {
  formname:string = 'جدول اسم تذييل الطباعة';
  ELEMENT_DATA: ITBLShamelFooterH2[] = [];
  dataSource = new MatTableDataSource<ITBLShamelFooterH2>();

 displayedColumns: string[] = ['footerh2_name', 'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 darkTheme: boolean;

 constructor(public dialog: MatDialog,
   private tblshamelFooterh2Service:TblshamelFooterh2Service,
   private _snaker: MatSnackBar,
   private themeService: ThemeService) {
     if (tblshamelFooterh2Service.List_ITBLShamelFooterh2 == null ||
      tblshamelFooterh2Service.List_ITBLShamelFooterh2.length ==0
     )
     tblshamelFooterh2Service.fill();

     tblshamelFooterh2Service.List_ITBLShamelFooterh2_BehaviorSubject?.subscribe(
       data=>
       {
         console.log('data123', data);
         this.ELEMENT_DATA = data;
         this.dataSource.data =this.ELEMENT_DATA;
       }
     )
   }


   RefreshDataSource()
   {
     this.tblshamelFooterh2Service.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelFooterh2AddComponent, {
     width: '350px',
     data:obj
   });


   dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     console.log(result.event);

     if(result.event == 'إضافة'){
       this.addClass(result.data);
     }else if(result.event == 'تعديل'){
       this.updateClass(result.data);
     }else if(result.event == 'حذف'){
       this.deleteClass(result.data);
     }
   });
 }

 addClass(obj: any){

   this.tblshamelFooterh2Service.add(obj).subscribe
   (
     (data: any)=>
     {
      if (data.Result == 1){
        this.RefreshDataSource();
        this._snaker.open('تمت الإضافة بنجاح', '', {
         duration: 3000,
       });
      }
     }
   );

}





 updateClass(obj: any){

   console.log(obj);
   this.tblshamelFooterh2Service.update(obj).subscribe
   (
    (data: any)=>
     {
      if (data.Result == 1){
        this.RefreshDataSource();
        this._snaker.open('تم التعديل بنجاح', '', {
         duration: 3000,
       });
      }
     }
   );


 }
 deleteClass(obj:any){
   this.tblshamelFooterh2Service.delete(obj.footerh2_id).subscribe
   (
    (data: any)=>
     {
       if (data.Result == 1){
         this.RefreshDataSource();
         this._snaker.open('تم الحذف بنجاح', '', {
          duration: 3000,
        });
       }
     }
   );


 }
  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }




}
