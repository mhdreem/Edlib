import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, debounceTime, finalize, forkJoin, map, Observable, of, startWith, Subscription, switchMap, tap } from 'rxjs';
import { ITBLShamelAccounter } from 'src/app/modules/shared/models/employees_department/TBLShamelAccounter';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { TBLShamelMonth } from 'src/app/modules/shared/models/employees_department/TBLShamelMonth';
import { TBLShamelYear } from 'src/app/modules/shared/models/employees_department/TBLShamelYear';
import { ViewTBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/ViewTBLSamelEmployee';
import { EmployeeServiceService } from 'src/app/modules/shared/services/employees_department/employee-service.service';
import { TBLShamelAccounterService } from 'src/app/modules/shared/services/employees_department/tblshamel-accounter.service';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { ViewTBLShamelEmployeeService } from 'src/app/modules/shared/services/employees_department/view-tbl-shamel-employee.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

import { TblShamelNewPayrolAddPageServiceService } from '../../newpayroladd/TbLShamelNewPayrol/tbl-shamel-new-payrol-add-page-service.service';
import { SearchEmployeeDialogComponent } from '../search-employee-dialog/search-employee-dialog.component';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.scss']
})
export class EmployeeSearchComponent implements OnInit, OnDestroy  {

  _Subscribtion: Subscription = new Subscription();

  // Filtering
  List_Accounter: ITBLShamelAccounter[] = [];
  List_Accounter_Filter: Observable<ITBLShamelAccounter[]> = of([]);

  List_Employee: ViewTBLShamelEmployee[];
  List_Employee_Filter: Observable<ViewTBLShamelEmployee[]>;

  Fixed_Month: TBLShamelMonth;
  Fixed_Year: TBLShamelYear;
  Form: FormGroup;

  isLoadingFinish: boolean;


  ViewTBLShamelEmployee_BehaviorSubject : BehaviorSubject<ViewTBLShamelEmployee> = new BehaviorSubject<ViewTBLShamelEmployee>({});

  darkTheme: boolean;

  constructor(
    public dialog: MatDialog,
    private frmBuilder: FormBuilder,
    private ShamelAccounterService: TBLShamelAccounterService,
    public ShamelMonthService: TBLShamelMonthService,
    public ShamelYearService: TBLShamelYearService,
    public viewTBLShamelEmployeeService: ViewTBLShamelEmployeeService,
    public employeeService: EmployeeServiceService,
    public pageService: TblShamelNewPayrolAddPageServiceService,
    private themeService: ThemeService
  ) {
    this.isLoadingFinish = true;
    this.BuildForm();
    this.LoadData();

    this.ViewTBLShamelEmployee_BehaviorSubject.subscribe(
      res=>
      {
        if (res!= null && res.id!= null && res.id>0)
        {
          this.employeeService.search_by_id(res.id.toString()).
          subscribe(res => {
            if (res!= null && res.id!= null)
            {
              this.pageService.TBLShamelEmployee = res;
              this.pageService.id =  res.id;
              this.pageService.id_BehaviorSubject.next(this.pageService.id);
            }

          });
        }
     
      }
    )
  }

  ngOnDestroy(): void {
    if (this._Subscribtion!= null)
    {
      this._Subscribtion.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

  BuildForm() {
    this.Form = this.frmBuilder.group({
      'accounter_id': new FormControl<number | null>(null),
      'accounterserial': new FormControl<string | null>(null),
      'id': new FormControl<string | null>(null),
      'fullname': new FormControl<string | null>(null)
    });
  }



  LoadAccounter(): Observable<ITBLShamelAccounter[]> {
    if (this.ShamelAccounterService.List_TBLShamelAccounter == null ||
      this.ShamelAccounterService.List_TBLShamelAccounter == undefined ||
      this.ShamelAccounterService.List_TBLShamelAccounter.length == 0)
      return this.ShamelAccounterService.list();
    return of(this.ShamelAccounterService.List_TBLShamelAccounter);
  }

  LoadMonth(): Observable<TBLShamelMonth> {
    return this.ShamelMonthService.GetMonthFixed();
  }

  LoadYear(): Observable<TBLShamelYear> {
    return this.ShamelYearService.GetYearFixed();
  }

  LoadData() {
    this.isLoadingFinish = false;
    this._Subscribtion.add(
      forkJoin(
        [this.LoadAccounter(),
        this.LoadYear(),
        this.LoadMonth()
        ]
      ).subscribe(res => {
        this.isLoadingFinish = true;
        this.List_Accounter = res[0];
        this.ShamelAccounterService.List_TBLShamelAccounter = res[0];
        this.ShamelAccounterService.List_TBLShamelAccounter_BehaviorSubject.next(res[0]);

        this.Fixed_Month = res[2];
        this.Fixed_Year = res[1];

        if (this.Form != null) {
          this.Form.controls['fullname']
            .valueChanges
            .pipe(
              debounceTime(200),
              tap(() => { }),
              switchMap((value: string) => this.viewTBLShamelEmployeeService.getEmpFullName2(value)
                .pipe(
                  finalize(() => { }),
                )
              )
            )
            .subscribe(emps => {
              if (emps != null && emps.length > 0
              ) {
                this.List_Employee = emps;
                this.List_Employee_Filter = of(emps);
                console.log(emps);
              }
            });


          this.List_Accounter_Filter = this.Form.controls['accounter_id'].valueChanges
            .pipe(
              startWith(''),
              map(value => value && typeof value === 'string' ? this._filteredAccounter(value) : this.List_Accounter.slice())
            );


        }


      },
        (error) => console.log(error))
    );
  }



  displayFn(emp: ViewTBLShamelEmployee) {
    if (emp != null && emp.id > 0) {

      return emp.fullname;
    }
    return '';
  }

  displayAccounter(accounter_id: number) {
    if (accounter_id > 0 && this.List_Accounter != null && this.List_Accounter.length > 0) {
      var Accounter = this.List_Accounter.filter(x => x.accounter_id == accounter_id);
      if (Accounter != null && Accounter.length > 0)
        return Accounter[0].accounter_name;
    }
    return '';
  }



  onEmployeeSelected(emp: ViewTBLShamelEmployee) {

    if (emp == null || emp.id == null)
      return;

    const id = emp.id;

    if (id != null && id > 0) {
      this.Form.controls['id'].setValue(id);

      if (emp != null && emp.accounter_id != null && emp.accounter_name != null)
        this.Form.controls['accounter_id'].setValue(emp.accounter_id);

      if (emp != null && emp.accounterserial != null && emp.accounterserial != null)
        this.Form.controls['accounterserial'].setValue(emp.accounterserial);

        this.ViewTBLShamelEmployee_BehaviorSubject.next(emp);
        this.DisplayData(emp);

    }
  }


  private _filteredAccounter(value: string): ITBLShamelAccounter[] {
    if (value!= null ) {
      const filterValue = value;
      return this.List_Accounter.filter(obj => obj.accounter_name.includes(filterValue));

    }
    return this.List_Accounter.slice();
  }



  searchEmployee() {
    const dialogRef = this.dialog.open(SearchEmployeeDialogComponent, {
      width: '750px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  nextSerial() {

    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.AccounterSerial != null) {

      this.viewTBLShamelEmployeeService.next_accounter(this.pageService.TBLShamelEmployee.Accounter_ID, this.pageService.TBLShamelEmployee.AccounterSerial).subscribe(
        res => {
          if (res!= null && res.id!= null && res.id>0)
          {
            this.ViewTBLShamelEmployee_BehaviorSubject.next(res);
            this.DisplayData(res);
          }

        }
      );
    }

  }

  previousSerial() {

    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.Accounter_ID != null &&
      this.pageService.TBLShamelEmployee.AccounterSerial != null) {

      this.viewTBLShamelEmployeeService.prev_accounter(this.pageService.TBLShamelEmployee.Accounter_ID, this.pageService.TBLShamelEmployee.AccounterSerial).subscribe(
        res => {
          if (res!= null && res.id!= null && res.id>0)
          {
            this.ViewTBLShamelEmployee_BehaviorSubject.next(res);
            this.DisplayData(res);
          }                 
        }
      );
    }
  }

  serialChanged() {
    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.Accounter_ID != null &&
      this.pageService.TBLShamelEmployee.AccounterSerial != null) {


      this.viewTBLShamelEmployeeService.search_by_accounter(this.pageService.TBLShamelEmployee.Accounter_ID, this.pageService.TBLShamelEmployee.AccounterSerial).subscribe(
        res => {
          if (res!= null && res.id!= null && res.id>0)
          {
            this.ViewTBLShamelEmployee_BehaviorSubject.next(res);
            this.DisplayData(res);
          }
        }
      );
    }
  }

  nextId() {

    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.id != null) {



      this.employeeService.next_id(this.pageService.TBLShamelEmployee.id.toString()).subscribe(
        res => {
          if (res!= null && res.id!= null && res.id>0)
          {
            this.ViewTBLShamelEmployee_BehaviorSubject.next(res);
            this.DisplayData(res);
          }
        }
      );
    }
  }

  DisplayData(emp:ViewTBLShamelEmployee)
  {
    if (emp == null || emp.id == null)
      return;
  
    if (emp.id != null && emp.id > 0) {

      this.Form.controls['id'].setValue(emp.id);

      this.Form.controls['fullname'].setValue(emp);

      if (emp != null && emp.accounter_id != null && emp.accounter_name != null)
        this.Form.controls['accounter_id'].setValue(emp.accounter_id);

      if (emp != null && emp.accounterserial != null && emp.accounterserial != null)
        this.Form.controls['accounterserial'].setValue(emp.accounterserial);


    }

  }

  previousId() {
    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.id != null) {



      this.employeeService.prev_id(this.pageService.TBLShamelEmployee.id.toString()).subscribe(
        res => {
          if (res!= null && res.id!= null && res.id>0)
          {
            this.ViewTBLShamelEmployee_BehaviorSubject.next(res);
            this.DisplayData(res);
          }
        }
      );
    }
  }

  idChanged() {

    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.id != null) {



      this.employeeService.search_by_id(this.pageService.TBLShamelEmployee.id.toString()).subscribe(
        res => {
          if (res!= null && res.id!= null && res.id>0)
          {
            this.ViewTBLShamelEmployee_BehaviorSubject.next(res);
            this.DisplayData(res);
          }
        }
      );
    }
  }

}
