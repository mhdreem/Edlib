import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITBLShamelChangeReason } from 'src/app/modules/shared/models/employees_department/ITBLShamelChangeReason';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-tbl-shamel-change-reason-add',
  templateUrl: './tbl-shamel-change-reason-add.component.html',
  styleUrls: ['./tbl-shamel-change-reason-add.component.scss']
})
export class TblShamelChangeReasonAddComponent implements OnInit {

  myform: FormGroup;
  frm_ChangeReason_id : FormControl;
  frm_ChangeReason_name : FormControl;
  frm_MalakState_id : FormControl;
  frm_CountService_id : FormControl;

  action:string;
  local_data:ITBLShamelChangeReason={};

  darkTheme: boolean;

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<TblShamelChangeReasonAddComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private themeService: ThemeService)  {
      this.myform=this.frmBuilder.group({});
      console.log(data);
      this.frm_ChangeReason_id= new FormControl('' ,[Validators.required ,Validators.maxLength(3)]),
      this.frm_ChangeReason_name= new FormControl('', [Validators.required, Validators.maxLength(50)])
      this.frm_MalakState_id= new FormControl('0', [Validators.required, Validators.maxLength(3)])
      this.frm_CountService_id= new FormControl('0', [Validators.required, Validators.maxLength(3)])

      this.myform.addControl('changereason_id',this.frm_ChangeReason_id);
      this.myform.addControl('changereason_name',this.frm_ChangeReason_name);
      this.myform.addControl('malakstate_id',this.frm_MalakState_id);
      this.myform.addControl('countservice_id',this.frm_CountService_id);

    console.log('111',this.data);
      this.local_data.changereason_name = data.changereason_name;

      
      this.action = this.data.action;
      this.frm_ChangeReason_id.setValue(data.changereason_id );
      this.frm_ChangeReason_name.setValue( data.changereason_name );
      if(data.malakstate_id >0 )
      this.frm_MalakState_id.setValue('1');
      else
      this.frm_MalakState_id.setValue('0');
      if(data.countservice_id >0 )
      this.frm_CountService_id.setValue('1');
      else
      this.frm_CountService_id.setValue('0');

  }

  doAction(){
    let x: ITBLShamelChangeReason ={changereason_id:this.frm_ChangeReason_id.value,changereason_name:this.frm_ChangeReason_name.value,malakstate_id:this.frm_MalakState_id.value == true?1:0,countservice_id:this.frm_CountService_id.value == true?1:0};

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
