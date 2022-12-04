import { Component, OnInit, Input, Inject, Optional } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TBLShamelEmployee } from "src/app/modules/shared/models/employees_department/TBLShamelEmployee";
import { EmployeePageService } from "../../employee-page-service";


@Component({
  selector: 'app-data-entry-dialog',
  templateUrl: './data-entry-dialog.component.html',
  styleUrls: ['./data-entry-dialog.component.scss']
})
export class DataEntryDialogComponent implements OnInit {

  @Input() SelectedEmp : TBLShamelEmployee;

  constructor(public dialogRef: MatDialogRef<DataEntryDialogComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional()@Inject(MAT_DIALOG_DATA) public data: any,
    private pageService : EmployeePageService) {  
      this.pageService.Subject_Selected_TBLShamelEmployee.subscribe
      (
        data=>
        {
          
          this.SelectedEmp = data
          console.log('this.SelectedEmp', this.SelectedEmp);
        }

      )
   }

   ngOnInit(): void {
   
  }

  


}
