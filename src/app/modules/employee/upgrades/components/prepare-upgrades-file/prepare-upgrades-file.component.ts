import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { forkJoin, map, Observable, of, startWith, Subscription } from 'rxjs';
import { ITBLShamelRank } from 'src/app/modules/shared/models/employees_department/ITBLShamelRank';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TblshamelTaskService } from 'src/app/modules/shared/services/employees_department/tblshamel-task.service';
import { TBLShamelUpgradeService } from 'src/app/modules/shared/services/employees_department/tblshamel-upgrade.service';
import { TBLShamelUserService } from 'src/app/modules/shared/services/employees_department/tblshamel-user.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { TblshamelrankService } from 'src/app/modules/shared/services/employees_department/tblshamelrank.service';
import { FormValidationHelpersService } from 'src/app/modules/shared/services/helpers/form-validation-helpers.service';

@Component({
  selector: 'app-prepare-upgrades-file',
  templateUrl: './prepare-upgrades-file.component.html',
  styleUrls: ['./prepare-upgrades-file.component.scss']
})
export class PrepareUpgradesFileComponent implements OnInit {

  _Subscription: Subscription;

  fixedYear: string;

  progressBarValue: number= 0;
  taskCurrentState: string= '';
  taskFinished: string= '';

  Form: FormGroup;
  inputType: FormControl<number | null>; // 0 is manual, 1 is auto
  autoOptions: FormControl<number | null>;
  manualOptions: FormControl<number | null>;
  duration: FormControl<string | null>;

  //filtering
  auto_List: ITBLShamelRank[] = [];
  filteredAutoOptions: Observable<ITBLShamelRank[]>;
  manual_List: ITBLShamelRank[] = [];
  filteredManualOptions: Observable<ITBLShamelRank[]>;

  userId: number;
  constructor(private tblShamelMonthService: TBLShamelMonthService,
    private tblShamelYearService: TBLShamelYearService,
    private fb: UntypedFormBuilder,
    private tblShamelUpgradeService: TBLShamelUpgradeService,
    private shamelrankService: TblshamelrankService,
    public formValidatorsService: FormValidationHelpersService,
    private tblshamelTaskService: TblshamelTaskService,
    private tblShamelUserService: TBLShamelUserService,) {
    this.BuildForm();
    this.Load_Data();

     }

     public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'inputType: ': this.inputType = new FormControl<number | null>(null, [Validators.required]),
            'autoOptions: : ': this.autoOptions = new FormControl<number | null>(null, [Validators.required]),
            'manualOptions: ': this.manualOptions = new FormControl<number | null>(null, [Validators.required]),
            'duration: ': this.duration = new FormControl<string | null>(null, [Validators.required]),
          }
        );
  
      } catch (Exception: any) {
        console.log(Exception);
      }
    }

    Load_Data() {
      
      this._Subscription = forkJoin(
        this.Load_TBLRank(),
      ).subscribe(
        res => {
          this.auto_List = res[0];
          this.filteredAutoOptions = of(this.auto_List);
          this.shamelrankService.list_ITBLShamelRank = this.auto_List;
          this.shamelrankService.List_ITBLShamelRank_BehaviorSubject.next(this.auto_List);
          
          this.manual_List = res[0];
          this.filteredManualOptions = of(this.manual_List);
          this.shamelrankService.list_ITBLShamelRank = this.manual_List;
          this.shamelrankService.List_ITBLShamelRank_BehaviorSubject.next(this.manual_List);

          this.Init_AutoComplete();
  
        }
        
      )
    }

    Load_TBLRank(){
      if (this.shamelrankService.list_ITBLShamelRank == null ||
        this.shamelrankService.list_ITBLShamelRank == undefined ||
        this.shamelrankService.list_ITBLShamelRank.length == 0)
        return this.shamelrankService.list();
      return of(this.shamelrankService.list_ITBLShamelRank);
    }

    public async Init_AutoComplete() {
      try {
          this.filteredAutoOptions = this.autoOptions.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterAuto(value) : this.auto_List.slice())
          );

          this.filteredManualOptions = this.manualOptions.valueChanges
          .pipe(
            startWith(''),
            map(value => value && typeof value === 'string' ? this._filterManual(value) : this.manual_List.slice())
          );

        } catch (Exception: any) { }
      }

      private _filterAuto(value: string): ITBLShamelRank[] {
        const filterValue = value.toLowerCase();
    
        return this.auto_List.filter(option => option.rank_name.toLowerCase().includes(filterValue));
      }

      private _filterManual(value: string): ITBLShamelRank[] {
        const filterValue = value.toLowerCase();
    
        return this.manual_List.filter(option => option.rank_name.toLowerCase().includes(filterValue));
      }

      public displayRankProperty(value: string): string {
        if (value && this.auto_List) {
          let cer: any = this.auto_List.find(cer => cer.rank_id.toString() == value);
          if (cer)
            return cer.rank_name;
        }
        return '';
      }
  ngOnInit(): void {
    console.log('666', this.Form.controls);

    this.manualOptions.disable();
    this.duration.disable();

    this.tblShamelYearService.GetYearFixed().subscribe(
      res => {
        this.fixedYear = res.year_name;
      }
    );

    

  }

  onInputTypeChange(){
    if (this.inputType.value == 1){
      this.autoOptions.enable();
      this.manualOptions.disable();
      this.duration.disable();
    }
    else if (this.inputType.value == 0){
      this.autoOptions.disable();
      this.manualOptions.enable();
      this.duration.enable();
    }
  }

  prepareFile(){
    console.log('request', {auto: +this.inputType.value,
      duaration: +this.duration.value,
      year:+this.fixedYear,
      rank: (this.inputType.value==0)? this.getRankFromManual(): this.getRankFromAuto(),
      user_FK: this.userId
    });
    this.tblShamelUpgradeService.AddUpgradeToAllEmployee(
      {auto: +this.inputType.value,
        duaration: +this.duration.value,
        year:+this.fixedYear,
        rank: (this.inputType.value==0)? this.getRankFromManual(): this.getRankFromAuto(),
        user_FK: this.userId
      }).subscribe(
        res =>{
          
        }
      );

      this.userId= this.tblShamelUserService.Login_User.user_id;
    setInterval(()=>{
      this.tblshamelTaskService.getStatus(this.userId).subscribe((res: any)=>{
        console.log('res', res);
        if (res != null){
          let filteredResult= res.filter( (res: any)=> res.TBLSHAMELTASK_NAME== 'تجهيز الترفيعات')[0];
          this.progressBarValue=filteredResult?.VALUE;
          this.taskCurrentState=filteredResult?.TBLSHAMELTASK_OPERATION;
          this.taskFinished= filteredResult?.TBLSHAMELTASK_STATE;
        }
      });
    },30000);
  }

  getRankFromManual(){
    return (this.manual_List.filter(item=> item.rank_id == this.manualOptions.value))[0];
  }

  getRankFromAuto(){
    return (this.auto_List.filter(item=> item.rank_id == this.autoOptions.value))[0];
  }

  public fieldHasErrors(form: any, field: string) {
    console.log('333',form);
    console.log('111',this.formValidatorsService.fieldHasErrors(form, field) );
    return this.formValidatorsService.fieldHasErrors(form, field);
  }

  public printFirstErrorMessage(
    form: any,
    controlName: string,
    label: string,
    errors: { name: string, message?: string }[],
    isFemale?: boolean
  ): string {

    return this.formValidatorsService.printFirstErrorMessage(form, controlName, label, errors, isFemale);

  }

  public autoPrintFirstErrorMessage(
    form: any,
    controlName: string,
    label: string,
    isFemale?: boolean
  ): string {
    console.log('222', this.formValidatorsService.autoPrintFirstErrorMessage(form, controlName, label, isFemale));
    return this.formValidatorsService.autoPrintFirstErrorMessage(form, controlName, label, isFemale);

  }
}

