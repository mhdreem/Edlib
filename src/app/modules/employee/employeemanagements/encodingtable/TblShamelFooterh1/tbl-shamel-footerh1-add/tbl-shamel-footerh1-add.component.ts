import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITBLShamelFooterH1 } from 'src/app/modules/shared/models/employees_department/itblshamelFooterh1';

@Component({
  selector: 'app-tbl-shamel-footerh1-add',
  templateUrl: './tbl-shamel-footerh1-add.component.html',
  styleUrls: ['./tbl-shamel-footerh1-add.component.scss']
})
export class TblShamelFooterh1AddComponent implements OnInit {

  myform: FormGroup;
  frm_footerh1_id : FormControl;
  frm_footerh1_name : FormControl;
  action:string;
  local_data:ITBLShamelFooterH1={};
  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<TblShamelFooterh1AddComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any)  {
      this.myform=this.frmBuilder.group({});
      console.log(data);
      this.frm_footerh1_id= new FormControl('' ,[Validators.required ,Validators.maxLength(3)]),
      this.frm_footerh1_name= new FormControl('', [Validators.required, Validators.maxLength(50)])

      this.myform.addControl('footerh1_id',this.frm_footerh1_id);
      this.myform.addControl('footerh1_name',this.frm_footerh1_name);

    console.log(this.data);
      this.local_data.footerh1_id = data.footerh1_id;
      this.local_data.footerh1_name = data.footerh1_name;

      this.action = this.data.action;
      this.frm_footerh1_id.setValue(this.local_data.footerh1_id );
      this.frm_footerh1_name.setValue(this.local_data.footerh1_name );

  }

  doAction(){
    let x: ITBLShamelFooterH1 ={footerh1_id:this.local_data.footerh1_id,footerh1_name:this.frm_footerh1_name.value,fixed:0};

    this.dialogRef.close({event:this.action,data:x});
}

  closeDialog(){
    this.dialogRef.close({event:'إلغاء'});
  }
  ngOnInit(): void {
  }




}
