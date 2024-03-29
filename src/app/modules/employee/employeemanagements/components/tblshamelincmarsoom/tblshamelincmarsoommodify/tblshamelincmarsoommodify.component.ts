import { AfterViewInit, Component, HostListener, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { combineLatest, forkJoin, Observable, of, Subscription } from 'rxjs';



import * as moment from 'moment';
import { map, startWith } from 'rxjs/operators';
import { FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ITBLShamelChangeReason } from 'src/app/modules/shared/models/employees_department/ITBLShamelChangeReason';
import { ITBLShamelDocumentType } from 'src/app/modules/shared/models/employees_department/ITBLShamelDocumentType';
import { ITBLShamelIncMarsoom } from 'src/app/modules/shared/models/employees_department/ITBLShamelIncMarsoom';
import { TblshamelchangereasonService } from 'src/app/modules/shared/services/employees_department/tblshamelchangereason.service';
import { TblshameldocumenttypeService } from 'src/app/modules/shared/services/employees_department/tblshameldocumenttype.service';
import { TblshamelincmarsoomService } from 'src/app/modules/shared/services/employees_department/tblshamelincmarsoom.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-tblshamelincmarsoommodify',
  templateUrl: './tblshamelincmarsoommodify.component.html',
  styleUrls: ['./tblshamelincmarsoommodify.component.scss']
})
export class TblshamelincmarsoommodifyComponent implements OnInit, AfterViewInit, OnDestroy {
  formname:string = 'ManageSCIncMarsoomFrame1';

  _Selected_IncMarsoom: ITBLShamelIncMarsoom;
  @Input() set Selected_IncMarsoom(obj: ITBLShamelIncMarsoom) {
    this._Selected_IncMarsoom = obj;


    if (this._Selected_IncMarsoom != null &&
      this._Selected_IncMarsoom != undefined) {

      this.SetValue();
    }
  }

  get Selected_IncMarsoom(): ITBLShamelIncMarsoom {
    return this._Selected_IncMarsoom;
  }



  //Array Of AutoComplere With Filter
  ChangeReason_List: ITBLShamelChangeReason[] = [];
  filteredChangeReasonOptions: Observable<ITBLShamelChangeReason[]>;


  DocumentType_List: ITBLShamelDocumentType[] = [];
  filteredDocumentTypeOptions: Observable<ITBLShamelDocumentType[]>;



  // Access To Element in Form
  Form: FormGroup;
  incmarsoom_id: FormControl<number | null>;
  incmarsoomdata: FormControl<string | null>;
  changedate: FormControl<Date | null>;
  changereason_id: FormControl<number | null>;
  documenttype_id: FormControl<number | null>;
  document_number: FormControl<string | null>;
  documentdate: FormControl<Date | null>;
  begindate: FormControl<Date | null>;
  incpercentage: FormControl<number | null>;
  additionalvalue: FormControl<number | null>;

  _Subscription: Subscription = new Subscription();

  //Local Var

  submitted = false;
  loading: boolean = false;

  changeDateDay: string= '';
  changeDateMonth: string= '';
  changeDateYear: string= '';
  beginDateDay: string= '';
  beginDateMonth: string= '';
  beginDateYear: string= '';
  docDateDay: string= '';
  docDateMonth: string= '';
  docDateYear: string= '';

  changeDateDayIsFilled: boolean= false;
  changeDateMonthIsFilled: boolean= false;
  changeDateYearIsFilled: boolean= false;
  beginDateDayIsFilled: boolean= false;
  beginDateMonthIsFilled: boolean= false;
  beginDateYearIsFilled: boolean= false;
  docDateDayIsFilled: boolean= false;
  docDateMonthIsFilled: boolean= false;
  docDateYearIsFilled: boolean= false;

  LoadingFinish:boolean;

  darkTheme: boolean;
  //#region Constuctor 
  constructor(
    public dialogRef: MatDialogRef<TblshamelincmarsoommodifyComponent>,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(MAT_DIALOG_DATA) public data: { obj: ITBLShamelIncMarsoom },
    public incmarsoomService: TblshamelincmarsoomService,
    public changereasonService: TblshamelchangereasonService,
    public ShameldocumenttypeService: TblshameldocumenttypeService,
    private fb: UntypedFormBuilder,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {

    this.BuildForm();
    this.Load_Data();
    this.FillArrayUsingService();

    if (data != null && data.obj != null) {
      this.Selected_IncMarsoom = data.obj;
    }

  }
  ngOnDestroy(): void {
    this._Subscription.unsubscribe();
  }


  Load_TBLShamelChangeReason(): Observable<ITBLShamelChangeReason[]> {
    if (this.changereasonService.List_ITBLShamelChangeReason == null ||
      this.changereasonService.List_ITBLShamelChangeReason == undefined ||
      this.changereasonService.List_ITBLShamelChangeReason.length == 0)
      return this.changereasonService.list();
    return of(this.changereasonService.List_ITBLShamelChangeReason);
  }






  Load_TBLShamelDocumentType(): Observable<ITBLShamelDocumentType[]> {
    if (this.ShameldocumenttypeService.List_ITBLShamelDocumentType == null ||
      this.ShameldocumenttypeService.List_ITBLShamelDocumentType == undefined ||
      this.ShameldocumenttypeService.List_ITBLShamelDocumentType.length == 0)
      return this.ShameldocumenttypeService.list();
    return of(this.ShameldocumenttypeService.List_ITBLShamelDocumentType);

  }


  Load_Data() {
    this.LoadingFinish = false;



    this._Subscription .add(
       forkJoin(

      this.Load_TBLShamelChangeReason(),
      this.Load_TBLShamelDocumentType()


    ).subscribe(
      res => {

        this.LoadingFinish = true;

        this.ChangeReason_List = res[0];
        this.filteredChangeReasonOptions = of(this.ChangeReason_List);
        this.changereasonService.List_ITBLShamelChangeReason = res[0];
        this.changereasonService.List_ITBLShamelChangeReason_BehaviorSubject.next(this.ChangeReason_List);
        this.DocumentType_List = res[1];
        this.filteredDocumentTypeOptions = of(res[1]);
        this.ShameldocumenttypeService.List_ITBLShamelDocumentType = res[1];
        this.ShameldocumenttypeService.List_ITBLShamelDocumentType_BehaviorSubject.next(res[1]);
        this.FillArrayUsingService();

        this.SetValue();
      },error=>
      {
        this.LoadingFinish = true ;
        this.snackBar.open('حدث خطأ اثناء تحميل البيانات','موافق');
      }
    )
    );

  }

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }


  ngAfterViewInit() {

  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
          this.Save();
          event.preventDefault();
      }
  }

  public async FillArrayUsingService() {
    try {

      this.filteredDocumentTypeOptions = this.documenttype_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredDocumentType(value) : this.DocumentType_List.slice())
        );

    } catch (Exception: any) { }


    try {



      this.filteredChangeReasonOptions = this.changereason_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredChangeReason(value) : this.ChangeReason_List.slice())
        );

    } catch (Exception: any) { }




  }

  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'incmarsoom_id': this.incmarsoom_id = new FormControl<number | null>(null, [Validators.required]),
          'incmarsoomdata': this.incmarsoomdata = new FormControl<string | null>(null, [Validators.required]),
          'changedate': this.changedate = new FormControl<Date | null>(null, [Validators.required]),
          'changereason_id': this.changereason_id = new FormControl<number | null>(null, [Validators.required]),
          'begindate': this.begindate = new FormControl<Date | null>(null, [Validators.required]),
          'incpercentage': this.incpercentage = new FormControl<number | null>(null),
          'additionalvalue': this.additionalvalue = new FormControl<number | null>(null),
          'documenttype_id': this.documenttype_id = new FormControl<number | null>(null),
          'document_number': this.document_number = new FormControl<string | null>(null),
          'documentdate': this.documentdate = new FormControl<Date | null>(null),
        }
      );



      this.Form = this.fb.group({
      });

      this.Form.addControl('changedate', this.changedate);
      this.Form.addControl('changereason_id', this.changereason_id);
      this.Form.addControl('documenttype_id', this.documenttype_id);
      this.Form.addControl('documentdate', this.documentdate);
      this.Form.addControl('document_number', this.document_number);
      this.Form.addControl('begindate', this.begindate);
      this.Form.addControl('incpercentage', this.incpercentage);
      this.Form.addControl('additionalvalue', this.additionalvalue);


    } catch (Exception: any) {
      console.log(Exception);
    }
  }



  //#region Filter Of  

  private _filteredChangeReason(value: string): ITBLShamelChangeReason[] {
    if (value) {
      const filterValue = value;
      return this.ChangeReason_List.filter(obj => obj.changereason_name.includes(filterValue));
    }
    return this.ChangeReason_List.slice();
  }


  private _filteredDocumentType(value: string): ITBLShamelDocumentType[] {
    if (value) {
      const filterValue = value;
      return this.DocumentType_List.filter(obj => obj.documenttype_name.includes(filterValue));

    }
    return this.DocumentType_List.slice();
  }

  public ClearForm() {
    try {
      console.log('ClearForm');
      this.changedate.reset();
      this.changereason_id.reset();
      this.documentdate.reset();
      this.document_number.reset();
      this.documenttype_id.reset();
      this.begindate.reset();

    } catch (ex: any) {

    }

  }


  //#region SetValue And GetValue Function
  public SetValue() {
    try {

      if (this.Selected_IncMarsoom != null && this.Selected_IncMarsoom.incmarsoom_id != null) {



        if (this.Selected_IncMarsoom.changereason_id != null && this.Selected_IncMarsoom.changereason_id != undefined)
          this.changereason_id.setValue(this.Selected_IncMarsoom.changereason_id);

        if (this.Selected_IncMarsoom.documenttype_id != null && this.Selected_IncMarsoom.documenttype_id != undefined)
          this.documenttype_id.setValue(this.Selected_IncMarsoom.documenttype_id);

        if (this.Selected_IncMarsoom.documentdate != null && this.Selected_IncMarsoom.documentdate != undefined){
          this.documentdate.setValue(moment(this.Selected_IncMarsoom.documentdate).set({hour: 4}).toDate());
          this.docDateDay= moment(this.documentdate.value).date() + '';
          this.docDateMonth= (moment(this.documentdate.value).month() + 1) + '';
          this.docDateYear= moment(this.documentdate.value).year() + '';
          this.docDateDayIsFilled= true;
          this.docDateMonthIsFilled= true;
          this.docDateYearIsFilled= true;
        }

        if (this.Selected_IncMarsoom.changedate != null && this.Selected_IncMarsoom.changedate != undefined){
          this.changedate.setValue(moment(this.Selected_IncMarsoom.changedate).set({hour: 4}).toDate());
          this.changeDateDay= moment(this.changedate.value).date() + '';
          this.changeDateMonth= (moment(this.changedate.value).month() + 1) + '';
          this.changeDateYear= moment(this.changedate.value).year() + '';
          this.changeDateDayIsFilled= true;
          this.changeDateMonthIsFilled= true;
          this.changeDateYearIsFilled= true;
        }

        if (this.Selected_IncMarsoom.begindate != null && this.Selected_IncMarsoom.begindate != undefined){
          this.begindate.setValue(moment(this.Selected_IncMarsoom.begindate).set({hour: 4}).toDate());
          this.beginDateDay= moment(this.begindate.value).date() + '';
          this.beginDateMonth= (moment(this.begindate.value).month() + 1) + '';
          this.beginDateYear= moment(this.begindate.value).year() + '';
          this.beginDateDayIsFilled= true;
          this.beginDateMonthIsFilled= true;
          this.beginDateYearIsFilled= true;
        }

        if (this.Selected_IncMarsoom.document_number != null && this.Selected_IncMarsoom.document_number != undefined)
          this.document_number.setValue(this.Selected_IncMarsoom.document_number);

        if (this.Selected_IncMarsoom.additionalvalue != null && this.Selected_IncMarsoom.additionalvalue != undefined)
          this.additionalvalue.setValue(this.Selected_IncMarsoom.additionalvalue);

        if (this.Selected_IncMarsoom.incpercentage != null && this.Selected_IncMarsoom.incpercentage != undefined)
          this.incpercentage.setValue(this.Selected_IncMarsoom.incpercentage);

        this.changereason_id.setValue(this.Selected_IncMarsoom.changereason_id);
        this.documenttype_id.setValue(this.Selected_IncMarsoom.documenttype_id);


        this.document_number.setValue(this.Selected_IncMarsoom.document_number);
        this.additionalvalue.setValue(this.Selected_IncMarsoom.additionalvalue);
        this.incpercentage.setValue(this.Selected_IncMarsoom.incpercentage);






      }


    } catch (ex: any) {
      console.log(ex);

    }

  }

  public getValue() {
    try {

      if (this.Selected_IncMarsoom != null && this.Selected_IncMarsoom != undefined) {

        if (this.begindate.value != null)
          this.Selected_IncMarsoom.begindate = moment(this.begindate.value).set({hour: 4}).toDate();

        if (this.documentdate.value != null)
          this.Selected_IncMarsoom.documentdate = moment(this.documentdate.value).set({hour: 4}).toDate();

        if (this.changedate.value != null)
          this.Selected_IncMarsoom.changedate = moment(this.changedate.value).set({hour: 4}).toDate();


        if (this.changereason_id.value != null)
          this.Selected_IncMarsoom.changereason_id = this.changereason_id.value;

        if (this.documenttype_id.value != null)
          this.Selected_IncMarsoom.documenttype_id = this.documenttype_id.value;

        if (this.document_number.value != null)
          this.Selected_IncMarsoom.document_number = this.document_number.value;

        if (this.incpercentage.value != null)
          this.Selected_IncMarsoom.incpercentage = this.incpercentage.value;

        if (this.additionalvalue.value != null)
          this.Selected_IncMarsoom.additionalvalue = this.additionalvalue.value;



      }
    } catch (ex: any) {

    }

  }



  public OnSelectChangeReasonChange(event: MatAutocompleteSelectedEvent) {

    if (event != null && this.Selected_IncMarsoom != null)
      this.Selected_IncMarsoom.changereason_id = event.option.value;
  }


  public OnSelectDocumentTypeChange(event: MatAutocompleteSelectedEvent) {
    console.log('OnSelectStateChange');
    console.log(event.option.value);
    if (event != null && this.Selected_IncMarsoom != null)
      this.Selected_IncMarsoom.documenttype_id = event.option.value;
  }



  //#endregion


  //#region  Display Display Member
  public displayDocumentTypeProperty(value: string): string {
    if (value != null && this.DocumentType_List != null) {
      let documentType: any = this.DocumentType_List.find(crs => crs.documenttype_id.toString() == value);
      if (documentType != null)
        return documentType.documenttype_name;
    }
    return '';
  }


  public displayChangeReasonProperty(value: string): string {
    if (value && this.ChangeReason_List) {
      let object: any = this.ChangeReason_List.find(obj => obj.changereason_id.toString() == value);
      if (object != null)
        return object.changereason_name;
    }
    return '';
  }








  public async Save() {


    if (this.Form.invalid == true) {
      return;
    }

    if (this.ValidateForm()) {

    }

    this.getValue();

    if (this.Selected_IncMarsoom != null &&
      (this.Selected_IncMarsoom.incmarsoom_id == null ||
        this.Selected_IncMarsoom.incmarsoom_id <= 0)
    ) {


      this.incmarsoomService.add(this.Selected_IncMarsoom).toPromise().then(res => {
        console.log(res)
        if (res == 1) {
        
          this.snackBar.open('تمت الإضافة بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar']
          });
          this.dialogRef.close();
        } else {



        }
      });
    }
    else if (this.Selected_IncMarsoom != null &&
      this.Selected_IncMarsoom.incmarsoom_id != null &&
      this.Selected_IncMarsoom.incmarsoom_id > 0) {


      this.incmarsoomService.update(this.Selected_IncMarsoom).toPromise().then(res => {
        console.log(res)
        if (res == 1) {
          this.snackBar.open('تم التعديل بنجاح', '', {
            duration: 3000,
            panelClass: ['green-snackbar']

          });
          this.dialogRef.close(1);

        } else {
        }
      });

    }
  }


  public ValidateForm(): boolean {
    let result: boolean = true;

    if (this.changereason_id.value == null || this.changereason_id.value <= 0) {
      console.log('error1');
      this.changereason_id.setErrors({ invalid: true, required: true });
      result = false;
    }

    if (this.documenttype_id.value == null || this.documenttype_id.value <= 0) {
      console.log('error2');
      this.documenttype_id.setErrors({ 'Phone Number does not exist.': true });
      result = false;
    }


    if (this.document_number.value == null ||
      this.document_number.value == undefined) {
      console.log('error2');
      this.document_number.setErrors({ 'Phone Number does not exist.': true });
      result = false;

    }



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
    this.Selected_IncMarsoom.documentdate = date;
  }

  addEventBeginDate(date: Date) {
    this.Selected_IncMarsoom.begindate = date;
  }

  addEventChangeDate(date: Date) {

    this.Selected_IncMarsoom.changedate = date;
  }

  changeDateChange(changeSource: string){
    if (changeSource == 'day')
      this.changeDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.changeDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.changeDateYearIsFilled= true;

    if (this.changeDateDayIsFilled && this.changeDateMonthIsFilled && this.changeDateYearIsFilled){
      this.changedate.setValue(moment(this.changeDateMonth+'/'+this.changeDateDay+'/'+this.changeDateYear).set({hour: 4}).toDate());
      this.addEventChangeDate(this.changedate.value);
    }
   }

   beginDateChange(changeSource: string){
    if (changeSource == 'day')
      this.beginDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.beginDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.beginDateYearIsFilled= true;

    if (this.beginDateDayIsFilled && this.beginDateMonthIsFilled && this.beginDateYearIsFilled){
      this.begindate.setValue(moment(this.beginDateMonth+'/'+this.beginDateDay+'/'+this.beginDateYear).set({hour: 4}).toDate());
      this.addEventBeginDate(this.begindate.value);
    }
   }

  docDateChange(changeSource: string){
    if (changeSource == 'day')
      this.docDateDayIsFilled= true;
    else if (changeSource == 'month')
      this.docDateMonthIsFilled= true;
    else if (changeSource == 'year')
      this.docDateYearIsFilled= true;

    if (this.docDateDayIsFilled && this.docDateMonthIsFilled && this.docDateYearIsFilled){
      this.documentdate.setValue(moment(this.docDateMonth+'/'+this.docDateDay+'/'+this.docDateYear).set({hour: 4}).toDate());
      this.addEventDocumentDate(this.documentdate.value);
    }
   }

}
