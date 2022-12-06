import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITBLShamelUpgrade } from 'src/app/modules/shared/models/employees_department/ITBLShamelUpgrade';
import { TblshamelPrintFooterService } from 'src/app/modules/shared/services/employees_department/tblshamel-print-footer.service';
import { TBLShamelUserService } from 'src/app/modules/shared/services/employees_department/tblshamel-user.service';

@Component({
  selector: 'app-print-qarars',
  templateUrl: './print-qarars.component.html',
  styleUrls: ['./print-qarars.component.scss']
})
export class PrintQararsComponent implements OnInit {
  @ViewChild("printButton") printButton!: ElementRef;

  todayDate: Date;
  userId: number;

  name1: string;
      
  name2: string;
  name3: string;
  name4: string;
  name5: string;

  title1: string;
  title2: string;
  title3: string;
  title4: string;
  title5: string;
  partialData: ITBLShamelUpgrade[][]= [];
  indexOfPage: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: [ITBLShamelUpgrade[], string, string, string],
  private tblShamelUserService: TBLShamelUserService,
  private tblshamelPrintFooterService: TblshamelPrintFooterService) { 
    this.todayDate= new Date();
    console.log('data123', this.data);

    for (let i=0; i<this.data[0]?.length/15 ;i++){
      for (let j=0; j<15 ;j++){
        this.partialData[i]= [{}];
      }
    }

    for (let i=0; i<this.data[0]?.length/15 ;i++){
      for (let j=0; j<15 ;j++){
        this.partialData[i][j]= this.data[0][i*15+j]
      }
    }

    this.tblShamelUserService.Login_User_BehavourSubject.subscribe(
      userId =>{
        this.userId= userId.user_id;
        console.log('this.userId',userId);

      }
    );
    this.tblshamelPrintFooterService.list(this.userId).subscribe(
      res =>{
        const printFooter= res?.filter(printFooter => printFooter.form_name== "PrintUpgradeQualityGrade");
        this.name1= printFooter[0]?.name1;
        this.name2= printFooter[0]?.name2;
        this.name3= printFooter[0]?.name3;
        this.name4= printFooter[0]?.name4;
        this.name5= printFooter[0]?.name5;

        this.title1= printFooter[0]?.title1;
        this.title2= printFooter[0]?.title2;
        this.title3= printFooter[0]?.title3;
        this.title4= printFooter[0]?.title4;
        this.title5= printFooter[0]?.title5;

      }
    );


  }

  ngOnInit(): void {
  }

  print(){
    let element = document.getElementById('hidden') as HTMLButtonElement;
    for(let i=0; i<this.partialData.length; i++){
      this.indexOfPage= i;
      // this.printButton.nativeElement.click();
      element.click();
      console.log('click');
    }
  }

}
