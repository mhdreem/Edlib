import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelClass } from 'src/app/modules/shared/models/employees_department/ITBLShamelClass';
import { TblshamelclassService } from 'src/app/modules/shared/services/employees_department/tblshamelclass.service';
import { TblShamelClassAddComponent } from '../tbl-shamel-class-add/tbl-shamel-class-add.component';

@Component({
  selector: 'app-tbl-shamel-class-list',
  templateUrl: './tbl-shamel-class-list.component.html',
  styleUrls: ['./tbl-shamel-class-list.component.scss']
})
export class TblShamelClassListComponent implements OnInit {

  ELEMENT_DATA: ITBLShamelClass[] = [];
  dataSource = new MatTableDataSource<ITBLShamelClass>();

 displayedColumns: string[] = ['class_id', 'class_name', 'max_salary' ,/*'salary_old',*/ 'Fixed', 'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 constructor(public dialog: MatDialog,
   private tblshamelclassService:TblshamelclassService,
   private _snaker: MatSnackBar,) {
     if (tblshamelclassService.List_ITBLShamelClass == null ||
      tblshamelclassService.List_ITBLShamelClass.length ==0
     )
     tblshamelclassService.fill();

     tblshamelclassService.List_ITBLShamelClass_BehaviorSubject?.subscribe(
       data=>
       {
         this.ELEMENT_DATA = data;
         this.dataSource.data =this.ELEMENT_DATA;
       }
     )
   }


   RefreshDataSource()
   {
     this.tblshamelclassService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelClassAddComponent, {
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

   this.tblshamelclassService.add(obj).subscribe
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
   this.tblshamelclassService.update(obj).subscribe
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
   this.tblshamelclassService.delete(obj.class_id).subscribe
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
  }


}
