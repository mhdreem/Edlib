import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITBLShamelCertificate } from 'src/app/modules/shared/models/employees_department/ITBLShamelCertificate';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-tbl-shamel-certificate-add',
  templateUrl: './tbl-shamel-certificate-add.component.html',
  styleUrls: ['./tbl-shamel-certificate-add.component.scss']
})
export class TblShamelCertificateAddComponent implements OnInit {

  myform: FormGroup;
  frm_Certificate_id : FormControl;
  frm_Certificate_name : FormControl;
  frm_Certificate_fixed : FormControl;
  action:string;
  local_data:ITBLShamelCertificate={};

  darkTheme: boolean;

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<TblShamelCertificateAddComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private themeService: ThemeService)  {
      this.myform=this.frmBuilder.group({});
      console.log(data);
      this.frm_Certificate_id= new FormControl('' ,[Validators.required ,Validators.maxLength(3)]),
      this.frm_Certificate_name= new FormControl('', [Validators.required, Validators.maxLength(50)])
      this.frm_Certificate_fixed= new FormControl('0', [Validators.required, Validators.maxLength(1)])

      this.myform.addControl('Certificate_id',this.frm_Certificate_id);
      this.myform.addControl('Certificate_name',this.frm_Certificate_name);
      this.myform.addControl('Certificate_fixed',this.frm_Certificate_fixed);

    console.log(this.data);
      this.local_data.certificate_id = data.certificate_id;
      this.local_data.certificate_name = data.certificate_name;
      this.local_data.Fixed = data.Fixed;

      this.action = this.data.action;
      this.frm_Certificate_id.setValue(this.local_data.certificate_id );
      this.frm_Certificate_name.setValue(this.local_data.certificate_name );
      if(this.local_data.Fixed >0 )
      this.frm_Certificate_fixed.setValue(true );
      else
      this.frm_Certificate_fixed.setValue(false );

  }

  doAction(){
    let x: ITBLShamelCertificate ={certificate_id:this.local_data.certificate_id,certificate_name:this.frm_Certificate_name.value,Fixed:this.frm_Certificate_fixed.value == true?1:0};

    this.dialogRef.close({event:this.action,data:x});
}

  closeDialog(){
    this.dialogRef.close({event:'إلغاء'});
  }
  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

}
