import { Component, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { EmployeeStatsService } from 'src/app/modules/shared/services/employees_department/employee-stats.service';

@Component({
  selector: 'app-chart-component',
  templateUrl: './chart-component.component.html',
  styleUrls: ['./chart-component.component.scss']
})
export class ChartComponentComponent implements OnInit {
  _Subscription: Subscription;

  data0 = {
    labels: ['عدد الموظفين داخل الملاك'],
    datasets: [
      {
        label: 'عدد الموظفين',
        backgroundColor: '#f87979',
        data: ['0']
      }
    ]
  };

  data1 = {
    labels: [''],
    datasets: [
      {
        label: 'عدد الموظفين حسب الفئة',
        backgroundColor: '#f87979',
        data: ['0']
      }
    ]
  };

  data2 = {
    labels: ['عدد الاناث', 'عدد الذكور'],
    datasets: [
      {
        label: 'عدد الموظفين حسب الجنس',
        backgroundColor: ['#41B883', '#E46651'],
        data: ['0','0']
      }
    ]
  };

  
  constructor(private employeeStatsService: EmployeeStatsService) { 
    this.Load_Data();
  }

  Load_Data(){
    this._Subscription = forkJoin(
      this.Load_NumEmployeeDependenceOnMalak(),
      this.Load_NumEmployeeDependenceOnClass(),
      this.Load_NumEmployeeDependenceOnGender(),
    ).subscribe(
      (res: any) => {
        console.log('data0', res[0]);
        console.log('data1', res[1]);
        console.log('data2', res[2]);

        this.data0= {
          labels: ['عدد الموظفين داخل الملاك'],
          datasets: [
            {
              label: `عدد الموظفين`,
              backgroundColor: '#f87979',
              data: [res[0]+'']
            }
          ]
        };
        this.data1= {labels: res[1].map((obj: any) => obj.CLASS_NAME),
        datasets: [
          {
            label: 'عدد الموظفين حسب الفئة',
            backgroundColor: '#f87979',
            data: res[1].map((obj: any) => obj.ROWCOUNT)
          }
        ]}
        ;
        this.data2= {
          labels: ['عدد الاناث', 'عدد الذكور'],
          datasets: [
            {
              label: 'عدد الموظفين حسب الجنس',
              backgroundColor: ['#41B883', '#E46651'],
              data: [res[2][0].ROWCOUNT, res[2][1].ROWCOUNT]
            }
          ]
        };
      }
    )
  }

  Load_NumEmployeeDependenceOnMalak(){
    return this.employeeStatsService.NumEmployeeDependenceOnMalak();
  }

  Load_NumEmployeeDependenceOnClass(){
    return this.employeeStatsService.NumEmployeeDependenceOnClass();
  }

  Load_NumEmployeeDependenceOnGender(){
    return this.employeeStatsService.NumEmployeeDependenceOnGender();
  }

  ngOnInit(): void {
  }

}
