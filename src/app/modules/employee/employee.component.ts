import { Component, OnInit, AfterViewInit, OnDestroy, AfterContentChecked, ChangeDetectorRef, AfterContentInit, Inject, HostListener, Renderer2 } from "@angular/core";
import { INavData } from "@coreui/angular";
import { NavService } from "../shared/components/containers/default-layout/nav.service";
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { PlatformLocation } from "@angular/common";
import { DOCUMENT } from '@angular/common';
import { EmployeeStatsService } from "../shared/services/employees_department/employee-stats.service";
import { forkJoin, Subscription } from "rxjs";
import { style } from "@angular/animations";





@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
  /*
  host:{
    'document:visibilitychange':'visibilitychange()'
  }
 */
})
export class EmployeeComponent implements OnInit , OnDestroy {
  


  private unlistener: () => void;
  navItems: INavData[] = [

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
    private location: PlatformLocation,    
    private renderer2: Renderer2,
    ) {
      this.navService.navItems_Subject.next(this.navItems);
      
  }

  ngOnInit(): void {    
  }

  

/*
  @HostListener('document:visibilitychange', ['$event'])
          visibilitychange() {
            this.checkHiddenDocument();
          }
        
            checkHiddenDocument(){
            if (document.hidden){
        console.log('df gdsf gsdfg s');
            } else {
              this.navService.navItems_Subject.next(this.navItems);
            }
        
        }
  
*/

  ngOnDestroy() {    
  }

  
}


