import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../../shared/components/containers/default-layout/nav.service';
import { ReturnBtnService } from '../../shared/services/return-btn.service';

@Component({
  selector: 'app-shatebtax',
  templateUrl: './shatebtax.component.html',
  styleUrls: ['./shatebtax.component.scss']
})
export class ShatebtaxComponent implements OnInit {


  navItems: INavData[] = [

    {
      name: 'شطب الحسميات',
      url: '/',
      iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      name: 'شطب الإجازات الصحية' ,
      url: 'finace/module/shatebtax/manage/health',
      iconComponent: { name: 'cil-pencil' },
  
    },
   
    {
      name: 'شطب العقوبات' ,
      url: 'finace/module/shatebtax/manage/punishment',
      iconComponent: { name: 'cil-pencil' },
    }
    ,
    {
      name: 'شطب الحسميات' ,
      url: 'finace/module/shatebtax/manage/vartax',
      iconComponent: { name: 'cil-pencil' },
    }
   
   
    
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