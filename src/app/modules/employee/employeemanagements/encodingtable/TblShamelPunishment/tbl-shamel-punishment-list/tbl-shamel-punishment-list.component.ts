import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelPunishment } from 'src/app/modules/shared/models/employees_department/ITBLShamelPunishment';
import { TBLShamelPunishmentService } from 'src/app/modules/shared/services/employees_department/tblshamel-punishment.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelPunishmentAddComponent } from '../tbl-shamel-punishment-add/tbl-shamel-punishment-add.component';

@Component({
  selector: 'app-tbl-shamel-punishment-list',
  templateUrl: './tbl-shamel-punishment-list.component.html',
  styleUrls: ['./tbl-shamel-punishment-list.component.scss']
})
export class TblShamelPunishmentListComponent implements OnInit {
  formname:string = 'جدول نوع العقوبات';
  ELEMENT_DATA: ITBLShamelPunishment[] = [];
  dataSource = new MatTableDataSource<ITBLShamelPunishment>();

 displayedColumns: string[] = ['punishment_id', 'punishment_name', 'punishment_fixed' ,'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 darkTheme: boolean;

 constructor(public dialog: MatDialog,
   private tBLShamelPunishmentService:TBLShamelPunishmentService,
   private _snaker: MatSnackBar,
   private themeService: ThemeService) {
     if (tBLShamelPunishmentService.List_ITBLShamelPunishment == null ||
      tBLShamelPunishmentService.List_ITBLShamelPunishment.length ==0
     )
     tBLShamelPunishmentService.fill();

     tBLShamelPunishmentService.List_ITBLShamelPunishment_BehaviorSubject?.subscribe(
       data=>
       {
         this.ELEMENT_DATA = data;
         this.dataSource.data =this.ELEMENT_DATA;
       }
     )
   }


   RefreshDataSource()
   {
     this.tBLShamelPunishmentService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelPunishmentAddComponent, {
     width: '350px',
     data:obj
   });


   dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     console.log(result.event);

     if(result.event == 'إضافة'){
       this.addPunishment(result.data);
     }else if(result.event == 'تعديل'){
       this.updatePunishment(result.data);
     }else if(result.event == 'حذف'){
       this.deletePunishment(result.data);
     }
   });
 }

 addPunishment(obj: any){

   this.tBLShamelPunishmentService.add(obj).subscribe
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





 updatePunishment(obj: any){

   console.log(obj);
   this.tBLShamelPunishmentService.update(obj).subscribe
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
 deletePunishment(obj:any){
   this.tBLShamelPunishmentService.delete(obj.punishment_id).subscribe
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
