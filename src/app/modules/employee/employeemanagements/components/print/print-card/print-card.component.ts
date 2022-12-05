import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { EmployeePageService } from '../../employee-page-service';

@Component({
  selector: 'app-print-card',
  templateUrl: './print-card.component.html',
  styleUrls: ['./print-card.component.scss']
})
export class PrintCardComponent implements OnInit {
  @Input() data: TBLShamelEmployee ;

  todayDate: Date;
  constructor(public PageService:EmployeePageService,) {

    this.todayDate= new Date();
    console.log('data123', this.data);
    this.PageService.Subject_Selected_TBLShamelEmployee.subscribe(
      res=>
      {
        if (res!= null && res.id!= null && res.id>0)
        {
          this.data = res;
        }
          
      }
    )

  }

  ngOnInit(): void {
  }

}
