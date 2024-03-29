import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelRank } from 'src/app/modules/shared/models/employees_department/ITBLShamelRank';
import { TblshamelrankService } from 'src/app/modules/shared/services/employees_department/tblshamelrank.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelRankAddComponent } from '../tbl-shamel-rank-add/tbl-shamel-rank-add.component';

@Component({
  selector: 'app-tbl-shamel-rank-list',
  templateUrl: './tbl-shamel-rank-list.component.html',
  styleUrls: ['./tbl-shamel-rank-list.component.scss']
})
export class TblShamelRankListComponent implements OnInit {
  formname:string = 'جدول التقدير';
  ELEMENT_DATA: ITBLShamelRank[] = [];
  dataSource = new MatTableDataSource<ITBLShamelRank>();


  fixed?: number;
 displayedColumns: string[] = ['rank_id', 'rank_name', 'rank_fixed' ,'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 darkTheme: boolean;

 constructor(public dialog: MatDialog,
   private tBLShamelRankService: TblshamelrankService,
   private _snaker: MatSnackBar, 
   private themeService: ThemeService) {

     if (tBLShamelRankService.list_ITBLShamelRank == null ||
      tBLShamelRankService.list_ITBLShamelRank.length ==0
     )
     tBLShamelRankService.fill();

     tBLShamelRankService.List_ITBLShamelRank_BehaviorSubject?.subscribe(
       data=>
       {
         console.log('ddd');
         console.log(data);
         this.ELEMENT_DATA = data;
         this.dataSource.data =this.ELEMENT_DATA;
       }
     )
   }


   RefreshDataSource()
   {
     this.tBLShamelRankService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelRankAddComponent, {
     width: '350px',
     data:obj
   });


   dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     console.log(result.event);

     if(result.event == 'إضافة'){
       this.addRank(result.data);
     }else if(result.event == 'تعديل'){
       this.updateRank(result.data);
     }else if(result.event == 'حذف'){
       this.deleteRank(result.data);
     }
   });
 }

 addRank(obj: any){

   this.tBLShamelRankService.add(obj).subscribe
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
   )
}





 updateRank(obj: any){
   this.tBLShamelRankService.update(obj).subscribe
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
   )
 }
 deleteRank(obj:any){

   this.tBLShamelRankService.delete(obj.rank_id).subscribe
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
   )

 }
  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

}
