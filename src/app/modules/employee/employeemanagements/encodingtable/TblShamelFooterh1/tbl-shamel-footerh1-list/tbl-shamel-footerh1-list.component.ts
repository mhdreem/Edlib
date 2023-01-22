import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelFooterH1 } from 'src/app/modules/shared/models/employees_department/itblshamelFooterh1';
import {TblshamelFooterh1Service} from 'src/app/modules/shared/services/employees_department/tblshamel-footerh1.service'
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import {TblShamelFooterh1AddComponent} from '../tbl-shamel-footerh1-add/tbl-shamel-footerh1-add.component'
@Component({
  selector: 'app-tbl-shamel-footerh1-list',
  templateUrl: './tbl-shamel-footerh1-list.component.html',
  styleUrls: ['./tbl-shamel-footerh1-list.component.scss']
})
export class TblShamelFooterh1ListComponent implements OnInit {
  formname:string = 'جدول صفة تذييل الطباعة';
  ELEMENT_DATA: ITBLShamelFooterH1[] = [];
  dataSource = new MatTableDataSource<ITBLShamelFooterH1>();

 displayedColumns: string[] = ['footerh1_name', 'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 darkTheme: boolean;

 constructor(public dialog: MatDialog,
   private tblshamelFooterh1Service:TblshamelFooterh1Service,
   private _snaker: MatSnackBar,
   private themeService: ThemeService) {
     if (tblshamelFooterh1Service.List_ITBLShamelFooterh1 == null ||
      tblshamelFooterh1Service.List_ITBLShamelFooterh1.length ==0
     )
     tblshamelFooterh1Service.fill();

     tblshamelFooterh1Service.List_ITBLShamelFooterh1_BehaviorSubject?.subscribe(
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
     this.tblshamelFooterh1Service.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelFooterh1AddComponent, {
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

   this.tblshamelFooterh1Service.add(obj).subscribe
   (
     data=>
     {
      if (data == 1){
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
   this.tblshamelFooterh1Service.update(obj).subscribe
   (
     data=>
     {
      if (data == 1){
        this.RefreshDataSource();
        this._snaker.open('تم التعديل بنجاح', '', {
         duration: 3000,
       });
      }
     }
   );


 }
 deleteClass(obj:any){
   this.tblshamelFooterh1Service.delete(obj.footerh1_id).subscribe
   (
     data=>
     {
       if (data == 1){
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
