import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { INavData } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { NavService } from '../../shared/components/containers/default-layout/nav.service';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { ReturnBtnService } from '../../shared/services/return-btn.service';


@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  
})
export class UpgradeComponent implements OnInit {

  
  navItems: INavData[] = [

    {      
      name: 'مديرية الشؤون الادارية',
      url: 'employees/module',
      iconComponent: { name: 'cil-pencil' }
    }, 
    {
      title: true,
      name: 'الترفيعات'
    },
  
    {
      name: 'تجهيز ملف الترفيعات',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/prepareUpgradesFile',
  
    },

    {
      name: 'عرض بيانات الترفيع',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/DisplayUpgradeData',
  
    },

    {
      name: 'تهيئة قرارات الترفيع',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/upgradePromotionQarars',
  
    },

    {
      name: 'طباعة قرارات الترفيع',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/printUpgradeQarars',
  
    },

    {
      name: 'طباعة إحالات القرار',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/printReferralQarar',
  
    },

    {
      name: 'تحديث البطاقة الذاتية',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/RefreshEmployeeCart',
  
    },

    {
      name: 'مراسيم زيادة الرواتب',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/IncreaseSalaryMarsoom',
  
    },

    {
      name: 'تحديث ملاك المعتمد',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/refreshAccounterMalak',
  
    },

    {
      name: 'تثبيت دورة الترفيع',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/FixUpgradeYearList',
  
    },

    {
      name: 'مسح ملف الترفيعات',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/clearUpgradesFile',
  
    },
  
    {
      name: 'استبدال أرقام القرار',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/replaceQararNumbers',
  
    },

    {
      name: 'القرارات الوهمية المتبقة',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/upgrades/upgrades/RemainingOldQarars',
  
    },

    
  
  
  
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

