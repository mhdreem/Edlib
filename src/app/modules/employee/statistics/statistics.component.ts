import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../../shared/components/containers/default-layout/nav.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
 
})
export class StatisticsComponent implements OnInit {

  
  

 navItems: INavData[] = [

  {
    title: true,
    name: 'الاحصائيات'
  },

  {
    name: 'البحث المبسط',
    url: 'employees/module/statistics/models/stats1',
    iconComponent: { name: 'cil-pencil' },
  }
  ,

  
  {
    name: 'البحث الموسع',
    iconComponent: { name: 'cil-pencil' },
    url: 'employees/module/statistics/models/stats2',

  },

  {
    name: 'إحصائيات وظيفية',
    iconComponent: { name: 'cil-pencil' },
    url: 'employees/module/statistics/models/stats3',

  },
  {
    name: 'احصائيات بين تاريخين',
    url: 'employees/module/statistics/models/stats4',
    iconComponent: { name: 'cil-pencil' },
  }




];
  

  constructor(private navService:NavService) {
    this.navService.navItems_Subject.next(this.navItems);
  }

  

  ngOnInit(): void {
    
    this.navService.navItems_Subject.next(this.navItems);
  }


}

