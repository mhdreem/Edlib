import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { debounceTime, finalize, forkJoin, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { TBLShamelArea } from 'src/app/modules/shared/models/employees_department/TBLShamelArea';
import { TBLShamelMonth } from 'src/app/modules/shared/models/employees_department/TBLShamelMonth';
import { TBLShamelYear } from 'src/app/modules/shared/models/employees_department/TBLShamelYear';
import { TblShamelBrokerEmployee } from 'src/app/modules/shared/models/finance_department/broker/TblShamelBrokerEmployee';
import { TblShamelBrokerShateb } from 'src/app/modules/shared/models/finance_department/broker/TblShamelBrokerShateb';
import { TblShamelMoneyM3PayDest } from 'src/app/modules/shared/models/finance_department/broker/TblShamelMoneyM3PayDest';
import { TBLShamelAreaService } from 'src/app/modules/shared/services/employees_department/tblshamel-area.service';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TblShamelBrokerEmployeeService } from 'src/app/modules/shared/services/finance_department/broker/tbl-shamel-broker-employee.service';
import { TblShamelBrokerShatebService } from 'src/app/modules/shared/services/finance_department/broker/tbl-shamel-broker-shateb.service';
import { TblShamelMoneyM3PayDestService } from 'src/app/modules/shared/services/finance_department/broker/tbl-shamel-money-m3-pay-dest.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-tbl-shamel-broker-shateb-modify',
  templateUrl: './tbl-shamel-broker-shateb-modify.component.html',
  styleUrls: ['./tbl-shamel-broker-shateb-modify.component.scss']
})
export class TblShamelBrokerShatebModifyComponent implements OnInit {

  _Selected_TblShamelBrokerShateb: TblShamelBrokerShateb;

  set Selected_TblShamelBrokerShateb(obj: TblShamelBrokerShateb) {
    this._Selected_TblShamelBrokerShateb = obj;
  }
  get Selected_TblShamelBrokerShateb(): TblShamelBrokerShateb {
    return this._Selected_TblShamelBrokerShateb;
  }
  Form: FormGroup;
  Fixed_Month: TBLShamelMonth;
  Fixed_Year: TBLShamelYear;
  List_Area_Id: TBLShamelArea[] = [];
  List_Area_Id_Filter: Observable<TBLShamelArea[]> = of([]);
  List_broker_employee_Name: TblShamelBrokerEmployee[] = [];
  List_broker_employee_Name_Filter: Observable<TblShamelBrokerEmployee[]> = of([]);
  List_ShamelMoneyM3PayDest: TblShamelMoneyM3PayDest[];
  List_ShamelMoneyM3PayDest_Filter: Observable<TblShamelMoneyM3PayDest[]>;
  List_TBLShamelMonth: TBLShamelMonth[];
  List_TBLShamelMonth_Filter: Observable<TBLShamelMonth[]> = of([]);
  List_TBLShamelYear: TBLShamelYear[];
  List_TBLShamelYear_Filter: Observable<TBLShamelYear[]> = of([]);

  darkTheme: boolean;

  constructor(private frmBuilder: FormBuilder,
    private tblShamelAreaService: TBLShamelAreaService,
    public ShamelOvertimeEmployeeService: TblShamelBrokerEmployeeService,
    public ShamelMonthService: TBLShamelMonthService,
    public ShamelYearService: TBLShamelYearService,
    public ShamelMoneyM3PayDestService: TblShamelMoneyM3PayDestService,
    private tblShamelBrokerEmployeeService: TblShamelBrokerEmployeeService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TblShamelBrokerShatebModifyComponent>,
    private tblShamelBrokerShatebService: TblShamelBrokerShatebService,
    @Inject(MAT_DIALOG_DATA) public data: TblShamelBrokerShateb,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService) {
      this.BuildForm();
    this.LoadData();
     }

     BuildForm() {
      this.Form = this.frmBuilder.group({
        serial: new FormControl<number | undefined | null>(null),
        broker: new FormControl<number | undefined | null>(null),
        area_id: new FormControl<number | undefined | null>(null),
        year_id: new FormControl<number | undefined | null>(null),
        month_id: new FormControl<number | undefined | null>(null),
        school_id: new FormControl<number | undefined | null>(null),
        payrol_id: new FormControl<number | undefined | null>(null),
        daycount: new FormControl<number | undefined | null>(null),
        enterusername: new FormControl<string | undefined | null>(null),
        enterdate: new FormControl<Date | undefined | null>(null),
        entertime: new FormControl<string | undefined | null>(null),
        modifyusername: new FormControl<string | undefined | null>(null),
        modifydate: new FormControl<Date | undefined | null>(null),
        modifytime: new FormControl<string | undefined | null>(null),
  
      });
  
    }

    Load_Area(): Observable<TBLShamelArea[]> {
      if (this.tblShamelAreaService.List_TBLShamelArea != null ||
        this.tblShamelAreaService.List_TBLShamelArea != undefined ||
        this.tblShamelAreaService.List_TBLShamelArea.length == 0)
        return this.tblShamelAreaService.list();
  
      return of(this.tblShamelAreaService.List_TBLShamelArea);
    }
  
  
  
    Load_School(): Observable<TblShamelMoneyM3PayDest[]> {
      if (this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest != null ||
        this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest != undefined ||
        this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest.length == 0)
        return this.ShamelMoneyM3PayDestService.list();
  
      return of(this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest);
    }
  
  
    LoadMonth(): Observable<TBLShamelMonth[]> {
      if (this.ShamelMonthService.List_TBLShamelMonth != null ||
        this.ShamelMonthService.List_TBLShamelMonth != undefined ||
        this.ShamelMonthService.List_TBLShamelMonth.length == 0)
        return this.ShamelMonthService.list();
  
      return of(this.ShamelMonthService.List_TBLShamelMonth);
  
    }
    LoadYear(): Observable<TBLShamelYear[]> {
      if (this.ShamelYearService.List_TBLShamelYear != null ||
        this.ShamelYearService.List_TBLShamelYear != undefined ||
        this.ShamelYearService.List_TBLShamelYear.length == 0)
        return this.ShamelYearService.list();
      return of(this.ShamelYearService.List_TBLShamelYear);
  
    }

    LoadData() {

      forkJoin(
        [this.Load_Area(),
        this.LoadMonth(),
        this.LoadYear(),
        this.Load_School()]
      ).subscribe(res => {
        this.List_Area_Id = res[0];
        this.List_Area_Id_Filter = of(res[0]);
        this.tblShamelAreaService.List_TBLShamelArea = this.List_Area_Id;
        this.tblShamelAreaService.List_TBLShamelArea_BehaviorSubject.next(this.List_Area_Id);
        console.log('this.List_Area_Id', this.List_Area_Id);
  
        this.List_TBLShamelMonth = res[1];
        this.List_TBLShamelMonth_Filter = of(res[1]);
        this.ShamelMonthService.List_TBLShamelMonth = this.List_TBLShamelMonth;
        this.ShamelMonthService.List_TBLShamelMonth_BehaviorSubject.next(this.List_TBLShamelMonth);
  
  
        this.List_TBLShamelYear = res[2];
        this.List_TBLShamelYear_Filter = of(res[2]);
        this.ShamelYearService.List_TBLShamelYear = this.List_TBLShamelYear;
        this.ShamelYearService.List_TBLShamelYear_BehaviorSubject.next(this.List_TBLShamelYear);
  
  
  
  
        this.List_ShamelMoneyM3PayDest = res[3];
        this.List_ShamelMoneyM3PayDest_Filter = of(res[3]);
        this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest = this.List_ShamelMoneyM3PayDest;
        this.ShamelMoneyM3PayDestService.List_TblShamelMoneyM3PayDest_BehaviorSubject.next(this.List_ShamelMoneyM3PayDest);
        console.log('this.List_ShamelMoneyM3PayDest', this.List_ShamelMoneyM3PayDest);
  
  
        if (this.Form != null) {
          this.Form.controls['broker']
            .valueChanges
            .pipe(
              debounceTime(300),
              tap(() => { }),
              switchMap((value: string) => this.tblShamelBrokerEmployeeService.EmployeeFullName(value)
                .pipe(
                  finalize(() => { }),
                )
              )
            )
            .subscribe(emps => {
              console.log('emps', emps);
              if (emps != null && (emps as TblShamelBrokerEmployee[]).length > 0
              ) {
                this.List_broker_employee_Name = emps as TblShamelBrokerEmployee[];
                this.List_broker_employee_Name_Filter = of(this.List_broker_employee_Name);
  
              }
            });
  
  
          this.List_Area_Id_Filter = this.Form.controls['area_id'].valueChanges
            .pipe(
              startWith(''),
              map(value => value && typeof value === 'string' ? this._Filtered_Aria_Id(value) : this.List_Area_Id.slice())
            );
  
          this.List_ShamelMoneyM3PayDest_Filter = this.Form.controls['school_id'].valueChanges
            .pipe(
              startWith(''),
              map(value => value && typeof value === 'string' ? this._Filtered_School_ID(value) : this.List_ShamelMoneyM3PayDest.slice())
            );
  
          this.List_TBLShamelMonth_Filter = this.Form.controls['month_id'].valueChanges
            .pipe(
              startWith(''),
              map(value => value && typeof value === 'string' ? this._Filtered_Month_Id(value) : this.List_TBLShamelMonth.slice())
            );
  
  
          this.List_TBLShamelYear_Filter = this.Form.controls['year_id'].valueChanges
            .pipe(
              startWith(''),
              map(value => value && typeof value === 'string' ? this._Filtered_Year_Id(value) : this.List_TBLShamelYear.slice())
            );
  
        }
  
        if (this.data != null){
          this.Selected_TblShamelBrokerShateb= this.data;
          this.SetValue();
        }

        else {
          this.Selected_TblShamelBrokerShateb= {};
          this.Selected_TblShamelBrokerShateb.serial= 0;
        }
  
  
      },
        (error) => console.log(error));
  
    }



  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

  Display_broker_Employee_Fn(emp: TblShamelBrokerEmployee) {
    if (emp != null && emp.serial > 0) {
      console.log('emp', emp);
      return emp.fullname;
    }
    return '';
  }

  private _Filtered_Month_Id(value: string): TBLShamelMonth[] {
    if (value != null) {
      console.log('value', value);
      const filterValue = value;
      return this.List_TBLShamelMonth.filter(obj => obj.month_name.includes(filterValue));
    }
    return this.List_TBLShamelMonth.slice();
  }

  private _Filtered_Year_Id(value: string): TBLShamelYear[] {
    if (value != null) {
      const filterValue = value;
      return this.List_TBLShamelYear.filter(obj => obj.year_name.includes(filterValue));
    }
    return this.List_TBLShamelYear.slice();
  }
  OnBrokerEmployeeSelected(event: MatAutocompleteSelectedEvent) {
    if (event.option.value == null)
      return;
    var emp = event.option.value;

    const id = emp.id;

    this.Form.controls['broker'].setValue(emp);

    // if (id != null && id > 0) {
    //   this.Form.controls['broker'].setValue(id);
      /*
      this.ShamelNewShatebService.GetNetCash(id, this.Fixed_Year.year_id, this.Fixed_Month.month_id).subscribe
        (
          data => {
            this.Form.controls['salary'].setValue(data.netcash);
          }
        )
  */

    // }

  }


  private _Filtered_Aria_Id(value: string): TBLShamelArea[] {
    if (value != null && this.List_Area_Id != null && this.List_Area_Id.length > 0) {
      const filterValue = value;
      return this.List_Area_Id.filter(obj => obj.Area_Name.includes(filterValue));
    }
    return this.List_Area_Id.slice();
  }


  private _Filtered_School_ID(value: string): TblShamelMoneyM3PayDest[] {
    if (value != null && this.List_ShamelMoneyM3PayDest != null && this.List_ShamelMoneyM3PayDest.length > 0) {
      const filterValue = value;
      return this.List_ShamelMoneyM3PayDest.filter(obj => obj.paydest_name.includes(filterValue));
    }
    return this.List_ShamelMoneyM3PayDest.slice();
  }

  public Display_Month_Property(value: number): string {
    if (value != null && this.List_TBLShamelMonth != null && this.List_TBLShamelMonth.length > 0) {
      let Month: any = this.List_TBLShamelMonth.find(crs => crs.month_id == value);
      if (Month != null)
        return Month.month_name;
    }
    return '';
  }

  public Display_Year_Property(value: number): string {
    if (value != null && this.List_TBLShamelYear != null && this.List_TBLShamelMonth.length > 0) {
      let Year: any = this.List_TBLShamelYear.find(crs => crs.year_id == value);
      if (Year != null)
        return Year.year_name;
    }
    return '';
  }


  public Display_Area_Property(value: number): string {
    if (value != null && this.List_Area_Id != null && this.List_Area_Id.length > 0) {
      let Area: any = this.List_Area_Id.find(crs => crs.Area_ID == value);
      if (Area != null)
        return Area.Area_Name;
    }
    return '';
  }

  public Display_School_Property(value: number): string {
    if (value != null && this.List_ShamelMoneyM3PayDest != null && this.List_ShamelMoneyM3PayDest.length > 0) {
      let ShamelMoneyM3PayDest: any = this.List_ShamelMoneyM3PayDest.find(crs => crs.serial == value);
      if (ShamelMoneyM3PayDest != null)
        return ShamelMoneyM3PayDest.paydest_name;
    }
    return '';
  }

  SetValue() {
    console.log('this._Selected_TblShamelBrokerShateb', this._Selected_TblShamelBrokerShateb);
    if (this._Selected_TblShamelBrokerShateb != null) {

      if (this._Selected_TblShamelBrokerShateb.broker_id != null){
        this.tblShamelBrokerEmployeeService.SearchById(this._Selected_TblShamelBrokerShateb.serial).subscribe(broker=>{
          this.Form.controls['broker'].setValue(broker);
          console.log('aaa', this.Form.controls['broker'].value);
          console.log('bbb', broker);
        });
      }

      if (this._Selected_TblShamelBrokerShateb.serial != null)
        this.Form.controls['serial'].setValue(this._Selected_TblShamelBrokerShateb.serial);


      if (this._Selected_TblShamelBrokerShateb.area_id != null)
        this.Form.controls['area_id'].setValue(this._Selected_TblShamelBrokerShateb.area_id);

      if (this._Selected_TblShamelBrokerShateb.year_id != null)
        this.Form.controls['year_id'].setValue(this._Selected_TblShamelBrokerShateb.year_id);

        console.log('this.List_TBLShamelMonth', this.List_TBLShamelMonth);
      if (this._Selected_TblShamelBrokerShateb.month_id != null)
        this.Form.controls['month_id'].setValue(this._Selected_TblShamelBrokerShateb.month_id);

      if (this._Selected_TblShamelBrokerShateb.school_id != null)
        this.Form.controls['school_id'].setValue(this._Selected_TblShamelBrokerShateb.school_id);


      if (this._Selected_TblShamelBrokerShateb.payrol_id != null)
        this.Form.controls['payrol_id'].setValue(this._Selected_TblShamelBrokerShateb.payrol_id);

      if (this._Selected_TblShamelBrokerShateb.daycount != null)
        this.Form.controls['daycount'].setValue(this._Selected_TblShamelBrokerShateb.daycount);

      if (this._Selected_TblShamelBrokerShateb.enterusername != null)
        this.Form.controls['enterusername'].setValue(this._Selected_TblShamelBrokerShateb.enterusername);

      if (this._Selected_TblShamelBrokerShateb.enterdate != null)
        this.Form.controls['enterdate'].setValue(moment(this._Selected_TblShamelBrokerShateb.enterdate).set({hour: 4}).toDate());

      if (this._Selected_TblShamelBrokerShateb.entertime != null)
        this.Form.controls['entertime'].setValue(this._Selected_TblShamelBrokerShateb.entertime);

      if (this._Selected_TblShamelBrokerShateb.modifyusername != null)
        this.Form.controls['modifyusername'].setValue(this._Selected_TblShamelBrokerShateb.modifyusername);

      if (this._Selected_TblShamelBrokerShateb.modifydate != null)
        this.Form.controls['modifydate'].setValue(moment(this._Selected_TblShamelBrokerShateb.modifydate).set({hour: 4}).toDate());

      if (this._Selected_TblShamelBrokerShateb.modifytime != null)
        this.Form.controls['modifytime'].setValue(this._Selected_TblShamelBrokerShateb.modifytime);

      // if (this._Selected_TblShamelBrokerShateb.TBLShamelBrokerEmployee != null && this._Selected_TblShamelBrokerShateb.TBLShamelBrokerEmployee.fullname != null) {
      //   let emp: TblShamelBrokerEmployee =
      //   {

      //     fullname: this._Selected_TblShamelBrokerShateb.TBLShamelBrokerEmployee.fullname,
      //     serial: this._Selected_TblShamelBrokerShateb.TBLShamelBrokerEmployee.serial,
      //   }
      //   this.List_broker_employee_Name_Filter = of([emp]);
      //   this.Form.controls['fullname'].setValue(emp);
      //   console.log('this.Form.controls', this.Form.controls['fullname'].value);
      // }

    }
  }

  public getValue() {

        if (this.Form.controls['broker'].value != null)
          this._Selected_TblShamelBrokerShateb.broker_id = this.Form.controls['broker'].value.serial;
        
        if (this.Form.controls['serial'].value != null)
          this._Selected_TblShamelBrokerShateb.serial = this.Form.controls['serial'].value;
        
          if (this.Form.controls['area_id'].value != null)
          this._Selected_TblShamelBrokerShateb.area_id = this.Form.controls['area_id'].value;

        if (this.Form.controls['year_id'].value != null)
          this._Selected_TblShamelBrokerShateb.year_id = this.Form.controls['year_id'].value;

        if (this.Form.controls['month_id'].value != null)
          this._Selected_TblShamelBrokerShateb.month_id = this.Form.controls['month_id'].value;

        if (this.Form.controls['school_id'].value != null)
          this._Selected_TblShamelBrokerShateb.school_id = this.Form.controls['school_id'].value;

          if (this.Form.controls['payrol_id'].value != null)
          this._Selected_TblShamelBrokerShateb.payrol_id = this.Form.controls['payrol_id'].value;
          
          if (this.Form.controls['daycount'].value != null)
          this._Selected_TblShamelBrokerShateb.daycount = this.Form.controls['daycount'].value;

      console.log('this.selected_broker_employee', this._Selected_TblShamelBrokerShateb);

    

  }

  public errorHandling = (control: string, error: string) => {
    return this.Form.controls[control].hasError(error);
  }

  public async Save() {



    //Form Not Valid Then return
    if (!this.Form.valid == true) {
      console.log('this.Form', this.Form.errors);
      return;
    }
    this.getValue();


    if (this._Selected_TblShamelBrokerShateb &&
      this._Selected_TblShamelBrokerShateb.serial != null &&
      this._Selected_TblShamelBrokerShateb.serial <= 0) {


      // comment when using real data service
      console.log('this.selected_broker_employee', this._Selected_TblShamelBrokerShateb);
      this.tblShamelBrokerShatebService.add(this._Selected_TblShamelBrokerShateb).subscribe(
        data => {
          console.log('this.selected_broker_employee',this._Selected_TblShamelBrokerShateb);
          if (data > 0) // Succeess 
          {
            console.log('data456', data);
            this.snackBar.open('تمت الإضافة بنجاح', '', {
              duration: 3000,
              panelClass: ['green-snackbar']
            });
            this.dialogRef.close();
          }

        }
      )

    }

    else if (this._Selected_TblShamelBrokerShateb &&
      this._Selected_TblShamelBrokerShateb.serial != null &&
      this._Selected_TblShamelBrokerShateb.serial > 0) {

      console.log('this.selected_broker_employee', this._Selected_TblShamelBrokerShateb);
      this.tblShamelBrokerShatebService.update(this._Selected_TblShamelBrokerShateb).subscribe(
        data => {
          if (data > 0) // Succeess 
          {
            console.log('data456', data);
            this.snackBar.open('تم التعديل بنجاح', '', {
              duration: 3000,
              panelClass: ['green-snackbar']
            });
            this.dialogRef.close();
          }
        }
      )



    }
  }


  OnSelectYear(event: MatAutocompleteSelectedEvent) {

  }

  OnSelectMonth(event: MatAutocompleteSelectedEvent) {

  }

  OnSelectTblShamelMoneyM3PayDest(event: MatAutocompleteSelectedEvent) {

  }
  OnSelectArea(event: MatAutocompleteSelectedEvent) {


  }

  onReset() {
    this.Form.reset();
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    console.log('element', element);
    if (element) {
      element.focus();
    }
  }
}
