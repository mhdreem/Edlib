import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Observable, startWith, map, of, Subscription, combineLatest, forkJoin } from 'rxjs';
import { ITBLShamelDocumentType } from 'src/app/modules/shared/models/employees_department/ITBLShamelDocumentType';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { TBLShamelMergeServiceReason } from 'src/app/modules/shared/models/employees_department/TBLShamelMergeServiceReason';
import { TBLShamelSCMergeService } from 'src/app/modules/shared/models/employees_department/TBLShamelSCMergeService';
import { TBLShamelMergeServiceReasonService } from 'src/app/modules/shared/services/employees_department/tblshamel-merge-service-reason.service';
import { TBLShamelSCMergeServiceService } from 'src/app/modules/shared/services/employees_department/tblshamel-sc-merge-service.service';
import { TblshameldocumenttypeService } from 'src/app/modules/shared/services/employees_department/tblshameldocumenttype.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { EmployeePageService } from '../../pageservice/employee-page-service';
import { ValidateForm } from './validate/ValidateForm';
@Component({
  selector: 'app-tblshamelscmergeservice-modify',
  templateUrl: './tblshamelscmergeservice-modify.component.html',
  styleUrls: ['./tblshamelscmergeservice-modify.component.scss']
})

export class TblshamelscmergeserviceModifyComponent implements OnInit {

  id_employee: number|undefined;
  Selected_Emp: TBLShamelEmployee = {};
  _Selected_Employee_SCMergeService: TBLShamelSCMergeService
  @Input() set Selected_Employee_SCMergeService(obj: TBLShamelSCMergeService) {
    this._Selected_Employee_SCMergeService = obj;
    console.log('بلش');

    if (this._Selected_Employee_SCMergeService != null &&
      this._Selected_Employee_SCMergeService != undefined) {
      console.log('سث');
      console.log(this._Selected_Employee_SCMergeService);
      this.SetValue();
    }
  }

  get Selected_Employee_SCMergeService(): TBLShamelSCMergeService {
    return this._Selected_Employee_SCMergeService;
  }

  isLoadingFinish: boolean = false;
  _Subscription: Subscription;

  //Array Of AutoComplere With Filter
  
  List_TBLShamelMergeServiceReason :TBLShamelMergeServiceReason[]=[];
  filter_TBLShamelMergeServiceReason: Observable<TBLShamelMergeServiceReason[]>;  

  DocumentType_List :ITBLShamelDocumentType[]=[];
  filteredDocumentTypeOptions: Observable<ITBLShamelDocumentType[]>;


  
  // Access To Element in Form

  Form: FormGroup;
  serial: FormControl<number | null>;
  id: FormControl<number | null>;
  years: FormControl<number | null>;
  months: FormControl<number | null>;
  days: FormControl<number | null>;
  mergeservicereason_id: FormControl<number | null>;
  documenttype_id: FormControl<number | null>;
  document_number: FormControl<string | null>;
  documentdate: FormControl<Date | null>;



  //Local Var

  submitted = false;
  loading: boolean = false;

  darkTheme: boolean;

  //#region Constuctor 
  constructor(    
    @Inject(MAT_DIALOG_DATA) public data: {obj: TBLShamelSCMergeService,id:number},
    public ShamelSCMergeService:TBLShamelSCMergeServiceService,
    public ShamelMergeServiceReasonService:TBLShamelMergeServiceReasonService,    
    public ShameldocumenttypeService:TblshameldocumenttypeService ,
    private fb: UntypedFormBuilder,
    public PageService: EmployeePageService,
    public dialogRef: MatDialogRef<TblshamelscmergeserviceModifyComponent>,
    private themeService: ThemeService
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
  
      console.log('dsdf sadf asdfasdf asdf asd');
      console.log(data.obj);

      if (data!= null  && data.obj!= null && data.id!= null && data.id> 0) {

        console.log('dsdf sadf asdfasdf asdf asd');

        this.id_employee = data.id;     
        this.Selected_Employee_SCMergeService = data.obj;
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
            this.Load_ITBLShamelMergeServiceReason()
          ).subscribe(
            res => {
              this.isLoadingFinish = true;
              this.DocumentType_List = res[0];
              this.filteredDocumentTypeOptions = of(this.DocumentType_List);
              this.ShameldocumenttypeService.List_ITBLShamelDocumentType = this.DocumentType_List;
              this.ShameldocumenttypeService.List_ITBLShamelDocumentType_BehaviorSubject.next(this.DocumentType_List);

              this.List_TBLShamelMergeServiceReason  = res[1];
              this.filter_TBLShamelMergeServiceReason = of(this.List_TBLShamelMergeServiceReason);
              this.ShamelMergeServiceReasonService.List_TBLShamelMergeServiceReason = this.List_TBLShamelMergeServiceReason;
              this.ShamelMergeServiceReasonService.List_TBLShamelMergeServiceReason_BehaviorSubject.next(this.List_TBLShamelMergeServiceReason);
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

  Load_ITBLShamelMergeServiceReason(): Observable<TBLShamelMergeServiceReason[]> {
    if (this.ShamelMergeServiceReasonService.List_TBLShamelMergeServiceReason == null ||
      this.ShamelMergeServiceReasonService.List_TBLShamelMergeServiceReason == undefined ||
      this.ShamelMergeServiceReasonService.List_TBLShamelMergeServiceReason.length == 0)
      return this.ShamelMergeServiceReasonService.list();
    return of(this.ShamelMergeServiceReasonService.List_TBLShamelMergeServiceReason);

  }

  public async Init_AutoComplete() {
    try {
      this.filteredDocumentTypeOptions = this.documenttype_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredDocumentType(value) : this.DocumentType_List.slice())
        );

        this.filter_TBLShamelMergeServiceReason = this.mergeservicereason_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredMergeServiceReason(value) : this.List_TBLShamelMergeServiceReason.slice())
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

  private _filteredMergeServiceReason(value: string): TBLShamelMergeServiceReason[] {
    if (value) {
      const filterValue = value;
      return this.List_TBLShamelMergeServiceReason.filter(obj => obj.mergeservicereason_name.includes(filterValue));

    }
    return this.List_TBLShamelMergeServiceReason.slice();
  }

  public async FillArrayUsingService()
  {
    try{

      this.filteredDocumentTypeOptions = this.documenttype_id.valueChanges
      .pipe(
        startWith(''),        
        map(value => value   && typeof value === 'string'  ? this._Filtered_DocumentType(value) : this.DocumentType_List.slice() )
      );  
    

      this.filter_TBLShamelMergeServiceReason = this.mergeservicereason_id.valueChanges
      .pipe(
        startWith(''),        
        map(value => value   && typeof value === 'string'  ? this._Filtered_TBLShamelMergeServiceReason(value) : this.List_TBLShamelMergeServiceReason.slice() )
      );  
    
  
      
    }catch(Exception : any)
    {}


   
     
  

   

  }

   
   //#endregion

   //#region  Init Component

   ngOnInit(): void {
     this.SetValue();
     this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }


  ngAfterViewInit() {

  }

  
  
   public BuildForm()
   {
    

    this.Form = this.fb.group(
      {
        'serial': this.serial = new FormControl<number | null>(null, []),
        'days': this.days = new FormControl<number | null>(null, []),
        'months': this.months = new FormControl<number | null>(null, []),
        'years': this.years = new FormControl<number | null>(null, []),
        'id': this.id = new FormControl<number | null>(null, []),
        'mergeservicereason_id': this.mergeservicereason_id = new FormControl<number | null>(null, []),
        'document_number': this.document_number = new FormControl<string | null>(null, []),
        'documenttype_id': this.documenttype_id = new FormControl<number | null>(null, []),
        'documentdate': this.documentdate = new FormControl<Date | null>(null, []),
      },
      {
        updateOn: 'change',
        asyncValidators: ValidateForm(this.ShamelSCMergeService).bind(this) // <= async validator
      }
    );
   
  }
   //#endregion


   //#region Filter Of  

    public  _Filtered_TBLShamelMergeServiceReason(value: string): TBLShamelMergeServiceReason[] 
     {    
    if (value!= null )
    {
    const filterValue = value ;
    return this.List_TBLShamelMergeServiceReason.filter(obj => obj.mergeservicereason_name && obj.mergeservicereason_name.includes(filterValue) );
    }
    return this.List_TBLShamelMergeServiceReason.slice();
  }

  public  _Filtered_DocumentType(value: string): ITBLShamelDocumentType[] {    
    if (value!= null)
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
    if (this.Selected_Employee_SCMergeService != null  &&
       this.Selected_Employee_SCMergeService.serial != null  &&
      this.Selected_Employee_SCMergeService.serial>0)
    {

      if (this.Selected_Employee_SCMergeService.serial != null)
          this.serial.setValue(this.Selected_Employee_SCMergeService.serial);


      if (this.Selected_Employee_SCMergeService.id != null)
        this.id.setValue(this.Selected_Employee_SCMergeService.id);

      if (this.Selected_Employee_SCMergeService.days != null)
      this.days.setValue(this.Selected_Employee_SCMergeService.days); 
      
      if (this.Selected_Employee_SCMergeService.months != null)
      this.months.setValue(this.Selected_Employee_SCMergeService.months); 

      if (this.Selected_Employee_SCMergeService.years != null)
      this.years.setValue(this.Selected_Employee_SCMergeService.years); 

      if (this.Selected_Employee_SCMergeService.mergeservicereason_id != null)
      this.mergeservicereason_id.setValue(this.Selected_Employee_SCMergeService.mergeservicereason_id); 

      if (this.Selected_Employee_SCMergeService.documenttype_id != null)
      this.documenttype_id.setValue(this.Selected_Employee_SCMergeService.documenttype_id); 

      if (this.Selected_Employee_SCMergeService.document_number != null)
      this.document_number.setValue(this.Selected_Employee_SCMergeService.document_number); 

      if (this.Selected_Employee_SCMergeService.documentdate != null)
        this.documentdate.setValue(moment(this.Selected_Employee_SCMergeService.documentdate).toDate());

      
    
    }
  
  }

  public getValue()
  {
    try{

if (this.Selected_Employee_SCMergeService != null  )
{

  this.Selected_Employee_SCMergeService.id = this.id_employee;
  this.Selected_Employee_SCMergeService.days = this.days.value;
  this.Selected_Employee_SCMergeService.months = this.months.value;
    this.Selected_Employee_SCMergeService.years =this.years.value; 
    this.Selected_Employee_SCMergeService.mergeservicereason_id = this.mergeservicereason_id.value; 
    this.Selected_Employee_SCMergeService.documenttype_id = this.documenttype_id.value;        
    this.Selected_Employee_SCMergeService.document_number = this.document_number.value;
    if (this.documentdate.value )
    this.Selected_Employee_SCMergeService.documentdate = moment(this.documentdate.value).toDate();
    
    
  }
  }catch(ex: any)
  {

  }
  
  }
//#endregion

 

  //#region OnSelect Function

  public OnSelect_TBLShamelMergeServiceReason(event: MatAutocompleteSelectedEvent) {
    if (event  != null && this.Selected_Employee_SCMergeService != null)
      this.Selected_Employee_SCMergeService.mergeservicereason_id = event.option.value;  
  }


  public OnSelect_DocumentType(event: MatAutocompleteSelectedEvent) {
    console.log('OnSelectStateChange');
    console.log(event.option.value);
    if ( event != null &&  this.Selected_Employee_SCMergeService != null)
      this.Selected_Employee_SCMergeService.documenttype_id = event.option.value;  
  }

  

  //#endregion


  //#region  Display Display Member
  public displayDocumentTypeProperty(value:string):string  {
    if (value != null && this.DocumentType_List!= null){     
      let documentType:any = this.DocumentType_List.find(crs => crs.documenttype_id.toString() == value) ;
      if (documentType != null )
      return documentType.documenttype_name;
    }
    return '';
  }


  public display_TBLShamelMergeServiceReason(value:string):string  {

    console.log('dsdsdfsdf');
    console.log(value);
    if (value!= null && this.List_TBLShamelMergeServiceReason != null){

      let obj:TBLShamelMergeServiceReason | undefined = this.List_TBLShamelMergeServiceReason.find(spec => spec.mergeservicereason_id && spec.mergeservicereason_id.toString() == value) ;
      if (obj!= null  &&  obj.mergeservicereason_name!= null )
        return obj.mergeservicereason_name;
    }
    return '';
  }





 

  

  public async Save()
  {
 
    this.submitted = true;

   
    
    
    if (!this.Form.valid == true ) {
      console.log("form", this.Form);
      console.log("this.Form.طلع");
      console.log("this.Form.invalid"+this.Form.errors);
      return;
    }

    console.log(this.Selected_Employee_SCMergeService);
    console.log(this.Selected_Employee_SCMergeService.serial);

    this.getValue();

    if (this.Selected_Employee_SCMergeService!= null   &&
      (this.Selected_Employee_SCMergeService.serial== null  ||
      this.Selected_Employee_SCMergeService.serial<=0))
      {

        console.log("dgs adfgdsfg sdfg sd");

        this.ShamelSCMergeService.add(this.Selected_Employee_SCMergeService).toPromise().then(res => {
          console.log(res)
          if (res == 1)
        {
          this.dialogRef.close(true);

        }else
        {



        }
    });
  }
   else if (this.Selected_Employee_SCMergeService != null  &&
    this.Selected_Employee_SCMergeService.serial != null &&
             this.Selected_Employee_SCMergeService.serial>0)
             {

      this.ShamelSCMergeService.update(this.Selected_Employee_SCMergeService).toPromise().then(res => {
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



addEventDocumentDate(type: string, event: MatDatepickerInputEvent<Date>) {
  if (event.value != null &&
    this.Selected_Employee_SCMergeService != null)
    this.Selected_Employee_SCMergeService.documentdate = moment(event.value).toDate();

}




}
