import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Observable, of, startWith, map, Subscription, combineLatest, forkJoin } from 'rxjs';
import { ITBLShamelDocumentType } from 'src/app/modules/shared/models/employees_department/ITBLShamelDocumentType';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { TBLShamelSCSuddenHoliday } from 'src/app/modules/shared/models/employees_department/TBLShamelSCSuddenHoliday';
import { TBLShamelSuddenHoliday } from 'src/app/modules/shared/models/employees_department/TBLShamelSuddenHoliday';
import { TBLShamelSCSuddenHolidayService } from 'src/app/modules/shared/services/employees_department/tblshamel-sc-sudden-holiday.service';
import { TBLShamelSuddenHolidayService } from 'src/app/modules/shared/services/employees_department/tblshamel-sudden-holiday.service';
import { TblshameldocumenttypeService } from 'src/app/modules/shared/services/employees_department/tblshameldocumenttype.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { EmployeePageService } from '../../pageservice/employee-page-service';
import { ValidateForm } from './validate/ValidateForm';

@Component({
  selector: 'app-tblshamel-sc-sudden-holiday-add',
  templateUrl: './tblshamel-sc-sudden-holiday-add.component.html',
  styleUrls: ['./tblshamel-sc-sudden-holiday-add.component.scss']
})
export class TBLShamelSCSuddenHolidayAddComponent implements OnInit {

  id_employee: number;
  Selected_Emp: TBLShamelEmployee = {};
  
  _Selected_Employee_SCSuddenHoliday: TBLShamelSCSuddenHoliday
  @Input() set Selected_Employee_SCSuddenHoliday(obj: TBLShamelSCSuddenHoliday) {
    this._Selected_Employee_SCSuddenHoliday = obj;
    console.log('بلش');

    if (this._Selected_Employee_SCSuddenHoliday != null &&
      this._Selected_Employee_SCSuddenHoliday != undefined) {
      console.log('سث');
      console.log(this._Selected_Employee_SCSuddenHoliday);
      this.SetValue();
    }
  }

  get Selected_Employee_SCSuddenHoliday(): TBLShamelSCSuddenHoliday {
    return this._Selected_Employee_SCSuddenHoliday;
  }

  isLoadingFinish: boolean = false;
  _Subscription: Subscription;

  //Array Of AutoComplere With Filter
  
  DocumentType_List :ITBLShamelDocumentType[]=[];
  filteredDocumentTypeOptions: Observable<ITBLShamelDocumentType[]>;


  
  TBLShamelSuddenHoliday_List :TBLShamelSuddenHoliday[]=[];
  Filtered_TBLShamelSuddenHoliday: Observable<TBLShamelSuddenHoliday[]>;


  // Access To Element in Form

  Form: FormGroup;
  serial: FormControl<number | null>;
  id: FormControl<number | null>;
  duration: FormControl<number | null>;
  startdate: FormControl<Date | null>;
  enddate: FormControl<Date | null>;
  suddenholiday_id: FormControl<number | null>;
  notes: FormControl<string | null>;
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
    @Inject(MAT_DIALOG_DATA) public data: {obj: TBLShamelSCSuddenHoliday,id:number},
    public ShamelSCSuddenHolidayService:TBLShamelSCSuddenHolidayService,
    public ShamelSuddenHolidayService:TBLShamelSuddenHolidayService,
    public ShameldocumenttypeService:TblshameldocumenttypeService ,
    private fb: UntypedFormBuilder,
    public PageService: EmployeePageService,
    public dialogRef: MatDialogRef<TBLShamelSCSuddenHolidayAddComponent>,
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
  
      if (data!= null  && data.obj!= null && data.id != null &&  data.id > 0) {
        console.log('ddddddddddddddddddddddddddddddd');

        this.id_employee = data.id;
        this.Selected_Employee_SCSuddenHoliday = data.obj;
        console.log(this.Selected_Employee_SCSuddenHoliday);
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
            this.Load_ITBLShamelDocumentType(),
            this.Load_ITBLShamelSuddenHoliday()
          ).subscribe(
            res => {
              this.isLoadingFinish = true;
              this.DocumentType_List = res[0];
              this.filteredDocumentTypeOptions = of(this.DocumentType_List);
              this.ShameldocumenttypeService.List_ITBLShamelDocumentType = this.DocumentType_List;
              this.ShameldocumenttypeService.List_ITBLShamelDocumentType_BehaviorSubject.next(this.DocumentType_List);

              this.TBLShamelSuddenHoliday_List  = res[1];
              this.Filtered_TBLShamelSuddenHoliday = of(this.TBLShamelSuddenHoliday_List);
              this.ShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService = this.TBLShamelSuddenHoliday_List;
              this.ShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService_BehaviorSubject.next(this.TBLShamelSuddenHoliday_List);
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

  Load_ITBLShamelSuddenHoliday(): Observable<TBLShamelSuddenHoliday[]> {
    if (this.ShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService == null ||
      this.ShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService == undefined ||
      this.ShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService.length == 0)
      return this.ShamelSuddenHolidayService.list();
    return of(this.ShamelSuddenHolidayService.List_TBLShamelSuddenHolidayService);

  }

  public async Init_AutoComplete() {
    try {
      this.filteredDocumentTypeOptions = this.documenttype_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredDocumentType(value) : this.DocumentType_List.slice())
        );

        this.Filtered_TBLShamelSuddenHoliday = this.suddenholiday_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredSuddenHoliday(value) : this.TBLShamelSuddenHoliday_List.slice())
        );
    } catch (Exception: any) { }
  }
    ngOnInit(): void {
  
      this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
        this.darkTheme= res;
      })
  
    }

    private _filteredDocumentType(value: string): ITBLShamelDocumentType[] {
      if (value) {
        const filterValue = value;
        return this.DocumentType_List.filter(obj => obj.documenttype_name.includes(filterValue));
  
      }
      return this.DocumentType_List.slice();
    }
  
    private _filteredSuddenHoliday(value: string): TBLShamelSuddenHoliday[] {
      if (value) {
        const filterValue = value;
        return this.TBLShamelSuddenHoliday_List.filter(obj => obj.suddenholiday_name.includes(filterValue));
  
      }
      return this.TBLShamelSuddenHoliday_List.slice();
    }
  
  
    ngAfterViewInit() {
  
    }
  
    public async FillArrayUsingService()
   {
     try{

      
       
       this.filteredDocumentTypeOptions = this.documenttype_id.valueChanges
       .pipe(
         startWith(''),        
         map(value => value   && typeof value === 'string'  ? this._Filtered_DocumentType(value) : this.DocumentType_List.slice() )
       );  
     

       this.Filtered_TBLShamelSuddenHoliday = this.suddenholiday_id.valueChanges
       .pipe(
         startWith(''),        
         map(value => value   && typeof value === 'string'  ? this._Filtered_TBLShamelSuddenHoliday(value) : this.TBLShamelSuddenHoliday_List.slice() )
       );  
     
   
       
     }catch(Exception : any)
     {}


    
      
   

    

   }
  

  
  
   public BuildForm()
   {
    

    this.Form = this.fb.group(
      {
        'duration': this.duration = new FormControl<number | null>(null, []),
        'serial': this.serial = new FormControl<number | null>(null, []),
        'id': this.id = new FormControl<number | null>(null, []),
        'notes': this.notes = new FormControl<string | null>(null, []),
        'suddenholiday_id': this.suddenholiday_id = new FormControl<number | null>(null, []),
        'startdate': this.startdate = new FormControl<Date | null>(null, [Validators.required]),
        'enddate': this.enddate = new FormControl<Date | null>(null, [Validators.required]),
        'document_number': this.document_number = new FormControl<string | null>(null, []),
        'documenttype_id': this.documenttype_id = new FormControl<number | null>(null, []),
        'documentdate': this.documentdate = new FormControl<Date | null>(null, []),
      },
      {
        updateOn: 'change',
        asyncValidators: ValidateForm(this.ShamelSCSuddenHolidayService).bind(this) // <= async validator
      }
    );

     
   
  }
   //#endregion

   public  _Filtered_TBLShamelSuddenHoliday(value: string): TBLShamelSuddenHoliday[] {    
    if (value)
    {
      const filterValue = value ;
      return this.TBLShamelSuddenHoliday_List.filter(obj =>obj.suddenholiday_name && obj.suddenholiday_name.includes(filterValue) );

    }
    return this.TBLShamelSuddenHoliday_List.slice();
  }
  

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
  public ClearForm()
  {
    try {
      this.Form.reset();

    } catch (ex: any) {

    }
  }


  //#region SetValue And GetValue Function
  public SetValue()
  {
    if (this.Selected_Employee_SCSuddenHoliday!= null  &&
       this.Selected_Employee_SCSuddenHoliday.serial!= null  &&
      this.Selected_Employee_SCSuddenHoliday.serial>0)
    {

      if (this.Selected_Employee_SCSuddenHoliday.serial != null)
          this.serial.setValue(this.Selected_Employee_SCSuddenHoliday.serial);


        if (this.Selected_Employee_SCSuddenHoliday.id != null)
          this.id.setValue(this.Selected_Employee_SCSuddenHoliday.id);

    if (this.Selected_Employee_SCSuddenHoliday.duration !=null)
      this.duration.setValue(this.Selected_Employee_SCSuddenHoliday.duration); 

      if (this.Selected_Employee_SCSuddenHoliday != null &&
          this.Selected_Employee_SCSuddenHoliday.startdate != null ){
            this.startdate.setValue(moment(this.Selected_Employee_SCSuddenHoliday.startdate).toDate() ); 
            this.startDateDay= moment(this.startdate.value).date()+'';
            this.startDateMonth= (moment(this.startdate.value).month()+1)+'';
            this.startDateYear= moment(this.startdate.value).year()+'';
          }

      if (this.Selected_Employee_SCSuddenHoliday != null &&
          this.Selected_Employee_SCSuddenHoliday.enddate != null )
          {
            this.enddate.setValue(moment(this.Selected_Employee_SCSuddenHoliday.enddate).toDate()); 
            this.endDateDay= moment(this.enddate.value).date()+'';
            this.endDateMonth= (moment(this.enddate.value).month()+1)+'';
            this.endDateYear= moment(this.enddate.value).year()+'';
          }

        if (this.Selected_Employee_SCSuddenHoliday.documenttype_id != null)
      this.documenttype_id.setValue(this.Selected_Employee_SCSuddenHoliday.documenttype_id); 

      if (this.Selected_Employee_SCSuddenHoliday.document_number != null)
      this.document_number.setValue(this.Selected_Employee_SCSuddenHoliday.document_number); 

      if (this.Selected_Employee_SCSuddenHoliday != null &&
        this.Selected_Employee_SCSuddenHoliday.documentdate != null )   {
          this.documentdate.setValue(moment(this.Selected_Employee_SCSuddenHoliday.documentdate).toDate() ); 
          this.documentDateDay= moment(this.documentdate.value).date()+'';
          this.documentDateMonth= (moment(this.documentdate.value).month()+1)+'';
          this.documentDateYear= moment(this.documentdate.value).year()+'';
        }     

        if (this.Selected_Employee_SCSuddenHoliday.suddenholiday_id != null)
      this.suddenholiday_id.setValue(this.Selected_Employee_SCSuddenHoliday.suddenholiday_id)

      if (this.Selected_Employee_SCSuddenHoliday.notes != null)
      this.notes.setValue(this.Selected_Employee_SCSuddenHoliday.notes);
      
    
    }
  
  }

  public getValue()
  {
    try{

if (this.Selected_Employee_SCSuddenHoliday != null )
{

  this.Selected_Employee_SCSuddenHoliday.id = this.Selected_Emp.id;
  this.Selected_Employee_SCSuddenHoliday.duration = this.duration.value;

  if (this.startdate.value != null )
  this.Selected_Employee_SCSuddenHoliday.startdate =moment( this.startdate.value).toDate();

  if (this.enddate.value != null )
    this.Selected_Employee_SCSuddenHoliday.enddate =moment(this.enddate.value).toDate();
    
    this.Selected_Employee_SCSuddenHoliday.documenttype_id = this.documenttype_id.value;        
    this.Selected_Employee_SCSuddenHoliday.document_number = this.document_number.value;

    if (this.documentdate.value )
    
    this.Selected_Employee_SCSuddenHoliday.documentdate = moment(this.documentdate.value).toDate();    
    this.Selected_Employee_SCSuddenHoliday.notes = this.notes.value    
    this.Selected_Employee_SCSuddenHoliday.suddenholiday_id = this.suddenholiday_id.value
    
  }
  }catch(ex: any)
  {

  }
  
  }
//#endregion

 




  public OnSelect_DocumentType(event: MatAutocompleteSelectedEvent) {
    console.log('OnSelectStateChange');
    console.log(event.option.value);
    if ( event!= null   &&  this.Selected_Employee_SCSuddenHoliday != null )
      this.Selected_Employee_SCSuddenHoliday.documenttype_id = event.option.value;  
  }


  public OnSelect_SuddenHoliday(event: MatAutocompleteSelectedEvent) {
    console.log('OnSelectStateChange');
    console.log(event.option.value);
    if ( event != null  &&  this.Selected_Employee_SCSuddenHoliday != null  )
      this.Selected_Employee_SCSuddenHoliday.suddenholiday_id = event.option.value;  
  }



  //#endregion


  //#region  Display Display Member
  public displayDocumentTypeProperty(value:string):string  {
    if (value!= null  && this.DocumentType_List != null  && this.DocumentType_List.length >0){     
      let documentType:any = this.DocumentType_List.find(crs => crs.documenttype_id.toString() == value) ;
      if (documentType!= null )
      return documentType.documenttype_name;
    }
    return '';
  }


    //#region  Display Display Member
    public Display_TBLShamelSuddenHoliday(value:string):string  {
      if (value!= null   && this.TBLShamelSuddenHoliday_List!= null && this.TBLShamelSuddenHoliday_List.length >0){     
        let suddenholiday:any = this.TBLShamelSuddenHoliday_List.find(crs => crs.suddenholiday_id != null  && crs.suddenholiday_id.toString() == value) ;
        if (suddenholiday!= null )
        return suddenholiday.suddenholiday_name;
      }
      return '';
    }






 

  

  public async Save()
  {
 
console.log('1');   
    
    if (!this.Form.valid == true ) {
      console.log("invalid",this.Form.errors);
      return;
    }
    console.log('2');   

    this.getValue();

    console.log(this.Selected_Employee_SCSuddenHoliday);   

    if (this.Selected_Employee_SCSuddenHoliday != null  &&
      (this.Selected_Employee_SCSuddenHoliday.serial == null  ||
      this.Selected_Employee_SCSuddenHoliday.serial<=0))
      {
        console.log('3');   

        this.ShamelSCSuddenHolidayService.add(this.Selected_Employee_SCSuddenHoliday).toPromise().then(res => {
          console.log(res)
          if (res == 1)
        {
          this.dialogRef.close(true);
        }else
        {



        }
    });
  }
   else if (this.Selected_Employee_SCSuddenHoliday!= null   &&
    this.Selected_Employee_SCSuddenHoliday.serial != null &&
             this.Selected_Employee_SCSuddenHoliday.serial>0)
             {

      this.ShamelSCSuddenHolidayService.update(this.Selected_Employee_SCSuddenHoliday).toPromise().then(res => {
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
    this.Selected_Employee_SCSuddenHoliday != null)
    this.Selected_Employee_SCSuddenHoliday.documentdate = date;

}


addEventStartDate(date: Date) {
  if (date != null &&
    this.Selected_Employee_SCSuddenHoliday != null)
    this.Selected_Employee_SCSuddenHoliday.startdate = date;

    this.isStartDateSelected= true;
    this.calcDuration();


}



addEventEndDate(date: Date) {
  if (date != null &&
    this.Selected_Employee_SCSuddenHoliday != null)
    this.Selected_Employee_SCSuddenHoliday.enddate = date;

    this.isEndDateSelected= true;
    this.calcDuration();

}

calcDuration(){
  if (this.isStartDateSelected && this.isEndDateSelected)
  this.duration.setValue(moment.duration(moment(this.Selected_Employee_SCSuddenHoliday.enddate).diff(moment(this.Selected_Employee_SCSuddenHoliday.startdate))).asDays());
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
