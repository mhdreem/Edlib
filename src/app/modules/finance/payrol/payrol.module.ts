import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrolRoutingModule } from './payrol-routing.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SharedModule, AvatarModule, BadgeModule, BreadcrumbModule, ButtonGroupModule, ButtonModule, CardModule, DropdownModule, FooterModule, FormModule, GridModule, HeaderModule, ListGroupModule, NavModule, ProgressModule, SidebarModule, TabsModule, UtilitiesModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {MatRadioModule} from '@angular/material/radio'; 
//////////////////////////////

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
// import the module
import { NgxHoverOpacityModule } from 'ngx-hover-opacity';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};




import {MatProgressBarModule} from '@angular/material/progress-bar'; 


import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
import { TbLShamelNewPayrolAddComponent } from './componenets/newpayroladd/TbLShamelNewPayrol/tblshamelnewpayroladd/tblshamel-new-payrol-add.component';

import {  TBLShamelNewPayrolTaxComponent } from './componenets/newpayroltax/tblshamel-new-payrol-tax/tblshamel-new-payrol-tax.component';

import { PayrolComponent } from './payrol.component';
import { TaxDialogComponent } from './componenets/newpayroladd/tax-dialog/tax-dialog.component';
import { EmployeeSearchComponent } from './componenets/employee/employee-search/employee-search.component';
import { SubTBLShamelNewPayrolTaxComponent } from './componenets/newpayroltax/sub-tblshamel-new-payrol-tax/sub-tblshamel-new-payrol-tax.component';
import { SubTblshamelNewPayrolAddComponent } from './componenets/newpayroladd/TbLShamelNewPayrol/sub-tblshamel-new-payrol-add/sub-tblshamel-new-payrol-add.component';
import { MainEntryTbLShamelNewPayrolAddComponent } from './componenets/newpayroladd/TbLShamelNewPayrol/main-entry-tbl-shamel-new-payrol-add/main-entry-tbl-shamel-new-payrol-add.component';
import { SearchEmployeeDialogComponent } from './componenets/employee/search-employee-dialog/search-employee-dialog.component';
import { EmployeePageShatebComponent } from './componenets/employee-page-shateb/employee-page-shateb.component';
import { PrintEmployeeShatebPageComponent } from './componenets/print/print-employee-shateb-page/print-employee-shateb-page.component';
import { MainEntryTblShamelEmployeePageShatebComponent } from './componenets/employee-page-shateb/main-entry-tbl-shamel-employee-page-shateb/main-entry-tbl-shamel-employee-page-shateb.component';
import {NgxPrintModule} from 'ngx-print';
import { StoppedSalariesComponent } from './componenets/stopped-salaries/stopped-salaries.component';
import { ChangeSalariesComponent } from './componenets/change-salaries/change-salaries.component';
import { InsuranceSalary2SalaryComponent } from './componenets/insurance-salary2-salary/insurance-salary2-salary.component';
import { PayrolDifferenceComponent } from './componenets/payrol-difference/payrol-difference.component';
import { AccounterRefreshComponent } from './componenets/accounter-refresh/accounter-refresh.component';
import { SalaryStatisticsComponent } from './componenets/salary-statistics/salary-statistics.component';
import {MatExpansionModule} from '@angular/material/expansion'; 
import { CommonmoduleModule } from '../../commonmodule/commonmodule.module';


/////////////////////////////




export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};




@NgModule({
  declarations: [   
    TBLShamelNewPayrolTaxComponent,  
    TbLShamelNewPayrolAddComponent,    
    SubTblshamelNewPayrolAddComponent,    
    PayrolComponent,
    TaxDialogComponent,
    EmployeeSearchComponent,
    SubTBLShamelNewPayrolTaxComponent,
    MainEntryTbLShamelNewPayrolAddComponent,
    SearchEmployeeDialogComponent,
    EmployeePageShatebComponent,
    PrintEmployeeShatebPageComponent,
    MainEntryTblShamelEmployeePageShatebComponent,
    StoppedSalariesComponent,
    ChangeSalariesComponent,
    InsuranceSalary2SalaryComponent,
    PayrolDifferenceComponent,
    AccounterRefreshComponent,
    SalaryStatisticsComponent
   ],
  imports: [
    CommonModule,
    PayrolRoutingModule,
    CommonModule,
    CommonmoduleModule,
    InfiniteScrollModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule,  
    MatDividerModule,
  MatToolbarModule, 
  MatButtonModule,
  FlexLayoutModule,
  MatMenuModule,
  MatListModule,
  MatDialogModule,
  MatCardModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatInputModule,
  MatButtonModule,  
  MatGridListModule,
  ScrollingModule ,
  MatToolbarModule ,
  MatSidenavModule ,
  MatIconModule ,
  FormsModule,  
  MatPaginatorModule,
  MatSnackBarModule,
  MatDatepickerModule,
  MomentDateModule,
  MatFormFieldModule,
  FlexLayoutModule  ,
  MatInputModule ,
  MatSelectModule,
  SharedModule,
  PerfectScrollbarModule,
  AvatarModule,
BadgeModule,
BreadcrumbModule,
ButtonGroupModule,
ButtonModule,
CardModule,
DropdownModule,
FooterModule,
FormModule,
GridModule,
HeaderModule,
ListGroupModule,
NavModule,
ProgressModule,
SidebarModule,
TabsModule,
UtilitiesModule,
IconModule,
MatProgressBarModule,
MatProgressSpinnerModule,
MatRadioModule,
NgxHoverOpacityModule,
NgxPrintModule,
MatExpansionModule
  ]
})
export class PayrolModule { }
