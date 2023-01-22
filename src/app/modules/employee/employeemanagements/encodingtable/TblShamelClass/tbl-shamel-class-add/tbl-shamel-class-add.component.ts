import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITBLShamelClass } from 'src/app/modules/shared/models/employees_department/ITBLShamelClass';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

@Component({
  selector: 'app-tbl-shamel-class-add',
  templateUrl: './tbl-shamel-class-add.component.html',
  styleUrls: ['./tbl-shamel-class-add.component.scss']
})
export class TblShamelClassAddComponent implements OnInit {

  myform: FormGroup;
  frm_Class_id : FormControl;
  frm_Class_name : FormControl;
  frm_Max_salary : FormControl;
  frm_Class_fixed : FormControl;
  action:string;
  local_data:ITBLShamelClass={};

  darkTheme: boolean;

  constructor(private frmBuilder:FormBuilder,
    public dialogRef: MatDialogRef<TblShamelClassAddComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private themeService: ThemeService)  {
      this.myform=this.frmBuilder.group({});
      console.log(data);
      this.frm_Class_id= new FormControl('' ,[Validators.required ,Validators.maxLength(3)]),
      this.frm_Class_name= new FormControl('', [Validators.required, Validators.maxLength(50)])
      this.frm_Max_salary= new FormControl('', [Validators.required, Validators.maxLength(50)])
      this.frm_Class_fixed= new FormControl('0', [Validators.required, Validators.maxLength(1)])

      this.myform.addControl('Class_id',this.frm_Class_id);
      this.myform.addControl('Class_name',this.frm_Class_name);
      this.myform.addControl('max_salary',this.frm_Max_salary);
      this.myform.addControl('Class_fixed',this.frm_Class_fixed);

    console.log(this.data);
      this.local_data.class_id = data.class_id;
      this.local_data.class_name = data.class_name;
      this.local_data.max_salary = data.max_salary;
      this.local_data.Fixed = data.Fixed;

      this.action = this.data.action;
      this.frm_Class_id.setValue(this.local_data.class_id );
      this.frm_Class_name.setValue(this.local_data.class_name );
      this.frm_Max_salary.setValue(this.local_data.max_salary );
      if(this.local_data.Fixed >0 )
      this.frm_Class_fixed.setValue(true );
      else
      this.frm_Class_fixed.setValue(false );

  }

  doAction(){
    let x: ITBLShamelClass ={class_id:this.local_data.class_id,class_name:this.frm_Class_name.value, max_salary: this.frm_Max_salary.value,Fixed:this.frm_Class_fixed.value == true?1:0};

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
