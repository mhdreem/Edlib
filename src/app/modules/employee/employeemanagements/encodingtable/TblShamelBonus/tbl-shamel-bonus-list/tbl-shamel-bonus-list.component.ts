import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TBLShamelBonus } from 'src/app/modules/shared/models/employees_department/TBLShamelBonus';
import { TBLShamelBonusService } from 'src/app/modules/shared/services/employees_department/tblshamel-bonus.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelBonusAddComponent } from '../tbl-shamel-bonus-add/tbl-shamel-bonus-add.component';

@Component({
  selector: 'app-tbl-shamel-bonus-list',
  templateUrl: './tbl-shamel-bonus-list.component.html',
  styleUrls: ['./tbl-shamel-bonus-list.component.scss']
})
export class TblShamelBonusListComponent implements OnInit {
  formname:string = 'جدول نوع المكافأة';
  ELEMENT_DATA: TBLShamelBonus[] = [];
  dataSource = new MatTableDataSource<TBLShamelBonus>();

 displayedColumns: string[] = ['bonus_id', 'bonus_name', 'bonus_fixed' ,'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 darkTheme: boolean;

 constructor(public dialog: MatDialog,
   private tBLShamelBonusService:TBLShamelBonusService,
   private _snaker: MatSnackBar,
   private themeService: ThemeService) {
     if (tBLShamelBonusService.List_TBLShamelBonus == null ||
      tBLShamelBonusService.List_TBLShamelBonus.length ==0
     )
     tBLShamelBonusService.fill();

     tBLShamelBonusService.List_TBLShamelBonus_BehaviorSubject?.subscribe(
       data=>
       {
         this.ELEMENT_DATA = data;
         this.dataSource.data =this.ELEMENT_DATA;
       }
     )
   }


   RefreshDataSource()
   {
     this.tBLShamelBonusService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelBonusAddComponent, {
     width: '350px',
     data:obj
   });


   dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     console.log(result.event);

     if(result.event == 'إضافة'){
       this.addBonus(result.data);
     }else if(result.event == 'تعديل'){
       this.updateBonus(result.data);
     }else if(result.event == 'حذف'){
       this.deleteBonus(result.data);
     }
   });
 }

 addBonus(obj: any){

   this.tBLShamelBonusService.add(obj).subscribe
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





 updateBonus(obj: any){

   console.log(obj);
   this.tBLShamelBonusService.update(obj).subscribe
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
 deleteBonus(obj:any){
   this.tBLShamelBonusService.delete(obj.bonus_id).subscribe
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
