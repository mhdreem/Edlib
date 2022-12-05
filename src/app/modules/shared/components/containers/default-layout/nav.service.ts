import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavService {
  
  public  navItems: INavData[] = [

    {
      name: 'منظومة الشامل',
      url: '/',
      formname:'',
      iconComponent: { name: 'cil-speedometer' },
      badge: {
        color: 'info',
        text: 'NEW'
      }    
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
    }     
  ];

  public navItems_Subject : BehaviorSubject< INavData[]>= new BehaviorSubject< INavData[]>(this.navItems);

  constructor() { 
    this.navItems_Subject.subscribe(

    )

  }


  ChangeNav(nav:INavData[])
  {
    this.navItems_Subject.next(nav);
    this.navItems = nav;
  }
}
