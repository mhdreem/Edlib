import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { ITBLShamelChangeReason } from 'src/app/modules/shared/models/employees_department/ITBLShamelChangeReason';
import { ITBLShamelDepartment } from 'src/app/modules/shared/models/employees_department/ITBLShamelDepartment';
import { ITBLShamelDocumentType } from 'src/app/modules/shared/models/employees_department/ITBLShamelDocumentType';
import { ITBLShamelJobKind } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobKind';
import { TblshamelScJobStateService } from 'src/app/modules/shared/services/employees_department/tblshamel-sc-job-state.service';
import { TblshamelchangereasonService } from 'src/app/modules/shared/services/employees_department/tblshamelchangereason.service';
import { TblshameldepartmentService } from 'src/app/modules/shared/services/employees_department/tblshameldepartment.service';
import { TblshameldocumenttypeService } from 'src/app/modules/shared/services/employees_department/tblshameldocumenttype.service';
import { TblshameljobkindService } from 'src/app/modules/shared/services/employees_department/tblshameljobkind.service';

@Component({
  selector: 'app-increase-salary-marsoom',
  templateUrl: './increase-salary-marsoom.component.html',
  styleUrls: ['./increase-salary-marsoom.component.scss']
})
export class IncreaseSalaryMarsoomComponent implements OnInit, OnDestroy {
  LoadingFinish : boolean;

  _Subscription: Subscription;

  Form: FormGroup;
  ChangeDateDay: FormControl<number | null>;
  ChangeDateMonth: FormControl<number | null>;
  ChangeDateYear: FormControl<number | null>;
  ChangeReason: FormControl<number | null>;
  DocumentType: FormControl<number | null>;
  Department: FormControl<number | null>;
  JobKind: FormControl<number | null>;
  DocumentId: FormControl<number | null>;
  DocumentDateDay: FormControl<number | null>;
  DocumentDateMonth: FormControl<number | null>;
  DocumentDateYear: FormControl<number | null>;
  textArea: FormControl<string | null>;

  ChangeReason_List: ITBLShamelChangeReason[] = [];
  ChangeReason_Filter: Observable<ITBLShamelChangeReason[]>;
  DocumentType_List: ITBLShamelDocumentType[] = [];
  DocumentType_Filter: Observable<ITBLShamelDocumentType[]>;
  Department_List: ITBLShamelDepartment[] = [];
  Department_Filter: Observable<ITBLShamelDepartment[]>;
  JobKind_List: ITBLShamelJobKind[] = [];
  JobKind_Filter: Observable<ITBLShamelJobKind[]>;

  progressBarValue1: number= 0;
  progressBarValue2: number= 0;

  constructor(private fb: UntypedFormBuilder,
    private tblshamelchangereasonService: TblshamelchangereasonService,
    private tblshameldocumenttypeService: TblshameldocumenttypeService,
    private tblshameldepartmentService: TblshameldepartmentService,
    private tblshameljobkindService: TblshameljobkindService,
    private tblshamelScJobStateService: TblshamelScJobStateService,
    @Inject(DOCUMENT) private _document: Document) { 
    this.LoadingFinish = true;

      this.BuildForm();
      this.Load_Data();
    }

    ngOnDestroy(): void {
      this._Subscription.unsubscribe();
    }
  
      public BuildForm() {
        try {
    
          this.Form = this.fb.group(
            {
              'ChangeDateDay: ': this.ChangeDateDay = new FormControl<number | null>(null, [Validators.required]),
              'ChangeDateMonth: ': this.ChangeDateMonth = new FormControl<number | null>(null, [Validators.required]),
              'ChangeDateYear: ': this.ChangeDateYear = new FormControl<number | null>(null, [Validators.required]),
              'ChangeReason: ': this.ChangeReason = new FormControl<number | null>(null, [Validators.required]),
              'DocumentType: ': this.DocumentType = new FormControl<number | null>(null, [Validators.required]),
              'Department: ': this.Department = new FormControl<number | null>(null, [Validators.required]),
              'JobKind: ': this.JobKind = new FormControl<number | null>(null, [Validators.required]),
              'DocumentId: ': this.DocumentId = new FormControl<number | null>(null, [Validators.required]),
              'DocumentDateDay: ': this.DocumentDateDay = new FormControl<number | null>(null, [Validators.required]),
              'DocumentDateMonth: ': this.DocumentDateMonth = new FormControl<number | null>(null, [Validators.required]),
              'DocumentDateYear: ': this.DocumentDateYear = new FormControl<number | null>(null, [Validators.required]),
              'textArea: ': this.textArea = new FormControl<string | null>(null, [Validators.required]),
            }
          );
    
        } catch (Exception: any) {
          console.log(Exception);
        }
      }
  
      Load_Data() {
        this.LoadingFinish = false;
      
        this._Subscription = forkJoin(
          this.Load_TBLShamelChangeReason(),
          this.Load_TBLShamelDocumentType(),
          this.Load_TBLShamelDepartment(),
          this.Load_TBLShamelJobKind(),
        ).subscribe(
          res => {
            this.ChangeReason_List = res[0];
            this.ChangeReason_Filter = of(this.ChangeReason_List);
            this.tblshamelchangereasonService.List_ITBLShamelChangeReason = this.ChangeReason_List;
            this.tblshamelchangereasonService.List_ITBLShamelChangeReason_BehaviorSubject.next(this.ChangeReason_List);
  
            this.DocumentType_List = res[1];
            this.DocumentType_Filter = of(this.DocumentType_List);
            this.tblshameldocumenttypeService.List_ITBLShamelDocumentType = this.DocumentType_List;
            this.tblshameldocumenttypeService.List_ITBLShamelDocumentType_BehaviorSubject.next(this.DocumentType_List);
  
            this.Department_List = res[2];
            this.Department_Filter = of(this.Department_List);
            this.tblshameldepartmentService.List_ITBLShamelDepartment = this.Department_List;
            this.tblshameldepartmentService.List_ITBLShamelDepartment_BehaviorSubject.next(this.Department_List);
  
            this.JobKind_List = res[3];
            this.JobKind_Filter = of(this.JobKind_List);
            this.tblshameljobkindService.list_ITBLShamelJobKind = this.JobKind_List;
            this.tblshameljobkindService.List_ITBLShamelJobKind_BehaviorSubject.next(this.JobKind_List);
    
            this.Init_AutoComplete();
        this.LoadingFinish = true;

          }
          
        )
      }
  
      Load_TBLShamelChangeReason(){
        if (this.tblshamelchangereasonService.List_ITBLShamelChangeReason == null ||
          this.tblshamelchangereasonService.List_ITBLShamelChangeReason == undefined ||
          this.tblshamelchangereasonService.List_ITBLShamelChangeReason.length == 0)
          return this.tblshamelchangereasonService.list();
        return of(this.tblshamelchangereasonService.List_ITBLShamelChangeReason);
      }
  
      Load_TBLShamelDocumentType(){
        if (this.tblshameldocumenttypeService.List_ITBLShamelDocumentType == null ||
          this.tblshameldocumenttypeService.List_ITBLShamelDocumentType == undefined ||
          this.tblshameldocumenttypeService.List_ITBLShamelDocumentType.length == 0)
          return this.tblshameldocumenttypeService.list();
        return of(this.tblshameldocumenttypeService.List_ITBLShamelDocumentType);
      }
  
      Load_TBLShamelDepartment(){
        if (this.tblshameldepartmentService.List_ITBLShamelDepartment == null ||
          this.tblshameldepartmentService.List_ITBLShamelDepartment == undefined ||
          this.tblshameldepartmentService.List_ITBLShamelDepartment.length == 0)
          return this.tblshameldepartmentService.list();
        return of(this.tblshameldepartmentService.List_ITBLShamelDepartment);
      }
  
      Load_TBLShamelJobKind(){
        if (this.tblshameljobkindService.list_ITBLShamelJobKind == null ||
          this.tblshameljobkindService.list_ITBLShamelJobKind == undefined ||
          this.tblshameljobkindService.list_ITBLShamelJobKind.length == 0)
          return this.tblshameljobkindService.list();
        return of(this.tblshameljobkindService.list_ITBLShamelJobKind);
      }
  
      public async Init_AutoComplete() {
        try {
          this.ChangeReason_Filter = this.ChangeReason.valueChanges
            .pipe(
              startWith(''),
              map(value => value && typeof value === 'string' ? this._filterChangeReason(value) : this.ChangeReason_List.slice())
            );
  
          this.DocumentType_Filter = this.DocumentType.valueChanges
            .pipe(
              startWith(''),
              map(value => value && typeof value === 'string' ? this._filterDocumentType(value) : this.DocumentType_List.slice())
            );
  
            this.Department_Filter = this.Department.valueChanges
            .pipe(
              startWith(''),
              map(value => value && typeof value === 'string' ? this._filterDepartment(value) : this.Department_List.slice())
            );
  
            this.JobKind_Filter = this.JobKind.valueChanges
            .pipe(
              startWith(''),
              map(value => value && typeof value === 'string' ? this._filterJobKind(value) : this.JobKind_List.slice())
            );
          
        } catch (Exception: any) { }
      }
  
      _filterChangeReason(value: string): ITBLShamelChangeReason[]{
        if (value){
          const filterValue = value.toLowerCase();
          return this.ChangeReason_List.filter(option => option.changereason_name?.toLowerCase().includes(filterValue));
        }
        return this.ChangeReason_List.slice();
      }
  
      _filterDocumentType(value: string): ITBLShamelDocumentType[]{
        if (value){
          const filterValue = value.toLowerCase();
          return this.DocumentType_List.filter(option => option.documenttype_name?.toLowerCase().includes(filterValue));
        }
        return this.DocumentType_List.slice();
      }
  
      _filterDepartment(value: string): ITBLShamelDepartment[]{
        if (value){
          const filterValue = value.toLowerCase();
          return this.Department_List.filter(option => option.department_name?.toLowerCase().includes(filterValue));
        }
        return this.Department_List.slice();
      }
  
      _filterJobKind(value: string): ITBLShamelJobKind[]{
        if (value){
          const filterValue = value.toLowerCase();
          return this.JobKind_List.filter(option => option.jobkind_name?.toLowerCase().includes(filterValue));
        }
        return this.JobKind_List.slice();
      }
  
      public displayChangeReasonProperty(value: string): string {
        if (value && this.ChangeReason_List) {
          let cer: any = this.ChangeReason_List.find(cer => cer.changereason_id.toString() == value);
          if (cer)
            return cer.changereason_name;
        }
        return '';
      }
  
      public displayDocumentTypeProperty(value: string): string {
        if (value && this.DocumentType_List) {
          let cer: any = this.DocumentType_List.find(cer => cer.documenttype_id.toString() == value);
          if (cer)
            return cer.documenttype_name;
        }
        return '';
      }
  
      public displayDepartmentProperty(value: string): string {
        if (value && this.Department_List) {
          let cer: any = this.Department_List.find(cer => cer.department_id.toString() == value);
          if (cer)
            return cer.department_name;
        }
        return '';
      }
  
      public displayJobKindProperty(value: string): string {
        if (value && this.JobKind_List) {
          let cer: any = this.JobKind_List.find(cer => cer.jobkind_id.toString() == value);
          if (cer)
            return cer.jobkind_name;
        }
        return '';
      }

  ngOnInit(): void {
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }

}
