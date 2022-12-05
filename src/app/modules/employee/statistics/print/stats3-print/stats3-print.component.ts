import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stats3-print',
  templateUrl: './stats3-print.component.html',
  styleUrls: ['./stats3-print.component.scss']
})
export class Stats3PrintComponent implements OnInit {
  
  todayDate: Date;
  constructor(@Inject(MAT_DIALOG_DATA) public data: [any,[number[],number[],number[],number[],number[],number[]]]) { 
    this.todayDate= new Date();
    console.log('data123', data);
  }

  ngOnInit(): void {
  }

}
