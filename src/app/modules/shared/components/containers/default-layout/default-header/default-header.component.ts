import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent, INavData } from '@coreui/angular';
import { TBLShamelUserService } from 'src/app/modules/shared/services/employees_department/tblshamel-user.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { NavService } from '../nav.service';


@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  styleUrls: ['./default-header.component.scss']
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  navItems: INavData[];

  darkTheme: boolean;
  constructor(
    private classToggler: ClassToggleService,
    private userservice:TBLShamelUserService,
    private navService:NavService,
    private themeService: ThemeService
    ) {
    super();
  }
  ngOnInit(): void {
    
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
    
  }
  Logout()
  {
     // this.userservice.();
  }

  employeesClicked(){
    this.navItems = [
      {
        name: 'مديرية الشؤون الادارية',
        url: 'employees',
        iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
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
    this.navService.navItems_Subject.next(this.navItems);
  }

  finaceClicked(){
    this.navItems = [
      {
        name: 'القسم المالي',
        url: '/',
        iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'الوكلاء و الساعات' ,
        url: 'finace/module/broker',
        iconComponent: { name: 'cil-pencil' },
    
      },
  
      {
        name: 'الحسميات' ,
        url: 'finace/module/shatebtax',
        iconComponent: { name: 'cil-pencil' },
      }
      ,
      {
        name: 'الرواتب' ,
        url: 'finace/module/shatebpayrol',
        iconComponent: { name: 'cil-pencil' },
      }
         
    ];
    this.navService.navItems_Subject.next(this.navItems);
  }

  systemserviceClicked(){
    this.navItems = [
      {
        name: 'خدمات النظام',
        url: '/',
        iconComponent: { name: 'cil-speedometer' },
        badge: {
          color: 'info',
          text: 'NEW'
        }
      },
      {
        name: 'المستخدمين' ,
        url: 'systemservice/module/user',
        iconComponent: { name: 'cil-pencil' },
    
      },
  
      {
        name: 'السماحيات' ,
        url: 'systemservice/module/privilige',
        iconComponent: { name: 'cil-pencil' },
      },
  
      {
        name: 'تعريف واجهات البرنامج' ,
        url: 'systemservice/module/programTree',
        iconComponent: { name: 'cil-pencil' },
      },
         
    ];
    this.navService.navItems_Subject.next(this.navItems);
  }

  
}
