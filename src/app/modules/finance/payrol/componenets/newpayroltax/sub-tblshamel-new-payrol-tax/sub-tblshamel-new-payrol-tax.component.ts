import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TblShamelNewPayrolTax } from 'src/app/modules/shared/models/finance_department/payrol/TblShamelNewPayrolTax';
import { TblShamelNewPayrolTaxService } from 'src/app/modules/shared/services/finance_department/payrol/tbl-shamel-new-payrol-tax.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';
import { TblShamelNewPayrolTaxValidatorFormGroup } from './TblShamelNewPayrolTaxValidatorFormGroup';


@Component({
  selector: 'app-sub-tblshamel-new-payrol-tax',
  templateUrl: './sub-tblshamel-new-payrol-tax.component.html',
  styleUrls: ['./sub-tblshamel-new-payrol-tax.component.scss']
})
export class SubTBLShamelNewPayrolTaxComponent implements OnInit, OnChanges {

  _tblShamelNewPayrolTax:TblShamelNewPayrolTax;
  

  get tblShamelNewPayrolTax():TblShamelNewPayrolTax
  {
     if (this.payroltaxtype != null && 
         this.payroltaxtype =='ta3weed' && 
         this.index!= null &&
         this.index>=0)
    {
      return this.tblShamelNewPayrolTaxService.List_ta3weed[this.index];
    }
    if (this.payroltaxtype != null && 
      this.payroltaxtype =='taxtemp' && 
      this.index!= null &&
      this.index>=0)
 {
   return this.tblShamelNewPayrolTaxService.List_taxtemp[this.index];
 }
 if (this.payroltaxtype != null && 
  this.payroltaxtype =='recurr' && 
  this.index!= null &&
  this.index>=0)
{
return this.tblShamelNewPayrolTaxService.List_recurr[this.index];
}
return {};

  }


  @Input() index:number;
  @Input() payroltaxtype:string;

  @Output() OnDelete = new EventEmitter<any>();
  Form : FormGroup;

  darkTheme: boolean;


  constructor( 
    private FrmBuilder:FormBuilder,
    private tblShamelNewPayrolTaxService : TblShamelNewPayrolTaxService,
    private themeService: ThemeService) { 
    this.BuildForm();
  }
//انشاء الفورم
  BuildForm()
  {
    this.Form = this.FrmBuilder.group({
      serial: new FormControl<number|null>(null),
      salary_source_fk: new FormControl<number|null>(null),      
      ta3weed_included_in_tax: new FormControl<boolean|null>(null, Validators.required),
      ta3weed_included_in_sum: new FormControl<boolean|null>(null, Validators.required),
      ta3weed_included_specialest: new FormControl<boolean|null>(null, Validators.required),
      ta3weed_name: new FormControl<string|null>(null, Validators.required),
      ta3weedp_name: new FormControl<string|null>(null, Validators.required),
      ta3weed_round: new FormControl<number|null>(null, Validators.required),
      ta3weed_order: new FormControl<number|null>(null, Validators.required),
      taxtemp_name: new FormControl<string|null>(null, Validators.required),
      taxtempp_name: new FormControl<string|null>(null, Validators.required),
      taxtemp_round: new FormControl<number|null>(null, Validators.required),
      taxtemp_order: new FormControl<number|null>(null, Validators.required),
      taxrecurr_name: new FormControl<string|null>(null, Validators.required),
      taxrecurrp_name: new FormControl<string|null>(null, Validators.required),
      taxrecurr_order: new FormControl<number|null>(null, Validators.required),
      payroltaxtype: new FormControl<string|null>(null),
      payroltaxconstant: new FormControl<string|null>(null, Validators.required)
    }, 
    {asyncValidator: TblShamelNewPayrolTaxValidatorFormGroup.Validate(this.tblShamelNewPayrolTaxService).bind(this)}
    );

  }
  
  //اظهار
  BindValue()
  {
      console.log('this.tblShamelNewPayrolTax', this.tblShamelNewPayrolTax);
    if (this.tblShamelNewPayrolTax!= null &&   
        this.tblShamelNewPayrolTax!= undefined)
    { 
      if (this.tblShamelNewPayrolTax.payroltaxconstant!= null)
        if (this.tblShamelNewPayrolTax.payroltaxconstant == 'دائم')
          this.Form.controls['payroltaxconstant'].setValue('دائم');
        else if (this.tblShamelNewPayrolTax.payroltaxconstant == 'مؤقت')
          this.Form.controls['payroltaxconstant'].setValue('مؤقت');

        if (this.tblShamelNewPayrolTax.payroltaxtype!= null)
        this.Form.controls['payroltaxtype'].setValue(this.tblShamelNewPayrolTax.payroltaxtype);

        if (this.tblShamelNewPayrolTax.salary_source_fk!= null)
        this.Form.controls['salary_source_fk'].setValue(this.tblShamelNewPayrolTax.salary_source_fk.toString());

        if (this.tblShamelNewPayrolTax.serial!= null)
        this.Form.controls['serial'].setValue(this.tblShamelNewPayrolTax.serial);

        if (this.tblShamelNewPayrolTax.ta3weed_included_in_sum!= null)
        this.Form.controls['ta3weed_included_in_sum'].setValue(this.tblShamelNewPayrolTax.ta3weed_included_in_sum);


        if (this.tblShamelNewPayrolTax.ta3weed_included_in_tax!= null)
        this.Form.controls['ta3weed_included_in_tax'].setValue(this.tblShamelNewPayrolTax.ta3weed_included_in_tax);

        if (this.tblShamelNewPayrolTax.ta3weed_included_specialest!= null)
        this.Form.controls['ta3weed_included_specialest'].setValue(this.tblShamelNewPayrolTax.ta3weed_included_specialest);


        if (this.tblShamelNewPayrolTax.ta3weed_name!= null)
        this.Form.controls['ta3weed_name'].setValue(this.tblShamelNewPayrolTax.ta3weed_name);

        if (this.tblShamelNewPayrolTax.ta3weed_round!= null)
        this.Form.controls['ta3weed_round'].setValue(this.tblShamelNewPayrolTax.ta3weed_round.toString());

        if (this.tblShamelNewPayrolTax.ta3weedp_name!= null)
        this.Form.controls['ta3weedp_name'].setValue(this.tblShamelNewPayrolTax.ta3weedp_name);


        if (this.tblShamelNewPayrolTax.ta3weed_order!= null)
        this.Form.controls['ta3weed_order'].setValue(this.tblShamelNewPayrolTax.ta3weed_order);

        if (this.tblShamelNewPayrolTax.taxrecurr_name!= null)
        this.Form.controls['taxrecurr_name'].setValue(this.tblShamelNewPayrolTax.taxrecurr_name);

        if (this.tblShamelNewPayrolTax.taxrecurrp_name!= null)
        this.Form.controls['taxrecurrp_name'].setValue(this.tblShamelNewPayrolTax.taxrecurrp_name);


        if (this.tblShamelNewPayrolTax.taxrecurr_order!= null)
        this.Form.controls['taxrecurr_order'].setValue(this.tblShamelNewPayrolTax.taxrecurr_order);



        if (this.tblShamelNewPayrolTax.taxtemp_name!= null)
        this.Form.controls['taxtemp_name'].setValue(this.tblShamelNewPayrolTax.taxtemp_name);

        if (this.tblShamelNewPayrolTax.taxtempp_name!= null)
        this.Form.controls['taxtempp_name'].setValue(this.tblShamelNewPayrolTax.taxtempp_name);



      
        if (this.tblShamelNewPayrolTax.taxtemp_round!= null)
        this.Form.controls['taxtemp_round'].setValue(this.tblShamelNewPayrolTax.taxtemp_round+'');

        if (this.tblShamelNewPayrolTax.taxtemp_order!= null)
        this.Form.controls['taxtemp_order'].setValue(this.tblShamelNewPayrolTax.taxtemp_order);

    }

  }

  //تنفيذ ngmodel مخفية
  bindModelToForm(model: any, form: FormGroup) {
    if (model== null ||  form == null)
    return;
    const keys = Object.keys(form.controls);
    keys.forEach(key => {
      
        form.controls[key].valueChanges.subscribe(
            (newValue) => {
                model[key] = newValue;
            }
                     
        );

      
    });
}

//كود الربط و التهيئة
  ngOnChanges(changes: SimpleChanges){
   
    if ( changes!= null && changes['index']!=null)
    {
      this.index = changes['index'].currentValue ;
    }
  
    if ( changes!= null && changes['payroltaxtype']!=null)
    {
      this.payroltaxtype = changes['payroltaxtype'].currentValue ;  
      this.BindValue();
      this.bindModelToForm(this.tblShamelNewPayrolTax,this.Form);          
    }

  }

  
  BtnDelete()
  {
      this.OnDelete.emit({'index': this.index,'payroltaxtype':this.payroltaxtype});
  }

  ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }

}
