import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatisticsComponent } from './statistics.component';
import { stats4 } from './stats4/stats4.component';
import { Stats1Component } from './stats1/stats1.component';
import { Stats2Component } from './stats2/stats2.component';
import { Stats3Component } from './stats3/stats3.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'models',
    pathMatch: 'full'
  },
  {
    path: 'models', component: StatisticsComponent, data:
    {
      title: 'نماذج الإحصائيات'
    },
    children:[
      {
        path: 'stats1', component: Stats1Component, data:
        {
          title: 'البحث المبسط'
        }
      },
      {
        path: 'stats2', component: Stats2Component, data:
        {
          title: 'البحث الموسع'
        }
      },
      {
        path: 'stats3', component: Stats3Component, data:
        {
          title: 'إحصائيات وظيفية'
        }
      },
      {
        path: 'stats4', component: stats4, data:
        {
          title: 'احصائيات بين تاريخين'
        }
      }
    ]
  }
            
           
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
