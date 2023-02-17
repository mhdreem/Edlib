import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { TblShamelReplaceQararNumbers } from 'src/app/modules/shared/models/employees_department/tbl-shamel-replace-qarar-numbers';
import { TblShamelUpgradeGovReport } from 'src/app/modules/shared/models/employees_department/TblShamelUpgradeGovReport';
import { TblshamelScJobStateService } from 'src/app/modules/shared/services/employees_department/tblshamel-sc-job-state.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-replace-qarar-numbers',
  templateUrl: './replace-qarar-numbers.component.html',
  styleUrls: ['./replace-qarar-numbers.component.scss']
})
export class ReplaceQararNumbersComponent implements OnInit, AfterViewInit {
  formname:string = 'استبدال أرقام القرارات';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'id','worker_name','new_salary','qarar_num','qarar_date'];

  Form: FormGroup;
  Id: FormControl<number | null>;
  NewQararNumber: FormControl<number | null>;
  QararDateDay: FormControl<number | null>;
  QararDateMonth: FormControl<number | null>;
  QararDateYear: FormControl<number | null>;
  NewQararDateDay: FormControl<number | null>;
  NewQararDateMonth: FormControl<number | null>;
  NewQararDateYear: FormControl<number | null>;


  request: TblShamelReplaceQararNumbers= {};

  darkTheme: boolean;

  constructor(private tblshamelScJobStateService: TblshamelScJobStateService,
    private fb: UntypedFormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    @Inject(DOCUMENT) private _document: Document,
    private themeService: ThemeService) {
    
    this.BuildForm();
   }

   public BuildForm() {
    try {

      this.Form = this.fb.group(
        {
          'Id: : ': this.Id = new FormControl<number | null>(null, [Validators.required]),
          'NewQararNumber: ': this.NewQararNumber = new FormControl<number | null>(null, [Validators.required]),
          'QararDateDay: ': this.QararDateDay = new FormControl<number | null>(null, [Validators.required]),
          'QararDateMonth: ': this.QararDateMonth = new FormControl<number | null>(null, [Validators.required]),
          'QararDateYear: ': this.QararDateYear = new FormControl<number | null>(null, [Validators.required]),
          'NewQararDateDay: ': this.NewQararDateDay = new FormControl<number | null>(null, [Validators.required]),
          'NewQararDateMonth: ': this.NewQararDateMonth = new FormControl<number | null>(null, [Validators.required]),
          'NewQararDateYear: ': this.NewQararDateYear = new FormControl<number | null>(null, [Validators.required]),
        }
      );

    } catch (Exception: any) {
      console.log(Exception);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

  View(){
    this.request.old_Qara_Num= +this.Id.value;
    this.request.old_Qara_Date= moment(this.QararDateMonth.value+'/'+this.QararDateDay.value+'/'+this.QararDateYear.value).toDate();
    this.request.new_Qara_Num= +this.NewQararNumber.value;
    this.request.new_Qara_Date= moment(this.NewQararDateMonth.value+'/'+this.NewQararDateDay.value+'/'+this.NewQararDateYear.value).toDate();
    this.tblshamelScJobStateService.ListQarar(this.request).subscribe(
      (res: any) => {
        this.dataSource.data= res.Result;
        console.log('res', res);
        console.log('req', this.request);
      }
    );
  }

  Replace(){
    this.request.old_Qara_Num= +this.Id.value;
    this.request.old_Qara_Date= moment(this.QararDateMonth.value+'/'+this.QararDateDay.value+'/'+this.QararDateYear.value).set({hour: 2}).toDate();
    this.request.new_Qara_Num= +this.NewQararNumber.value;
    this.request.new_Qara_Date= moment(this.NewQararDateMonth.value+'/'+this.NewQararDateDay.value+'/'+this.NewQararDateYear.value).set({hour: 2}).toDate();
    console.log('req', this.request);
    this.tblshamelScJobStateService.UpgradeQarar(this.request).subscribe(
      res => {
        this.dataSource.data= res as any;
        console.log('res', res);
      }
    );
  }

  

    rowClicked: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public focusNext(id: string) {
    let element = this._document.getElementById(id);
    if (element) {
      element.focus();
    }
  }
}


