
import { Component, Inject, OnInit } from '@angular/core';
import { debounceTime, finalize, forkJoin, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TBLShamelOvertimeEmployeeService } from 'src/app/modules/shared/services/finance_department/broker/tblshamel-overtime-employee.service';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { TBLShamelOvertimeEmployee } from 'src/app/modules/shared/models/finance_department/broker/TBLShamelOvertimeEmployee';
import { Uniqe } from './validators/validate_formgroup';
import { Validate_ID } from './validators/validate_id';
import { ViewTBLShamelEmployeeService } from 'src/app/modules/shared/services/employees_department/view-tbl-shamel-employee.service';
import { TBLShamelSex } from 'src/app/modules/shared/models/employees_department/TBLShamelSex';
import { TBLShamelSexService } from 'src/app/modules/shared/services/employees_department/tblshamel-sex.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';


@Component({
  selector: 'app-tblshamel-overtime-employee-modify',
  templateUrl: './tblshamel-overtime-employee-modify.component.html',
  styleUrls: ['./tblshamel-overtime-employee-modify.component.scss']
})
export class TBLShamelOvertimeEmployeeModifyComponent implements OnInit {

  selected_overtime_employee: TBLShamelOvertimeEmployee;
  List_SEX_NAME: TBLShamelSex[] = [];
  List_SEX_NAME_Filter: Observable<TBLShamelSex[]> = of([]);
  overtime_employee_Name_List: TBLShamelOvertimeEmployee[] = [];
  overtime_employee_Name_List_Filter: Observable<TBLShamelOvertimeEmployee[]> = of([]);
  Form: FormGroup;



  submitted = false;

  darkTheme: boolean;
  
  constructor(public dialogRef: MatDialogRef<TBLShamelOvertimeEmployeeModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { obj: TBLShamelOvertimeEmployee, source: string },
    public ShamelOvertimeEmployeeService: TBLShamelOvertimeEmployeeService,
    private ShamelSexService: TBLShamelSexService,
    public frmBuild: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService
  ) {
    this.selected_overtime_employee = data.obj;
    this.BuildForm();
    this.LoadData();
  }

  Load_Sex(): Observable<TBLShamelSex[]> {
    if (this.ShamelSexService.List_TBLShamelSex == null ||
      this.ShamelSexService.List_TBLShamelSex == undefined ||
      this.ShamelSexService.List_TBLShamelSex.length == 0)
      return this.ShamelSexService.list();
    return of(this.ShamelSexService.List_TBLShamelSex);
  }

  LoadData() {

    forkJoin(
      [this.Load_Sex()]
    ).subscribe(res => {
      this.List_SEX_NAME = res[0];
      this.List_SEX_NAME_Filter = of(res[0]);


      if (this.Form != null) {




      

        this.List_SEX_NAME_Filter = this.Form.controls['sex_name'].valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._Filtered_SEX_NAME(value) : this.List_SEX_NAME.slice())
          );



      }

      this.SetValue();
    },
      (error) => console.log(error));

  }


  displayOvertimeEmployeeFn(emp: TBLShamelOvertimeEmployee) {
    if (emp != null && emp.serial > 0) {
      return emp.fullname;
    }
    return '';
  }



  onEmployeeSelected(event: MatAutocompleteSelectedEvent) {
    if (event.option.value == null)
      return;
    var emp = event.option.value;

    const id = emp.id;

    this.Form.controls['id'].setValue(id);

    if (id != null && id > 0) {
      this.Form.controls['id'].setValue(id);
    }

  }

  private _Filtered_SEX_NAME(value: string): TBLShamelSex[] {
    if (value != null && this.List_SEX_NAME != null && this.List_SEX_NAME.length > 0) {
      const filterValue = value;
      return this.List_SEX_NAME.filter(obj => obj.Sex_Name.includes(filterValue));
    }
    return this.List_SEX_NAME.slice();
  }



  public displaySexNameProperty(value: string): string {
    if (value != null && this.List_SEX_NAME != null) {
      let sexName: any = this.List_SEX_NAME.find(crs => crs.Sex_Name.toString() == value);
      if (sexName!= null )
        return sexName.Sex_Name;
    }
    return '';
  }


  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

  ngAfterViewInit() {

  }


  public BuildForm() {
    try {

      this.Form = this.frmBuild.group({
        serail: new FormControl<number | null>(null, [Validators.required], [Validate_ID(this.ShamelOvertimeEmployeeService)]),
        fname: new FormControl<string | null>(null, [Validators.required]),
        lname: new FormControl<string | null>(null, [Validators.required]),
        father: new FormControl<string | null>(null, [Validators.required]),
        mother: new FormControl<string | null>(null, [Validators.required]),
        servicedayes: new FormControl<number | null>(null, [Validators.required]),
        sex_name: new FormControl<string | null>(null, [Validators.required]),
        enterusername: new FormControl<string | null>(null, []),
        enterdate: new FormControl<Date | null>(null, []),
        entertime: new FormControl<string | null>(null, []),
        modifyusername: new FormControl<string | null>(null, []),
        modifydate: new FormControl<Date | null>(null, []),
        modifytime: new FormControl<string | null>(null, []),
        birthdateDay: new FormControl<number | null>(null, [Validators.required]),
        birthdateMonth: new FormControl<number | null>(null, [Validators.required]),
        birthdateYear: new FormControl<number | null>(null, [Validators.required]),

      }, Uniqe(this.ShamelOvertimeEmployeeService));

    } catch (Exception: any) {
      console.log(Exception);
    }
  }



  public ClearForm() {

    if (this.Form != null)
      this.Form.reset();

  }


  public SetValue() {
    try {


      if (this.selected_overtime_employee != null && this.selected_overtime_employee.serial != null)
        this.Form.controls['serail'].setValue(this.selected_overtime_employee?.serial);

      if (this.selected_overtime_employee != null && this.selected_overtime_employee.fname != null)
        this.Form.controls['fname'].setValue(this.selected_overtime_employee?.fname);

      if (this.selected_overtime_employee != null && this.selected_overtime_employee.lname != null)
        this.Form.controls['lname'].setValue(this.selected_overtime_employee?.lname);

      if (this.selected_overtime_employee != null && this.selected_overtime_employee.father != null)

        this.Form.controls['father'].setValue(this.selected_overtime_employee?.father);

      if (this.selected_overtime_employee != null && this.selected_overtime_employee.mother != null)
        this.Form.controls['mother'].setValue(this.selected_overtime_employee?.mother);

      if (this.selected_overtime_employee != null && this.selected_overtime_employee.birthdate != null){
        this.Form.controls['birthdateDay'].setValue(+moment(this.selected_overtime_employee?.birthdate).date());
        this.Form.controls['birthdateMonth'].setValue(+moment(this.selected_overtime_employee?.birthdate).month()+1);
        this.Form.controls['birthdateYear'].setValue(+moment(this.selected_overtime_employee?.birthdate).year());
      }

      if (this.selected_overtime_employee != null && this.selected_overtime_employee.sex_name != null)
        this.Form.controls['sex_name'].setValue(this.selected_overtime_employee?.sex_name);

      if (this.selected_overtime_employee != null && this.selected_overtime_employee.VShamelOvertimeEmpService.ServiceDayes != null)
        this.Form.controls['servicedayes'].setValue(this.selected_overtime_employee?.VShamelOvertimeEmpService.ServiceDayes);


      if (this.selected_overtime_employee != null && this.selected_overtime_employee.EnterUserName != null)
        this.Form.controls['EnterUserName'].setValue(this.selected_overtime_employee?.EnterUserName);


      if (this.selected_overtime_employee != null && this.selected_overtime_employee.enterdate != null)
        this.Form.controls['enterdate'].setValue(moment(this.selected_overtime_employee?.enterdate).set({hour: 4}).toDate());


      if (this.selected_overtime_employee != null && this.selected_overtime_employee.entertime != null)
        this.Form.controls['entertime'].setValue(this.selected_overtime_employee?.entertime);


      if (this.selected_overtime_employee != null && this.selected_overtime_employee.modifyusername != null)
        this.Form.controls['modifyusername'].setValue(this.selected_overtime_employee?.modifyusername);

      if (this.selected_overtime_employee.modifydate != null)
        this.Form.controls['modifydate'].setValue(moment(this.selected_overtime_employee?.modifydate).set({hour: 4}).toDate());













    } catch (ex: any) {


    }

  }


  public getValue() {
    try {

      if (this.selected_overtime_employee != null) {

        if (this.Form.controls['serail'].value != null)
          this.selected_overtime_employee.serial = this.Form.controls['serail'].value;


        if (this.Form.controls['fname'].value != null)
          this.selected_overtime_employee.fname = this.Form.controls['fname'].value;

        if (this.Form.controls['lname'].value != null)
          this.selected_overtime_employee.lname = this.Form.controls['lname'].value;

        if (this.Form.controls['father'].value != null)
          this.selected_overtime_employee.father = this.Form.controls['father'].value;

        if (this.Form.controls['mother'].value != null)
          this.selected_overtime_employee.mother = this.Form.controls['mother'].value;



        if (this.Form.controls['servicedayes'].value != null)
          this.selected_overtime_employee.VShamelOvertimeEmpService.ServiceDayes = this.Form.controls['servicedayes'].value;

        if (this.Form.controls['birthdateDay'].value != null && this.Form.controls['birthdateMonth'].value != null && this.Form.controls['birthdateYear'].value != null)
          this.selected_overtime_employee.birthdate =  moment(this.Form.controls['birthdateMonth'].value+'/'+this.Form.controls['birthdateDay'].value+'/'+this.Form.controls['birthdateYear'].value).set({hour: 4}).toDate();

        if (this.Form.controls['sex_name'].value != null)
          this.selected_overtime_employee.sex_name = this.Form.controls['sex_name'].value;


      }
    } catch (ex: any) {

    }

  }




  public async Save() {



    //Form Not Valid Then return
    if (!this.Form.valid == true) {
      return;
    }
    this.getValue();

    if (this.selected_overtime_employee &&
      this.selected_overtime_employee.serial != null &&
      this.selected_overtime_employee.serial <= 0) {


      // comment when using real data service
      this.ShamelOvertimeEmployeeService.add(this.selected_overtime_employee).subscribe(
        data => {
          if (data > 0) // Succeess 
          {
            this.snackBar.open('تمت الإضافة بنجاح', '', {
              duration: 3000,
              panelClass: ['green-snackbar']
            });
            this.dialogRef.close();
          }

        }
      )

    }

    else if (this.selected_overtime_employee &&
      this.selected_overtime_employee.serial != null &&
      this.selected_overtime_employee.serial > 0) {

      // comment when using real data service
      this.ShamelOvertimeEmployeeService.update(this.selected_overtime_employee).subscribe(
        data => {
          if (data > 0) // Succeess 
          {
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

  onReset() {
    this.Form.reset();
  }


  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }
}
