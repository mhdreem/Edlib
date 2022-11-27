import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { TblshamelScJobStateService } from 'src/app/modules/shared/services/employees_department/tblshamel-sc-job-state.service';

@Component({
  selector: 'app-remaining-old-qarars',
  templateUrl: './remaining-old-qarars.component.html',
  styleUrls: ['./remaining-old-qarars.component.scss']
})
export class RemainingOldQararsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'id','worker_name','qarar_num','qarar_date'];

  Form: FormGroup;
  QararDateDay: FormControl<number | null>;
  QararDateMonth: FormControl<number | null>;
  QararDateYear: FormControl<number | null>;

  constructor(private fb: UntypedFormBuilder,
    private _liveAnnouncer: LiveAnnouncer,
    private tblshamelScJobStateService: TblshamelScJobStateService,) {
      this.BuildForm();
     }

     public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'QararDateDay: ': this.QararDateDay = new FormControl<number | null>(null, [Validators.required]),
            'QararDateMonth: ': this.QararDateMonth = new FormControl<number | null>(null, [Validators.required]),
            'QararDateYear: ': this.QararDateYear = new FormControl<number | null>(null, [Validators.required]),
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

  View(){
    this.tblshamelScJobStateService.ListQarar({'old_Qara_Date': moment(this.QararDateMonth.value+'/'+this.QararDateDay.value+'/'+this.QararDateYear.value).toDate()}).subscribe(
      res => {
        this.dataSource.data= res as any;
        console.log('res', res);
      }
    );
  }

}
