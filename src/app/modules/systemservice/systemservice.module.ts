import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemserviceRoutingModule } from './systemservice-routing.module';
import { SystemserviceComponent } from './systemservice.component';
import { TBLShamelUserListComponent } from './componenets/user/tblshamel-user-list/tblshamel-user-list.component';
import { TBLShamelUserEditComponent } from './componenets/user/tblshamel-user-edit/tblshamel-user-edit.component';
import { TBLShamelPrivilagesComponent } from './componenets/user/tblshamel-privilages/tblshamel-privilages.component';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SharedModule, AvatarModule, BadgeModule, BreadcrumbModule, ButtonGroupModule, ButtonModule, CardModule, DropdownModule, FooterModule, FormModule, GridModule, HeaderModule, ListGroupModule, NavModule, ProgressModule, SidebarModule, TabsModule, UtilitiesModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { NgxHoverOpacityModule } from 'ngx-hover-opacity';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxPrintModule } from 'ngx-print';
import {MatTreeModule} from '@angular/material/tree'; 


@NgModule({
  declarations: [
    SystemserviceComponent,
    TBLShamelUserListComponent,
    TBLShamelUserEditComponent,
    TBLShamelPrivilagesComponent
  ],
  imports: [
    CommonModule,
    SystemserviceRoutingModule,
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
MatExpansionModule,
MatTreeModule


  ]
})
export class SystemserviceModule { }
