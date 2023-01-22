import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../../shared/components/containers/default-layout/nav.service';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { ReturnBtnService } from '../../shared/services/return-btn.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
 
})
export class StatisticsComponent implements OnInit {

  
  

 navItems: INavData[] = [
  {      
    name: 'مديرية الشؤون الادارية',
    url: 'employees/module',
    iconComponent: { name: 'cil-pencil' }
  }, 
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
  


returnNavItems: INavData[] = [
  {
    title: true,
    name: 'مديرية الشؤون الادارية',
    formname: 'مديرية الشؤون الادارية',
    url: 'employees',
  },

  {
    name: 'ش.ادارية البطاقة الذاتية',
    url: 'employees/module/employeecards',
    formname:'ش.ادارية البطاقة الذاتية',
    iconComponent: { name: 'cil-pencil' }
  }
  ,
  {
    name: 'ش.ادارية الترفيعات والزيادات',
    formname: 'ش.ادارية الترفيعات والزيادات',
    iconComponent: { name: 'cil-pencil' },
    url: 'employees/module/upgrades',

  },  
  {
    name: 'ش.ادارية شؤون العاملين',
    formname: 'ش.ادارية شؤون العاملين',
    url: 'employees/module/employeeaffairs',
    iconComponent: { name: 'cil-pencil' },
  },
  {
    name: 'ش.ادارية الاحصائيات',
    formname: 'ش.ادارية الاحصائيات',
    iconComponent: { name: 'cil-pencil' },
    url: 'employees/module/statistics',

  }
];
constructor(private navService:NavService,
  private router: Router,
  private returnBtnService: ReturnBtnService) {
    this.navService.navItems_Subject.next(this.navItems);
    this.router.events
      .subscribe(
        (event: NavigationEvent) => {
          if(event instanceof NavigationStart) {
      if (event.navigationTrigger === 'popstate') {
        this.navService.navItems_Subject.next(this.navItems);
      }
              
          }
        });

    this.returnBtnService.navItems= this.returnNavItems;
    this.returnBtnService.returnUrl= 'http://localhost:4200/employees/module/statistics/models';
}


  

  ngOnInit(): void {
    
    
  }


}

