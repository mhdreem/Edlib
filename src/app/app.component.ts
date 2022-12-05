import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router,NavigationEnd } from '@angular/router';
import { INavData } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { NavService } from './modules/shared/components/containers/default-layout/nav.service';
import { iconSubset } from './modules/shared/components/icons/icon-subset';
import { IGlobalEmployeeList } from './modules/shared/services/employees_department/IGlobalEmployeeList';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'منظومة الشامل الإدارية و المالية';
    navItems: INavData[] = [
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
    }
       
  ];
  
  constructor(
    private router: Router,
   private navService:NavService,
    private titleService: Title,
    private iconSetService: IconSetService
  ) {
    this.navService.navItems_Subject.next(this.navItems);
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
   
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

  ngOnInit(): void {  
  }
}



