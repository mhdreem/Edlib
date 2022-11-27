import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription, take, takeUntil } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { ViewTBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/ViewTBLSamelEmployee';
import { ViewTBLSamelEmployeeSearch } from 'src/app/modules/shared/models/employees_department/ViewTBLSamelEmployeeSearch';
import { EmployeeServiceService } from 'src/app/modules/shared/services/employees_department/employee-service.service';
import { IGlobalEmployeeList } from 'src/app/modules/shared/services/employees_department/IGlobalEmployeeList';
import { ViewTBLShamelEmployeeService } from 'src/app/modules/shared/services/employees_department/view-tbl-shamel-employee.service';
import { EmployeePageService } from '../employee-page-service';



@Component({
  selector: 'app-employee-list-search',
  templateUrl: './employee-list-search.component.html',
  styleUrls: ['./employee-list-search.component.scss']
})
export class EmployeeListSearchComponent implements OnInit {
  // List For Table
  TBLShamelEmployee_List: ViewTBLShamelEmployee[] = [];
  // Selected  overtime_employee
  Selected_Employee: TBLShamelEmployee;
  //
  Selected_Search_Request : any ;
  _Subscription:Subscription = new Subscription();

  //Variable For Scroll
  PageIndex: number = 1;
  fcl_EmployeeName: FormControl<string|null> ;
  fcl_Payrol_ID:  FormControl<string|null> ;
  fcl_Global_ID:  FormControl<string|null> ;
  fcl_Insurance_ID: FormControl<number|null> ;
  fcl_Computer_ID: FormControl<number|null> ;
  fcl_Employee_ID: FormControl<number|null> ;

  
  Payrol_ID_Sort: string ;
  Global_ID_Sort: string ;
  Insurance_ID_Sort: string ;
  Computer_ID_Sort: string ;
  

  EmployeeName_Sort: string ;
  Employee_ID_Sort: string ;



  @Output() OnFindEmployee = new EventEmitter<TBLShamelEmployee>();

Form:FormGroup;



  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private pageService:EmployeePageService,
    public restApi:EmployeeServiceService,
    public viewTBLShamelEmployeeService:ViewTBLShamelEmployeeService,
    public GlobalEmployeeList : IGlobalEmployeeList,
    public dialog: MatDialog) {
      this.PageIndex =1;

      this.Form =this.fb.group({
        'fcl_EmployeeName':this.fcl_EmployeeName = new  FormControl<string|null>(null) ,
        'fcl_Payrol_ID':this.fcl_Payrol_ID=new  FormControl<string|null> (null),
        'fcl_Global_ID':this.fcl_Global_ID=new FormControl<string|null> (null),
        'fcl_Insurance_ID':this.fcl_Insurance_ID=new FormControl<number|null> (null),
        'fcl_Computer_ID':this.fcl_Computer_ID=new FormControl<number|null> (null),
        'fcl_Employee_ID':this.fcl_Employee_ID=new FormControl<number|null>(null) 
      });

      this.pageService.Subject_Selected_ViewTBLSamelEmployeeSearch.subscribe(
        data=>
        {
          this.RefreshList();
        }
      )

     }


  ngOnInit(): void {
  }

  SelectItemChange (Selected_Employee: ViewTBLShamelEmployee)
  {
   
    this.Selected_Employee = Selected_Employee;
    
    this.pageService.Subject_Selected_ViewTBLSamelEmployee.next(this.Selected_Employee);

    this.pageService.Selected_ViewTBLSamelEmployee=this.Selected_Employee;
    // this.router.navigate(['employeeinfo'],{ relativeTo: this.route });

  }

  OnInputEmployeeNameChange(value:any,sort:boolean =true)
  {
    
    if (this.pageService.Selected_ViewTBLSamelEmployeeSearch )
    {
     

      this.PageIndex =1;
      this.TBLShamelEmployee_List = [];
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.fullName = this.fcl_EmployeeName.value;
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.fullname_sort =  sort;      
      this.pageService.Subject_Selected_ViewTBLSamelEmployeeSearch?.next(this.pageService.Selected_ViewTBLSamelEmployeeSearch);
     
    }
   
      

  }

  OnInputEmployeeIDChange($event:any,sort:boolean =true)
  {
    if (this.pageService.Selected_ViewTBLSamelEmployeeSearch )
    {
      this.PageIndex =1;
      this.TBLShamelEmployee_List = [];
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.id = this.fcl_Employee_ID.value;
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.id_sort =  sort;      
      this.pageService.Subject_Selected_ViewTBLSamelEmployeeSearch?.next(this.pageService.Selected_ViewTBLSamelEmployeeSearch);
    }
  }


  OnInputEmployeeComputerIDChange($event:any,sort:boolean =true)
  {
    if (this.pageService.Selected_ViewTBLSamelEmployeeSearch )
    {
      this.PageIndex =1;
      this.TBLShamelEmployee_List = [];
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.computer_ID = this.fcl_Computer_ID.value;
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.computer_id_sort =  sort;      
      this.pageService.Subject_Selected_ViewTBLSamelEmployeeSearch?.next(this.pageService.Selected_ViewTBLSamelEmployeeSearch);
    }

  }
  OnInputEmployeeGlobalIDChange($event:any,sort:boolean =true)
  {
    if (this.pageService.Selected_ViewTBLSamelEmployeeSearch )
    {
      this.PageIndex =1;
      this.TBLShamelEmployee_List = [];
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.global_ID = this.fcl_Global_ID.value;
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.global_id_sort =  sort;      
      this.pageService.Subject_Selected_ViewTBLSamelEmployeeSearch?.next(this.pageService.Selected_ViewTBLSamelEmployeeSearch);
    }
  }
  OnInputEmployeePayrolIDChange($event:any,sort:boolean =true)
  {
    if (this.pageService.Selected_ViewTBLSamelEmployeeSearch )
    {
      this.PageIndex =1;
      this.TBLShamelEmployee_List = [];
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.payrol_ID = this.fcl_Payrol_ID.value;
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.payrol_id_sort =  sort;      
      this.pageService.Subject_Selected_ViewTBLSamelEmployeeSearch?.next(this.pageService.Selected_ViewTBLSamelEmployeeSearch);
    }
  }

  OnInputEmployeeInsuranceIDChange($event:any,sort:boolean =true)
  {
    if (this.pageService.Selected_ViewTBLSamelEmployeeSearch )
    {

      this.PageIndex =1;
      this.TBLShamelEmployee_List = [];
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.insurance_ID = this.fcl_Insurance_ID.value;
      this.pageService.Selected_ViewTBLSamelEmployeeSearch.payrol_id_sort =  sort;      
      this.pageService.Subject_Selected_ViewTBLSamelEmployeeSearch?.next(this.pageService.Selected_ViewTBLSamelEmployeeSearch);
    }
  }

  RefreshList()
  {    
    this._Subscription.add(

      this.viewTBLShamelEmployeeService.List_ViewTBLSamelEmployee(this.PageIndex,this.pageService?.Selected_ViewTBLSamelEmployeeSearch) .pipe(
        map(value => value),
        take(1),
        takeUntil(this.TBLShamelEmployee_List)
     ).subscribe(
        data=>
        {             
         if (this.TBLShamelEmployee_List == null || this.TBLShamelEmployee_List == undefined || this.TBLShamelEmployee_List.length==0)
            this.TBLShamelEmployee_List= data ;
        else       
            this.TBLShamelEmployee_List.concat(data)  ;
  
            console.log('complete');
        }
      )
    )
  

  }


  trackByFn(index:number, item:ViewTBLShamelEmployee) {    
    return item.id; // unique id corresponding to the item
 }


  onScroll() {
    console.log(this.PageIndex);
    this.PageIndex = this.PageIndex + 1;
    console.log(this.PageIndex);
    this.RefreshList();
  }

  public ngOnDestroy (): void {
   this._Subscription.unsubscribe();
}


}
