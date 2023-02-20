import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable, of } from 'rxjs';
import { TblShamelNewPayrolTax } from 'src/app/modules/shared/models/finance_department/payrol/TblShamelNewPayrolTax';
import { TblShamelNewPayrolTaxService } from 'src/app/modules/shared/services/finance_department/payrol/tbl-shamel-new-payrol-tax.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';


@Component({
  selector: 'app-ta3weed-tax-programming',
  templateUrl: './tblshamel-new-payrol-tax.component.html',
  styleUrls: ['./tblshamel-new-payrol-tax.component.scss']
})

export class TBLShamelNewPayrolTaxComponent  implements OnInit {


  List_TblShamelNewPayrolTax: TblShamelNewPayrolTax[]= [];
  

  isDisabled: boolean = true;


  darkTheme: boolean;

  constructor(
    public tblShamelNewPayrolTaxService: TblShamelNewPayrolTaxService,
    public _SnackBar:MatSnackBar ,
    private themeService: ThemeService
    ) {       
      this.loadData();     
  }

  BuildForm()
  {    

  }

  //تحميل بيانات التعويضات والحسميات 
  Load_TblShamelNewPayrolTax() : Observable<TblShamelNewPayrolTax[]>
  {
    if (this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax != null &&
      this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax.length >0 )
      return of(this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax);
      return this.tblShamelNewPayrolTaxService.list();
  }

  loadData()
  {
    forkJoin(
      this.Load_TblShamelNewPayrolTax()
    ).subscribe(res=>
      {
        this.List_TblShamelNewPayrolTax = res[0];
        this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax =  res[0];
        this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax_BehaviorSubject.next(res[0]);
        
        if (this.List_TblShamelNewPayrolTax!= null && this.List_TblShamelNewPayrolTax.length>0)
        {
          this.tblShamelNewPayrolTaxService.List_ta3weed  = this.List_TblShamelNewPayrolTax.filter(x=>x.payroltaxtype == "ta3weed");          
          this.tblShamelNewPayrolTaxService.List_taxtemp  = this.List_TblShamelNewPayrolTax.filter(x=>x.payroltaxtype == "taxtemp");
          this.tblShamelNewPayrolTaxService.List_recurr  = this.List_TblShamelNewPayrolTax.filter(x=>x.payroltaxtype == "recurr");
          console.log('this.tblShamelNewPayrolTaxService.List_taxtemp', this.tblShamelNewPayrolTaxService.List_taxtemp);


     
        }
      });
    
  }


  save(){

    var arr = [...this.tblShamelNewPayrolTaxService.List_ta3weed, ...this.tblShamelNewPayrolTaxService.List_taxtemp, ... this.tblShamelNewPayrolTaxService.List_recurr ];
    
    let newArr:any []=[];
    console.log('arr', arr);
    arr.forEach(element => {
      if (this.isNotNull(element)){

        console.log('element', element);
        var newElement=
        {
          serial:element.serial,
          salary_source_fk:element.salary_source_fk,
          ta3weed_included_in_tax:      (element.ta3weed_included_in_tax?1:0),
          ta3weed_included_in_sum:      (element.ta3weed_included_in_sum?1:0),
          ta3weed_included_specialest:  (element.ta3weed_included_specialest?1:0),
          ta3weed_name:element.ta3weed_name,
          ta3weedp_name:element.ta3weedp_name,
          ta3weed_round:element.ta3weed_round,
          ta3weed_order:element.ta3weed_order,
          taxtemp_name:element.taxtemp_name,
          taxtempp_name:element.taxtempp_name,
          taxtemp_round:element.taxtemp_round,
          taxtemp_order:element.taxtemp_order,
          taxrecurr_name:element.taxrecurr_name,
          taxrecurrp_name:element.taxrecurrp_name,
          taxrecurr_order:element.taxrecurr_order,
          payroltaxtype:element.payroltaxtype,
          payroltaxconstant:element.payroltaxconstant,

        }
        newArr.push(newElement);
      }

    });
    


    this.tblShamelNewPayrolTaxService.AddRange(newArr).subscribe
    (
      res=>
      {
        if (res == 1){
          this._SnackBar.open('تمت الإضافة بنجاح','موافق', {panelClass: ['green-snackbar']});
        }
        else
        this._SnackBar.open('لم تتم الإضافة','موافق', {panelClass: ['red-snackbar']});
      }
    )


  }

  isNotNull(element: any){
    let isNotNull = false;
    if (element.payroltaxtype == 'ta3weed'){
      if (element.ta3weed_name != null && element.ta3weedp_name != null && element.ta3weed_round != null && element.ta3weed_order != null)
      isNotNull= true;
    }
    else if (element.payroltaxtype == 'taxtemp'){
      if (element.taxtemp_name != null && element.taxtempp_name != null && element.taxtemp_round != null && element.taxtemp_order != null)
      isNotNull= true;
    }
    else if (element.payroltaxtype == 'recurr'){
      if (element.taxrecurr_name != null && element.taxrecurrp_name != null && element.taxrecurr_order != null)
      isNotNull= true;
    }
    return isNotNull;
  }

  ngOnInit(): void {  
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
      const saveButton = document.getElementById('saveButton');     
  }

  Add_Tawid()
  {
    let obj:TblShamelNewPayrolTax =
    {
      payroltaxconstant:'دائم',
      serial:-1,
      payroltaxtype:'ta3weed'
    };
    this.tblShamelNewPayrolTaxService.List_ta3weed.push(obj);
  }

  Add_Recurr()
  {
    let obj:TblShamelNewPayrolTax =
    {
      payroltaxconstant:'دائم',
      serial:-1,
      payroltaxtype:'recurr'
    };
    this.tblShamelNewPayrolTaxService.List_recurr.push(obj);
  }


  Add_Tax()
  {
    let obj:TblShamelNewPayrolTax =
    {
      payroltaxconstant:'دائم',
      serial:-1,
      payroltaxtype:'taxtemp'
    };
    this.tblShamelNewPayrolTaxService.List_taxtemp.push(obj);
  }


  Delete($event:any)
  {
    if ($event!= null )
    {
       var index=  $event.index;
       var payroltaxtype=  $event.payroltaxtype;
       let tblShamelNewPayrolTax : TblShamelNewPayrolTax={};


  
       if (index!= null &&  payroltaxtype!= null)
       {
          if (payroltaxtype=='ta3weed')
          {
            tblShamelNewPayrolTax = this.tblShamelNewPayrolTaxService.List_ta3weed[index];

          }else if (payroltaxtype=='taxtemp')
          {
            tblShamelNewPayrolTax = this.tblShamelNewPayrolTaxService.List_taxtemp[index];

          }if (payroltaxtype=='recurr')
          {
            tblShamelNewPayrolTax = this.tblShamelNewPayrolTaxService.List_recurr[index];


          }

          if (tblShamelNewPayrolTax!= null && tblShamelNewPayrolTax.serial!= null &&  tblShamelNewPayrolTax.serial>0)
          {
            this.tblShamelNewPayrolTaxService.delete( tblShamelNewPayrolTax.serial).subscribe
            (
              res=>
              {
                if (res!= null && res>0)
                {
                  this._SnackBar.open('تم الحذف بنجاح','موافق',  {panelClass: ['green-snackbar']});
                  if (payroltaxtype=='ta3weed')
                  {
                  
                    this.tblShamelNewPayrolTaxService.List_ta3weed[index].isdeleted =true;
                    this.tblShamelNewPayrolTaxService.List_ta3weed.splice(index,1);
                  }else if (payroltaxtype=='taxtemp')
                  {
                  
                    this.tblShamelNewPayrolTaxService.List_taxtemp[index].isdeleted =true;
                    this.tblShamelNewPayrolTaxService.List_ta3weed.splice(index,1);
                  }if (payroltaxtype=='recurr')
                  {
                  
        
                    this.tblShamelNewPayrolTaxService.List_recurr[index].isdeleted =true;
                    this.tblShamelNewPayrolTaxService.List_ta3weed.splice(index,1);
                  }

                }
                else 
                {
                  this._SnackBar.open('لم يتم الحذف','موافق', {panelClass: ['red-snackbar']});

                }
              }
            );
          }

       }

    }
  }

    DeleteAll()
    {
      this.tblShamelNewPayrolTaxService.deleteAll().subscribe(
        res=>
        {
          if (res>0)
          {
            this._SnackBar.open('تم حذف جميع السجلات','موافق', {panelClass: ['green-snackbar']});
          }else 
          {
            this._SnackBar.open('لم يتم الحذف','موافق', {panelClass: ['red-snackbar']});

          }
        }
      )
    }

    addFromOldPayRollAdd()
    {
      this.tblShamelNewPayrolTaxService.addFromOldPayRollAdd().subscribe(
        res=>
        {
          if (res>0)
          {
            this._SnackBar.open('تم حذف جميع السجلات','موافق', {panelClass: ['green-snackbar']});
          }else 
          {
            this._SnackBar.open('لم يتم الحذف','موافق', {panelClass: ['red-snackbar']});

          }
        }
      )
    }

}
