import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ITBLShamelCourse } from 'src/app/modules/shared/models/employees_department/ITBLShamelCourse';
import { TblshamelcourseService } from 'src/app/modules/shared/services/employees_department/tblshamelcourse.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelCourseAddComponent } from '../tbl-shamel-course-add/tbl-shamel-course-add.component';

@Component({
  selector: 'app-tbl-shamel-course-list',
  templateUrl: './tbl-shamel-course-list.component.html',
  styleUrls: ['./tbl-shamel-course-list.component.scss']
})
export class TblShamelCourseListComponent implements OnInit {
  formname:string = 'جدول الدراسات والدورات';
  ELEMENT_DATA: ITBLShamelCourse[] = [];
  dataSource = new MatTableDataSource<ITBLShamelCourse>();

 displayedColumns: string[] = ['course_id', 'course_name', 'course_fixed' ,'action'];

 @ViewChild(MatTable,{static:true}) mytable!: MatTable<any>;

 darkTheme: boolean;

 constructor(public dialog: MatDialog,
   private tBLShamelCourseService:TblshamelcourseService,
   private _snaker: MatSnackBar,
   private themeService: ThemeService) {
     if (tBLShamelCourseService.List_ITBLShamelCourse == null ||
       tBLShamelCourseService.List_ITBLShamelCourse.length ==0
     )
     tBLShamelCourseService.fill();

     tBLShamelCourseService.List_ITBLShamelCourse_BehaviorSubject?.subscribe(
       data=>
       {
         this.ELEMENT_DATA = data;
         this.dataSource.data =this.ELEMENT_DATA;
       }
     )
   }


   RefreshDataSource()
   {
     this.tBLShamelCourseService.fill();
   }

 openDialog(action: any,obj:any) {
  console.log(obj);

   obj.action = action;
   const dialogRef = this.dialog.open(TblShamelCourseAddComponent, {
     width: '350px',
     data:obj
   });


   dialogRef.afterClosed().subscribe(result => {
     console.log(result);
     console.log(result.event);

     if(result.event == 'إضافة'){
       this.addCourse(result.data);
     }else if(result.event == 'تعديل'){
       this.updateCourse(result.data);
     }else if(result.event == 'حذف'){
       this.deleteCourse(result.data);
     }
   });
 }

 addCourse(obj: any){

   this.tBLShamelCourseService.add(obj).subscribe
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





 updateCourse(obj: any){

   console.log(obj);
   this.tBLShamelCourseService.update(obj).subscribe
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
 deleteCourse(obj:any){
   this.tBLShamelCourseService.delete(obj.course_id).subscribe
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
