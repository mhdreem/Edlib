import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelDocumentType } from 'src/app/modules/shared/models/employees_department/ITBLShamelDocumentType';
import { TblshameldocumenttypeService } from 'src/app/modules/shared/services/employees_department/tblshameldocumenttype.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelDocumentTypeAddComponent } from '../tbl-shamel-document-type-add/tbl-shamel-document-type-add.component';

@Component({
  selector: 'app-tbl-shamel-document-type-list',
  templateUrl: './tbl-shamel-document-type-list.component.html',
  styleUrls: ['./tbl-shamel-document-type-list.component.scss']
})
export class TblShamelDocumentTypeListComponent implements OnInit {
  formname:string = 'جدول نوع المستند';
  ELEMENT_DATA: ITBLShamelDocumentType[] = [];
  dataSource = new MatTableDataSource<ITBLShamelDocumentType>();

 displayedColumns: string[] = ['documenttype_id', 'documenttype_name' ,'documenttype_fixed', 'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 darkTheme: boolean;

 constructor(public dialog: MatDialog,
   private tblshameldocumenttypeService:TblshameldocumenttypeService,
   private _snaker: MatSnackBar,
   private themeService: ThemeService) {
     if (tblshameldocumenttypeService.List_ITBLShamelDocumentType == null ||
      tblshameldocumenttypeService.List_ITBLShamelDocumentType.length ==0
     )
     tblshameldocumenttypeService.fill();

     tblshameldocumenttypeService.List_ITBLShamelDocumentType_BehaviorSubject?.subscribe(
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
     this.tblshameldocumenttypeService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelDocumentTypeAddComponent, {
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

   this.tblshameldocumenttypeService.add(obj).subscribe
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
   this.tblshameldocumenttypeService.update(obj).subscribe
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
   this.tblshameldocumenttypeService.delete(obj.documenttype_id).subscribe
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
