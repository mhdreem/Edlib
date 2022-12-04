import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelJobName } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobName';
import { TblshameljobnameService } from 'src/app/modules/shared/services/employees_department/tblshameljobname.service';
import { TblShamelJobNameAddComponent } from '../tbl-shamel-job-name-add/tbl-shamel-job-name-add.component';

@Component({
  selector: 'app-tbl-shamel-job-name-list',
  templateUrl: './tbl-shamel-job-name-list.component.html',
  styleUrls: ['./tbl-shamel-job-name-list.component.scss']
})
export class TblShamelJobNameListComponent implements OnInit {

  ELEMENT_DATA: ITBLShamelJobName[] = [];
  dataSource = new MatTableDataSource<ITBLShamelJobName>();

 displayedColumns: string[] = ['jobname_id', 'jobname_name' ,'Fixed', 'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 constructor(public dialog: MatDialog,
   private tblshameljobnameService:TblshameljobnameService,
   private _snaker: MatSnackBar,) {
     if (tblshameljobnameService.list_ITBLShamelJobName == null ||
      tblshameljobnameService.list_ITBLShamelJobName.length ==0
     )
     tblshameljobnameService.fill();

     tblshameljobnameService.List_ITBLShamelJobName_BehaviorSubject?.subscribe(
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
     this.tblshameljobnameService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelJobNameAddComponent, {
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

   this.tblshameljobnameService.add(obj).subscribe
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
   this.tblshameljobnameService.update(obj).subscribe
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
   this.tblshameljobnameService.delete(obj.jobname_id).subscribe
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
