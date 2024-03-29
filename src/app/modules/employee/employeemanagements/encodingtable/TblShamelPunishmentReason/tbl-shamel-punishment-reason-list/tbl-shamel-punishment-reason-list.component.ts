import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelPunishmentReason } from 'src/app/modules/shared/models/employees_department/ITBLShamelPunishmentReason';
import { TBLShamelPunishmentReasonService } from 'src/app/modules/shared/services/employees_department/tblshamel-punishment-reason.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelPunishmentReasonAddComponent } from '../tbl-shamel-punishment-reason-add/tbl-shamel-punishment-reason-add.component';

@Component({
  selector: 'app-tbl-shamel-punishment-reason-list',
  templateUrl: './tbl-shamel-punishment-reason-list.component.html',
  styleUrls: ['./tbl-shamel-punishment-reason-list.component.scss']
})
export class TblShamelPunishmentReasonListComponent implements OnInit {
  formname:string = 'جدول سبب العقوبة';
  ELEMENT_DATA: ITBLShamelPunishmentReason[] = [];
  dataSource = new MatTableDataSource<ITBLShamelPunishmentReason>();

 displayedColumns: string[] = ['punishmentreason_id', 'punishmentreason_name', 'punishmentreason_fixed' ,'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 darkTheme: boolean;

 constructor(public dialog: MatDialog,
   private tBLShamelPunishmentReasonService:TBLShamelPunishmentReasonService,
   private _snaker: MatSnackBar,
   private themeService: ThemeService) {
     if (tBLShamelPunishmentReasonService.List_ITBLShamelPunishmentReason == null ||
      tBLShamelPunishmentReasonService.List_ITBLShamelPunishmentReason.length ==0
     )
     tBLShamelPunishmentReasonService.fill();

     tBLShamelPunishmentReasonService.List_ITBLShamelPunishmentReason_BehaviorSubject?.subscribe(
       data=>
       {
         this.ELEMENT_DATA = data;
         this.dataSource.data =this.ELEMENT_DATA;
         console.log('data1', data);
       }
     )
   }


   RefreshDataSource()
   {
     this.tBLShamelPunishmentReasonService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelPunishmentReasonAddComponent, {
     width: '350px',
     data:obj
   });


   dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     console.log(result.event);

     if(result.event == 'إضافة'){
       this.addPunishmentReason(result.data);
     }else if(result.event == 'تعديل'){
       this.updatePunishmentReason(result.data);
     }else if(result.event == 'حذف'){
       this.deletePunishmentReason(result.data);
     }
   });
 }

 addPunishmentReason(obj: any){

   this.tBLShamelPunishmentReasonService.add(obj).subscribe
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





 updatePunishmentReason(obj: any){

   console.log(obj);
   this.tBLShamelPunishmentReasonService.update(obj).subscribe
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
 deletePunishmentReason(obj:any){
   this.tBLShamelPunishmentReasonService.delete(obj.punishmentreason_id).subscribe
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
