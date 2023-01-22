import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-tblshamel-program-tree-modify',
  templateUrl: './tblshamel-program-tree-modify.component.html',
  styleUrls: ['./tblshamel-program-tree-modify.component.scss']
})
export class TblshamelProgramTreeModifyComponent implements OnInit {

  darkTheme: boolean;

  constructor(public dialogRef: MatDialogRef<TblshamelProgramTreeModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

}
