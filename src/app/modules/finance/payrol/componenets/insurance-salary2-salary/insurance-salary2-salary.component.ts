import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationdialogComponent } from 'src/app/modules/employee/employeemanagements/components/common/confirmationdialog/confirmationdialog.component';
import { TBLShamelMonth } from 'src/app/modules/shared/models/employees_department/TBLShamelMonth';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TBLShamelNewShatebService } from 'src/app/modules/shared/services/finance_department/payrol/tblshamel-new-shateb.service';

@Component({
  selector: 'app-insurance-salary2-salary',
  templateUrl: './insurance-salary2-salary.component.html',
  styleUrls: ['./insurance-salary2-salary.component.scss']
})
export class InsuranceSalary2SalaryComponent implements OnInit {

  fixedYear: string;
  fixedMonth: TBLShamelMonth;

  constructor(private tblShamelYearService: TBLShamelYearService,
    public ShamelMonthService: TBLShamelMonthService,
    private tblShamelNewShatebService: TBLShamelNewShatebService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.tblShamelYearService.GetYearFixed().subscribe(
      res => {
        this.fixedYear = res.year_name;
      }
    );

    this.ShamelMonthService.GetMonthFixed().subscribe(
      res => {
        this.fixedMonth = res;
      }
    );
  }

  InsuranceSalary2Salary(){
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      data: {message: 'هل انت متأكد من التنفيذ؟', buttonText: {ok: 'نعم', cancel: 'لا'}},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.tblShamelNewShatebService.updateInsuranceSalary2Salary(this.fixedMonth.month_id, +this.fixedYear).subscribe(res =>{
          if (res == 1){
            this.snackBar.open('تمت العملية بنجاح', '', {
              duration: 3000,
            });
          }
          else {
            this.snackBar.open('حدث خطأ', '', {
              duration: 3000,
            });
          }
        });
      }
    });
  }

  SalaryOld2Salary(){
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      data: {message: 'هل انت متأكد من التنفيذ؟', buttonText: {ok: 'نعم', cancel: 'لا'}},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.tblShamelNewShatebService.updateSalaryOld2Salary(this.fixedMonth.month_id, +this.fixedYear).subscribe(res =>{
          if (res == 1){
            this.snackBar.open('تمت العملية بنجاح', '', {
              duration: 3000,
            });
          }
          else {
            this.snackBar.open('حدث خطأ', '', {
              duration: 3000,
            });
          }
        });
      }
    });
  }
}
