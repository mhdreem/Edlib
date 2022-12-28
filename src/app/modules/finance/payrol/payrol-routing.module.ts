import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccounterRefreshComponent } from './componenets/accounter-refresh/accounter-refresh.component';
import { ChangeSalariesComponent } from './componenets/change-salaries/change-salaries.component';
import { MainEntryTblShamelEmployeePageShatebComponent } from './componenets/employee-page-shateb/main-entry-tbl-shamel-employee-page-shateb/main-entry-tbl-shamel-employee-page-shateb.component';
import { InsuranceSalary2SalaryComponent } from './componenets/insurance-salary2-salary/insurance-salary2-salary.component';
import { MainEntryTbLShamelNewPayrolAddComponent } from './componenets/newpayroladd/TbLShamelNewPayrol/main-entry-tbl-shamel-new-payrol-add/main-entry-tbl-shamel-new-payrol-add.component';
import { TbLShamelNewPayrolAddComponent } from './componenets/newpayroladd/TbLShamelNewPayrol/tblshamelnewpayroladd/tblshamel-new-payrol-add.component';
import { TBLShamelNewPayrolTaxComponent } from './componenets/newpayroltax/tblshamel-new-payrol-tax/tblshamel-new-payrol-tax.component';
import { PayrolDifferenceComponent } from './componenets/payrol-difference/payrol-difference.component';
import { SalaryStatisticsComponent } from './componenets/salary-statistics/salary-statistics.component';
import { StoppedSalariesComponent } from './componenets/stopped-salaries/stopped-salaries.component';
import { PayrolComponent } from './payrol.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage',
    pathMatch: 'full'
  },
  {
    path: 'manage', component: PayrolComponent, data:
    {
      title: ''
    },
    children:[
      { path: 'salaryinput', component:  MainEntryTbLShamelNewPayrolAddComponent} ,
      { path: 'ta3weedTaxProgramming', component:  TBLShamelNewPayrolTaxComponent} ,
      { path: 'employeePageShateb', component:  MainEntryTblShamelEmployeePageShatebComponent} ,
      { path: 'stoppedSalary', component:  StoppedSalariesComponent} ,
      { path: 'changeSalary', component:  ChangeSalariesComponent} ,
      { path: 'insuranceSalary2Salary', component:  InsuranceSalary2SalaryComponent} ,
      { path: 'salaryDifference', component:  PayrolDifferenceComponent} ,
      { path: 'accounterMalakRefresh', component:  AccounterRefreshComponent} ,
      { path: 'salaryStatistics', component:  SalaryStatisticsComponent} ,
      
     ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrolRoutingModule { }
