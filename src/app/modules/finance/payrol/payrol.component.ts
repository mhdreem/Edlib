import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../../shared/components/containers/default-layout/nav.service';
import { ReturnBtnService } from '../../shared/services/return-btn.service';

@Component({
  selector: 'app-payrol',
  templateUrl: './payrol.component.html',
  styleUrls: ['./payrol.component.scss']
})
export class PayrolComponent implements OnInit {

  navItems: INavData[] = [

    {
      name: 'الرواتب',
      url: '/',
      iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      name: 'إدخال بيانات الراتب' ,
      url: 'finace/module/shatebpayrol/manage/salaryinput',
      iconComponent: { name: 'cil-pencil' },
  
    },
    
    {
      name: 'برمجة التعويض والحسم' ,
      url: 'finace/module/shatebpayrol/manage/ta3weedTaxProgramming',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'صفحة شطب عامل' ,
      url: 'finace/module/shatebpayrol/manage/employeePageShateb',
      iconComponent: { name: 'cil-pencil' },
  
    },
    {
      name: 'الرواتب المتوقفة' ,
      url: 'finace/module/shatebpayrol/manage/stoppedSalary',
      iconComponent: { name: 'cil-pencil' },
  
    },
    {
      name: 'الرواتب المتبدلة' ,
      url: 'finace/module/shatebpayrol/manage/changeSalary',
      iconComponent: { name: 'cil-pencil' },
  
    },
    {
      name: 'التأميني = المقطوع' ,
      url: 'finace/module/shatebpayrol/manage/insuranceSalary2Salary',
      iconComponent: { name: 'cil-pencil' },
  
    },
    
    {
      name: 'فروقات ترفيعات وزيادات' ,
      url: 'finace/module/shatebpayrol/manage/salaryDifference',
      iconComponent: { name: 'cil-pencil' },
  
    },
    
    {
      name: 'تحديث ملاك معتمد' ,
      url: 'finace/module/shatebpayrol/manage/accounterMalakRefresh',
      iconComponent: { name: 'cil-pencil' },
  
    },
    
    {
      name: 'احصائيات' ,
      url: 'finace/module/shatebpayrol/manage/salaryStatistics',
      iconComponent: { name: 'cil-pencil' },
  
    },
    
   
    
  ];

   
  returnNavItems: INavData[] = [
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



 
constructor(private navService:NavService,
  private returnBtnService: ReturnBtnService) {
  this.navService.navItems_Subject.next(this.navItems);
 
  this.returnBtnService.navItems= this.returnNavItems;
  this.returnBtnService.returnUrl= 'http://localhost:4200/finace/module';
}

ngOnInit(): void {
  this.navService.navItems_Subject.next(this.navItems);
}

ngOnDestroy() {
  
}

}