
import { DOCUMENT } from '@angular/common';
import { Component, OnInit, AfterViewInit, Input, Inject, OnDestroy } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _moment from 'moment';
import { Observable, of, startWith, map, Subscription, combineLatest, forkJoin } from 'rxjs';
import { ITBLShamelDocumentType } from 'src/app/modules/shared/models/employees_department/ITBLShamelDocumentType';
import { ITBLShamelPunishment } from 'src/app/modules/shared/models/employees_department/ITBLShamelPunishment';
import { ITBLShamelPunishmentReason } from 'src/app/modules/shared/models/employees_department/ITBLShamelPunishmentReason';
import { ITBLShamelSCCancelPunishment } from 'src/app/modules/shared/models/employees_department/ITBLShamelSCCancelPunishment';
import { ITBLShamelSCPunishment } from 'src/app/modules/shared/models/employees_department/ITBLShamelSCPunishment';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { IGlobalEmployeeList } from 'src/app/modules/shared/services/employees_department/IGlobalEmployeeList';
import { TBLShamelPunishmentReasonService } from 'src/app/modules/shared/services/employees_department/tblshamel-punishment-reason.service';
import { TBLShamelPunishmentService } from 'src/app/modules/shared/services/employees_department/tblshamel-punishment.service';
import { TBLShamelSCCancelPunishmentService } from 'src/app/modules/shared/services/employees_department/tblshamel-sccancel-punishment.service';
import { TblshameldocumenttypeService } from 'src/app/modules/shared/services/employees_department/tblshameldocumenttype.service';
import { EmployeePageService } from '../../employee-page-service';
const moment = _moment;

@Component({
  selector: 'app-tblshamelsccancelpunishmentmodify',
  templateUrl: './tblshamelsccancelpunishmentmodify.component.html',
  styleUrls: ['./tblshamelsccancelpunishmentmodify.component.scss']
})
export class TblshamelsccancelpunishmentmodifyComponent implements OnInit, AfterViewInit, OnDestroy {

  formname:string = 'ManageSCPunishmentFrame1';

  id_employee: number;
  Selected_Emp: TBLShamelEmployee = {};

  _Selected_Employee_SCCancelPunishment: ITBLShamelSCCancelPunishment;
  @Input() set Selected_Employee_SCCancelPunishment(obj: ITBLShamelSCCancelPunishment) {
    this._Selected_Employee_SCCancelPunishment = obj;
    if (this._Selected_Employee_SCCancelPunishment != null &&
      this._Selected_Employee_SCCancelPunishment != undefined) {
      this.SetValue();
    }
  }

  get Selected_Employee_SCCancelPunishment(): ITBLShamelSCCancelPunishment {
    return this._Selected_Employee_SCCancelPunishment;
  }


  _Selected_Employee_SCPunishment: ITBLShamelSCPunishment;
  @Input() set Selected_Employee_SCPunishment(obj: ITBLShamelSCPunishment) {
    this._Selected_Employee_SCPunishment = obj;

    if (this._Selected_Employee_SCPunishment != null &&
      this._Selected_Employee_SCPunishment != undefined &&
      this._Selected_Employee_SCPunishment.TBLShamelSCCancelPunishment != undefined &&
      this._Selected_Employee_SCPunishment.TBLShamelSCCancelPunishment != null) {
      this.Selected_Employee_SCCancelPunishment = this._Selected_Employee_SCPunishment.TBLShamelSCCancelPunishment;
    }
  }

  get Selected_Employee_SCPunishment(): ITBLShamelSCPunishment {
    return this._Selected_Employee_SCPunishment;
  }

  _Subscription: Subscription;


  TBLShamelPunishment_List: ITBLShamelPunishment[] = [];
  filteredPunishmentOptions: Observable<ITBLShamelPunishment[]>;

  TBLShamelPunishmentReason_List: ITBLShamelPunishmentReason[] = [];
  filteredPunishmentReasonOptions: Observable<ITBLShamelPunishmentReason[]>;


  DocumentType_List: ITBLShamelDocumentType[] = [];
  filteredDocumentTypeOptions: Observable<ITBLShamelDocumentType[]>;




  // Access To Element in Form
  Form: FormGroup;
  serial_punishment: FormControl<number | null>;
  serial: FormControl<number | null>;
  id: FormControl<number | null>;
  punishment_id: FormControl<number | null>;
  reason_id: FormControl<number | null>;
  documenttype_id: FormControl<number | null>;
  document_number: FormControl<string | null>;
  documentdate: FormControl<Date | null>;


  //Local Var

  submitted = false;
  loading: boolean = false;

  //#region Constuctor 
  constructor(
    public dialogRef: MatDialogRef<TblshamelsccancelpunishmentmodifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Parent: ITBLShamelSCPunishment, obj: ITBLShamelSCCancelPunishment, id: number },
    public GlobalList: IGlobalEmployeeList,
    public SCCancelPunishmentService: TBLShamelSCCancelPunishmentService,
    public ShamelPunishmentService: TBLShamelPunishmentService,
    public PunishmentReasonService: TBLShamelPunishmentReasonService,
    public ShameldocumenttypeService: TblshameldocumenttypeService,
    private fb: FormBuilder,
    private _snaker: MatSnackBar,
    public PageService: EmployeePageService,
    @Inject(DOCUMENT) private _document: Document,
  ) {

    if (data && data.obj && data.id > 0) {
      this.id_employee = data.id;
      this.Selected_Employee_SCCancelPunishment = data.obj;
    }


    this.BuildForm();
    this.Load_Data();
  }
  //#endregion


  Load_ITBLShamelPunishment() {
    if (this.ShamelPunishmentService.List_ITBLShamelPunishment == null ||
      this.ShamelPunishmentService.List_ITBLShamelPunishment == undefined ||
      this.ShamelPunishmentService.List_ITBLShamelPunishment.length == 0) {
      this._Subscription.add(

        this.ShamelPunishmentService.list().subscribe
          (
            res => {

              this.TBLShamelPunishment_List = res;
              this.filteredPunishmentOptions = of(res);
              this.ShamelPunishmentService.List_ITBLShamelPunishment = res;
            }
          )
      );

    }

    return of(this.ShamelPunishmentService.List_ITBLShamelPunishment);

  }

  Load_ITBLShamelPunishmentReason() {
    if (this.PunishmentReasonService.List_ITBLShamelPunishmentReason == null ||
      this.PunishmentReasonService.List_ITBLShamelPunishmentReason == undefined ||
      this.PunishmentReasonService.List_ITBLShamelPunishmentReason.length == 0) {

      this._Subscription.add(
        this.PunishmentReasonService.list().subscribe
          (
            res => {
              this.TBLShamelPunishmentReason_List = res;
              this.filteredPunishmentReasonOptions = of(res);
              this.PunishmentReasonService.List_ITBLShamelPunishmentReason = res;
              this.PunishmentReasonService.List_ITBLShamelPunishmentReason_BehaviorSubject.next(res);
              return of(res);

            }
          ));


    }
    return of(this.PunishmentReasonService.List_ITBLShamelPunishmentReason);


  }

  Load_List_ITBLShamelDocumentType(): Observable<ITBLShamelDocumentType[]> {
    if (this.ShameldocumenttypeService.List_ITBLShamelDocumentType == null ||
      this.ShameldocumenttypeService.List_ITBLShamelDocumentType == undefined ||
      this.ShameldocumenttypeService.List_ITBLShamelDocumentType.length == 0) {
      this._Subscription.add(
        this.ShameldocumenttypeService.List_ITBLShamelDocumentType_BehaviorSubject.subscribe(
          data => {
            this.DocumentType_List = data;
            this.filteredDocumentTypeOptions = of(this.DocumentType_List);
            return of(data);
          })
      )
    }

    return of(this.ShameldocumenttypeService.List_ITBLShamelDocumentType);



  }


  Load_Data() {
    combineLatest([this.PageService.Subject_Selected_TBLShamelEmployee]).subscribe
      (
        res => {
          this.Selected_Emp = res[0];
          if (this.Selected_Emp != null && this.Selected_Emp.id != null)
            this.id_employee = this.Selected_Emp.id;

          forkJoin(
            this.Load_List_ITBLShamelDocumentType(),
            this.Load_ITBLShamelPunishment(),
            this.Load_ITBLShamelPunishmentReason(),
          ).subscribe(
            res => {
              this.FillArrayUsingService();
            }
          )
        }
      )
  }

  //#region  Init Component

  ngOnInit(): void {

  }


  ngAfterViewInit() {

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

      this.filteredPunishmentOptions = this.punishment_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredPunishment(value) : this.TBLShamelPunishment_List.slice())
        );

    } catch (Exception: any) { }


    try {

      this.filteredPunishmentReasonOptions = this.reason_id.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filteredPunishmentReason(value) : this.TBLShamelPunishmentReason_List.slice())
        );

    } catch (Exception: any) { }

  }

  public BuildForm() {
    try {
      this.Form = this.fb.group({
        'serial': this.punishment_id = new FormControl<number | null>(null, [Validators.required]),
        'id': this.punishment_id = new FormControl<number | null>(null, [Validators.required]),
        'punishment_id': this.punishment_id = new FormControl<number | null>(null, [Validators.required]),
        'reason_id': this.reason_id = new FormControl<number | null>(null, []),
        'documenttype_id': this.documenttype_id = new FormControl<number | null>(null, []),
        'document_number': this.document_number = new FormControl<string | null>(null, []),
        'documentdate': this.documentdate = new FormControl<Date | null>(null, []),
        'serial_punishment': this.serial_punishment = new FormControl<number | null>(null, []),
      });




    } catch (Exception: any) {
      console.log(Exception);
    }
  }
  //#endregion


  //#region Filter Of  

  private _filteredPunishment(value: string): ITBLShamelPunishment[] {
    console.log('_filteredPunishment');
    if (value != null) {
      const filterValue = value;
      return this.TBLShamelPunishment_List.filter(obj => obj.punishment_name.includes(filterValue));
    }
    return this.TBLShamelPunishment_List.slice();
  }

  private _filteredPunishmentReason(value: string): ITBLShamelPunishmentReason[] {
    if (value) {
      const filterValue = value;
      return this.TBLShamelPunishmentReason_List.filter(obj => obj.punishmentreason_name.includes(filterValue));
    }
    return this.TBLShamelPunishmentReason_List.slice();
  }

  private _filteredDocumentType(value: string): ITBLShamelDocumentType[] {
    if (value) {
      const filterValue = value;
      return this.DocumentType_List.filter(obj => obj.documenttype_name.includes(filterValue));

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
  public SetValue() {
    try {

      if (this.Selected_Employee_SCPunishment != null &&
        this.Selected_Employee_SCPunishment != undefined) {
        if (this.Selected_Employee_SCCancelPunishment.serial_punishment != null)
          this.serial_punishment.setValue(this.Selected_Employee_SCCancelPunishment.serial_punishment);

        if (this.Selected_Employee_SCCancelPunishment.reason_id != null)
          this.reason_id.setValue(this.Selected_Employee_SCCancelPunishment.reason_id);

        if (this.Selected_Employee_SCCancelPunishment.punishment_id != null)
          this.punishment_id.setValue(this.Selected_Employee_SCCancelPunishment.punishment_id);

        if (this.Selected_Employee_SCCancelPunishment.documenttype_id != null)
          this.documenttype_id.setValue(this.Selected_Employee_SCCancelPunishment.documenttype_id);

        if (this.Selected_Employee_SCCancelPunishment.documentdate != null &&
          this.Selected_Employee_SCCancelPunishment.documentdate != undefined)
          this.documentdate.setValue(moment(this.Selected_Employee_SCCancelPunishment.documentdate).toDate());

        if (this.Selected_Employee_SCCancelPunishment.document_number != null)
          this.document_number.setValue(this.Selected_Employee_SCCancelPunishment.document_number);


      }

    } catch (ex: any) {
      console.log(ex);

    }

  }

  public getValue() {
    try {

      if (this.Selected_Employee_SCCancelPunishment != null &&
        this.Selected_Employee_SCCancelPunishment != undefined) {

        this.Selected_Employee_SCCancelPunishment.id = this.id_employee;
        if (this.punishment_id.value != null)
          this.Selected_Employee_SCCancelPunishment.punishment_id = this.punishment_id.value;

        if (this.reason_id.value != null)
          this.Selected_Employee_SCCancelPunishment.reason_id = this.reason_id.value;


        if (this.documenttype_id.value != null)
          this.Selected_Employee_SCCancelPunishment.documenttype_id = this.documenttype_id.value;

        if (this.document_number.value != null)
          this.Selected_Employee_SCCancelPunishment.document_number = this.document_number.value;


        if (this.documentdate.value != null && this.documentdate.value != undefined)
          this.Selected_Employee_SCCancelPunishment.documentdate = moment(this.documentdate.value).toDate();

        if (this.serial_punishment.value != null && this.serial_punishment.value != undefined)
          this.Selected_Employee_SCCancelPunishment.serial_punishment = this.Selected_Employee_SCPunishment.serial_punishment;

      }
    } catch (ex: any) {

    }

  }
  //#endregion



  //#region OnSelect Function

  public OnSelectPunishmentReasonChange(event: MatAutocompleteSelectedEvent) {
    console.log('OnSelectPunishmentReasonChange');
    if (event != null && this.Selected_Employee_SCCancelPunishment != null)
      this.Selected_Employee_SCCancelPunishment.reason_id = event.option.value;
  }

  public OnSelectPunishmentChange(event: MatAutocompleteSelectedEvent) {
    console.log('OnSelectPunishmentChange');
    if (event && this.Selected_Employee_SCCancelPunishment)
      this.Selected_Employee_SCCancelPunishment.punishment_id = event.option.value;
  }


  public OnSelectDocumentTypeChange(event: MatAutocompleteSelectedEvent) {
    console.log('OnSelectStateChange');
    console.log(event.option.value);
    if (event && this.Selected_Employee_SCCancelPunishment)
      this.Selected_Employee_SCCancelPunishment.documenttype_id = event.option.value;
  }



  //#endregion


  //#region  Display Display Member
  public displayDocumentTypeProperty(value: string): string {
    if (value && this.DocumentType_List) {
      let documentType: any = this.DocumentType_List.find(crs => crs.documenttype_id.toString() == value);
      if (documentType != null)
        return documentType.documenttype_name;
    }
    return '';
  }


  public displayPunishmentReasonProperty(value: string): string {
    if (value && this.TBLShamelPunishmentReason_List) {
      let punishmentreason: any = this.TBLShamelPunishmentReason_List.find(crs => crs.punishmentreason_id.toString() == value);
      if (punishmentreason != null)
        return punishmentreason.punishmentreason_name;
    }
    return '';
  }


  public displayPunishmentProperty(value: string): string {
    console.log('displayPunishmentProperty');
    console.log(value);

    if (value && this.TBLShamelPunishment_List) {

      let ShamelPunishment: any = this.TBLShamelPunishment_List.find(spec => spec.punishment_id.toString() == value);
      if (ShamelPunishment)
        return ShamelPunishment.punishment_name;
    }
    return '';
  }







  public async Save() {


    if (!this.Form.valid) {
      return;
    }
    if (!this.ValidateForm() == true) {
      return;
    }
    this.getValue();

    if (this.Selected_Employee_SCCancelPunishment != null &&
      this.Selected_Employee_SCCancelPunishment != undefined &&
      (this.Selected_Employee_SCCancelPunishment.serial == null || this.Selected_Employee_SCCancelPunishment.serial <= 0)
    ) {
      this.SCCancelPunishmentService.add(this.Selected_Employee_SCCancelPunishment).toPromise().then(res => {
        console.log(res)
        if (res == 1) {
          this._snaker.open('تم الحفظ بنجاح', 'موافق');
          this.ClearForm();
        } else {
          this._snaker.open('لم يتم الحفظ', 'موافق');

        }
      });
    } if (this.Selected_Employee_SCCancelPunishment != null &&
      this.Selected_Employee_SCCancelPunishment != undefined &&
      this.Selected_Employee_SCCancelPunishment.serial != null &&
      this.Selected_Employee_SCCancelPunishment.serial > 0
    ) {


      this.SCCancelPunishmentService.update(this.Selected_Employee_SCCancelPunishment).toPromise().then(res => {
        console.log(res)
        if (res == 1) {

          this._snaker.open('تم الحفظ بنجاح', 'موافق');
          this.dialogRef.close();

        } else {
          this._snaker.open('لم يتم الحفظ', 'موافق');
        }
      });

    }
  }


  public ValidateForm(): boolean {
    let result: boolean = true;




    if (this.punishment_id.value == null || this.punishment_id.value <= 0) {
      console.log('error2');
      this.reason_id.setErrors({ 'Phone Number does not exist.': true });
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



  addEventDocumentDate(type: string, event: MatDatepickerInputEvent<Date>) {


    console.log(event.value);
    if (event.value != null &&
      event.value != undefined)
      this.Selected_Employee_SCCancelPunishment.documentdate = moment(event.value).toDate();


  }




  ngOnDestroy() {

    // Unsubscribed the subscription  
    if (this._Subscription != null)
      this._Subscription.unsubscribe();

  }


}
