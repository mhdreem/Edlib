import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelChangeReason } from 'src/app/modules/shared/models/employees_department/ITBLShamelChangeReason';
import { TblshamelchangereasonService } from 'src/app/modules/shared/services/employees_department/tblshamelchangereason.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelChangeReasonAddComponent } from '../tbl-shamel-change-reason-add/tbl-shamel-change-reason-add.component';

@Component({
  selector: 'app-tbl-shamel-change-reason-list',
  templateUrl: './tbl-shamel-change-reason-list.component.html',
  styleUrls: ['./tbl-shamel-change-reason-list.component.scss']
})
export class TblShamelChangeReasonListComponent implements OnInit {
  formname:string = 'جدول سبب التبدل';
  ELEMENT_DATA: ITBLShamelChangeReason[] = [];
  dataSource = new MatTableDataSource<ITBLShamelChangeReason>();

 displayedColumns: string[] = ['changereason_id', 'changereason_name', 'malakstate_id' ,'countservice_id','action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 darkTheme: boolean;

 constructor(public dialog: MatDialog,
   private tBLShamelChangeReasonService:TblshamelchangereasonService,
   private _snaker: MatSnackBar,
   private themeService: ThemeService) {
     if (tBLShamelChangeReasonService.List_ITBLShamelChangeReason == null ||
      tBLShamelChangeReasonService.List_ITBLShamelChangeReason.length ==0
     )
     tBLShamelChangeReasonService.fill();

     tBLShamelChangeReasonService.List_ITBLShamelChangeReason_BehaviorSubject?.subscribe(
       data=>
       {
         this.ELEMENT_DATA = data;
         this.dataSource.data =this.ELEMENT_DATA;
       }
     )
   }


   RefreshDataSource()
   {
     this.tBLShamelChangeReasonService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelChangeReasonAddComponent, {
     width: '550px',
     data:obj
   });


   dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     console.log(result.event);

     if(result.event == 'إضافة'){
       this.addChangeReason(result.data);
     }else if(result.event == 'تعديل'){
       this.updateChangeReason(result.data);
     }else if(result.event == 'حذف'){
       this.deleteChangeReason(result.data);
     }
   });
 }

 addChangeReason(obj: any){

   this.tBLShamelChangeReasonService.add(obj).subscribe
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





 updateChangeReason(obj: any){

   console.log(obj);
   this.tBLShamelChangeReasonService.update(obj).subscribe
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
 deleteChangeReason(obj:any){
   this.tBLShamelChangeReasonService.delete(obj.changereason_id).subscribe
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
