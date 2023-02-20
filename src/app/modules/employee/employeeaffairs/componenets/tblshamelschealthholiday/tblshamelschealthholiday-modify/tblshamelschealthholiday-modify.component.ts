
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { Observable, of, startWith, map, combineLatest, forkJoin, Subscription } from 'rxjs';
import { ITBLShamelDoctor } from 'src/app/modules/shared/models/employees_department/ITBLShamelDoctor';
import { ITBLShamelDocumentType } from 'src/app/modules/shared/models/employees_department/ITBLShamelDocumentType';
import { ITBLShamelSCHealthHoliday } from 'src/app/modules/shared/models/employees_department/ITBLShamelSCHealthHoliday';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { IGlobalEmployeeList } from 'src/app/modules/shared/services/employees_department/IGlobalEmployeeList';
import { TBLShamelDoctorService } from 'src/app/modules/shared/services/employees_department/tblshamel-doctor.service';
import { TBLShamelSCHealthHolidayService } from 'src/app/modules/shared/services/employees_department/tblshamel-schealth-holiday.service';
import { TblshameldocumenttypeService } from 'src/app/modules/shared/services/employees_department/tblshameldocumenttype.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { EmployeePageService } from '../../pageservice/employee-page-service';
import { ValidateForm } from './validate/ValidateForm';
const moment = _moment;

@Component({
  selector: 'app-tblshamelschealthholiday-modify',
  templateUrl: './tblshamelschealthholiday-modify.component.html',
  styleUrls: ['./tblshamelschealthholiday-modify.component.scss']
})
export class TblshamelschealthholidayModifyComponent implements OnInit, OnDestroy {
  id_employee: number;
  Selected_Emp: TBLShamelEmployee = {};
  _Selected_Employee_SCHealthHoliday: ITBLShamelSCHealthHoliday
  @Input() set Selected_Employee_SCHealthHoliday(obj: ITBLShamelSCHealthHoliday) {
    this._Selected_Employee_SCHealthHoliday = obj;


    if (this._Selected_Employee_SCHealthHoliday != null &&
      this._Selected_Employee_SCHealthHoliday != undefined) {

      console.log(this._Selected_Employee_SCHealthHoliday);
      this.SetValue();
    }
  }

  get Selected_Employee_SCHealthHoliday(): ITBLShamelSCHealthHoliday {
    return this._Selected_Employee_SCHealthHoliday;
  }

  isLoadingFinish: boolean = false;
  _Subscription: Subscription;

  Doctor_List: ITBLShamelDoctor[] = [];
  filteredDoctorOptions: Observable<ITBLShamelDoctor[]>;

  DocumentType_List: ITBLShamelDocumentType[] = [];
  filteredDocumentTypeOptions: Observable<ITBLShamelDocumentType[]>;



  // Access To Element in Form
  Form: FormGroup;
  serial: FormControl<number | null>;
  id: FormControl<number | null>;
  duration: FormControl<number | null>;
  startdate: FormControl<Date | null>;
  enddate: FormControl<Date | null>;
  sick: FormControl<string | null>;
  doctor_id: FormControl<number | null>;
  documenttype_id: FormControl<number | null>;
  document_number: FormControl<string | null>;
  documentdate: FormControl<Date | null>;

  //Local Var

  submitted = false;
  loading: boolean = false;

  isStartDateSelected: boolean= false;
  isEndDateSelected: boolean= false;


  startDateDay: string= '';
  startDateMonth: string= '';
  startDateYear: string= '';
  endDateDay: string= '';
  endDateMonth: string= '';
  endDateYear: string= '';
  documentDateDay: string= '';
  documentDateMonth: string= '';
  documentDateYear: string= '';

  startDateDayIsFilled: boolean= false;
  startDateMonthIsFilled: boolean= false;
  startDateYearIsFilled: boolean= false;
  endDateDayIsFilled: boolean= false;
  endDateMonthIsFilled: boolean= false;
  endDateYearIsFilled: boolean= false;
  documentDateDayIsFilled: boolean= false;
  documentDateMonthIsFilled: boolean= false;
  documentDateYearIsFilled: boolean= false;

  darkTheme: boolean;

  //#region Constuctor 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { obj: ITBLShamelSCHealthHoliday, id: number },
    public dialogRef: MatDialogRef<TblshamelschealthholidayModifyComponent>,
    public ShamelHealthHolidayService: TBLShamelSCHealthHolidayService,
    public ShamelDoctorService: TBLShamelDoctorService,
    public ShameldocumenttypeService: TblshameldocumenttypeService,
    private fb: UntypedFormBuilder,
    public PageService: EmployeePageService,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService
  ) {

    if (data != null && data.obj != null && data.id != null && data.id > 0) {
      this.id_employee = data.id;
      this.Selected_Employee_SCHealthHoliday = data.obj;
    }

    this.BuildForm();

    this.Load_Data();

  }


  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }


  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }
  //#endregion

  public BuildForm() {
    try {
      this.Form = this.fb.group(
        {
          'serial': this.serial = new FormControl<number | null>(null, []),
          'id': this.id = new FormControl<number | null>(null, []),
          'duration': this.duration = new FormControl<number | null>(null, []),
          'sick': this.sick = new FormControl<string | null>(null, [Validators.maxLength(70)]),
          'startdate': this.startdate = new FormControl<Date | null>(null, [Validators.required]),
          'enddate': this.enddate = new FormControl<Date | null>(null, [Validators.required]),
          'document_number': this.document_number = new FormControl<string | null>(null, []),
          'documenttype_id': this.documenttype_id = new FormControl<number | null>(null, []),
          'documentdate': this.documentdate = new FormControl<Date | null>(null, []),
          'doctor_id': this.doctor_id = new FormControl<number | null>(null, []),
        },
        {
          updateOn: 'change',
          asyncValidators: ValidateForm(this.ShamelHealthHolidayService).bind(this) // <= async validator
        }
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }
  //#endregion


  Load_TBLShamelDoctor(): Observable<ITBLShamelDoctor[]> {
    if (this.ShamelDoctorService.List_TBLShamelDoctor == null ||
      this.ShamelDoctorService.List_TBLShamelDoctor == undefined ||
      this.ShamelDoctorService.List_TBLShamelDoctor.length == 0)
      return this.ShamelDoctorService.list();
    return of(this.ShamelDoctorService.List_TBLShamelDoctor);

  }


  Load_ITBLShamelDocumentType(): Observable<ITBLShamelDocumentType[]> {
    if (this.ShameldocumenttypeService.List_ITBLShamelDocumentType == null ||
      this.ShameldocumenttypeService.List_ITBLShamelDocumentType == undefined ||
      this.ShameldocumenttypeService.List_ITBLShamelDocumentType.length == 0)
      return this.ShameldocumenttypeService.list();
    return of(this.ShameldocumenttypeService.List_ITBLShamelDocumentType);

  }



  Load_Data() {
    combineLatest([this.PageService.Subject_Selected_TBLShamelEmployee]).subscribe
      (
        res => {
          this.Selected_Emp = res[0];
          if (this.Selected_Emp != null && this.Selected_Emp.id != null)
            this.id_employee = this.Selected_Emp.id;

          this._Subscription = forkJoin(
            this.Load_TBLShamelDoctor(),
            this.Load_ITBLShamelDocumentType()
          ).subscribe(
            res => {
              this.isLoadingFinish = true;
              this.Doctor_List = res[0];
              console.log("Doctor_List", this.Doctor_List);
              this.filteredDoctorOptions = of(this.Doctor_List);
              this.ShamelDoctorService.List_TBLShamelDoctor = this.Doctor_List;
              this.ShamelDoctorService.List_TBLShamelDoctor_BehaviorSubject.next(this.Doctor_List);


              this.DocumentType_List = res[1];
              this.filteredDocumentTypeOptions = of(this.DocumentType_List);
              this.ShameldocumenttypeService.List_ITBLShamelDocumentType = this.DocumentType_List;
              this.ShameldocumenttypeService.List_ITBLShamelDocumentType_BehaviorSubject.next(this.DocumentType_List);

              this.Init_AutoComplete();

              this.SetValue();
            },
            (err => {
              this.isLoadingFinish = true;
            })
          )
        }
      )
  }


  public async Init_AutoComplete() {
    try {



      this.filteredDocumentTypeOptions = this.documenttype_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredDocumentType(value) : this.DocumentType_List.slice())
        );


      this.filteredDoctorOptions = this.doctor_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredDoctor(value) : this.Doctor_List.slice())
        );



    } catch (Exception: any) { }
  }


  //#region Filter Of  

  private _filteredDoctor(value: string): ITBLShamelDoctor[] {
    if (value) {
      const filterValue = value;
      return this.Doctor_List.filter(obj => obj.doctor_name.includes(filterValue));
    }
    return this.Doctor_List.slice();
  }

  private _filteredDocumentType(value: string): ITBLShamelDocumentType[] {
    if (value) {
      const filterValue = value;
      return this.DocumentType_List.filter(obj => obj.documenttype_name.includes(filterValue));

    }
    return this.DocumentType_List.slice();
  }






  //#region SetValue And GetValue Function
  public ClearForm() {
    try {
      this.Form.reset();

    } catch (ex: any) {

    }

  }


  //#region SetValue And GetValue Function
  public SetValue() {
    try {


      if (this.Selected_Employee_SCHealthHoliday != null) {


        if (this.Selected_Employee_SCHealthHoliday.serial != null)
          this.serial.setValue(this.Selected_Employee_SCHealthHoliday.serial);


        if (this.Selected_Employee_SCHealthHoliday.id != null)
          this.id.setValue(this.Selected_Employee_SCHealthHoliday.id);


        if (this.Selected_Employee_SCHealthHoliday.doctor_id != null)
          this.doctor_id.setValue(this.Selected_Employee_SCHealthHoliday.doctor_id);

        if (this.Selected_Employee_SCHealthHoliday.sick != null)
          this.sick.setValue(this.Selected_Employee_SCHealthHoliday.sick);

        if (this.Selected_Employee_SCHealthHoliday.duration != null)
          this.duration.setValue(this.Selected_Employee_SCHealthHoliday.duration);


        if (this.Selected_Employee_SCHealthHoliday.startdate != null && this.Selected_Employee_SCHealthHoliday.startdate != undefined){
          this.startdate.setValue(moment(this.Selected_Employee_SCHealthHoliday.startdate).toDate());
          this.startDateDay= moment(this.startdate.value).date()+'';
          this.startDateMonth= (moment(this.startdate.value).month()+1)+'';
          this.startDateYear= moment(this.startdate.value).year()+'';
        }

        if (this.Selected_Employee_SCHealthHoliday.enddate != null && this.Selected_Employee_SCHealthHoliday.enddate != undefined){
          this.enddate.setValue(moment(this.Selected_Employee_SCHealthHoliday.enddate).toDate());
          this.endDateDay= moment(this.enddate.value).date()+'';
          this.endDateMonth= (moment(this.enddate.value).month()+1)+'';
          this.endDateYear= moment(this.enddate.value).year()+'';
        }


        if (this.Selected_Employee_SCHealthHoliday.documenttype_id != null)
          this.documenttype_id.setValue(this.Selected_Employee_SCHealthHoliday.documenttype_id);


        if (this.Selected_Employee_SCHealthHoliday.documentdate != null && this.Selected_Employee_SCHealthHoliday.documentdate != undefined){
          this.documentdate.setValue(moment(this.Selected_Employee_SCHealthHoliday.documentdate).toDate());
          this.documentDateDay= moment(this.documentdate.value).date()+'';
          this.documentDateMonth= (moment(this.documentdate.value).month()+1)+'';
          this.documentDateYear= moment(this.documentdate.value).year()+'';
        }

        if (this.Selected_Employee_SCHealthHoliday.document_number != null)
          this.document_number.setValue(this.Selected_Employee_SCHealthHoliday.document_number);

        if (this.Selected_Employee_SCHealthHoliday.doctor_id != null)
          this.doctor_id.setValue(this.Selected_Employee_SCHealthHoliday.doctor_id);






      }



    } catch (ex: any) {

      console.log(ex);

    }

  }

  public getValue() {
    try {

      if (this.Selected_Employee_SCHealthHoliday != null) {

        if (this.serial.value != null)
          this.Selected_Employee_SCHealthHoliday.serial = this.serial.value;


        if (this.id.value != null)
          this.Selected_Employee_SCHealthHoliday.id = this.id.value;

        if (this.doctor_id.value != null)
          this.Selected_Employee_SCHealthHoliday.doctor_id = this.doctor_id.value;

        if (this.duration.value != null)
          this.Selected_Employee_SCHealthHoliday.duration = this.duration.value;

        if (this.sick.value != null)
          this.Selected_Employee_SCHealthHoliday.sick = this.sick.value;



        if (this.enddate.value != null && this.enddate.value != undefined)
          this.Selected_Employee_SCHealthHoliday.enddate = moment(this.enddate.value).set({hour: 4}).toDate();

        if (this.startdate.value != null && this.startdate.value != undefined)
          this.Selected_Employee_SCHealthHoliday.startdate = moment(this.startdate.value).set({hour: 4}).toDate();

        if (this.documenttype_id.value != null)
          this.Selected_Employee_SCHealthHoliday.documenttype_id = this.documenttype_id.value;
          this.Selected_Employee_SCHealthHoliday.document_number = this.document_number.value;

        if (this.documentdate.value != null && this.documentdate.value != undefined)
          this.Selected_Employee_SCHealthHoliday.documentdate = moment(this.documentdate.value).set({hour: 4}).toDate();


      }
    } catch (ex: any) {

    }

  }
  //#endregion



  //#region OnSelect Function

  public OnSelectDoctorChange(event: MatAutocompleteSelectedEvent) {
    if (event && this.Selected_Employee_SCHealthHoliday)
      this.Selected_Employee_SCHealthHoliday.doctor_id = event.option.value;
  }


  public OnSelectDocumentTypeChange(event: MatAutocompleteSelectedEvent) {
    console.log('OnSelectStateChange');
    console.log('document123',event.option.value);
    if (event && this.Selected_Employee_SCHealthHoliday)
      this.Selected_Employee_SCHealthHoliday.documenttype_id = event.option.value;
  }



  //#endregion


  //#region  Display Display Member
  public displayDocumentTypeProperty(value: string): string {
    if (value && this.DocumentType_List) {
      let documentType: any = this.DocumentType_List.find(crs => crs.documenttype_id.toString() == value);
      if (documentType)
        return documentType.documenttype_name;
    }
    return '';
  }


  public displayDoctorProperty(value: string): string {
    console.log('doctorValue', value);
    if (value && this.Doctor_List) {

      let doctor: any = this.Doctor_List.find(spec => spec.doctor_id.toString() == value);
      console.log('doctor', doctor);
      if (doctor)
        return doctor.doctor_name;
    }
    return '';
  }






  public async Save() {

    console.log(this.Form.valid);
    if (this.Form.valid == false) {
      return;
    }
    if (!this.ValidateForm() == true) {
      return;
    }
    this.getValue();

    if (this.Selected_Employee_SCHealthHoliday != null &&
      this.Selected_Employee_SCHealthHoliday != undefined &&
      (this.Selected_Employee_SCHealthHoliday.serial == null || this.Selected_Employee_SCHealthHoliday.serial <= 0)
    ) {
      this.ShamelHealthHolidayService.add(this.Selected_Employee_SCHealthHoliday).toPromise().then((res:any) => {
        console.log("res",res)
        if (res.Result == 1) {
          this.dialogRef.close(true);
        } else {



        }
      });
    }
    else if (this.Selected_Employee_SCHealthHoliday != null &&
      this.Selected_Employee_SCHealthHoliday != undefined &&
      this.Selected_Employee_SCHealthHoliday.serial != null &&
      this.Selected_Employee_SCHealthHoliday.serial > 0) {
      console.log('update');
      console.log(this.Selected_Employee_SCHealthHoliday);

      this.ShamelHealthHolidayService.update(this.Selected_Employee_SCHealthHoliday).toPromise().then((res:any) => {
        console.log("res",res)
        if (res.Result == 1) {
          this.dialogRef.close(true);

        } else {
        }
      });

    }
  }


  public ValidateForm(): boolean {
    let result: boolean = true;


    /*
        if (!this.doctor_id.value || this.doctor_id.value <=0)
        {
          console.log('error1');
          this.doctor_id.setErrors({ invalid: true ,required:true});
          result = false;
          
        }
      */




    console.log("result vaildarw" + result);
    return result;

  }

  public onReset(): void {
    this.submitted = false;
    this.Form.reset();
  }
  /* Handle form errors in Angular 8 */
  public errorHandling = (control: string, error: string) => {
    return this.Form.controls[control].hasError(error);
  }



  addEventDocumentDate(date: Date) {
    if (date != null &&
      this.Selected_Employee_SCHealthHoliday != null)
      this.Selected_Employee_SCHealthHoliday.documentdate = date;

  }


  addEventStartDate(date: Date) {
    if (date != null &&
      this.Selected_Employee_SCHealthHoliday != null)
      this.Selected_Employee_SCHealthHoliday.startdate = date;

      this.isStartDateSelected= true;
      this.calcDuration();


  }



  addEventEndDate(date: Date) {
    if (date != null &&
      this.Selected_Employee_SCHealthHoliday != null)
      this.Selected_Employee_SCHealthHoliday.enddate = date;

      this.isEndDateSelected= true;
      this.calcDuration();

  }

  calcDuration(){
    if (this.isStartDateSelected && this.isEndDateSelected)
    this.duration.setValue(moment.duration(moment(this.Selected_Employee_SCHealthHoliday.enddate).diff(moment(this.Selected_Employee_SCHealthHoliday.startdate))).asDays());
    else return;
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  startDateChange(changeSource: string){
    if (changeSource == 'day')
      this.startDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.startDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.startDateYearIsFilled= true;

    if (this.startDateDayIsFilled && this.startDateMonthIsFilled && this.startDateYearIsFilled){
      this.startdate.setValue(moment(this.startDateMonth+'/'+this.startDateDay+'/'+this.startDateYear).set({hour: 4}).toDate());
      this.addEventStartDate(this.startdate.value);
    }
   }

   endDateChange(changeSource: string){
    if (changeSource == 'day')
      this.endDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.endDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.endDateYearIsFilled= true;

    if (this.endDateDayIsFilled && this.endDateMonthIsFilled && this.endDateYearIsFilled){
      this.enddate.setValue(moment(this.endDateMonth+'/'+this.endDateDay+'/'+this.endDateYear).set({hour: 4}).toDate());
      this.addEventEndDate(this.enddate.value);
    }
   }

   documentDateChange(changeSource: string){
    if (changeSource == 'day')
      this.documentDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.documentDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.documentDateYearIsFilled= true;

    if (this.documentDateDayIsFilled && this.documentDateMonthIsFilled && this.documentDateYearIsFilled){
      this.documentdate.setValue(moment(this.documentDateMonth+'/'+this.documentDateDay+'/'+this.documentDateYear).set({hour: 4}).toDate());
      this.addEventDocumentDate(this.documentdate.value);
    }
   }

}
