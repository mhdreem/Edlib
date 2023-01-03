import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, finalize, forkJoin, lastValueFrom, map, Observable, of, startWith, Subscription, switchMap, tap } from 'rxjs';
import { ITBLShamelAccounter } from 'src/app/modules/shared/models/employees_department/TBLShamelAccounter';
import { TBLShamelMonth } from 'src/app/modules/shared/models/employees_department/TBLShamelMonth';
import { ViewTBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/ViewTBLSamelEmployee';
import { TblShamelPayrolSlice } from 'src/app/modules/shared/models/finance_department/payrol/tblShamelPayrolSlice';
import { EmployeeServiceService } from 'src/app/modules/shared/services/employees_department/employee-service.service';
import { TBLShamelAccounterService } from 'src/app/modules/shared/services/employees_department/tblshamel-accounter.service';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { ViewTBLShamelEmployeeService } from 'src/app/modules/shared/services/employees_department/view-tbl-shamel-employee.service';
import { TBLShamelNewShatebService } from 'src/app/modules/shared/services/finance_department/payrol/tblshamel-new-shateb.service';
import { TblshamelPayrolSliceService } from 'src/app/modules/shared/services/finance_department/payrol/tblshamel-payrol-slice.service';

@Component({
  selector: 'app-accounter-refresh',
  templateUrl: './accounter-refresh.component.html',
  styleUrls: ['./accounter-refresh.component.scss']
})
export class AccounterRefreshComponent implements OnInit {
  formname:string = 'تحديث ملاك معتمد';

  _Subscription: Subscription;
  
  Form1: FormGroup;
  Form2: FormGroup;
  AccounterName1: FormControl<number | null>;
  AccounterName2: FormControl<number | null>;
  AccounterName3: FormControl<number | null>;
  Autocomplete_EmployeeName_Ctrl1: FormControl<number | null>;
  Autocomplete_EmployeeName_Ctrl2: FormControl<string | null>;
  id1: FormControl<number | null>;
  serial1: FormControl<number | null>;
  id2: FormControl<number | null>;
  serial2: FormControl<number | null>;
  serial3: FormControl<number | null>;
  payrolSlice: FormControl<string | null>;

  //filtering
  Accounter_Name_List1: ITBLShamelAccounter[] = [];
  Accounter_Name_Filter1: Observable<ITBLShamelAccounter[]> = of([]);
  Accounter_Name_List2: ITBLShamelAccounter[] = [];
  Accounter_Name_Filter2: Observable<ITBLShamelAccounter[]> = of([]);
  Accounter_Name_List3: ITBLShamelAccounter[] = [];
  Accounter_Name_Filter3: Observable<ITBLShamelAccounter[]> = of([]);
  filteredEmployeeNameList1: ViewTBLShamelEmployee[] = [];
  filteredEmployeeNameList2: ViewTBLShamelEmployee[] = [];
  payrolSlice_List: TblShamelPayrolSlice[] = [];
  filteredPayrolSliceOptions: Observable<TblShamelPayrolSlice[]>;

  selectedEmployee: ViewTBLShamelEmployee;

  isLoading = false;

  fixedYear: string;
  fixedMonth: TBLShamelMonth;
  constructor(@Inject(DOCUMENT) private _document: Document,
    public viewTBLShamelEmployeeService:ViewTBLShamelEmployeeService,
    private tblShamelAccounterService: TBLShamelAccounterService,
    private fb: UntypedFormBuilder,
    private employeeServiceService: EmployeeServiceService,
    private snackBar: MatSnackBar,
    private tblshamelPayrolSliceService: TblshamelPayrolSliceService,
    private tblShamelNewShatebService: TBLShamelNewShatebService,
    private tblShamelYearService: TBLShamelYearService,
    public ShamelMonthService: TBLShamelMonthService,) {

    this.BuildForm();
    this.Load_Data();
      
   }

   public BuildForm() {
    try {
      this.Form1 = this.fb.group(
        {
          'AccounterName1: ': this.AccounterName1 = new FormControl<number | null>(null),
          'AccounterName3: ': this.AccounterName3 = new FormControl<number | null>(null, [Validators.required]),
          'Autocomplete_EmployeeName_Ctrl1: ': this.Autocomplete_EmployeeName_Ctrl1 = new FormControl<number | null>(null, [Validators.required]),
          'id1: ': this.id1 = new FormControl<number | null>(null, [Validators.required]),
          'serial1: ': this.serial1 = new FormControl<number | null>(null),
          'serial3: ': this.serial3 = new FormControl<number | null>(null, [Validators.required]),
          'payrolSlice: ': this.payrolSlice = new FormControl<string | null>(null, [Validators.required]),
        }
      );

      this.Form2 = this.fb.group(
        {
          'AccounterName2: : ': this.AccounterName2 = new FormControl<number | null>(null, [Validators.required]),
          'Autocomplete_EmployeeName_Ctrl2: ': this.Autocomplete_EmployeeName_Ctrl2 = new FormControl<string | null>(null, [Validators.required]),
          'id2: ': this.id2 = new FormControl<number | null>(null, [Validators.required]),
          'serial2: ': this.serial2 = new FormControl<number | null>(null, [Validators.required]),
        }
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    
    this._Subscription = forkJoin(
      this.Load_TBLShamelAccounter(),
      this.Load_PayrolSlice(),
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
        
        this.Accounter_Name_List3 = res[0];
        this.Accounter_Name_Filter3 = of(this.Accounter_Name_List3);
        this.tblShamelAccounterService.List_TBLShamelAccounter = this.Accounter_Name_List3;
        this.tblShamelAccounterService.List_TBLShamelAccounter_BehaviorSubject.next(this.Accounter_Name_List3);

        this.payrolSlice_List = res[1];
        this.filteredPayrolSliceOptions = of(this.payrolSlice_List);
        this.tblshamelPayrolSliceService.List_payrolSlice = this.payrolSlice_List;
        this.tblshamelPayrolSliceService.List_payrolSlice_BehaviorSubject.next(this.payrolSlice_List);

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

  Load_PayrolSlice(){
    if (this.tblshamelPayrolSliceService.List_payrolSlice == null ||
      this.tblshamelPayrolSliceService.List_payrolSlice == undefined ||
      this.tblshamelPayrolSliceService.List_payrolSlice.length == 0)
      return this.tblshamelPayrolSliceService.list();
    return of(this.tblshamelPayrolSliceService.List_payrolSlice);
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

        this.Accounter_Name_Filter3 = this.AccounterName3.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterAccounter3(value) : this.Accounter_Name_List3.slice())
        );

        this.filteredPayrolSliceOptions = this.payrolSlice.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterPayrolSlice(value) : this.payrolSlice_List.slice())
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

  _filterAccounter3(value: string): ITBLShamelAccounter[]{
    if (value){
      const filterValue = value.toLowerCase();
      return this.Accounter_Name_List3.filter(option => option.accounter_name.toLowerCase().includes(filterValue));
    }
    return this.Accounter_Name_List3.slice();
  }

  private _filterPayrolSlice(value: string): TblShamelPayrolSlice[] {
    const filterValue = value.toLowerCase();

    return this.payrolSlice_List.filter(option => option.slice_name.toLowerCase().includes(filterValue));
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
    this.serial1.disable();
    this.AccounterName3.disable();

    this.Autocomplete_EmployeeName_Ctrl2.disable();
    this.id2.disable();

    this.tblShamelYearService.GetYearFixed().subscribe(
      res => {
        this.fixedYear = res.year_name;
      }
    );

    this.ShamelMonthService.GetMonthFixed().subscribe(
      res => {
        this.fixedMonth = res;
      }
    );
    
  }

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }

  displayFn(id: number) {
    
    if (this.selectedEmployee) { console.log('2222');  return this.selectedEmployee.fullname;}
    return '';
    
  }

  public displayPayrolSlice(value: string): string {
    if (value && this.payrolSlice_List) {
      let cer: any = this.payrolSlice_List.find(cer => cer.slice_id.toString() == value);
      if (cer)
        return cer.slice_name;
    }
    return '';
  }

     add(){
      //  let request = {
      //   id: this.Autocomplete_EmployeeName_Ctrl1.value,
      //   accounterserial: this.AccounterName3.value,
      //   accounter_id: ,
      //   accounter_name: this.displayAccounterNameProperty(this.AccounterName3.value+''),
      //   year_id: this.fixedYear,
      //   month_id: this.fixedMonth 
      //  };
      this.tblShamelNewShatebService.moveAccounter({})
      .subscribe(res => {
        if (res == 1){
          this.snackBar.open('تمت الإضافة بنجاح', '', {
            duration: 3000,
          });
        }
      });
     }

     delete(){
        this.tblShamelNewShatebService.stopAccounter({})
              .subscribe(res => {
                if (res == 1){
                  this.snackBar.open('تم الحذف بنجاح', '', {
                    duration: 3000,
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
            this.fillEmployeeNameAndIdOfDelete(this.serial2.value);
            this.fillAccounterOfDelete();
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
      // else if(operation== 'delete'){
      //   this.fillAccounterAndSerialOfAddDelete();
      //   this.fillIdOfDelete();
      // }
    }

   
    fillAccounterAndSerialOfAdd(){
      this.AccounterName1.setValue(this.selectedEmployee.accounter_id);
      this.serial1.setValue(this.selectedEmployee.accounterserial);
    }

    fillAccounterOfDelete(){
      this.AccounterName2.setValue(this.selectedEmployee.accounter_id);
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
    
    fillEmployeeNameAndIdOfDelete(serial: number){
      this.employeeServiceService.search_by_accounter(this.AccounterName2.value, serial).subscribe(res =>{
        this.selectedEmployee= res;
        this.serial2.setValue(this.selectedEmployee.id);
        this.Autocomplete_EmployeeName_Ctrl2.setValue(this.selectedEmployee.fullname);
      })
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  onSliceSelected(){
    this.tblshamelPayrolSliceService.getLastInThisSlice(
      this.AccounterName2.value,
      this.payrolSlice_List.filter(item => item.slice_id == +this.payrolSlice)[0].slice_from,
      this.payrolSlice_List.filter(item => item.slice_id == +this.payrolSlice)[0].slice_to/2
      ).subscribe(res =>{
        let outputInsurance1= document.getElementById('outputInsurance1');
        outputInsurance1.innerText= res as string;
      });

      this.tblshamelPayrolSliceService.getLastInThisSlice(
        this.AccounterName2.value,
        this.payrolSlice_List.filter(item => item.slice_id == +this.payrolSlice)[0].slice_to/2,
        this.payrolSlice_List.filter(item => item.slice_id == +this.payrolSlice)[0].slice_to
        ).subscribe(res =>{
          let outputInsurance2= document.getElementById('outputInsurance2');
          outputInsurance2.innerText= res as string;
        });
  }
}
