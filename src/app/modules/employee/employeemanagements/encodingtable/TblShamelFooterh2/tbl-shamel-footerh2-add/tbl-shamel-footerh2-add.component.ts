import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITBLShamelFooterH2 } from 'src/app/modules/shared/models/employees_department/itblshamelFooterh2';

@Component({
  selector: 'app-tbl-shamel-footerh2-add',
  templateUrl: './tbl-shamel-footerh2-add.component.html',
  styleUrls: ['./tbl-shamel-footerh2-add.component.scss']
})
export class TblShamelFooterh2AddComponent implements OnInit {

  myform: FormGroup;
  frm_footerh2_id : FormControl;
  frm_footerh2_name : FormControl;
  action:string;
  local_data:ITBLShamelFooterH2={};
  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<TblShamelFooterh2AddComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any)  {
      this.myform=this.frmBuilder.group({});
      console.log(data);
      this.frm_footerh2_id= new FormControl('' ,[Validators.required ,Validators.maxLength(3)]),
      this.frm_footerh2_name= new FormControl('', [Validators.required, Validators.maxLength(50)])

      this.myform.addControl('footerh2_id',this.frm_footerh2_id);
      this.myform.addControl('footerh2_name',this.frm_footerh2_name);

    console.log(this.data);
      this.local_data.footerh2_id = data.footerh2_id;
      this.local_data.footerh2_name = data.footerh2_name;

      this.action = this.data.action;
      this.frm_footerh2_id.setValue(this.local_data.footerh2_id );
      this.frm_footerh2_name.setValue(this.local_data.footerh2_name );

  }

  doAction(){
    let x: ITBLShamelFooterH2 ={footerh2_id:this.local_data.footerh2_id,footerh2_name:this.frm_footerh2_name.value,fixed:0};

    this.dialogRef.close({event:this.action,data:x});
}

  closeDialog(){
    this.dialogRef.close({event:'إلغاء'});
  }
  ngOnInit(): void {
  }



}
