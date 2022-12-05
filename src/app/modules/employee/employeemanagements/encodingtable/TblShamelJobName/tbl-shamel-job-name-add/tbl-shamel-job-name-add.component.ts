import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITBLShamelJobName } from 'src/app/modules/shared/models/employees_department/ITBLShamelJobName';

@Component({
  selector: 'app-tbl-shamel-job-name-add',
  templateUrl: './tbl-shamel-job-name-add.component.html',
  styleUrls: ['./tbl-shamel-job-name-add.component.scss']
})
export class TblShamelJobNameAddComponent implements OnInit {

  myform: FormGroup;
  frm_jobname_id : FormControl;
  frm_jobname_name : FormControl;
  frm_jobname_fixed : FormControl;
  action:string;
  local_data:ITBLShamelJobName={};
  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<TblShamelJobNameAddComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any)  {
      this.myform=this.frmBuilder.group({});
      console.log(data);
      this.frm_jobname_id= new FormControl('' ,[Validators.required ,Validators.maxLength(3)]),
      this.frm_jobname_name= new FormControl('', [Validators.required, Validators.maxLength(50)])
      this.frm_jobname_fixed= new FormControl('0', [Validators.required, Validators.maxLength(1)])

      this.myform.addControl('jobname_id',this.frm_jobname_id);
      this.myform.addControl('jobname_name',this.frm_jobname_name);
      this.myform.addControl('jobname_fixed',this.frm_jobname_fixed);

    console.log(this.data);
      this.local_data.jobname_id = data.jobname_id;
      this.local_data.jobname_name = data.jobname_name;
      this.local_data.Fixed = data.Fixed;

      this.action = this.data.action;
      this.frm_jobname_id.setValue(this.local_data.jobname_id );
      this.frm_jobname_name.setValue(this.local_data.jobname_name );
      if(this.local_data.Fixed >0 )
      this.frm_jobname_fixed.setValue(true );
      else
      this.frm_jobname_fixed.setValue(false );

  }

  doAction(){
    let x: ITBLShamelJobName ={jobname_id:this.local_data.jobname_id,jobname_name:this.frm_jobname_name.value,Fixed:this.frm_jobname_fixed.value == true?1:0};

    this.dialogRef.close({event:this.action,data:x});
}

  closeDialog(){
    this.dialogRef.close({event:'إلغاء'});
  }
  ngOnInit(): void {
  }


}
