import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { NumberToWordService } from 'src/app/modules/shared/services/employees_department/number-to-word.service';
import { TblshamelPrintFooterService } from 'src/app/modules/shared/services/employees_department/tblshamel-print-footer.service';
import { TBLShamelUserService } from 'src/app/modules/shared/services/employees_department/tblshamel-user.service';

type jobState={jobName?: string, begindate?: Date};
type calculatedJobState={
  jobName?: string,
  totalDays?: number,
  totalMonths?: number,
  totalyears?: number,
  totalDaysWritten?: string,
  totalMonthsWritten?: string,
  totalyearsWritten?: string};
@Component({
  selector: 'app-experience-certificate-print',
  templateUrl: './experience-certificate-print.component.html',
  styleUrls: ['./experience-certificate-print.component.scss']
})
export class ExperienceCertificatePrintComponent implements OnInit, OnChanges {
  @Input() data: [
    TBLShamelEmployee,
    {radioButtonsGroup: number, jobName: string}
  ];
  
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

  jobStates: jobState[]= [];
  calculatedJobStates: calculatedJobState[]= [];
  totalServicesDays: number;
  totalServicesMonths: number;
  totalServicesYears: number;
  totalServicesDaysWritten: string;
  totalServicesMonthsWritten: string;
  totalServicesYearsWritten: string;
  constructor(
  private tblShamelUserService: TBLShamelUserService,
  private tblshamelPrintFooterService: TblshamelPrintFooterService,
  private numberToWordService: NumberToWordService) { 
    this.todayDate= new Date();
    console.log('data123', this.data);

    this.tblShamelUserService.Login_User_BehavourSubject.subscribe(
      userId =>{
        this.userId= userId.user_id;
        console.log('this.userId',userId);

      }
    );
    this.tblshamelPrintFooterService.list(this.userId).subscribe(
      res =>{
        const printFooter= res.filter(printFooter => printFooter.form_name== "PrintEmpExperience");
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

    if (this.data != null){
      this.data[0].TBLShamelSCJobStates.forEach(TBLShamelSCJobState =>{
        if ( TBLShamelSCJobState.TBLShamelJobName != undefined && TBLShamelSCJobState.TBLShamelJobName?.jobname_name != undefined && TBLShamelSCJobState.begindate != undefined)
        this.jobStates.push({jobName: TBLShamelSCJobState.TBLShamelJobName.jobname_name, begindate: TBLShamelSCJobState.begindate});
      });
      console.log('this.jobStates', this.jobStates);
        for (let i=0; i< this.jobStates.length-1; i++){
          let newJobName: boolean= true;
          // console.log("moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days')",moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days'));
          for (let j=0; j<this.calculatedJobStates.length; j++){
            if (this.jobStates[i].jobName == this.calculatedJobStates[j].jobName ){
              newJobName= false;
              let diffInDays= moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days');
              this.calculatedJobStates[j].totalyears+= Math.floor(diffInDays/360);
              diffInDays-= Math.floor(diffInDays/360)*360;
              this.calculatedJobStates[j].totalMonths+= Math.floor(diffInDays/30);
              diffInDays-= Math.floor(diffInDays/30)*30;
              this.calculatedJobStates[j].totalDays+= diffInDays;
            }
          }
          if (newJobName){
            this.calculatedJobStates.push({jobName: this.jobStates[i].jobName});
              let diffInDays= moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days');
              // console.log('this.jobStates[i].begindate', this.jobStates[i].begindate);
              // console.log('this.jobStates[i+1].begindate', this.jobStates[i+1].begindate);
              // console.log("moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days')", moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days'));
              this.calculatedJobStates[this.calculatedJobStates.length-1].totalyears=  Math.floor(diffInDays/360);
              diffInDays-=  Math.floor(diffInDays/360)*360;
              this.calculatedJobStates[this.calculatedJobStates.length-1].totalMonths= Math.floor(diffInDays/30);
              diffInDays-= Math.floor(diffInDays/30)*30;
              this.calculatedJobStates[this.calculatedJobStates.length-1].totalDays= diffInDays;
          }
        }
        
        for (let i=0; i<this.calculatedJobStates.length; i++){
          this.calculatedJobStates[i].totalyears+= Math.floor(this.calculatedJobStates[i].totalMonths/12);
          this.calculatedJobStates[i].totalMonths-= Math.floor(this.calculatedJobStates[i].totalMonths/12)*12;
          this.calculatedJobStates[i].totalMonths+= Math.floor(this.calculatedJobStates[i].totalDays/30);
          this.calculatedJobStates[i].totalDays-= Math.floor(this.calculatedJobStates[i].totalDays/30)*30;
        }
        for (let i=0; i<this.calculatedJobStates.length; i++){
          this.numberToWordService.getWrittenNumber(this.calculatedJobStates[i].totalyears).subscribe(res =>{
            this.calculatedJobStates[i].totalyearsWritten = res as string;
          });
          this.numberToWordService.getWrittenNumber(this.calculatedJobStates[i].totalMonths).subscribe(res =>{
            this.calculatedJobStates[i].totalMonthsWritten = res as string;
          });
          this.numberToWordService.getWrittenNumber(this.calculatedJobStates[i].totalDays).subscribe(res =>{
            this.calculatedJobStates[i].totalDaysWritten = res as string;
          });
        }
        let calculatedInDays: number= 0;
        this.calculatedJobStates.forEach(
          calculatedJobState =>{
            calculatedInDays+=calculatedJobState.totalyears* 360 + calculatedJobState.totalMonths* 30 + calculatedJobState.totalDays
          }
        );
        console.log('calculatedInDays1', calculatedInDays);
        this.totalServicesYears= Math.floor(calculatedInDays/360);
        calculatedInDays-= this.totalServicesYears*360;
        console.log('calculatedInDays2', calculatedInDays);
  
        this.totalServicesMonths= Math.floor(calculatedInDays/30);
        calculatedInDays-= this.totalServicesMonths*30;
        console.log('calculatedInDays3', calculatedInDays);
  
        this.totalServicesDays= calculatedInDays;

        this.totalServicesDays= calculatedInDays;
      this.numberToWordService.getWrittenNumber(this.totalServicesDays).subscribe(res =>{
        this.totalServicesDaysWritten = res as string;
      });
      this.numberToWordService.getWrittenNumber(this.totalServicesMonths).subscribe(res =>{
        this.totalServicesMonthsWritten = res as string;
      });
      this.numberToWordService.getWrittenNumber(this.totalServicesYears).subscribe(res =>{
        this.totalServicesYearsWritten = res as string;
      });
  
        if (this.data[1].radioButtonsGroup == 1)
        this.calculatedJobStates = this.calculatedJobStates.filter(calculatedJobState => calculatedJobState.jobName == this.data[1].jobName);
        console.log('this.data[1].jobName', this.data[1].jobName);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.data[0].TBLShamelSCJobStates.forEach(TBLShamelSCJobState =>{
      if ( TBLShamelSCJobState.TBLShamelJobName != undefined && TBLShamelSCJobState.TBLShamelJobName?.jobname_name != undefined && TBLShamelSCJobState.begindate != undefined)
      this.jobStates.push({jobName: TBLShamelSCJobState.TBLShamelJobName.jobname_name, begindate: TBLShamelSCJobState.begindate});
    });
    console.log('this.jobStates', this.jobStates);
      for (let i=0; i< this.jobStates.length-1; i++){
        let newJobName: boolean= true;
        // console.log("moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days')",moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days'));
        for (let j=0; j<this.calculatedJobStates.length; j++){
          if (this.jobStates[i].jobName == this.calculatedJobStates[j].jobName ){
            newJobName= false;
            let diffInDays= moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days');
            this.calculatedJobStates[j].totalyears+= Math.floor(diffInDays/360);
            diffInDays-= Math.floor(diffInDays/360)*360;
            this.calculatedJobStates[j].totalMonths+= Math.floor(diffInDays/30);
            diffInDays-= Math.floor(diffInDays/30)*30;
            this.calculatedJobStates[j].totalDays+= diffInDays;
          }
        }
        if (newJobName){
          this.calculatedJobStates.push({jobName: this.jobStates[i].jobName});
            let diffInDays= moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days');
            // console.log('this.jobStates[i].begindate', this.jobStates[i].begindate);
            // console.log('this.jobStates[i+1].begindate', this.jobStates[i+1].begindate);
            // console.log("moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days')", moment(this.jobStates[i+1].begindate).diff(this.jobStates[i].begindate, 'days'));
            this.calculatedJobStates[this.calculatedJobStates.length-1].totalyears=  Math.floor(diffInDays/360);
            diffInDays-=  Math.floor(diffInDays/360)*360;
            this.calculatedJobStates[this.calculatedJobStates.length-1].totalMonths= Math.floor(diffInDays/30);
            diffInDays-= Math.floor(diffInDays/30)*30;
            this.calculatedJobStates[this.calculatedJobStates.length-1].totalDays= diffInDays;
        }
      }
      
      for (let i=0; i<this.calculatedJobStates.length; i++){
        this.calculatedJobStates[i].totalyears+= Math.floor(this.calculatedJobStates[i].totalMonths/12);
        this.calculatedJobStates[i].totalMonths-= Math.floor(this.calculatedJobStates[i].totalMonths/12)*12;
        this.calculatedJobStates[i].totalMonths+= Math.floor(this.calculatedJobStates[i].totalDays/30);
        this.calculatedJobStates[i].totalDays-= Math.floor(this.calculatedJobStates[i].totalDays/30)*30;

      }
      for (let i=0; i<this.calculatedJobStates.length; i++){
        this.numberToWordService.getWrittenNumber(this.calculatedJobStates[i].totalyears).subscribe(res =>{
          this.calculatedJobStates[i].totalyearsWritten = res as string;
        });
        this.numberToWordService.getWrittenNumber(this.calculatedJobStates[i].totalMonths).subscribe(res =>{
          this.calculatedJobStates[i].totalMonthsWritten = res as string;
        });
        this.numberToWordService.getWrittenNumber(this.calculatedJobStates[i].totalDays).subscribe(res =>{
          this.calculatedJobStates[i].totalDaysWritten = res as string;
        });
      }
      let calculatedInDays: number= 0;
      this.calculatedJobStates.forEach(
        calculatedJobState =>{
          calculatedInDays+=calculatedJobState.totalyears* 360 + calculatedJobState.totalMonths* 30 + calculatedJobState.totalDays
        }
      );
      console.log('calculatedInDays1', calculatedInDays);
      this.totalServicesYears= Math.floor(calculatedInDays/360);
      calculatedInDays-= this.totalServicesYears*360;
      console.log('calculatedInDays2', calculatedInDays);

      this.totalServicesMonths= Math.floor(calculatedInDays/30);
      calculatedInDays-= this.totalServicesMonths*30;
      console.log('calculatedInDays3', calculatedInDays);

      this.totalServicesDays= calculatedInDays;
      this.numberToWordService.getWrittenNumber(this.totalServicesDays).subscribe(res =>{
        this.totalServicesDaysWritten = res as string;
      });
      this.numberToWordService.getWrittenNumber(this.totalServicesMonths).subscribe(res =>{
        this.totalServicesMonthsWritten = res as string;
      });
      this.numberToWordService.getWrittenNumber(this.totalServicesYears).subscribe(res =>{
        this.totalServicesYearsWritten = res as string;
      });
       
      if (this.data[1].radioButtonsGroup == 1)
      this.calculatedJobStates = this.calculatedJobStates.filter(calculatedJobState => calculatedJobState.jobName == this.data[1].jobName);
      console.log('this.data[1].jobName', this.data[1].jobName);
  }
  ngOnInit(): void {
  }

}
