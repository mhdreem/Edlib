import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { INavData } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { NavService } from '../../shared/components/containers/default-layout/nav.service';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';


@Component({
  selector: 'app-upgrade',
  templateUrl: './upgrade.component.html',
  
})
export class UpgradeComponent implements OnInit {

  
  navItems: INavData[] = [

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
    
  
  constructor(private navService:NavService,
    private router: Router) {
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
  }
  
  ngOnInit(): void {
    

  }


}

