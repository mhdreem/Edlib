import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelJobKind } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobKind';
import { TblshameljobkindService } from 'src/app/modules/shared/services/employees_department/tblshameljobkind.service';
import { TblShamelJobKindAddComponent } from '../tbl-shamel-job-kind-add/tbl-shamel-job-kind-add.component';

@Component({
  selector: 'app-tbl-shamel-job-kind-list',
  templateUrl: './tbl-shamel-job-kind-list.component.html',
  styleUrls: ['./tbl-shamel-job-kind-list.component.scss']
})
export class TblShamelJobKindListComponent implements OnInit {
  formname:string = 'جدول نوع الوظيفة';
  ELEMENT_DATA: ITBLShamelJobKind[] = [];
  dataSource = new MatTableDataSource<ITBLShamelJobKind>();

 displayedColumns: string[] = ['jobkind_id', 'jobkind_name', 'jobkind_fixed' ,'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 constructor(public dialog: MatDialog,
   private tBLShamelJobKindService:TblshameljobkindService,
   private _snaker: MatSnackBar,) {
     if (tBLShamelJobKindService.list_ITBLShamelJobKind == null ||
      tBLShamelJobKindService.list_ITBLShamelJobKind.length ==0
     )
     tBLShamelJobKindService.fill();

     tBLShamelJobKindService.List_ITBLShamelJobKind_BehaviorSubject?.subscribe(
       data=>
       {
         this.ELEMENT_DATA = data;
         this.dataSource.data =this.ELEMENT_DATA;
       }
     )
   }


   RefreshDataSource()
   {
     this.tBLShamelJobKindService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelJobKindAddComponent, {
     width: '350px',
     data:obj
   });


   dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     console.log(result.event);

     if(result.event == 'إضافة'){
       this.addJobKind(result.data);
     }else if(result.event == 'تعديل'){
       this.updateJobKind(result.data);
     }else if(result.event == 'حذف'){
       this.deleteJobKind(result.data);
     }
   });
 }

 addJobKind(obj: any){

   this.tBLShamelJobKindService.add(obj).subscribe
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





 updateJobKind(obj: any){

   console.log(obj);
   this.tBLShamelJobKindService.update(obj).subscribe
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
 deleteJobKind(obj:any){
   this.tBLShamelJobKindService.delete(obj.jobkind_id).subscribe
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
