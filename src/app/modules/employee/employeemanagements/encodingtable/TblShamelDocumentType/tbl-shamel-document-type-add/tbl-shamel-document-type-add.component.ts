import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITBLShamelDocumentType } from 'src/app/modules/shared/models/employees_department/ITBLShamelDocumentType';

@Component({
  selector: 'app-tbl-shamel-document-type-add',
  templateUrl: './tbl-shamel-document-type-add.component.html',
  styleUrls: ['./tbl-shamel-document-type-add.component.scss']
})
export class TblShamelDocumentTypeAddComponent implements OnInit {

  myform: FormGroup;
  frm_documenttype_id : FormControl;
  frm_documenttype_name : FormControl;
  frm_documenttype_fixed : FormControl;
  action:string;
  local_data:ITBLShamelDocumentType={};
  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<TblShamelDocumentTypeAddComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any)  {
      this.myform=this.frmBuilder.group({});
      console.log(data);
      this.frm_documenttype_id= new FormControl('' ,[Validators.required ,Validators.maxLength(3)]),
      this.frm_documenttype_name= new FormControl('', [Validators.required, Validators.maxLength(50)])
      this.frm_documenttype_fixed= new FormControl('0', [Validators.required, Validators.maxLength(1)])

      this.myform.addControl('Class_id',this.frm_documenttype_id);
      this.myform.addControl('documenttype_name',this.frm_documenttype_name);
      this.myform.addControl('Class_fixed',this.frm_documenttype_fixed);

    console.log(this.data);
      this.local_data.documenttype_id = data.documenttype_id;
      this.local_data.documenttype_name = data.documenttype_name;
      this.local_data.documenttype_fixed = data.documenttype_fixed;

      this.action = this.data.action;
      this.frm_documenttype_id.setValue(this.local_data.documenttype_id );
      this.frm_documenttype_name.setValue(this.local_data.documenttype_name );
      if(this.local_data.documenttype_fixed >0 )
      this.frm_documenttype_fixed.setValue(true );
      else
      this.frm_documenttype_fixed.setValue(false );

  }

  doAction(){
    let x: ITBLShamelDocumentType ={documenttype_id:this.local_data.documenttype_id,documenttype_name:this.frm_documenttype_name.value,documenttype_fixed:this.frm_documenttype_fixed.value == true?1:0};

    this.dialogRef.close({event:this.action,data:x});
}

  closeDialog(){
    this.dialogRef.close({event:'إلغاء'});
  }
  ngOnInit(): void {
  }



}
