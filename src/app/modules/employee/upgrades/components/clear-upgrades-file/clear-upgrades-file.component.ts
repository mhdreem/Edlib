import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TBLShamelUpgradeService } from 'src/app/modules/shared/services/employees_department/tblshamel-upgrade.service';

@Component({
  selector: 'app-clear-upgrades-file',
  templateUrl: './clear-upgrades-file.component.html',
  styleUrls: ['./clear-upgrades-file.component.scss']
})
export class ClearUpgradesFileComponent implements OnInit {
  formname:string = 'مسح ملف الترفيعات';
  constructor(private tblShamelUpgradeService: TBLShamelUpgradeService,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
  }

  clearFile(){
    this.tblShamelUpgradeService.TBLShamelUpgrade_Delete_Data().subscribe(res =>{
      console.log('res456', res);
      if (res == 1){
        this.snackBar.open('تم الحذف', '', {
          duration: 3000,
          panelClass: ['green-snackbar']
        });
      }
    });
    
  }

}
