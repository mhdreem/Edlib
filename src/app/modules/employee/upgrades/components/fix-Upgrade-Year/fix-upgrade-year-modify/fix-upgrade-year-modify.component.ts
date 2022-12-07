import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { TblShamelUpgradeYear } from 'src/app/modules/shared/models/employees_department/TblShamelUpgradeYear';
import { TblShamelUpgradeYearService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-year.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { Uniqe } from './validators/validate_formgroup';

@Component({
  selector: 'app-fix-upgrade-year-modify',
  templateUrl: './fix-upgrade-year-modify.component.html',
  styleUrls: ['./fix-upgrade-year-modify.component.scss']
})
export class FixUpgradeYearModifyComponent implements OnInit {

  Form: FormGroup;
  upgradeYear: FormControl<number | null>;
  upgradeYearStart: FormControl<Date | null>;
  upgradeYearEnd: FormControl<Date | null>;
  StartDay: FormControl<number | null>;
  StartMonth: FormControl<number | null>;
  StartYear: FormControl<number | null>;
  endDay: FormControl<number | null>;
  endMonth: FormControl<number | null>;
  endYear: FormControl<number | null>;
  fix: FormControl<number | null>;

  selected_upgrade_year: TblShamelUpgradeYear;

  isStartDaySelected: boolean= false;
  isStartMonthSelected: boolean= false;
  isStartYearSelected: boolean= false;
  isEndDaySelected: boolean= false;
  isEndMonthSelected: boolean= false;
  isEndYearSelected: boolean= false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { obj: TblShamelUpgradeYear, action: string },
  private fb: UntypedFormBuilder,
  private tblShamelUpgradeYearService: TblShamelUpgradeYearService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar,) { 
    this.selected_upgrade_year= data.obj;

    this.BuildForm();
    this.SetValue();
  }

  public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'upgradeYear: : ': this.upgradeYear = new FormControl<number | null>(null, [Validators.required]),
          'upgradeYearStart: ': this.upgradeYearStart = new FormControl<Date | null>(null, [Validators.required]),
          'upgradeYearEnd: ': this.upgradeYearEnd = new FormControl<Date | null>(null, [Validators.required]),
          'StartDay: : ': this.StartDay = new FormControl<number | null>(null, [Validators.required]),
          'StartMonth: : ': this.StartMonth = new FormControl<number | null>(null, [Validators.required]),
          'StartYear: : ': this.StartYear = new FormControl<number | null>(null, [Validators.required]),
          'endDay: : ': this.endDay = new FormControl<number | null>(null, [Validators.required]),
          'endMonth: : ': this.endMonth = new FormControl<number | null>(null, [Validators.required]),
          'endYear: : ': this.endYear = new FormControl<number | null>(null, [Validators.required]),
          'fix: : ': this.fix = new FormControl<number | null>(null, []),
        },
        Uniqe(this.tblShamelUpgradeYearService)
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  public SetValue() {
    try {


      if (this.selected_upgrade_year != null && this.selected_upgrade_year.YEAR_ID != null)
        this.upgradeYear.setValue(this.selected_upgrade_year?.YEAR_ID);
        
      if (this.selected_upgrade_year != null && this.selected_upgrade_year.YEAR_ID != null)
        this.fix.setValue(this.selected_upgrade_year?.fixed);

      if (this.selected_upgrade_year != null && this.selected_upgrade_year.UpgradeStart != null){
        this.upgradeYearStart.setValue(this.selected_upgrade_year?.UpgradeStart);
        this.StartDay.setValue(+moment(this.upgradeYearStart.value).date());
        this.StartMonth.setValue(+moment(this.upgradeYearStart.value).month()+1);
        this.StartYear.setValue(+moment(this.upgradeYearStart.value).year());
      }

      if (this.selected_upgrade_year != null && this.selected_upgrade_year.UpgradeEnd != null){
        this.upgradeYearEnd.setValue(this.selected_upgrade_year?.UpgradeEnd);
        this.endDay.setValue(+moment(this.upgradeYearEnd.value).date());
        this.endMonth.setValue(+moment(this.upgradeYearEnd.value).month()+1);
        this.endYear.setValue(+moment(this.upgradeYearEnd.value).year());

      }

    } catch (ex: any) {


    }

  }

  getValue(){
    this.selected_upgrade_year={}
    this.selected_upgrade_year.YEAR_ID= this.upgradeYear.value;
    this.selected_upgrade_year.fixed= this.fix.value;
    this.selected_upgrade_year.UpgradeStart= this.upgradeYearStart.value;
    this.selected_upgrade_year.UpgradeEnd= this.upgradeYearEnd.value;
  }

  public async Save() {



    //Form Not Valid Then return
    if (!this.Form.valid == true) {
      console.log('notValid');
      return;
    }

      if (this.data.action == 'add'){
         this.getValue();
         console.log('this.selected_upgrade_year',this.selected_upgrade_year);
          this.tblShamelUpgradeYearService.add(this.selected_upgrade_year).subscribe(
            data => {
              console.log('data', data);

              if (data > 0) // Succeess 
              {
                console.log('data', data);
                this.dialog.closeAll();
                this.snackBar.open('تمت الإضافة', '', {
                  duration: 3000,
                });
              }

            }
          )
    }


      else if (this.data.action == 'update')
      this.tblShamelUpgradeYearService.update(this.selected_upgrade_year).subscribe(
        data => {
          console.log('data', data);
          if (data > 0) // Succeess 
          {
            console.log('data', data);
            this.dialog.closeAll();
            this.snackBar.open('تم التعديل', '', {
              duration: 3000,
            });
          }

        }
      )

  }
  ngOnInit(): void {
  }

  public ClearForm() {

    if (this.Form != null)
      this.Form.reset();

  }

  onReset() {
    this.Form.reset();
  }

  onStartDayChange(){
    this.isStartDaySelected= true;
    this.generateStartDate();

  }

  onStartMonthChange(){
    this.isStartMonthSelected= true;
    this.generateStartDate();

  }

  onStartYearChange(){
    this.isStartYearSelected= true;
    this.generateStartDate();

  }

  generateStartDate(){
    if (this.isStartDaySelected && this.isStartMonthSelected && this.isStartYearSelected){
      this.upgradeYearStart.setValue(moment(this.StartMonth.value+'/'+this.StartDay.value+'/'+this.StartYear.value+ ' '+ '04:00','MM/DD/YYYY HH:mm').toDate());

    }
  }

  onEndDayChange(){
    this.isEndDaySelected= true;
    this.generateEndDate();

  }

  onEndMonthChange(){
    this.isEndMonthSelected= true;
    this.generateEndDate();

  }

  onEndYearChange(){
    this.isEndYearSelected= true;
    this.generateEndDate();

  }

  generateEndDate(){
    if (this.isEndDaySelected && this.isEndMonthSelected && this.isEndYearSelected){
      this.upgradeYearEnd.setValue(moment(this.endMonth.value+'/'+this.endDay.value+'/'+this.endYear.value+ ' '+ '04:00', 'MM/DD/YYYY HH:mm').toDate());
    }
  }
}
