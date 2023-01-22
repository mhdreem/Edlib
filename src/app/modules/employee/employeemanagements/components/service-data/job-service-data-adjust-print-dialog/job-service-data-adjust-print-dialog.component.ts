import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { ITBLShamelFooterH1 } from 'src/app/modules/shared/models/employees_department/itblshamelFooterh1';
import { ITBLShamelFooterH2 } from 'src/app/modules/shared/models/employees_department/itblshamelFooterh2';
import { AdjustPrintDialog } from 'src/app/modules/shared/models/employees_department/adjust-print-dialog';
import { TblshamelFooterh1Service } from 'src/app/modules/shared/services/employees_department/tblshamel-footerh1.service';
import { TblshamelFooterh2Service } from 'src/app/modules/shared/services/employees_department/tblshamel-footerh2.service';
import { TblshamelPrintFooterService } from 'src/app/modules/shared/services/employees_department/tblshamel-print-footer.service';
import { TBLShamelUserService } from 'src/app/modules/shared/services/employees_department/tblshamel-user.service';
import { TblshamelclassService } from 'src/app/modules/shared/services/employees_department/tblshamelclass.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-job-service-data-adjust-print-dialog',
  templateUrl: './job-service-data-adjust-print-dialog.component.html',
  styleUrls: ['./job-service-data-adjust-print-dialog.component.scss']
})
export class JobServiceDataAdjustPrintDialogComponent implements OnInit {

  _Subscription: Subscription;

  private readonly _matDialogRef: MatDialogRef<JobServiceDataAdjustPrintDialogComponent>;

  userId: number;

  Form: FormGroup;
  name1: FormControl<string | null>;
  name2: FormControl<string | null>;
  name3: FormControl<string | null>;
  name4: FormControl<string | null>;
  name5: FormControl<string | null>;
  title1: FormControl<string | null>;
  title2: FormControl<string | null>;
  title3: FormControl<string | null>;
  title4: FormControl<string | null>;
  title5: FormControl<string | null>;
  

  Name1_List: ITBLShamelFooterH2[] = [];
  filteredName1Options: Observable<ITBLShamelFooterH2[]>;
  Name2_List: ITBLShamelFooterH2[] = [];
  filteredName2Options: Observable<ITBLShamelFooterH2[]>;
  Name3_List: ITBLShamelFooterH2[] = [];
  filteredName3Options: Observable<ITBLShamelFooterH2[]>;
  Name4_List: ITBLShamelFooterH2[] = [];
  filteredName4Options: Observable<ITBLShamelFooterH2[]>;
  Name5_List: ITBLShamelFooterH2[] = [];
  filteredName5Options: Observable<ITBLShamelFooterH2[]>;
  Title1_List: ITBLShamelFooterH1[] = [];
  filteredTitle1Options: Observable<ITBLShamelFooterH1[]>;
  Title2_List: ITBLShamelFooterH1[] = [];
  filteredTitle2Options: Observable<ITBLShamelFooterH1[]>;
  Title3_List: ITBLShamelFooterH1[] = [];
  filteredTitle3Options: Observable<ITBLShamelFooterH1[]>;
  Title4_List: ITBLShamelFooterH1[] = [];
  filteredTitle4Options: Observable<ITBLShamelFooterH1[]>;
  Title5_List: ITBLShamelFooterH1[] = [];
  filteredTitle5Options: Observable<ITBLShamelFooterH1[]>;
  
  darkTheme: boolean;

  constructor(public dialogRef: MatDialogRef<JobServiceDataAdjustPrintDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private tblshamelclassService: TblshamelclassService,
    private tblshamelPrintFooterService: TblshamelPrintFooterService,
    private tblshamelFooterh1Service: TblshamelFooterh1Service,
    private tblshamelFooterh2Service: TblshamelFooterh2Service,
    private fb: UntypedFormBuilder,
    private tblShamelUserService: TBLShamelUserService,
    private themeService: ThemeService) {

      this._matDialogRef= dialogRef;
      this.BuildForm();
      this.Load_Data();

      this.tblShamelUserService.Login_User_BehavourSubject.subscribe(
        userId =>{
          this.userId= userId.user_id;
        }
      );

     }

     public BuildForm() {
      try {
        this.Form = this.fb.group(
          {
            'name1: ': this.name1 = new FormControl<string | null>(null, []),
            'name2: ': this.name2 = new FormControl<string | null>(null, []),
            'name3: ': this.name3 = new FormControl<string | null>(null, []),
            'name4: ': this.name4 = new FormControl<string | null>(null, []),
            'name5: ': this.name5 = new FormControl<string | null>(null, []),
            'title1: ': this.title1 = new FormControl<string | null>(null, []),
            'title2: ': this.title2 = new FormControl<string | null>(null, []),
            'title3: ': this.title3 = new FormControl<string | null>(null, []),
            'title4: ': this.title4 = new FormControl<string | null>(null, []),
            'title5: ': this.title5 = new FormControl<string | null>(null, []),
          }
        );
  
      } catch (Exception: any) {
        console.log(Exception);
      }
    }

     Load_ITBLShamelName() {
      if (this.tblshamelFooterh2Service.List_ITBLShamelFooterh2 == null ||
        this.tblshamelFooterh2Service.List_ITBLShamelFooterh2 == undefined ||
        this.tblshamelFooterh2Service.List_ITBLShamelFooterh2.length == 0)
        return this.tblshamelFooterh2Service.list();
      return of(this.tblshamelFooterh2Service.List_ITBLShamelFooterh2);
    }

     Load_ITBLShamelTitle() {
      if (this.tblshamelFooterh1Service.List_ITBLShamelFooterh1 == null ||
        this.tblshamelFooterh1Service.List_ITBLShamelFooterh1 == undefined ||
        this.tblshamelFooterh1Service.List_ITBLShamelFooterh1.length == 0)
        return this.tblshamelFooterh1Service.list();
      return of(this.tblshamelFooterh1Service.List_ITBLShamelFooterh1);
    }
  
    Load_Data() {
      this._Subscription = forkJoin(
        this.Load_ITBLShamelName(),
        this.Load_ITBLShamelTitle(),
      ).subscribe(
        res => {
          this.Name1_List = res[0];
          this.filteredName1Options = of(this.Name1_List);
          this.tblshamelFooterh2Service.List_ITBLShamelFooterh2 = this.Name1_List;
          this.tblshamelFooterh2Service.List_ITBLShamelFooterh2_BehaviorSubject.next(this.Name1_List);

          this.Name2_List = res[0];
          this.filteredName2Options = of(this.Name2_List);
          this.tblshamelFooterh2Service.List_ITBLShamelFooterh2 = this.Name2_List;
          this.tblshamelFooterh2Service.List_ITBLShamelFooterh2_BehaviorSubject.next(this.Name2_List);

          this.Name3_List = res[0];
          this.filteredName3Options = of(this.Name3_List);
          this.tblshamelFooterh2Service.List_ITBLShamelFooterh2 = this.Name3_List;
          this.tblshamelFooterh2Service.List_ITBLShamelFooterh2_BehaviorSubject.next(this.Name3_List);

          this.Name4_List = res[0];
          this.filteredName4Options = of(this.Name4_List);
          this.tblshamelFooterh2Service.List_ITBLShamelFooterh2 = this.Name4_List;
          this.tblshamelFooterh2Service.List_ITBLShamelFooterh2_BehaviorSubject.next(this.Name4_List);

          this.Name5_List = res[0];
          this.filteredName5Options = of(this.Name5_List);
          this.tblshamelFooterh2Service.List_ITBLShamelFooterh2 = this.Name5_List;
          this.tblshamelFooterh2Service.List_ITBLShamelFooterh2_BehaviorSubject.next(this.Name5_List);

          this.Title1_List = res[1];
          this.filteredTitle1Options = of(this.Title1_List);
          this.tblshamelFooterh1Service.List_ITBLShamelFooterh1 = this.Title1_List;
          this.tblshamelFooterh1Service.List_ITBLShamelFooterh1_BehaviorSubject.next(this.Title1_List);

          this.Title2_List = res[1];
          this.filteredTitle2Options = of(this.Title2_List);
          this.tblshamelFooterh1Service.List_ITBLShamelFooterh1 = this.Title2_List;
          this.tblshamelFooterh1Service.List_ITBLShamelFooterh1_BehaviorSubject.next(this.Title2_List);

          this.Title3_List = res[1];
          this.filteredTitle2Options = of(this.Title3_List);
          this.tblshamelFooterh1Service.List_ITBLShamelFooterh1 = this.Title3_List;
          this.tblshamelFooterh1Service.List_ITBLShamelFooterh1_BehaviorSubject.next(this.Title3_List);

          this.Title4_List = res[1];
          this.filteredTitle2Options = of(this.Title4_List);
          this.tblshamelFooterh1Service.List_ITBLShamelFooterh1 = this.Title4_List;
          this.tblshamelFooterh1Service.List_ITBLShamelFooterh1_BehaviorSubject.next(this.Title4_List);

          this.Title5_List = res[1];
          this.filteredTitle2Options = of(this.Title5_List);
          this.tblshamelFooterh1Service.List_ITBLShamelFooterh1 = this.Title5_List;
          this.tblshamelFooterh1Service.List_ITBLShamelFooterh1_BehaviorSubject.next(this.Title5_List);
          this.Init_AutoComplete();

        }
      )
    }

    public async Init_AutoComplete() {
      try {
        this.filteredName1Options = this.name1.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterName1(value) : this.Name1_List.slice())
          );

          this.filteredName2Options = this.name2.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterName2(value) : this.Name2_List.slice())
          );

          this.filteredName3Options = this.name3.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterName3(value) : this.Name3_List.slice())
          );

          this.filteredName4Options = this.name4.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterName4(value) : this.Name4_List.slice())
          );

          this.filteredName5Options = this.name5.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterName5(value) : this.Name5_List.slice())
          );

          this.filteredTitle1Options = this.title1.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterTitle1(value) : this.Title1_List.slice())
          );

          this.filteredTitle2Options = this.title2.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterTitle2(value) : this.Title2_List.slice())
          );

          this.filteredTitle3Options = this.title3.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterTitle3(value) : this.Title3_List.slice())
          );

          this.filteredTitle4Options = this.title4.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterTitle4(value) : this.Title4_List.slice())
          );

          this.filteredTitle5Options = this.title5.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterTitle5(value) : this.Title5_List.slice())
          );

        } catch (Exception: any) { }
      }

      private _filterName1(value: string): ITBLShamelFooterH2[] {
        if (value){
          const filterValue = value.toLowerCase();
          return this.Name1_List.filter(option => option.footerh2_name.toLowerCase().includes(filterValue));
        }
        return this.Name1_List.slice();
      }

      private _filterName2(value: string): ITBLShamelFooterH2[] {
        if (value){
          const filterValue = value.toLowerCase();
          return this.Name2_List.filter(option => option.footerh2_name.toLowerCase().includes(filterValue));
        }
        return this.Name2_List.slice();
      }

      private _filterName3(value: string): ITBLShamelFooterH2[] {
        if (value){
          const filterValue = value.toLowerCase();
          return this.Name3_List.filter(option => option.footerh2_name.toLowerCase().includes(filterValue));
        }
        return this.Name3_List.slice();
      }

      private _filterName4(value: string): ITBLShamelFooterH2[] {
        if (value){
          const filterValue = value.toLowerCase();
          return this.Name4_List.filter(option => option.footerh2_name.toLowerCase().includes(filterValue));
        }
        return this.Name4_List.slice();
      }

      private _filterName5(value: string): ITBLShamelFooterH2[] {
        if (value){
          const filterValue = value.toLowerCase();
          return this.Name5_List.filter(option => option.footerh2_name.toLowerCase().includes(filterValue));
        }
        return this.Name5_List.slice();
      }

      private _filterTitle1(value: string): ITBLShamelFooterH1[] {
        if (value){
          const filterValue = value.toLowerCase();
          return this.Title1_List.filter(option => option.footerh1_name.toLowerCase().includes(filterValue));
        }
        return this.Title1_List.slice();
      }

      private _filterTitle2(value: string): ITBLShamelFooterH1[] {
        if (value){
          const filterValue = value.toLowerCase();
          return this.Title2_List.filter(option => option.footerh1_name.toLowerCase().includes(filterValue));
        }
        return this.Title2_List.slice();
      }

      private _filterTitle3(value: string): ITBLShamelFooterH1[] {
        if (value){
          const filterValue = value.toLowerCase();
          return this.Title3_List.filter(option => option.footerh1_name.toLowerCase().includes(filterValue));
        }
        return this.Title3_List.slice();
      }

      private _filterTitle4(value: string): ITBLShamelFooterH1[] {
        if (value){
          const filterValue = value.toLowerCase();
          return this.Title4_List.filter(option => option.footerh1_name.toLowerCase().includes(filterValue));
        }
        return this.Title4_List.slice();
      }

      private _filterTitle5(value: string): ITBLShamelFooterH1[] {
        if (value){
          const filterValue = value.toLowerCase();
          return this.Title5_List.filter(option => option.footerh1_name.toLowerCase().includes(filterValue));
        }
        return this.Title5_List.slice();
      }

      public displayName1Property(value: string): string {
        if (value && this.Name1_List) {
          let cer: any = this.Name1_List.find(cer => cer.footerh2_id.toString() == value);
          if (cer)
            return cer.footerh2_name;
        }
        return '';
      }

      public displayName2Property(value: string): string {
        if (value && this.Name2_List) {
          let cer: any = this.Name2_List.find(cer => cer.footerh2_id.toString() == value);
          if (cer)
            return cer.footerh2_name;
        }
        return '';
      }

      public displayName3Property(value: string): string {
        if (value && this.Name3_List) {
          let cer: any = this.Name3_List.find(cer => cer.footerh2_id.toString() == value);
          if (cer)
            return cer.footerh2_name;
        }
        return '';
      }

      public displayName4Property(value: string): string {
        if (value && this.Name4_List) {
          let cer: any = this.Name4_List.find(cer => cer.footerh2_id.toString() == value);
          if (cer)
            return cer.footerh2_name;
        }
        return '';
      }

      public displayName5Property(value: string): string {
        if (value && this.Name5_List) {
          let cer: any = this.Name5_List.find(cer => cer.footerh2_id.toString() == value);
          if (cer)
            return cer.footerh2_name;
        }
        return '';
      }

      public displayTitle1Property(value: string): string {
        if (value && this.Title1_List) {
          let cer: any = this.Title1_List.find(cer => cer.footerh1_id.toString() == value);
          if (cer)
            return cer.footerh1_name;
        }
        return '';
      }

      public displayTitle2Property(value: string): string {
        if (value && this.Title2_List) {
          let cer: any = this.Title2_List.find(cer => cer.footerh1_id.toString() == value);
          if (cer)
            return cer.footerh1_name;
        }
        return '';
      }

      public displayTitle3Property(value: string): string {
        if (value && this.Title3_List) {
          let cer: any = this.Title3_List.find(cer => cer.footerh1_id.toString() == value);
          if (cer)
            return cer.footerh1_name;
        }
        return '';
      }

      public displayTitle4Property(value: string): string {
        if (value && this.Title4_List) {
          let cer: any = this.Title4_List.find(cer => cer.footerh1_id.toString() == value);
          if (cer)
            return cer.footerh1_name;
        }
        return '';
      }

      public displayTitle5Property(value: string): string {
        if (value && this.Title5_List) {
          let cer: any = this.Title5_List.find(cer => cer.footerh1_id.toString() == value);
          if (cer)
            return cer.footerh1_name;
        }
        return '';
      }
          
  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
    
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    matDialogConfig.position = { left: `50px`, top: `150px` };
    this._matDialogRef.updatePosition(matDialogConfig.position);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  clear(){
    this.Form.reset();
  }

  save(){
    this.tblshamelPrintFooterService.add(
      {
        form_name: this.data,
        name1: this.name1.value,
        name2: this.name2.value,
        name3: this.name3.value,
        name4: this.name4.value,
        name5: this.name5.value,
        title1: this.title1.value,
        title2: this.title2.value,
        title3: this.title3.value,
        title4: this.title4.value,
        title5: this.title5.value,
        user_id: this.userId
      })
  }

}
