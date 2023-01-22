import { Component, OnInit } from "@angular/core";
import { INavData } from "@coreui/angular";
import { NavService } from "../shared/components/containers/default-layout/nav.service";
import { ReturnBtnService } from "../shared/services/return-btn.service";


@Component({
  selector: 'app-finace',
  templateUrl: './finace.component.html',
  styleUrls: ['./finace.component.scss']
})
export class FinaceComponent implements OnInit {
  
  

  navItems: INavData[] = [

    {
      name: 'مديرية الشؤون المالية',
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

   
returnNavItems: INavData[] = [
    {
      name: 'منظومة الشامل',
      url: '/',
      formname:'',
      iconComponent: { name: 'cil-speedometer' }         
    },
    {
      name: 'مديرية الشؤون الادارية' ,
      url: 'employees',
      formname:'مديرية الشؤون الادارية',
      iconComponent: { name: 'cil-pencil' },
    },   
    {
      name: 'مديرية الشؤون المالية' ,
      url: 'finace',
      formname:'مديرية الشؤون المالية',
      iconComponent: { name: 'cil-pencil' },
    },
    {
      name: 'خدمات النظام' ,
      url: 'systemservice',
      formname:'خدمات النظام',
      iconComponent: { name: 'cil-pencil' },
    }
  ];



 
constructor(private navService:NavService,
  private returnBtnService: ReturnBtnService) {
  this.navService.navItems_Subject.next(this.navItems);
 
  this.returnBtnService.navItems= this.returnNavItems;
}

ngOnInit(): void {
  this.navService.navItems_Subject.next(this.navItems);
}

ngOnDestroy() {
  
}

}