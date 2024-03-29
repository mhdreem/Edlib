import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ITBLShamelSCBonus } from "src/app/modules/shared/models/employees_department/ITBLShamelSCBonus";
import { TBLShamelEmployee } from "src/app/modules/shared/models/employees_department/TBLShamelEmployee";
import { TBLShamelSCBonusService } from "src/app/modules/shared/services/employees_department/tblshamel-scbonus.service";
import { EmployeePageService } from "../../employee-page-service";

import { ConfirmationdialogComponent } from "../../common/confirmationdialog/confirmationdialog.component";
import { TblshamelscbonusmodifyComponent } from "../tblshamelscbonusmodify/tblshamelscbonusmodify.component";
import { FormValidationHelpersService } from "src/app/modules/shared/services/helpers/form-validation-helpers.service";
import { Subscription } from "rxjs";
import { DOCUMENT } from "@angular/common";
import { ThemeService } from "src/app/modules/shared/services/theme.service";

@Component({
  selector: 'app-tblshamelscbonuslist',
  templateUrl: './tblshamelscbonuslist.component.html',
  styleUrls: ['./tblshamelscbonuslist.component.scss']
})
export class TblshamelscbonuslistComponent implements OnInit, AfterViewInit,OnDestroy {
  formname:string = 'المكافئات';
  //Join Variable
  Selected_Emp: TBLShamelEmployee = {};
  LoadingFinish:Boolean;
  _Subscription:Subscription = new Subscription ();


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  // List For Table
  employee_Bonus_List: ITBLShamelSCBonus[] = [];
  selected_employee_Bonus: ITBLShamelSCBonus;
  displayedColumns: string[] = ['bonus_name', 'bonusreason_name', 'documenttype_name', 'document_number',
    'documentdate', 'action'];


  // Select Object
  selected_employee_Bonus_Rows = new Set<ITBLShamelSCBonus>();
  dataSource: MatTableDataSource<ITBLShamelSCBonus>;

  isLoading: boolean= false;
  darkTheme: boolean;

  constructor(
    public PageService: EmployeePageService,
    @Inject(DOCUMENT) private _document: Document,
    public ShamelSCBonusService: TBLShamelSCBonusService,
    public dialog: MatDialog,
    public formValidatorsService: FormValidationHelpersService,
    private snackBar: MatSnackBar,
    private themeService: ThemeService) {

      this.LoadingFinish =true;

    this.dataSource = new MatTableDataSource([]);
    this.PageService.Subject_Selected_TBLShamelEmployee.subscribe(
      data => {
        console.log("data", data)
        this.Selected_Emp = data;
      }
    )

    this.employee_Bonus_List = [];
    this.dataSource.data = this.employee_Bonus_List;

    this.PageService.Subject_Selected_TBLShamelEmployee.subscribe
      (
        data => {
          this.employee_Bonus_List = data.TBLShamelSCBonuss;
          this.dataSource.data = this.employee_Bonus_List;
        }
      )


  }
  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }



  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.employee_Bonus_List);
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.employee_Bonus_List);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }




  public async FillTable() {
    try {
      this.isLoading= true;

      this.LoadingFinish = false;

      if (this.Selected_Emp && this.Selected_Emp.id != null && this.Selected_Emp.id > 0) {
        this._Subscription.add(
        this.ShamelSCBonusService.list(this.Selected_Emp.id).subscribe(
          (data: any) => {
            this.LoadingFinish = true;
            this.employee_Bonus_List = data;
            this.dataSource.data = this.employee_Bonus_List;
            this.PageService.Selected_TBLShamelEmployee.TBLShamelSCBonuss = this.employee_Bonus_List;
            this.isLoading= false;

          },error=>
          {
            this.LoadingFinish = true;
          }
        )
        );
      }



    } catch (ex: any) { }


  }



  Add(): void {

    this.selected_employee_Bonus = {};
    this.selected_employee_Bonus.id = this.Selected_Emp.id;

    const dialogRef = this.dialog.open(TblshamelscbonusmodifyComponent, {
      height: '60%',
      width: '40%',
      data: { obj: this.selected_employee_Bonus, id: this.Selected_Emp.id }
    });

    dialogRef.afterClosed().toPromise().then(result => {
      this.FillTable();
    });
  }


  async Delete(element: ITBLShamelSCBonus) {

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



          this.ShamelSCBonusService.delete(element.serial).toPromise().then((res: any) => {

            console.log(res);
            if (res.Result == 1){

              this.FillTable();
              
          
          this.snackBar.open(' تم الحذف بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar']
          });

        }

      });


        }
      });
    } catch (ex: any) {

    }

  }


  Update(element: ITBLShamelSCBonus) {
    if (element) {
      this.selected_employee_Bonus = element;
      console.log(this.selected_employee_Bonus);

      const dialogRef = this.dialog.open(TblshamelscbonusmodifyComponent, {
        height: '60%',
        width: '40%',
        data: { obj: this.selected_employee_Bonus, id: this.Selected_Emp.id }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.FillTable();
      });

    }


  }




}
