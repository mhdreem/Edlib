import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TblShamelNewPayrolAddDetail } from 'src/app/modules/shared/models/finance_department/payrol/TblShamelNewPayrolAddDetail';
import { TblShamelNewPayrolTax } from 'src/app/modules/shared/models/finance_department/payrol/TblShamelNewPayrolTax';
import { TblShamelNewPayrolTaxService } from 'src/app/modules/shared/services/finance_department/payrol/tbl-shamel-new-payrol-tax.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelNewPayrolAddPageServiceService } from '../tbl-shamel-new-payrol-add-page-service.service';

@Component({
  selector: 'sub-tblshamel-new-payrol-add',
  templateUrl: './sub-tblshamel-new-payrol-add.component.html',
  styleUrls: ['./sub-tblshamel-new-payrol-add.component.scss']
})
export class SubTblshamelNewPayrolAddComponent implements OnInit, OnChanges  {

 
  get TblShamelNewPayrolAddDetail():TblShamelNewPayrolAddDetail
  {
    if (
      this.pageService.TblShamelNewPayrolAdd!= null &&
      this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails!= null &&
      this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails.length >0 &&
      this.index!= null &&
      this.index>=0 &&
      this.index<this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails.length      
        )
    {
      switch(this.payroltaxtype){

        case 'ta3weed':
          if (this.pageService.List_ta3weed != null && this.pageService.List_ta3weed.length >0  && this.index < this.pageService.List_ta3weed.length)
            return this.pageService.List_ta3weed[this.index];
          break;

        case 'taxtemp':
          if (this.pageService.List_taxtemp != null && this.pageService.List_taxtemp.length >0  && this.index < this.pageService.List_taxtemp.length)
            return this.pageService.List_taxtemp[this.index];
          break;
        case 'recurr':
          if (this.pageService.List_recurr != null && this.pageService.List_recurr.length >0  && this.index < this.pageService.List_recurr.length)
            return this.pageService.List_recurr[this.index];
          break;
        }

        if (this.TblShamelNewPayrolAddDetail!= null &&
          this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax== null &&
          this.TblShamelNewPayrolAddDetail.tblshamelnewpayroltax_fk != null &&
          this.TblShamelNewPayrolAddDetail.tblshamelnewpayroltax_fk >0
          )
          {
            this.tblshamelnewpayroltaxservice.GetByID(this.TblShamelNewPayrolAddDetail.tblshamelnewpayroltax_fk).subscribe(
              data=>
              {
                this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax = data;
              }
            ); 
            
          }
    }
    return {};
  }


  //ترتيب العنصر ضمن المصفوفة
  @Input() index : number ;
  @Input() payroltaxtype : string ;
  // نوع السطر وذلك على حس 
  Form :FormGroup ;


  darkTheme: boolean;

  constructor(
    public pageService:TblShamelNewPayrolAddPageServiceService,
    public tblshamelnewpayroltaxservice :TblShamelNewPayrolTaxService ,
    private themeService: ThemeService) { 
    this.BuildForm();
  }

  BuildForm()
  {
    this.Form = new FormGroup({
      serail: new FormControl<number|null>(null),
      tblshamelnewpayroladd_fk: new FormControl<number|null >(null),
      tblshamelnewpayroltax_fk :  new FormControl<number|null >(null),
      TblShamelNewPayrolTax:new FormControl<TblShamelNewPayrolTax|null >(null),
      name:new FormControl<string|null >(null),
      ta3weed_amount:  new FormControl<number|null >(null),
      ta3weed_percent:  new FormControl<number|null >(null),
      ta3weed_active :  new FormControl<number|null >(null),
      ta3weed_order :  new FormControl<number|null >(null),
      taxtemp_amount  :  new FormControl<number|null >(null),
      taxtemp_percent  :  new FormControl<number|null >(null),
      taxtemp_active   :  new FormControl<number|null >(null),
      taxtemp_order   :  new FormControl<number|null >(null),
      taxrecurr_fee    :  new FormControl<number|null >(null),
      taxrecurr_balance:  new FormControl<number|null >(null),
      taxrecurr_total :  new FormControl<number|null >(null),
      taxrecurr_order :  new FormControl<number|null >(null),
      taxrecurr_active :  new FormControl<number|null >(null),      
    });
  }
 
  bindValue ()
  {
 
    if (this.Form!= null)
    {
      if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax!= null)
        {
          this.Form.controls['TblShamelNewPayrolTax'].setValue(this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax);
         
          if (this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.payroltaxtype!= null &&
              this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.payroltaxtype==='ta3weed')              
           this.Form.controls['name'].setValue(this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.ta3weed_name);
           else if (this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.payroltaxtype!= null &&
            this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.payroltaxtype==='taxtemp')              
         this.Form.controls['name'].setValue(this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.taxtempp_name);
         else if (this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.payroltaxtype!= null &&
          this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.payroltaxtype==='recurr')              
       this.Form.controls['name'].setValue(this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.taxrecurr_name);
          
        }

        console.log('this.TblShamelNewPayrolAddDetail', this.TblShamelNewPayrolAddDetail);
        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.ta3weed_active!= null &&
          this.TblShamelNewPayrolAddDetail.ta3weed_active > 0)
        {
          this.Form.controls['ta3weed_active'].setValue(this.TblShamelNewPayrolAddDetail.ta3weed_active);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.ta3weed_amount!= null&&
          this.TblShamelNewPayrolAddDetail.ta3weed_amount>0
          )
        {
          this.Form.controls['ta3weed_amount'].setValue(this.TblShamelNewPayrolAddDetail.ta3weed_amount);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.ta3weed_percent!= null &&
          this.TblShamelNewPayrolAddDetail.ta3weed_percent>0
          )
        {
          this.Form.controls['ta3weed_percent'].setValue(this.TblShamelNewPayrolAddDetail.ta3weed_percent);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.taxrecurr_balance!= null &&
          this.TblShamelNewPayrolAddDetail.taxrecurr_balance>0
          )
        {
          this.Form.controls['taxrecurr_balance'].setValue(this.TblShamelNewPayrolAddDetail.taxrecurr_balance);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.taxrecurr_fee!= null&&
          this.TblShamelNewPayrolAddDetail.taxrecurr_fee >0
          )
        {
          this.Form.controls['taxrecurr_fee'].setValue(this.TblShamelNewPayrolAddDetail.taxrecurr_fee);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.taxrecurr_order!= null &&
          this.TblShamelNewPayrolAddDetail.taxrecurr_order >0)
        {
          this.Form.controls['taxrecurr_order'].setValue(this.TblShamelNewPayrolAddDetail.taxrecurr_order);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.taxrecurr_total!= null &&
          this.TblShamelNewPayrolAddDetail.taxrecurr_total>0
          )
        {
          this.Form.controls['taxrecurr_total'].setValue(this.TblShamelNewPayrolAddDetail.taxrecurr_total);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.taxtemp_active!= null &&
          this.TblShamelNewPayrolAddDetail.taxtemp_active >0)
        {
          this.Form.controls['taxtemp_active'].setValue(this.TblShamelNewPayrolAddDetail.taxtemp_active);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.taxrecurr_active!= null &&
          this.TblShamelNewPayrolAddDetail.taxrecurr_active>0)
        {
          this.Form.controls['taxrecurr_active'].setValue(this.TblShamelNewPayrolAddDetail.taxrecurr_active);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.taxtemp_amount!= null &&
          this.TblShamelNewPayrolAddDetail.taxtemp_amount>0)
        {
          this.Form.controls['taxtemp_amount'].setValue(this.TblShamelNewPayrolAddDetail.taxtemp_amount);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.taxtemp_percent!= null &&
          this.TblShamelNewPayrolAddDetail.taxtemp_percent>0)
        {
          this.Form.controls['taxtemp_percent'].setValue(this.TblShamelNewPayrolAddDetail.taxtemp_percent);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.tblshamelnewpayroladd_fk!= null &&
          this.TblShamelNewPayrolAddDetail.tblshamelnewpayroladd_fk>0)
        {
          this.Form.controls['tblshamelnewpayroladd_fk'].setValue(this.TblShamelNewPayrolAddDetail.tblshamelnewpayroladd_fk);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.tblshamelnewpayroltax_fk!= null &&
          this.TblShamelNewPayrolAddDetail.tblshamelnewpayroltax_fk>0)
        {
          this.Form.controls['tblshamelnewpayroltax_fk'].setValue(this.TblShamelNewPayrolAddDetail.tblshamelnewpayroltax_fk);
        }

        if (this.TblShamelNewPayrolAddDetail!= null && 
          this.TblShamelNewPayrolAddDetail.tblshamelnpayroladddet_serail!= null &&
          this.TblShamelNewPayrolAddDetail.tblshamelnpayroladddet_serail>0)
        {
          this.Form.controls['tblshamelnpayroladddet_serail'].setValue(this.TblShamelNewPayrolAddDetail.tblshamelnpayroladddet_serail);
        }

    }


  }

  ngOnChanges(changes: SimpleChanges) {   
    if ( changes!= null && changes['index']!=null)    
    {
      this.payroltaxtype = changes['payroltaxtype'].currentValue;
      this.index = changes['index'].currentValue ;
      this.bindValue();
      this.bindModelToForm(this.TblShamelNewPayrolAddDetail,this.Form);          

    }
      

    
  }
  

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

  bindModelToForm(model: any, form: FormGroup) {
    if (model== null ||  form == null)
    return;
    const keys = Object.keys(form.controls);
    keys.forEach(key => {
      
        form.controls[key].valueChanges.subscribe(
            (newValue) => {
              model[key] = newValue;
              if (key == 'ta3weed_active'){
                model[key] = '0';
                if (this.Form.controls['ta3weed_active'].value == true)
                model[key] = '1';

              }
              else if (key == 'taxtemp_active'){
                model[key] = '0';
                if (this.Form.controls['taxtemp_active'].value == true)
                model[key] = '1';

              }
              else if (key == 'taxrecurr_active'){
                model[key] = '0';
                if (this.Form.controls['taxrecurr_active'].value == true)
                  model[key] = '1';

                 
              }
            }
        )
    });
}

clearPercentInput(){
  this.Form.controls['ta3weed_percent'].setValue('');
}

RoundTo10(value:number)
{
  return Math.round((value/10 ) ) * 10 ;
}

RoundTo5(value:number)
{
  return Math.round((value/5 ) ) * 5 ;
}

 SimpleRoundTo( AValue: number,  ADigit: number): number
 {
  let LFactor: number;
  LFactor = Math.pow(10, ADigit);
  return Math.trunc((AValue / LFactor) + 0.5) * LFactor;
 }




public  GetValOfPercent(Percent:number,
   Round:number,  Salary:number):number
  {
      let Val:number = 0;
      switch (Round)
      {
        //التقريب إلى اقرب 10
          case 10:
              Val = this.RoundTo10(Math.ceil(Salary * Percent / 100) ) ;
              break;
              //التقريب إلى اقرب 5
          case 5:
              Val = this.RoundTo5(Math.ceil(Salary * Percent / 100)) ;
              break;
              //التقريب إلى اقرب 1
          case 1:
              Val = Math.ceil(Salary * Percent / 100);
              break;
              //التقريب إلى اقرب 
          case 0:
              Val = Math.trunc( this.SimpleRoundTo (Salary * Percent / 100,0  )    );
              break;
              //التقريب إلى اقرب 10
          case -1:
              Val = Math.floor(Salary * Percent / 100);
              break;

      }
      return Val;

  }

CalcTawidPercent(){

  if (this.Form.controls['ta3weed_percent'] == null ||
  this.Form.controls['ta3weed_percent'].value == null ||
  this.Form.controls['ta3weed_percent'].value==0)
  return; 

  this.Form.controls['ta3weed_amount'].setValue('');
  let Percent : number = this.Form.controls['ta3weed_percent'].value;
  if (Percent!= null && Percent>0)
  {
    if (this.TblShamelNewPayrolAddDetail!= null &&
        this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax!= null &&
        this.pageService.TblShamelNewPayrolAdd!= null &&
        this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.payroltaxtype!= null)
        {
          if (this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.payroltaxtype=='ta3weed')          
          {
            if(this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.salary_source_fk==1)
            {

              this.TblShamelNewPayrolAddDetail.ta3weed_amount = this.GetValOfPercent(this.TblShamelNewPayrolAddDetail.ta3weed_percent,this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.ta3weed_round,this.pageService.TblShamelNewPayrolAdd.salary_old);
            }else if(this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.salary_source_fk==2)
            {
              this.TblShamelNewPayrolAddDetail.ta3weed_amount =this.GetValOfPercent(this.TblShamelNewPayrolAddDetail.ta3weed_percent,this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.ta3weed_round,this.pageService.TblShamelNewPayrolAdd.salary);
            }else if(this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.salary_source_fk==3)
            {
              this.TblShamelNewPayrolAddDetail.ta3weed_amount =this.GetValOfPercent(this.TblShamelNewPayrolAddDetail.ta3weed_percent,this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.ta3weed_round,this.pageService.TblShamelNewPayrolAdd.InsuranceSalary);
            }

            this.Form.controls['ta3weed_amount'].setValue(this.TblShamelNewPayrolAddDetail.ta3weed_amount);

          } 


        }
  }

}



CalcTaxTempPercent(){

  if (this.Form.controls['taxtemp_percent'] == null ||
  this.Form.controls['taxtemp_percent'].value == null ||
  this.Form.controls['taxtemp_percent'].value==0)
  return; 

  this.Form.controls['taxtemp_amount'].setValue('');
  let Percent : number = this.Form.controls['taxtemp_percent'].value;
  if (Percent!= null && Percent>0)
  {
    if (this.TblShamelNewPayrolAddDetail!= null &&
        this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax!= null &&
        this.pageService.TblShamelNewPayrolAdd!= null &&
        this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.payroltaxtype!= null)
        {
          if (this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.payroltaxtype=='taxtemp')
          {
            if(this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.salary_source_fk==1)
            {

              this.TblShamelNewPayrolAddDetail.taxtemp_amount = this.GetValOfPercent(this.TblShamelNewPayrolAddDetail.taxtemp_percent,this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.taxtemp_round,this.pageService.TblShamelNewPayrolAdd.salary_old);
            }else if(this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.salary_source_fk==1)
            {
              this.TblShamelNewPayrolAddDetail.taxtemp_amount =this.GetValOfPercent(this.TblShamelNewPayrolAddDetail.taxtemp_percent,this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.taxtemp_round,this.pageService.TblShamelNewPayrolAdd.salary);
            } else if(this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.salary_source_fk==1)
            {
              this.TblShamelNewPayrolAddDetail.taxtemp_amount =this.GetValOfPercent(this.TblShamelNewPayrolAddDetail.taxtemp_percent,this.TblShamelNewPayrolAddDetail.TblShamelNewPayrolTax.taxtemp_round,this.pageService.TblShamelNewPayrolAdd.InsuranceSalary);
            }

            this.Form.controls['taxtemp_amount'].setValue(this.TblShamelNewPayrolAddDetail.taxtemp_amount);


          }


        }
  }

}


}
