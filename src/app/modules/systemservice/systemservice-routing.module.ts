import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TblshamelProgramTreeListComponent } from './componenets/programTree/tblshamel-program-tree-list/tblshamel-program-tree-list.component';
import { TBLShamelPrivilagesComponent } from './componenets/user/tblshamel-privilages/tblshamel-privilages.component';
import { TBLShamelUserListComponent } from './componenets/user/tblshamel-user-list/tblshamel-user-list.component';
import { SystemserviceComponent } from './systemservice.component';

const routes: Routes = [
{
  path: '',
  redirectTo:'module',
  pathMatch:'full'
},

{
  path: 'module',
  component: SystemserviceComponent,
 
  children:[

    {
      path: 'user',
  
      data: {
        title: 'المستخدمين'
      },
      component:TBLShamelUserListComponent
      
    },
    
    {
      path: 'privilige',
  
      data: {
        title: 'السماحيات'
      },
      component:TBLShamelPrivilagesComponent
      
    },

    {
      path: 'programTree',
  
      data: {
        title: 'تعريف واجهات البرنامج'
      },
      component:TblshamelProgramTreeListComponent
      
    },

  ]
}
   

  

];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemserviceRoutingModule { }
