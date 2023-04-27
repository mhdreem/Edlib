import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, finalize, forkJoin, lastValueFrom, map, Observable, of, startWith, Subscription, switchMap, tap } from 'rxjs';
import { IEmployeeNameList } from 'src/app/modules/shared/models/employees_department/IEmployeeNameList';
import { ITBLShamelAccounter } from 'src/app/modules/shared/models/employees_department/TBLShamelAccounter';
import { ViewTBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/ViewTBLSamelEmployee';
import { EmployeeServiceService } from 'src/app/modules/shared/services/employees_department/employee-service.service';
import { TBLShamelAccounterService } from 'src/app/modules/shared/services/employees_department/tblshamel-accounter.service';
import { ViewTBLShamelEmployeeService } from 'src/app/modules/shared/services/employees_department/view-tbl-shamel-employee.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-refresh-accounter-malak',
  templateUrl: './refresh-accounter-malak.component.html',
  styleUrls: ['./refresh-accounter-malak.component.scss']
})
export class RefreshAccounterMalakComponent implements OnInit, OnDestroy {
  formname:string = 'تحديث ملاك معتمد';
  
  _Subscription: Subscription;
  
  Form1: FormGroup;
  Form2: FormGroup;
  AccounterName1: FormControl<number | null>;
  AccounterName2: FormControl<number | null>;
  Autocomplete_EmployeeName_Ctrl1: FormControl<number | null>;
  Autocomplete_EmployeeName_Ctrl2: FormControl<number | null>;
  id1: FormControl<number | null>;
  serial1: FormControl<number | null>;
  id2: FormControl<number | null>;
  serial2: FormControl<number | null>;

  //filtering
  Accounter_Name_List1: ITBLShamelAccounter[] = [];
  Accounter_Name_Filter1: Observable<ITBLShamelAccounter[]> = of([]);
  Accounter_Name_List2: ITBLShamelAccounter[] = [];
  Accounter_Name_Filter2: Observable<ITBLShamelAccounter[]> = of([]);
  filteredEmployeeNameList1: ViewTBLShamelEmployee[] = [];
  filteredEmployeeNameList2: ViewTBLShamelEmployee[] = [];

  selectedEmployee: ViewTBLShamelEmployee;

  isLoading = false;

  darkTheme: boolean;

  constructor(public viewTBLShamelEmployeeService:ViewTBLShamelEmployeeService,
    private tblShamelAccounterService: TBLShamelAccounterService,
    private fb: UntypedFormBuilder,
    private employeeServiceService: EmployeeServiceService,
    private snackBar: MatSnackBar,
    private themeService: ThemeService) {

    this.BuildForm();
    this.Load_Data();
      
   }

   public BuildForm() {
    try {
      this.Form1 = this.fb.group(
        {
          'AccounterName1': this.AccounterName1 = new FormControl<number | null>(null, [Validators.required]),
          'Autocomplete_EmployeeName_Ctrl1': this.Autocomplete_EmployeeName_Ctrl1 = new FormControl<number | null>(null, [Validators.required]),
          'id1': this.id1 = new FormControl<number | null>(null, [Validators.required]),
          'serial1': this.serial1 = new FormControl<number | null>(null, [Validators.required]),
        }
      );

      this.Form2 = this.fb.group(
        {
          'AccounterName2': this.AccounterName2 = new FormControl<number | null>(null, [Validators.required]),
          'Autocomplete_EmployeeName_Ctrl2': this.Autocomplete_EmployeeName_Ctrl2 = new FormControl<number | null>(null, [Validators.required]),
          'id2': this.id2 = new FormControl<number | null>(null, [Validators.required]),
          'serial2': this.serial2 = new FormControl<number | null>(null, [Validators.required]),
        }
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    
    this._Subscription = forkJoin(
      this.Load_TBLShamelAccounter(),
    ).subscribe(
      res => {
        this.Accounter_Name_List1 = res[0];
        this.Accounter_Name_Filter1 = of(this.Accounter_Name_List1);
        this.tblShamelAccounterService.List_TBLShamelAccounter = this.Accounter_Name_List1;
        this.tblShamelAccounterService.List_TBLShamelAccounter_BehaviorSubject.next(this.Accounter_Name_List1);

        this.Accounter_Name_List2 = res[0];
        this.Accounter_Name_Filter2 = of(this.Accounter_Name_List2);
        this.tblShamelAccounterService.List_TBLShamelAccounter = this.Accounter_Name_List2;
        this.tblShamelAccounterService.List_TBLShamelAccounter_BehaviorSubject.next(this.Accounter_Name_List2);

        this.Init_AutoComplete();
      }
      
    )

    this.Autocomplete_EmployeeName_Ctrl1
   
    .valueChanges
    .pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap((value: any) => this.viewTBLShamelEmployeeService.getEmpFullName2( value)
      .pipe(
        finalize(() => {this.isLoading = false; })),
        )
      )
    .subscribe(
      emps => {
        this.filteredEmployeeNameList1 = emps; 
        
      });

      this.Autocomplete_EmployeeName_Ctrl2
   
    .valueChanges
    .pipe(
      debounceTime(300),
      tap(() => this.isLoading = true),
      switchMap((value:any) => this.viewTBLShamelEmployeeService.getEmpFullName2( value)
      .pipe(
        finalize(() => {this.isLoading = false;}),
        )
      )
    )
    .subscribe(
      emps => {
        this.filteredEmployeeNameList2 = emps; 
        
      });
  }

  Load_TBLShamelAccounter(){
    if (this.tblShamelAccounterService.List_TBLShamelAccounter == null ||
      this.tblShamelAccounterService.List_TBLShamelAccounter == undefined ||
      this.tblShamelAccounterService.List_TBLShamelAccounter.length == 0)
      return this.tblShamelAccounterService.list();
    return of(this.tblShamelAccounterService.List_TBLShamelAccounter);
  }
  

  public async Init_AutoComplete() {
    try {
      this.Accounter_Name_Filter1 = this.AccounterName1.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterAccounter1(value) : this.Accounter_Name_List1.slice())
        );

        this.Accounter_Name_Filter2 = this.AccounterName2.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterAccounter2(value) : this.Accounter_Name_List2.slice())
        );

      
    } catch (Exception: any) { }
  }

  _filterAccounter1(value: string): ITBLShamelAccounter[]{
    if (value){
      const filterValue = value.toLowerCase();
      return this.Accounter_Name_List1.filter(option => option.accounter_name?.toLowerCase().includes(filterValue));
    }
    return this.Accounter_Name_List1.slice();
  }

  _filterAccounter2(value: string): ITBLShamelAccounter[]{
    if (value){
      const filterValue = value.toLowerCase();
      return this.Accounter_Name_List2.filter(option => option.accounter_name.toLowerCase().includes(filterValue));
    }
    return this.Accounter_Name_List2.slice();
  }

  public displayAccounterNameProperty(value: string): string {
    if (value && this.Accounter_Name_List1) {
      let cer: any = this.Accounter_Name_List1.find(cer => cer.accounter_id.toString() == value);
      if (cer)
        return cer.accounter_name;
    }
    return '';
  }

  ngOnInit(): void {
    this.serial2.disable();
    this.AccounterName2.disable();

    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
    
  }

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }

  displayFn(id: number) {
    
    if (this.selectedEmployee) { console.log('2222');  return this.selectedEmployee.fullname;}
    return '';
    
  }

     add(){
      this.employeeServiceService.SetEmployeeAccounter(+this.AccounterName1.value, this.serial1.value, this.id1.value )
      .subscribe(res => {
        if (res == 1){
          this.snackBar.open('تمت الإضافة بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar']
          });
        }
      });
     }

     delete(){
        this.employeeServiceService.UnSetEmployeeAccounter(this.id2.value )
              .subscribe(res => {
                if (res == 1){
                  this.snackBar.open('تم الحذف بنجاح', '', {
                    duration: 3000,
                    panelClass: ['green-snackbar']
                  });
                }
              });
     }

     onIdSelect(operation: string){
        if(operation== 'add'){
          this.getEmployee(this.id1.value).then(res =>{
            this.fillEmployeeNameOfAdd(this.id1.value);
            this.fillAccounterAndSerialOfAdd();
            // console.log('111',this.Autocomplete_EmployeeName_Ctrl1.value);
          });
        }
        else if(operation== 'delete'){
          this.getEmployee(this.id1.value).then(res =>{
            this.fillEmployeeNameOfDelete(this.id2.value);
            this.fillAccounterAndSerialOfAddDelete();
          });
        }
      }
      getEmployee(id: number){
        return lastValueFrom(this.employeeServiceService.search_by_id(id+'')).then((emp: ViewTBLShamelEmployee) =>{
          this.selectedEmployee= emp;
        });

      }

    onEmployeeSelected(operation: string){
      if(operation== 'add'){
        this.fillAccounterAndSerialOfAdd()
      this.fillIdOfAdd();
      }
      else if(operation== 'delete'){
        this.fillAccounterAndSerialOfAddDelete();
        this.fillIdOfDelete();
      }
    }

   
    fillAccounterAndSerialOfAdd(){
      this.AccounterName1.setValue(this.selectedEmployee.accounter_id);
      this.serial1.setValue(this.selectedEmployee.accounterserial);
    }

    fillAccounterAndSerialOfAddDelete(){
      this.AccounterName2.setValue(this.selectedEmployee.accounter_id);
    this.serial2.setValue(this.selectedEmployee.accounterserial);
    }

    fillIdOfAdd(){
    this.id1.setValue(+this.Autocomplete_EmployeeName_Ctrl1);
    }

    fillIdOfDelete(){
    this.id2.setValue(+this.Autocomplete_EmployeeName_Ctrl2);
    }

    fillEmployeeNameOfAdd(id: number){
        this.Autocomplete_EmployeeName_Ctrl1.setValue(id);
    }
    
    fillEmployeeNameOfDelete(id: number){
      this.Autocomplete_EmployeeName_Ctrl2.setValue(id);
  }
}
