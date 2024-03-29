import { Component, OnInit, AfterViewInit, ViewChild, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ITBLShamelSCEducation } from "src/app/modules/shared/models/employees_department/ITBLShamelSCEducation";
import { TBLShamelEmployee } from "src/app/modules/shared/models/employees_department/TBLShamelEmployee";
import { TblshamelsceducationService } from "src/app/modules/shared/services/employees_department/tblshamelsceducation.service";
import { EmployeePageService } from "../../employee-page-service";
import { ConfirmationdialogComponent } from "../../common/confirmationdialog/confirmationdialog.component";
import { TblshamelsceducationmodifyComponent } from "../tblshamelsceducationmodify/tblshamelsceducationmodify.component";
import { DOCUMENT } from "@angular/common";
import { ThemeService } from "src/app/modules/shared/services/theme.service";

@Component({
  selector: 'app-tblshamelsceducationlist',
  templateUrl: './tblshamelsceducationlist.component.html',
  styleUrls: ['./tblshamelsceducationlist.component.scss']
})
export class TblshamelsceducationlistComponent implements OnInit, AfterViewInit {

  formname:string = 'المؤهل العلمي';
  

  //Join Variable   
  Selected_Emp: TBLShamelEmployee = {};
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  employee_education_List: ITBLShamelSCEducation[] = [];
  selected_employee_education: ITBLShamelSCEducation;
  displayedColumns: string[] = ['certificate_name', 'specification_name', 'graduationyear', 'country_name',
    'state_name', 'rank_name', 'studyduration', 'action'];


  // Select Object
  selected_employee_education_Rows = new Set<ITBLShamelSCEducation>();
  dataSource: MatTableDataSource<ITBLShamelSCEducation>;

  isLoading: boolean= false;
  darkTheme: boolean;


  constructor(
    public PageService: EmployeePageService,
    public educationService: TblshamelsceducationService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService) {

    this.employee_education_List = [];

    this.dataSource = new MatTableDataSource([]);

    this.dataSource.data = this.employee_education_List;

    this.PageService.Subject_Selected_TBLShamelEmployee.subscribe(
      data => {
        this.Selected_Emp = data;
        console.log('data', data);
      }
    )


    this.PageService.Subject_Selected_TBLShamelEmployee.subscribe
      (
        data => {
          this.employee_education_List = data.TBLShamelSCEducations;
          this.dataSource.data = this.employee_education_List;
          console.log('employee_education_List', this.employee_education_List);

        }
      )


  }


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.employee_education_List);
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.employee_education_List);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  public async FillTable() {
    try {
      this.isLoading= true;

      if (this.Selected_Emp && this.Selected_Emp.id != null && this.Selected_Emp.id > 0) {

        this.educationService.list(this.Selected_Emp.id).toPromise().then(
          (data: any) => {
            this.employee_education_List = data;
            this.dataSource.data = this.employee_education_List;
            this.PageService.Selected_TBLShamelEmployee.TBLShamelSCEducations = this.employee_education_List;
            this.isLoading= false;

          }
        );

      }


    }
    catch (ex: any) { }


  }









  Add(): void {

    this.selected_employee_education = {};
    this.selected_employee_education.id = this.Selected_Emp.id;


    const dialogRef = this.dialog.open(TblshamelsceducationmodifyComponent, {
      height: '70%',
      width: '35%',
      position: {top: '10%'},
      data: { obj: this.selected_employee_education, id: this.Selected_Emp.id }
    });

    dialogRef.afterClosed().toPromise().then(result => {

      this.FillTable();

    });
  }


  async Delete(element: ITBLShamelSCEducation) {

    try {
      const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
        data: {
          message: 'هل أنت متأكد من الحذف?',
          buttonText: {
            ok: 'نعم',
            cancel: 'لا'
          }
        }
      });



      dialogRef.afterClosed().toPromise().then((confirmed: boolean) => {
        if (confirmed) {

          this.educationService.delete(element.serial).toPromise().then(res => {
            console.log(res);
            if (res == 1){

              this.FillTable();
              this.snackBar.open('تم الحذف بنجاح', '', {
                duration: 3000,
                panelClass: ['green-snackbar']
              });
            } 

          });
          

          this.snackBar.dismiss();


        }
      });
    } catch (ex: any) {

    }

  }


  async Update(element: ITBLShamelSCEducation) {
    if (element) {
      this.selected_employee_education = element;
      this.selected_employee_education.id = this.Selected_Emp.id;


      const dialogRef = this.dialog.open(TblshamelsceducationmodifyComponent, {
        height: '70%',
        width: '35%',
        data: { obj: this.selected_employee_education, id: this.Selected_Emp.id }
      });

      dialogRef.afterClosed().toPromise().then(result => {
        this.FillTable();
      });

    }


  }




}
