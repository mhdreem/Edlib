import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { EmployeePageService } from '../employee-page-service';
import { PrintCardComponent } from '../print/print-card/print-card.component';
import { PrintComponent } from '../print/print/print.component';
import { JobServiceDataAdjustPrintDialogComponent } from '../service-data/job-service-data-adjust-print-dialog/job-service-data-adjust-print-dialog.component';

@Component({
  selector: 'app-print-employee-card',
  templateUrl: './print-employee-card.component.html',
  styleUrls: ['./print-employee-card.component.scss']
})
export class PrintEmployeeCardComponent implements OnInit {

  Selected_Emp: TBLShamelEmployee = {};

  Form = new FormGroup({
    allDataCheckbox: new FormControl(''),
    punishmentsCheckbox: new FormControl(''),
    bonusCheckbox: new FormControl(''),
    holidaiesCheckbox: new FormControl(''),
  });
  
  constructor(public PageService:EmployeePageService, public dialog: MatDialog) {
    this.PageService.Subject_Selected_TBLShamelEmployee.subscribe(
      data => {
        this.Selected_Emp = data;
      }
    );
   }

  ngOnInit(): void {
    this.Form.get('allDataCheckbox').setValue('1');
    this.Form.get('punishmentsCheckbox').setValue('1');
    this.Form.get('bonusCheckbox').setValue('1');
    this.Form.get('holidaiesCheckbox').setValue('1');
  }

  change1(event: any){

  }

  change2(event: any){

  }

  printCard(){
      const dialogRef = this.dialog.open(PrintCardComponent, {
        height: '70%',
        width: '60%',
        data: this.Selected_Emp,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }

  printInterface(){

  }

  print(){
    const dialogRef = this.dialog.open(PrintComponent, {
      height: '70%',
      width: '60%',
      data: [this.Selected_Emp,
        {
          punishmentsCheckbox: this.Form.get('punishmentsCheckbox').value,
          bonusCheckbox: this.Form.get('bonusCheckbox').value,
          holidaiesCheckbox: this.Form.get('holidaiesCheckbox').value,
        }],
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  adjustPrintFooter(){
    const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
      width: '1150px',
      data: "ManageEmployeePrintCardBack",
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

}
