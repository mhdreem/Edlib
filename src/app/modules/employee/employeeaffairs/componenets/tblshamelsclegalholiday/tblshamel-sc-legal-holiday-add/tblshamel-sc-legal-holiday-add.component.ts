import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Observable, of, startWith, map, Subscription, combineLatest, forkJoin } from 'rxjs';
import { ITBLShamelDocumentType } from 'src/app/modules/shared/models/employees_department/ITBLShamelDocumentType';
import { TBLShamelSCLegalHoliday } from 'src/app/modules/shared/models/employees_department/TBLShamelSCLegalHoliday';
import { TBLShamelSCMergeService } from 'src/app/modules/shared/models/employees_department/TBLShamelSCMergeService';
import { TBLShamelSCLEgalHolidayService } from 'src/app/modules/shared/services/employees_department/tblshamel-sc-legal-holiday.service';
import { TblshameldocumenttypeService } from 'src/app/modules/shared/services/employees_department/tblshameldocumenttype.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { EmployeePageService } from '../../pageservice/employee-page-service';
import { ValidateForm } from './validate/ValidateForm';

@Component({
  selector: 'app-tblshamel-sc-legal-holiday-add',
  templateUrl: './tblshamel-sc-legal-holiday-add.component.html',
  styleUrls: ['./tblshamel-sc-legal-holiday-add.component.scss']
})
export class TBLShamelSCLEgalHolidayAddComponent implements OnInit, OnDestroy {


  id_employee: number;
  Selected_Emp: TBLShamelSCLegalHoliday = {};
  _Selected_Employee_SCLegalHoliday: TBLShamelSCLegalHoliday
  @Input() set Selected_Employee_SCLegalHoliday(obj: TBLShamelSCLegalHoliday) {
    this._Selected_Employee_SCLegalHoliday = obj;
    console.log('بلش');

    if (this._Selected_Employee_SCLegalHoliday != null &&
      this._Selected_Employee_SCLegalHoliday != undefined) {
      console.log('سث');
      console.log(this._Selected_Employee_SCLegalHoliday);
      this.SetValue();
    }
  }

  get Selected_Employee_SCLegalHoliday(): TBLShamelSCLegalHoliday {
    return this._Selected_Employee_SCLegalHoliday;
  }

  isLoadingFinish: boolean = false;
  _Subscription: Subscription;

  //Array Of AutoComplere With Filter
  
  DocumentType_List :ITBLShamelDocumentType[]=[];
  filteredDocumentTypeOptions: Observable<ITBLShamelDocumentType[]>;

  // Access To Element in Form
  Form: FormGroup;
  serial: FormControl<number | null>;
  id: FormControl<number | null>;
  duration: FormControl<number | null>;
  startdate: FormControl<Date | null>;
  enddate: FormControl<Date | null>;
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
    @Inject(MAT_DIALOG_DATA) public data: {obj: TBLShamelSCMergeService,id:number},
    public ShamelSCLEgalHolidayService:TBLShamelSCLEgalHolidayService,
    public ShameldocumenttypeService:TblshameldocumenttypeService ,
    private fb: UntypedFormBuilder,
    public PageService: EmployeePageService,
    public dialogRef: MatDialogRef<TBLShamelSCLEgalHolidayAddComponent>,
    private themeService: ThemeService,
    @Inject(DOCUMENT) private _document: Document,
  ) {
    this.PageService.Subject_Selected_TBLShamelEmployee.subscribe(
      data => {
        this.Selected_Emp = data;
        this.id_employee = this.Selected_Emp.id;
      }
    )

    this.Load_Data();

    this.BuildForm();
    this.FillArrayUsingService();

    console.log(data.obj);
    console.log(data.id);

    if (data!= null  && data.obj!= null && data.id!= null && data.id> 0) {
      console.log('ddd دخل ');
      this.id_employee = data.id;
      this.Selected_Employee_SCLegalHoliday = data.obj;
    }







  }

  Load_Data() {
    combineLatest([this.PageService.Subject_Selected_TBLShamelEmployee]).subscribe
      (
        res => {
          this.Selected_Emp = res[0];
          if (this.Selected_Emp != null && this.Selected_Emp.id != null)
            this.id_employee = this.Selected_Emp.id;

          this._Subscription = forkJoin(
            this.Load_ITBLShamelDocumentType()
          ).subscribe(
            res => {
              this.isLoadingFinish = true;
              this.DocumentType_List = res[0];
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


  Load_ITBLShamelDocumentType(): Observable<ITBLShamelDocumentType[]> {
    if (this.ShameldocumenttypeService.List_ITBLShamelDocumentType == null ||
      this.ShameldocumenttypeService.List_ITBLShamelDocumentType == undefined ||
      this.ShameldocumenttypeService.List_ITBLShamelDocumentType.length == 0)
      return this.ShameldocumenttypeService.list();
    return of(this.ShameldocumenttypeService.List_ITBLShamelDocumentType);

  }


  public async Init_AutoComplete() {
    try {
      this.filteredDocumentTypeOptions = this.documenttype_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredDocumentType(value) : this.DocumentType_List.slice())
        );
    } catch (Exception: any) { }
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

  
  public async FillArrayUsingService() {
    try {
      this.filteredDocumentTypeOptions = this.documenttype_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._Filtered_DocumentType(value) : this.DocumentType_List.slice())
        );

    } catch (Exception: any) { }


  
    




  }
  
  private _filteredDocumentType(value: string): ITBLShamelDocumentType[] {
    if (value) {
      const filterValue = value;
      return this.DocumentType_List.filter(obj => obj.documenttype_name.includes(filterValue));

    }
    return this.DocumentType_List.slice();
  }

   public BuildForm()
   {
    
    this.Form = this.fb.group(
      {
        'duration': this.duration = new FormControl<number | null>(null, []),
        'serial': this.serial = new FormControl<number | null>(null, []),
        'id': this.id = new FormControl<number | null>(null, []),
        'startdate': this.startdate = new FormControl<Date | null>(null, [Validators.required]),
        'enddate': this.enddate = new FormControl<Date | null>(null, [Validators.required]),
        'document_number': this.document_number = new FormControl<string | null>(null, []),
        'documenttype_id': this.documenttype_id = new FormControl<number | null>(null, []),
        'documentdate': this.documentdate = new FormControl<Date | null>(null, []),
      },
      {
        updateOn: 'change',
        asyncValidators: ValidateForm(this.ShamelSCLEgalHolidayService).bind(this) // <= async validator
      }
    );


    

     
   
  }
   //#endregion


  

  public  _Filtered_DocumentType(value: string): ITBLShamelDocumentType[] {    
    if (value)
    {
      const filterValue = value ;
      return this.DocumentType_List.filter(obj => obj.documenttype_name.includes(filterValue) );

    }
    return this.DocumentType_List.slice();
  }
  
  //#endregion


  //#region SetValue And GetValue Function
  public ClearForm() {
    try {
      this.Form.reset();

    } catch (ex: any) {

    }

  }


  //#region SetValue And GetValue Function
  public SetValue()
  {
    if (this.Selected_Employee_SCLegalHoliday && this.Selected_Employee_SCLegalHoliday.serial &&
      this.Selected_Employee_SCLegalHoliday.serial>0)
    {
      if (this.Selected_Employee_SCLegalHoliday.serial != null)
          this.serial.setValue(this.Selected_Employee_SCLegalHoliday.serial);


        if (this.Selected_Employee_SCLegalHoliday.id != null)
          this.id.setValue(this.Selected_Employee_SCLegalHoliday.id);
      if (this.Selected_Employee_SCLegalHoliday.duration != null)
      this.duration.setValue( this.Selected_Employee_SCLegalHoliday.duration);           

      if (this.Selected_Employee_SCLegalHoliday.startdate!= null && this.Selected_Employee_SCLegalHoliday.startdate != undefined) {
        this.startdate.setValue( moment(this.Selected_Employee_SCLegalHoliday.startdate).toDate() ); 
        this.startDateDay= moment(this.startdate.value).date()+'';
        this.startDateMonth= (moment(this.startdate.value).month()+1)+'';
        this.startDateYear= moment(this.startdate.value).year()+'';
      }       

      if (this.Selected_Employee_SCLegalHoliday.enddate!= null && this.Selected_Employee_SCLegalHoliday.enddate != undefined)    {
        this.enddate.setValue(moment(this.Selected_Employee_SCLegalHoliday.enddate).toDate()); 
        this.endDateDay= moment(this.enddate.value).date()+'';
        this.endDateMonth= (moment(this.enddate.value).month()+1)+'';
        this.endDateYear= moment(this.enddate.value).year()+'';
      }    

      if (this.Selected_Employee_SCLegalHoliday.documenttype_id != null)
      this.documenttype_id.setValue(this.Selected_Employee_SCLegalHoliday.documenttype_id); 

      if (this.Selected_Employee_SCLegalHoliday.document_number != null)
      this.document_number.setValue(this.Selected_Employee_SCLegalHoliday.document_number); 

      if (this.Selected_Employee_SCLegalHoliday.documentdate!= null && this.Selected_Employee_SCLegalHoliday.documentdate != undefined) {
        this.documentdate.setValue(moment(this.Selected_Employee_SCLegalHoliday.documentdate).toDate());         
        this.documentDateDay= moment(this.documentdate.value).date()+'';
        this.documentDateMonth= (moment(this.documentdate.value).month()+1)+'';
        this.documentDateYear= moment(this.documentdate.value).year()+'';
      }       
    }
  
  }

  public getValue()
  {
    try{

if (this.Selected_Employee_SCLegalHoliday != null )
{

  this.Selected_Employee_SCLegalHoliday.id = this.Selected_Emp.id;

  this.Selected_Employee_SCLegalHoliday.duration = this.duration.value;

  if (this.startdate.value != null )
  this.Selected_Employee_SCLegalHoliday.startdate =moment( this.startdate.value).toDate();

  if (this.enddate.value != null )
    this.Selected_Employee_SCLegalHoliday.enddate =moment(this.enddate.value).toDate();
    
    this.Selected_Employee_SCLegalHoliday.documenttype_id = this.documenttype_id.value;        
    this.Selected_Employee_SCLegalHoliday.document_number = this.document_number.value;
    
    if (this.documentdate.value != null )
    this.Selected_Employee_SCLegalHoliday.documentdate = moment(this.documentdate.value).toDate();
    
    
  }
  }catch(ex: any)
  {

  }
  
  }
//#endregion

 




  public OnSelect_DocumentType(event: MatAutocompleteSelectedEvent) {
    console.log('OnSelectStateChange');
    console.log(event.option.value);
    if ( event  &&  this.Selected_Employee_SCLegalHoliday )
      this.Selected_Employee_SCLegalHoliday.documenttype_id = event.option.value;  
  }

  

  //#endregion


  //#region  Display Display Member
  public displayDocumentTypeProperty(value:string):string  {
    if (value && this.DocumentType_List){     
      let documentType:any = this.DocumentType_List.find(crs => crs.documenttype_id.toString() == value) ;
      if (documentType)
      return documentType.documenttype_name;
    }
    return '';
  }







 

  

  public async Save()
  {
 
    console.log('1');
    if (this.Form.valid == false ) {
      console.log('2');
      return;
    }
    console.log(this.Selected_Employee_SCLegalHoliday);
    this.getValue();

    if (this.Selected_Employee_SCLegalHoliday != null  &&
      (this.Selected_Employee_SCLegalHoliday.serial == null ||
        this.Selected_Employee_SCLegalHoliday.serial == undefined ||
      this.Selected_Employee_SCLegalHoliday.serial<=0))
      {
        console.log('3');

        this.ShamelSCLEgalHolidayService.add(this.Selected_Employee_SCLegalHoliday).toPromise().then(res => {
          console.log(res)
          if (res == 1)
        {
          this.dialogRef.close(true);

        }else
        {



        }
    });
  }
   else if (this.Selected_Employee_SCLegalHoliday != null &&
    this.Selected_Employee_SCLegalHoliday.serial != null&&
             this.Selected_Employee_SCLegalHoliday.serial>0)
             {

      this.ShamelSCLEgalHolidayService.update(this.Selected_Employee_SCLegalHoliday).toPromise().then(res => {
        console.log(res)
        if (res == 1)
        {
          this.dialogRef.close(true);

        }else
        {
        }
    });

  }
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
    this.Selected_Employee_SCLegalHoliday != null)
    this.Selected_Employee_SCLegalHoliday.documentdate = date;

}


addEventStartDate(date: Date) {
  if (date != null &&
    this.Selected_Employee_SCLegalHoliday != null)
    this.Selected_Employee_SCLegalHoliday.startdate = date;

    this.isStartDateSelected= true;
    this.calcDuration();


}



addEventEndDate(date: Date) {
  if (date != null &&
    this.Selected_Employee_SCLegalHoliday != null)
    this.Selected_Employee_SCLegalHoliday.enddate = date;

    this.isEndDateSelected= true;
    this.calcDuration();

}

calcDuration(){
  if (this.isStartDateSelected && this.isEndDateSelected)
  this.duration.setValue(moment.duration(moment(this.Selected_Employee_SCLegalHoliday.enddate).diff(moment(this.Selected_Employee_SCLegalHoliday.startdate))).asDays());
  else return;
}

startDateChange(changeSource: string){
  if (changeSource == 'day')
    this.startDateDayIsFilled= true;
  else if (changeSource == 'month')
    this.startDateMonthIsFilled= true;
  else if (changeSource == 'year')
    this.startDateYearIsFilled= true;

  if (this.startDateDayIsFilled && this.startDateMonthIsFilled && this.startDateYearIsFilled){
    this.startdate.setValue(moment(this.startDateMonth+'/'+this.startDateDay+'/'+this.startDateYear).set({hour: 2}).toDate());
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
    this.enddate.setValue(moment(this.endDateMonth+'/'+this.endDateDay+'/'+this.endDateYear).set({hour: 2}).toDate());
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
    this.documentdate.setValue(moment(this.documentDateMonth+'/'+this.documentDateDay+'/'+this.documentDateYear).set({hour: 2}).toDate());
    this.addEventDocumentDate(this.documentdate.value);
  }
 }

 public focusNext(id: string) {
  let element = this._document.getElementById(id);
  if (element) {
    element.focus();
  }
}
}
