import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelCertificate } from 'src/app/modules/shared/models/employees_department/ITBLShamelCertificate';
import { TBLShamelCertificateService } from 'src/app/modules/shared/services/employees_department/tblshamel-certificate.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelCertificateAddComponent } from '../tbl-shamel-certificate-add/tbl-shamel-certificate-add.component';

@Component({
  selector: 'app-tbl-shamel-certificate-list',
  templateUrl: './tbl-shamel-certificate-list.component.html',
  styleUrls: ['./tbl-shamel-certificate-list.component.scss']
})
export class TblShamelCertificateListComponent implements OnInit {
  formname:string = 'جدول الشهادات';

  ELEMENT_DATA: ITBLShamelCertificate[] = [];
  dataSource = new MatTableDataSource<ITBLShamelCertificate>();

 displayedColumns: string[] = ['certificate_id', 'certificate_name', 'certificate_fixed' ,'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 darkTheme: boolean;

 constructor(public dialog: MatDialog,
   private tBLShamelCertificateService:TBLShamelCertificateService,
   private _snaker: MatSnackBar,
   private themeService: ThemeService) {
     if (tBLShamelCertificateService.List_ITBLShamelCertificate == null ||
       tBLShamelCertificateService.List_ITBLShamelCertificate.length ==0
     )
     tBLShamelCertificateService.fill();

     tBLShamelCertificateService.List_ITBLShamelCertificate_BehaviorSubject?.subscribe(
       data=>
       {
         this.ELEMENT_DATA = data;
         this.dataSource.data =this.ELEMENT_DATA;
       }
     )
   }


   RefreshDataSource()
   {
     this.tBLShamelCertificateService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelCertificateAddComponent, {
     width: '350px',
     data:obj
   });


   dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     console.log(result.event);

     if(result.event == 'إضافة'){
       this.addCertificate(result.data);
     }else if(result.event == 'تعديل'){
       this.updateCertificate(result.data);
     }else if(result.event == 'حذف'){
       this.deleteCertificate(result.data);
     }
   });
 }

 addCertificate(obj: any){

   this.tBLShamelCertificateService.add(obj).subscribe
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





 updateCertificate(obj: any){

   console.log(obj);
   this.tBLShamelCertificateService.update(obj).subscribe
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
 deleteCertificate(obj:any){
   this.tBLShamelCertificateService.delete(obj.certificate_id).subscribe
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
