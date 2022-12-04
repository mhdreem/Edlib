import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';

@Component({
  selector: 'app-print-card',
  templateUrl: './print-card.component.html',
  styleUrls: ['./print-card.component.scss']
})
export class PrintCardComponent implements OnInit {

  todayDate: Date;
  constructor(@Inject(MAT_DIALOG_DATA) public data: TBLShamelEmployee) { 
    this.todayDate= new Date();
    console.log('data123', data);
  }

  ngOnInit(): void {
  }

}
