import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from 'src/app/modules/finance/broker/components/common/confirmation-dialog/confirmation-dialog.component';
import { TblShamelUpgradeYear } from 'src/app/modules/shared/models/employees_department/TblShamelUpgradeYear';
import { TblShamelUpgradeYearService } from 'src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-year.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { FixUpgradeYearModifyComponent } from '../fix-upgrade-year-modify/fix-upgrade-year-modify.component';

@Component({
  selector: 'app-fix-upgrade-year-list',
  templateUrl: './fix-upgrade-year-list.component.html',
  styleUrls: ['./fix-upgrade-year-list.component.scss']
})
export class FixUpgradeYearListComponent implements OnInit, AfterViewInit {
  formname:string = 'تثبيت دورة الترفيع';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  fixedYear: string;

  dataSource = new MatTableDataSource<TblShamelUpgradeYear>();
  displayedColumns: string[] = [
    'YEAR_ID','UpgradeStart','UpgradeEnd', 'fixed', 'action'];

  selected_upgrade_year: TblShamelUpgradeYear;


  constructor(private tblShamelYearService: TBLShamelYearService,
    private tblShamelUpgradeYearService: TblShamelUpgradeYearService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,) { 
      
    }

  ngOnInit(): void {
    this.tblShamelYearService.GetYearFixed().subscribe(
      res => {
        this.fixedYear = res.year_name;
      }
    );

    this.FillTable();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  rowClicked: number;
  changeTableRowColor(idx: any) { 
    if(this.rowClicked === idx) this.rowClicked = -1;
    else this.rowClicked = idx;
  }

  public async FillTable() {


    try {
  
      this.tblShamelUpgradeYearService.fill();
    this.tblShamelUpgradeYearService.List_TblShamelUpgradeYear_BehaviorSubject.subscribe(
      res =>{
        console.log('this.dataSource.data', this.dataSource.data);
        this.dataSource.data= res;
      }
    );

  
    } catch (ex: any) { }
  
  
  }

  Add(name: string): void {
    // Init selected_upgrade_year
    // this.selected_upgrade_year = {
    //   YEAR_ID: 0,
    //   UpgradeStart: moment("01- 01-2022", 'MM-DD-YYYY').toDate(),
    //   UpgradeEnd: moment("01- 01-2022", 'MM-DD-YYYY').toDate(),
    // };

    const dialogRef = this.dialog.open(FixUpgradeYearModifyComponent, {
      height: '60%',
      width: '30%',
      data: { obj: null, action: 'add' }
    });

    dialogRef.afterClosed().toPromise().then(result => {
      console.log(result);
      if (result) {
        this.FillTable();
        this.dataSource.paginator = this.paginator;
        
      }
    });
  }


  async Delete(element: TblShamelUpgradeYear) {
    try {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          message: 'هل أنت متأكد من الحذف?',
          buttonText: {
            ok: 'نعم',
            cancel: 'لا'
          }
        }
      });



      dialogRef.afterClosed().toPromise().then((confirmed: boolean) => {
        if (confirmed) {
          if (element?.YEAR_ID != null)
            this.tblShamelUpgradeYearService.delete(element?.YEAR_ID).subscribe
              (
                data => {
                  if (data == 1){
                    this.FillTable();
                    this.dataSource.paginator = this.paginator;
                    this.snackBar.open('تم الحذف', '', {
                      duration: 3000,
                    });
                  }
                }

              )
        }
      });
    } catch (ex: any) {

    }

  }


  async Update(element: TblShamelUpgradeYear) {
    if (element) {
      this.selected_upgrade_year = element;

      const dialogRef = this.dialog.open(FixUpgradeYearModifyComponent, {
        height: '60%',
        width: '30%',
        data: { obj: this.selected_upgrade_year, action: 'update' }
      });

      dialogRef.afterClosed().toPromise().then(result => {
        this.FillTable();

        if (result)
          
          this.FillTable();
      });

    }


  }
}
