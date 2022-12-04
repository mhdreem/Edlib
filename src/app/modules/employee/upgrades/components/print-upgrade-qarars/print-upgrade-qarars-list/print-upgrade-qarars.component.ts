import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { TblShamelUpgradeQararHF } from 'src/app/modules/shared/models/employees_department/tbl-shamel-upgrade-qarar-hf';
import { TblShamelUpgradeQararHFService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-qarar-hf.service';
import { TblShamelUpgradeYearService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-year.service';
import { TblshamelclassService } from 'src/app/modules/shared/services/employees_department/tblshamelclass.service';
import { TblshameljobnameService } from 'src/app/modules/shared/services/employees_department/tblshameljobname.service';
import {map, startWith} from 'rxjs/operators';
import { TblShamelUpgradeYear } from 'src/app/modules/shared/models/employees_department/TblShamelUpgradeYear';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ITBLShamelClass } from 'src/app/modules/shared/models/employees_department/ITBLShamelClass';
import { ITBLShamelJobName } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobName';
import { PrintUpgradeQararsModifyComponent } from '../print-upgrade-qarars-modify/print-upgrade-qarars-modify.component';
import { JobServiceDataAdjustPrintDialogComponent } from 'src/app/modules/employee/employeemanagements/components/service-data/job-service-data-adjust-print-dialog/job-service-data-adjust-print-dialog.component';
import { PrintQararsComponent } from '../../print/print-qarars/print-qarars.component';

@Component({
  selector: 'app-print-upgrade-qarars',
  templateUrl: './print-upgrade-qarars.component.html',
  styleUrls: ['./print-upgrade-qarars.component.scss']
})
export class PrintUpgradeQararsComponent implements OnInit {

  _Subscription: Subscription;

  // List of text
  List_TblShamelUpgradeQararHF: TblShamelUpgradeQararHF[]= [];
  List_Header: TblShamelUpgradeQararHF[]= [];
  List_Footer1: TblShamelUpgradeQararHF[]= [];
  List_Footer2: TblShamelUpgradeQararHF[]= [];

  
  selected_header: string= '';
  selected_footer1: string= '';
  selected_footer2: string= '';

  // indexes for displaying
  headerCurrentIndex = 0;
  footer1CurrentIndex = 0;
  footer2CurrentIndex = 0;

  Form: FormGroup;
  UpgradeYear: FormControl<string | null>;
  Class: FormControl<string | null>;
  JobName: FormControl<string | null>;
  FirstQararNum: FormControl<number | null>;
  LastQararNum: FormControl<number | null>;
  DoNotPrint: FormControl<string | null>;
  
  Form1: FormGroup;
  showWord: FormControl<number | null>;

  jobNameToAdd: string= "";
  classToAdd: string= "";
  upgradeYearToAdd: string= "";


  // Filtering
  UpgradeYear_List: TblShamelUpgradeYear[] = [];
  filteredUpgradeYearOptions: Observable<TblShamelUpgradeYear[]>;
  Class_List: ITBLShamelClass[] = [];
  filteredClassOptions: Observable<ITBLShamelClass[]>;
  JobName_List: ITBLShamelJobName[] = [];
  filteredJobNameOptions: Observable<ITBLShamelJobName[]>;


  
  constructor(
    private tblShamelUpgradeQararHFService: TblShamelUpgradeQararHFService,
    private upgradeYear: TblShamelUpgradeYearService,
    private tblshamelclassService: TblshamelclassService,
    private tblshameljobnameService: TblshameljobnameService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fb: UntypedFormBuilder,
    
    ) {

      this.BuildForm();
      this.Load_Data();
    

   }
   

   public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'UpgradeYear: ': this.UpgradeYear = new FormControl<string | null>(null, [Validators.required]),
          'Class: : ': this.Class = new FormControl<string | null>(null, [Validators.required]),
          'JobName: ': this.JobName = new FormControl<string | null>(null, [Validators.required]),
          'FirstQararNum: ': this.FirstQararNum = new FormControl<number | null>(null, [Validators.required]),
          'LastQararNum: ': this.LastQararNum = new FormControl<number | null>(null, [Validators.required]),
          'DoNotPrint: ': this.LastQararNum = new FormControl<number | null>(null, [Validators.required]),
        }
        );
        
        this.Form1 = this.fb.group(
          {
          'showWord: ': this.showWord = new FormControl<number | null>(null, [Validators.required]),
        }
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  Load_Data() {
    
    this._Subscription = forkJoin(
      this.Load_TBLShamelUpgradeYear(),
      this.Load_TBLShamelClass(),
      this.Load_TBLJobName(),
    ).subscribe(
      res => {
        this.UpgradeYear_List = res[0];
        this.filteredUpgradeYearOptions = of(this.UpgradeYear_List);
        this.upgradeYear.List_TblShamelUpgradeYear = this.UpgradeYear_List;
        this.upgradeYear.List_TblShamelUpgradeYear_BehaviorSubject.next(this.UpgradeYear_List);

        this.Class_List = res[1];
        this.filteredClassOptions = of(this.Class_List);
        this.tblshamelclassService.List_ITBLShamelClass = this.Class_List;
        this.tblshamelclassService.List_ITBLShamelClass_BehaviorSubject.next(this.Class_List);

        this.JobName_List = res[2];
        this.filteredJobNameOptions = of(this.JobName_List);
        this.tblshameljobnameService.list_ITBLShamelJobName = this.JobName_List;
        this.tblshameljobnameService.List_ITBLShamelJobName_BehaviorSubject.next(this.JobName_List);

        this.Init_AutoComplete();
      }
      
    )
  }

  Load_TBLShamelUpgradeYear(){
    if (this.upgradeYear.List_TblShamelUpgradeYear == null ||
      this.upgradeYear.List_TblShamelUpgradeYear == undefined ||
      this.upgradeYear.List_TblShamelUpgradeYear.length == 0)
      return this.upgradeYear.list();
    return of(this.upgradeYear.List_TblShamelUpgradeYear);
  }

  Load_TBLShamelClass(){
    if (this.tblshamelclassService.List_ITBLShamelClass == null ||
      this.tblshamelclassService.List_ITBLShamelClass == undefined ||
      this.tblshamelclassService.List_ITBLShamelClass.length == 0)
      return this.tblshamelclassService.list();
    return of(this.tblshamelclassService.List_ITBLShamelClass);
  }

  Load_TBLJobName(){
    if (this.tblshameljobnameService.list_ITBLShamelJobName == null ||
      this.tblshameljobnameService.list_ITBLShamelJobName == undefined ||
      this.tblshameljobnameService.list_ITBLShamelJobName.length == 0)
      return this.tblshameljobnameService.list();
    return of(this.tblshameljobnameService.list_ITBLShamelJobName);
  }

  public async Init_AutoComplete() {
    try {
      this.filteredUpgradeYearOptions = this.UpgradeYear.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterUpgradeYear(value) : this.UpgradeYear_List.slice())
        );

      this.filteredClassOptions = this.Class.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterClass(value) : this.Class_List.slice())
        );

        this.filteredJobNameOptions = this.JobName.valueChanges
        .pipe(
          startWith(''),
          map(value => value && typeof value === 'string' ? this._filterJobName(value) : this.JobName_List.slice())
        );

    } catch (Exception: any) { }
  }

  private _filterUpgradeYear(value: string): TblShamelUpgradeYear[] {
    const filterValue = value.toLowerCase();

    return this.UpgradeYear_List.filter(option => option.YEAR_ID == +filterValue);
  }
  private _filterClass(value: string): ITBLShamelClass[] {
    const filterValue = value.toLowerCase();

    return this.Class_List.filter(option => option.class_name.toLowerCase().includes(filterValue));
  }
  private _filterJobName(value: string): ITBLShamelJobName[] {
    const filterValue = value.toLowerCase();

    return this.JobName_List.filter(option => option.jobname_name.toLowerCase().includes(filterValue));
  }

  public displayUpgradeYearProperty(value: string): string {
    if (value && this.UpgradeYear_List) {
      let cer: any = this.UpgradeYear_List.find(cer => cer.YEAR_ID.toString() == value);
      if (cer)
        return cer.YEAR_ID;
    }
    return '';
  }

  public displayClassProperty(value: string): string {
    if (value && this.Class_List) {
      let cer: any = this.Class_List.find(cer => cer.class_id.toString() == value);
      if (cer)
        return cer.class_name;
    }
    return '';
  }

  public displayJobNameProperty(value: string): string {
    if (value && this.JobName_List) {
      let cer: any = this.JobName_List.find(cer => cer.jobname_id.toString() == value);
      if (cer)
        return cer.jobname_name;
    }
    return '';
  }

  Load_Text(){
      this.tblShamelUpgradeQararHFService.fill();

      this.tblShamelUpgradeQararHFService.List_TblShamelUpgradeQararHF_BehaviorSubject.subscribe(
      data=>
      {
        this.List_TblShamelUpgradeQararHF= data;
        
        //reset the arrays
        this.List_Header= [];
        this.List_Footer1= [];
        this.List_Footer2= [];

        //fill the arrays
        for(let i = 0; i< this.List_TblShamelUpgradeQararHF.length; i++)
          if(this.List_TblShamelUpgradeQararHF[i].kind == 1)
            this.List_Header.push(this.List_TblShamelUpgradeQararHF[i]);
          else if(this.List_TblShamelUpgradeQararHF[i].kind == 2)
            this.List_Footer1.push(this.List_TblShamelUpgradeQararHF[i]);
          else if(this.List_TblShamelUpgradeQararHF[i].kind == 3)
            this.List_Footer2.push(this.List_TblShamelUpgradeQararHF[i]);
        
        //fill the textAreas
        const headerTextArea = document.getElementById('header');
        headerTextArea!.textContent= this.List_Header[0]?.strtextinside;
        const headerNumber = document.getElementById('headerNumber');
        headerNumber.textContent= this.List_Header.length+'';

        const footer1TextArea = document.getElementById('footer1');
        footer1TextArea!.textContent= this.List_Footer1[0]?.strtextinside;

        const footer1Number = document.getElementById('footer1Number');
        footer1Number.textContent= this.List_Footer1.length+'';

        const footer2TextArea = document.getElementById('footer2');
        footer2TextArea!.textContent= this.List_Footer2[0]?.strtextinside;

        const footer2Number = document.getElementById('footer2Number');
        footer2Number.textContent= this.List_Footer2.length+'';
      }
      );
  }
  ngOnInit(): void {
    this.Load_Text();
  }

  addHeader(){
    this.selected_header= '';
    const dialogRef = this.dialog.open(PrintUpgradeQararsModifyComponent, {
      height: '60%',
      width: '60%',
      data: this.selected_header
    });

    dialogRef.afterClosed().toPromise().then(result => {
      if (result) {
        this.tblShamelUpgradeQararHFService.add({kind: 1, fixed: 0, strtextinside: result}).subscribe(res => {
          if (res ==1){
            this._snackBar.open('تمت الإضافة بنجاح', '', {
              duration: 3000,
            });
            this.Load_Text();
          }
        });
      }
    });

  }

  updateHeader(){
    this.selected_header = document.getElementById('header').textContent;
    const dialogRef = this.dialog.open(PrintUpgradeQararsModifyComponent, {
      height: '60%',
      width: '60%',
      data: this.selected_header
    });

    dialogRef.afterClosed().toPromise().then(result => {
      if (result) {
        this.tblShamelUpgradeQararHFService.update({serial: this.List_Header[this.headerCurrentIndex].serial ,kind: 1, fixed: 0, strtextinside: result}).subscribe((res: any) => {
          if (res.Result ==1){
            this._snackBar.open('تم التعديل بنجاح', '', {
              panelClass: ['green-snackbar'],
              duration: 3000,
            });
            this.Load_Text();
          }
        });
      }
    });
  }

  nextHeader(){
    const headerTextArea = document.getElementById('header');
    if(this.headerCurrentIndex < this.List_Header.length-1)
      headerTextArea.textContent= this.List_Header[++this.headerCurrentIndex]?.strtextinside;
  }

  previousHeader(){
    const headerTextArea = document.getElementById('header');
    if(this.headerCurrentIndex > 0 )
      headerTextArea.textContent= this.List_Header[--this.headerCurrentIndex]?.strtextinside;
  }


  addFooter1(){
    this.selected_footer1= '';
    const dialogRef = this.dialog.open(PrintUpgradeQararsModifyComponent, {
      height: '60%',
      width: '60%',
      data: this.selected_footer1
    });

    dialogRef.afterClosed().toPromise().then(result => {
      if (result) {
        this.tblShamelUpgradeQararHFService.add({kind: 2, fixed: 0, strtextinside: result}).subscribe(res => {
          if (res ==1){
            this._snackBar.open('تمت الإضافة بنجاح', '', {
              duration: 3000,
            });
            this.Load_Text();
          }
        });
      }
    });
  }

  updateFooter1(){
    this.selected_footer1 = document.getElementById('footer1').textContent;
    const dialogRef = this.dialog.open(PrintUpgradeQararsModifyComponent, {
      height: '60%',
      width: '60%',
      data: this.selected_footer1
    });

    dialogRef.afterClosed().toPromise().then(result => {
      if (result) {
        console.log('result', result);
        this.tblShamelUpgradeQararHFService.update({serial: this.List_Footer1[this.footer1CurrentIndex].serial ,kind: 2, fixed: 0, strtextinside: result}).subscribe((res: any) => {
          if (res.Result ==1){
            this._snackBar.open('تم التعديل بنجاح', '', {
              duration: 3000,
            });
            this.Load_Text();
          }
        });
      }
    });
  }

  nextFooter1(){
    const footer1TextArea = document.getElementById('footer1');
    if(this.footer1CurrentIndex < this.List_Footer1.length-1)
      footer1TextArea.textContent= this.List_Footer1[++this.footer1CurrentIndex]?.strtextinside;
  }

  previousFooter1(){
    const footer1TextArea = document.getElementById('footer1');
    if(this.footer1CurrentIndex > 0)
      footer1TextArea.textContent= this.List_Footer1[--this.footer1CurrentIndex]?.strtextinside;
  }


  addFooter2(){
    this.selected_footer2= '';
    const dialogRef = this.dialog.open(PrintUpgradeQararsModifyComponent, {
      height: '60%',
      width: '60%',
      data: this.selected_footer2
    });

    dialogRef.afterClosed().toPromise().then(result => {
      if (result) {
        this.tblShamelUpgradeQararHFService.add({kind: 3, fixed: 0, strtextinside: result}).subscribe(res => {
          if (res ==1){
            this._snackBar.open('تمت الإضافة بنجاح', '', {
              duration: 3000,
            });
            this.Load_Text();
          }
        });
      }
    });
  }

  updateFooter2(){
    this.selected_footer2 = document.getElementById('footer2').textContent;
    const dialogRef = this.dialog.open(PrintUpgradeQararsModifyComponent, {
      height: '60%',
      width: '60%',
      data: this.selected_footer2
    });

    dialogRef.afterClosed().toPromise().then(result => {
      if (result) {
        this.tblShamelUpgradeQararHFService.update({serial: this.List_Footer2[this.footer2CurrentIndex].serial ,kind: 3, fixed: 0, strtextinside: result}).subscribe((res: any) => {
          if (res.Result ==1){
            this._snackBar.open('تم التعديل بنجاح', '', {
              duration: 3000,
            });
            this.Load_Text();
          }
        });
      }
    });
  }

  nextFooter2(){
    const footer2TextArea = document.getElementById('footer2');
    if(this.footer2CurrentIndex < this.List_Footer2.length-1)
      footer2TextArea.textContent= this.List_Footer2[++this.footer2CurrentIndex]?.strtextinside;
  }

  previousFooter2(){
    const footer2TextArea = document.getElementById('footer2');
    if(this.footer2CurrentIndex > 0)
      footer2TextArea.textContent= this.List_Footer2[--this.footer2CurrentIndex]?.strtextinside;
  }

  // get from autocompletes
  getJobName(jobNameTodAdd: string){
    this.jobNameToAdd= jobNameTodAdd;
  }

  getClass(classToAdd: string){
    this.classToAdd= classToAdd;
  }

  getUpgradeYear(upgradeYearToAdd: string){
    this.upgradeYearToAdd= upgradeYearToAdd;
  }


  adjustPrintFooter(){
    const dialogRef = this.dialog.open(JobServiceDataAdjustPrintDialogComponent, {
      width: '1150px',
      data: 'UpgradePrintQarar',
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  print(){
    if(this.Form.get('UpgradeYear').value == null || this.Form.get('Class').value == null || this.Form.get('JobName').value == null || this.Form.get('FirstQararNum').value == null || this.Form.get('LastQararNum').value == null)
      this._snackBar.open('يجب اختيار الفئة والصفة الوظيفية أو رقم القرار', '', {
        duration: 4000
      });
    else{
      const dialogRef = this.dialog.open(PrintQararsComponent, {
        height: '70%',
        width: '60%',
        data: ""
      });
  
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }
    
  }
}
