import { Component, OnInit } from '@angular/core';
import { INavData } from '@coreui/angular';
import { NavService } from '../shared/components/containers/default-layout/nav.service';

@Component({
  selector: 'app-systemservice',
  templateUrl: './systemservice.component.html',
  styleUrls: ['./systemservice.component.scss']
})
export class SystemserviceComponent implements OnInit {


  navItems: INavData[] = [

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
    }
   
   
   
    
  ];

   




 
constructor(private navService:NavService) {
  this.navService.navItems_Subject.next(this.navItems);
 
}

ngOnInit(): void {
  this.navService.navItems_Subject.next(this.navItems);
}

ngOnDestroy() {
  
}

}