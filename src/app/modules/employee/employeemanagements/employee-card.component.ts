import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { INavData } from '@coreui/angular';
import { NavService } from '../../shared/components/containers/default-layout/nav.service';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.scss']
})
export class EmployeeCardComponent implements OnInit {

  
  navItems: INavData[] = [
    {      
      name: 'مديرية الشؤون الادارية',
      url: 'employees/module',
      iconComponent: { name: 'cil-pencil' }
    }, 
    {
      title: true,
      name: 'البطاقة الذاتية',
      url: 'employees/module/employeecards',
    },  
    {
      name: 'إدخال بطاقة موظف',
      url: 'employees/module/employeecards/Cards/NewEmployeeCard',
      iconComponent: { name: 'cil-pencil' },
      formname:'ManageEmployeeDataCardFrame1'
    }
    ,
    {
      name: 'البيانات الشخصية',
      url: 'employees/module/employeecards/Cards/manage/employeeinfo',
      iconComponent: { name: 'cil-pencil' },
      formname:'ManageEmployeeDataCardFrame1'
    }
    ,
    
    {
      name: 'المؤهل العلمي',
      url: 'employees/module/employeecards/Cards/manage/education',
      iconComponent: { name: 'cil-pencil' },
      formname:'ManageSCEducationFrame1'
    }
    ,
    
    {
      name: 'الدراسات والدورات',
      url: 'employees/module/employeecards/Cards/manage/course',
      iconComponent: { name: 'cil-pencil' },
      formname:'ManageSCCourseFrame1'
    }
    ,
  
    {
      name: 'الوضع الوظيفي',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/employeecards/Cards/manage/scjobstate',
      formname:'ManageSCJobStateFrame1'
  
    },

    {
      name: 'الإجازات الخاصة',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/employeecards/Cards/manage/scfreeholiday',
      formname:'ManageSCFreeHolidayFrame1'
  
    },

    {
      name: 'المكافئات',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/employeecards/Cards/manage/bonus',
      formname:'ManageSCBonusFrame1'
  
    },

    {
      name: 'العقوبات',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/employeecards/Cards/manage/punishment',
      formname:'ManageSCPunishmentFrame1'
    },

    
    
    
    
    
    
    {
      name: 'طباعة بطاقة',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/employeecards/Cards/manage/printcard',
      formname:'ManageEmployeePrintCardFrame1'
    },
    {
      name: 'مراسيم الزيادة',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/employeecards/Cards/manage/incmarsoom',
      formname:'ManageSCIncMarsoomFrame1'
    },
    {
      name: 'بيانات الخدمة',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/employeecards/Cards/manage/jobservicedata',
      formname:'ManageM1EmpServiceFrame1'
    },
    {
      name: 'حذف بطاقة',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/employeecards/Cards/manage/deleteemployee',
      formname:'ManageEmployeeDeleteIDFrame1'
    },
    {
      name: 'تغيير رقم البطاقة',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/employeecards/Cards/manage/changeid',
      formname:'ManageEmployeeChangeIDFrame1'
    },
    {
      name: 'عرض تشابه الاسماء',
      iconComponent: { name: 'cil-pencil' },
      url: 'employees/module/employeecards/Cards/manage/changeid',
      formname:'ManageEmployeeDuplicatedFrame1'
    },    
    {
      title: true,
      name: 'جداول الترميز',
      formname:'CodingTablesManageEmpCard1'
    },
    {
      name: 'الشهادات',
  
      url: 'employees/module/employeecards/Cards/encoding/certificate',
      iconComponent: { name: 'cil-pencil' },
      formname:''
    },
    {
      name: 'الاختصاص',
  
      url: 'employees/module/employeecards/Cards/encoding/specification',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    },
    {
      name: 'الدورات',
  
      url: 'employees/module/employeecards/Cards/encoding/course',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    }
  
    , {
      name: 'التقييم',
  
      url: 'employees/module/employeecards/Cards/encoding/rank',
      iconComponent: { name: 'cil-pencil' },
      formname:''
    },
    {
      name: 'المراكز الوظيفية',
  
      url: 'employees/module/employeecards/Cards/encoding/department',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    },
    {
      name: 'نوع الوظيفة',
  
      url: 'employees/module/employeecards/Cards/encoding/jobkind',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    }
  
    ,
    {
      name: 'اسباب التبدل',
  
      url: 'employees/module/employeecards/Cards/encoding/changereason',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    }
  
  
    ,
    {
      name: 'سبب الإجازة الخاصة',
  
      url: 'employees/module/employeecards/Cards/encoding/freeholidayreason',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    },
  
  
    {
      name: 'سبب المكافأة',
  
      url: 'employees/module/employeecards/Cards/encoding/bonusreason',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    },
  
    {
      name: 'المكافئات',
  
      url: 'employees/module/employeecards/Cards/encoding/bonus',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    },
  
    {
      name: 'جدول صفة تذييل الطباعة',
  
      url: 'employees/module/employeecards/Cards/encoding/footerh1',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    },
  
    {
      name: 'جدول اسم تذييل الطباعة',
  
      url: 'employees/module/employeecards/Cards/encoding/footerh2',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    },
  
    {
      name: 'جدول الصفة الوظيفية',
  
      url: 'employees/module/employeecards/Cards/encoding/jobname',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    },
  
  
    {
      name: 'جدول نوع المستند',
  
      url: 'employees/module/employeecards/Cards/encoding/documenttype',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    },
  
  
    {
      name: 'العقوبات',
  
      url: 'employees/module/employeecards/Cards/encoding/punishment',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    },
  
    {
      name: 'جدول سبب العقوبة',
  
      url: 'employees/module/employeecards/Cards/encoding/punishmentreason',
      iconComponent: { name: 'cil-pencil' },
      formname:''
  
    }
  
  ,
  {
    name: 'ادخال بطاقة شخصية',
    url: 'employees/module/employeecards/Cards/manage/newemployee',
    iconComponent: { name: 'cil-pencil' },
    formname:''
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
