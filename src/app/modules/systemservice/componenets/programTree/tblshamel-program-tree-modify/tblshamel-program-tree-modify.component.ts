import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tblshamel-program-tree-modify',
  templateUrl: './tblshamel-program-tree-modify.component.html',
  styleUrls: ['./tblshamel-program-tree-modify.component.scss']
})
export class TblshamelProgramTreeModifyComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TblshamelProgramTreeModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

}
