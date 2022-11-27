import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-print-upgrade-qarars-modify',
  templateUrl: './print-upgrade-qarars-modify.component.html',
  styleUrls: ['./print-upgrade-qarars-modify.component.scss']
})
export class PrintUpgradeQararsModifyComponent implements OnInit {

  Form: FormGroup;
  text: FormControl<string | null>;

  constructor(public dialogRef: MatDialogRef<PrintUpgradeQararsModifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private fb: UntypedFormBuilder, ) {
      this.BuildForm();
     }

     public BuildForm() {
      try {
  
        this.Form = this.fb.group(
          {
            'text: ': this.text = new FormControl<string | null>(this.data, [Validators.required]),
          }
          );
          
      } catch (Exception: any) {
        console.log(Exception);
      }
    }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onReset() {
    this.Form.reset();
  }

  save(){
    this.data= this.text.value;
    this.dialogRef.close(this.data);
  }
}
