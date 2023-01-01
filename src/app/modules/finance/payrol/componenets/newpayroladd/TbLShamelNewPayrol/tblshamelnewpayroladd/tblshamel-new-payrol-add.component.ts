import { Component, OnInit } from '@angular/core';
import { stringToKeyValue } from '@angular/flex-layout/extended/style/style-transforms';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable, of } from 'rxjs';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { TBLShamelMonth } from 'src/app/modules/shared/models/employees_department/TBLShamelMonth';
import { TBLShamelYear } from 'src/app/modules/shared/models/employees_department/TBLShamelYear';
import { TblShamelNewPayrolAdd } from 'src/app/modules/shared/models/finance_department/payrol/TblShamelNewPayrolAdd';
import { TblShamelNewPayrolAddDetail } from 'src/app/modules/shared/models/finance_department/payrol/TblShamelNewPayrolAddDetail';
import { TblShamelNewPayrolAddRequest } from 'src/app/modules/shared/models/finance_department/payrol/tblShamelNewPayrolAddRequest';
import { TblShamelNewPayrolTax } from 'src/app/modules/shared/models/finance_department/payrol/TblShamelNewPayrolTax';
import { EmployeeServiceService } from 'src/app/modules/shared/services/employees_department/employee-service.service';
import { TBLShamelAccounterService } from 'src/app/modules/shared/services/employees_department/tblshamel-accounter.service';
import { TBLShamelMonthService } from 'src/app/modules/shared/services/employees_department/tblshamel-month.service';
import { TBLShamelYearService } from 'src/app/modules/shared/services/employees_department/tblshamel-year.service';
import { ViewTBLShamelEmployeeService } from 'src/app/modules/shared/services/employees_department/view-tbl-shamel-employee.service';
import { TblShamelNewPayrolAddService } from 'src/app/modules/shared/services/finance_department/payrol/tbl-shamel-new-payrol-add.service';
import { TblShamelNewPayrolTaxService } from 'src/app/modules/shared/services/finance_department/payrol/tbl-shamel-new-payrol-tax.service';
import { TaxDialogComponent } from '../../tax-dialog/tax-dialog.component';
import { TblShamelNewPayrolAddPageServiceService } from '../tbl-shamel-new-payrol-add-page-service.service';

@Component({
  selector: 'app-new-payrol-add',
  templateUrl: './tblshamel-new-payrol-add.component.html',
  styleUrls: ['./tblshamel-new-payrol-add.component.scss']
})
export class TbLShamelNewPayrolAddComponent implements OnInit {
  Form: FormGroup;
  List_TblShamelNewPayrolTax: TblShamelNewPayrolTax[] = [];

  Fixed_Month: TBLShamelMonth;
  Fixed_Year: TBLShamelYear;


  repayment: string = "";
  amount: string = "";
  rate: string = "";
  checked: boolean = false;
  deductive: string = "";
  deductiveName: string = "";
  total: string = "";
  installment: string = "";
  stock: string = "";

  updateList: TblShamelNewPayrolAddRequest[] = [];
  AddDetailsList: TblShamelNewPayrolAddDetail[] = [];

  errorMsg: any;




  constructor(
    private frmBuilder: FormBuilder,
    public pageService: TblShamelNewPayrolAddPageServiceService,
    public viewTBLShamelEmployeeService: ViewTBLShamelEmployeeService,
    private tblShamelAccounterService: TBLShamelAccounterService,
    private tblShamelNewPayrolAddService: TblShamelNewPayrolAddService,
    public dialog: MatDialog,
    public employeeService: EmployeeServiceService,
    public ShamelMonthService: TBLShamelMonthService,
    public ShamelYearService: TBLShamelYearService,
    private tblShamelNewPayrolTaxService: TblShamelNewPayrolTaxService,
    private snackBar: MatSnackBar,) {


    this.BuildForm();

    if (this.pageService.id_BehaviorSubject != null)
      this.pageService.id_BehaviorSubject.subscribe
        (
          emp => {
            console.log('emp', emp);
            if (emp == null || emp <= 0)
              return;

            this.LoadData();

          }
        )
  }

  BuildForm() {

    this.Form = this.frmBuilder.group({
      'id': new FormControl<number | null>(null),
      'payrol_id': new FormControl<string | null>(null),
      'wife': new FormControl<string | null>(null),
      'family': new FormControl<string | null>(null),
      'FirstChild': new FormControl<number | null>(null),
      'SecondChild': new FormControl<number | null>(null),
      'ThirdChild': new FormControl<number | null>(null),
      'FourChild': new FormControl<number | null>(null),
      'RestChild': new FormControl<number | null>(null),
      'family_ta3weed': new FormControl<number | null>(null),
      'insurance_kind': new FormControl<number | null>(null),
      'locked': new FormControl<string | null>(null),
      'salary_old': new FormControl<number | null>(null),
      'salary_last_jobstate': new FormControl<number | null>(null),
      'InsuranceSalary': new FormControl<number | null>(null)

    });
  }


  load_Employee(): Observable<TBLShamelEmployee> {

    if (this.pageService.id != null && this.pageService.id > 0)
      return this.employeeService.search_by_id_mini(this.pageService.id);

    return of();
  }

  load_TblShamelNewPayrolAdd(): Observable<TblShamelNewPayrolAdd> {

    if (this.pageService.id != null && this.pageService.id > 0)
      return this.tblShamelNewPayrolAddService.getById(this.pageService.id);
    return of();
  }


  Load_TblShamelNewPayrolTax(): Observable<TblShamelNewPayrolTax[]> {
    if (this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax == null ||
      this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax == undefined ||
      this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax.length == 0)
      return this.tblShamelNewPayrolTaxService.list();
    return of(this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax);
  }

  LoadMonth(): Observable<TBLShamelMonth> {
    return this.ShamelMonthService.GetMonthFixed();

  }


  LoadYear(): Observable<TBLShamelYear> {

    return this.ShamelYearService.GetYearFixed();

  }
  LoadData() {

    forkJoin(
      [this.Load_TblShamelNewPayrolTax(),
      this.LoadYear(),
      this.LoadMonth(),
      this.load_Employee(),
      this.load_TblShamelNewPayrolAdd()
      ]
    ).subscribe(res => {

      this.List_TblShamelNewPayrolTax = res[0];
      this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax = res[0];
      this.tblShamelNewPayrolTaxService.List_TblShamelNewPayrolTax_BehaviorSubject.next(res[0]);


      this.Fixed_Year = res[1];
      this.Fixed_Month = res[2];

      this.pageService.TBLShamelEmployee = res[3];
      this.pageService.TBLShamelEmployee_BehaviorSubject.next(res[3]);

      this.pageService.TblShamelNewPayrolAdd = new TblShamelNewPayrolAdd();
      this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails = [];
      this.pageService.TblShamelNewPayrolAdd.Clone(res[4]);


      this.pageService.TblShamelNewPayrolAdd_BehaviorSubject.next(this.pageService.TblShamelNewPayrolAdd);



      if (this.pageService.TblShamelNewPayrolAdd == null || this.pageService.TblShamelNewPayrolAdd == undefined) {
        this.pageService.TblShamelNewPayrolAdd = new TblShamelNewPayrolAdd();
        this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails = [];
      }

      if (this.pageService.TBLShamelEmployee != null &&
        this.pageService.TBLShamelEmployee.id != null &&
        this.pageService.TBLShamelEmployee.id > 0
      ) {

        this.pageService.TblShamelNewPayrolAdd.id = this.pageService.TBLShamelEmployee.id;
        this.pageService.TblShamelNewPayrolAdd.TBLShamelEmployee = this.pageService.TBLShamelEmployee;
        this.pageService.TblShamelNewPayrolAdd.InsuranceSalary = this.pageService.TblShamelNewPayrolAdd.TBLShamelEmployee.InsuranceSalary;        
        this.pageService.TblShamelNewPayrolAdd.Get_Last_Salary_From_JobState();

        


        let TblShamelNewPayrolAddDetails: TblShamelNewPayrolAddDetail[] = [];
        this.List_TblShamelNewPayrolTax.forEach(element => {

          let Detail: TblShamelNewPayrolAddDetail = {
            tblshamelnewpayroladd_fk: this.pageService.TBLShamelEmployee.id,
            tblshamelnewpayroltax_fk: element.serial
          };

          Detail.TblShamelNewPayrolTax = element;

          switch (element.payroltaxtype) {
            case 'ta3weed':
              Detail.name = element.ta3weed_name;
              break;
            case 'taxtemp':
              Detail.name = element.taxtemp_name;
              break;
            case 'recurr':
              Detail.name = element.taxrecurr_name;
              break;
          }


          Detail.tblshamelnewpayroladd_fk = this.pageService.TBLShamelEmployee.id;
          Detail.tblshamelnewpayroltax_fk = element.serial;

          if (this.pageService.TblShamelNewPayrolAdd != null && this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails != null && this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails.length > 0) {
            var payrollDetail = this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails.find(x => x.tblshamelnewpayroltax_fk == element.serial);


            if (payrollDetail != null) {
              Detail.ta3weed_active = payrollDetail.ta3weed_active;
              Detail.ta3weed_amount = payrollDetail.ta3weed_amount;
              Detail.ta3weed_percent = payrollDetail.ta3weed_percent;
              Detail.taxrecurr_balance = payrollDetail.taxrecurr_balance;
              Detail.taxrecurr_fee = payrollDetail.taxrecurr_fee;
              Detail.taxrecurr_order = payrollDetail.taxrecurr_order;
              Detail.taxrecurr_total = payrollDetail.taxrecurr_total;
              Detail.taxtemp_amount = payrollDetail.taxtemp_amount;
              Detail.taxtemp_order = payrollDetail.taxtemp_order;
              Detail.taxtemp_percent = payrollDetail.taxtemp_percent;
              Detail.taxtemp_active = payrollDetail.taxtemp_active;
              Detail.ta3weed_active = payrollDetail.ta3weed_active;
              Detail.taxrecurr_active = payrollDetail.taxrecurr_active;
            }

          }

          TblShamelNewPayrolAddDetails.push(Detail);

        });

        this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails = TblShamelNewPayrolAddDetails;
        this.pageService.TblShamelNewPayrolAdd_BehaviorSubject.next(this.pageService.TblShamelNewPayrolAdd);


        this.pageService.List_ta3weed = this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails.filter(x => x.TblShamelNewPayrolTax != null && x.TblShamelNewPayrolTax.payroltaxtype == 'ta3weed');
        this.pageService.List_taxtemp = this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails.filter(x => x.TblShamelNewPayrolTax != null && x.TblShamelNewPayrolTax.payroltaxtype == 'taxtemp');
        this.pageService.List_recurr = this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails.filter(x => x.TblShamelNewPayrolTax != null && x.TblShamelNewPayrolTax.payroltaxtype == 'recurr');

        console.log('List_ta3weed', this.pageService.List_ta3weed);
        console.log('List_taxtemp', this.pageService.List_taxtemp);
        console.log('List_recurr', this.pageService.List_recurr);
        this.BindValue();
        
      this.bindModelToForm(this.pageService.TblShamelNewPayrolAdd,this.Form);




      }



    },
      (error) => console.log(error));

  }


  ngOnInit(): void {


  }










  calcFamilyRepayment() {

    if (this.pageService.TblShamelNewPayrolAdd != null) {      

      this.pageService.TblShamelNewPayrolAdd.FirstChild = (this.Form.controls['FirstChild'].value!=null && this.Form.controls['FirstChild'].value==1) ? 1:0;    
      this.pageService.TblShamelNewPayrolAdd.SecondChild =  (this.Form.controls['SecondChild'].value!=null && this.Form.controls['SecondChild'].value==1) ? 1:0; 
      this.pageService.TblShamelNewPayrolAdd.ThirdChild = (this.Form.controls['ThirdChild'].value!=null && this.Form.controls['ThirdChild'].value==1) ? 1:0; 
      this.pageService.TblShamelNewPayrolAdd.FourChild = (this.Form.controls['FourChild'].value!=null && this.Form.controls['FourChild'].value==1) ? 1:0; 
      this.pageService.TblShamelNewPayrolAdd.wife = (this.Form.controls['wife'].value!=null && this.Form.controls['wife'].value==1) ? '1':'0'; 
      this.pageService.TblShamelNewPayrolAdd.family = this.pageService.TblShamelNewPayrolAdd.FourChild.toString() + this.pageService.TblShamelNewPayrolAdd.ThirdChild.toString() +this.pageService.TblShamelNewPayrolAdd.SecondChild.toString() +this.pageService.TblShamelNewPayrolAdd.FirstChild.toString() ;

      this.pageService.TblShamelNewPayrolAdd.calc_family_ta3weed();

      this.Form.controls['family_ta3weed'].setValue(this.pageService.TblShamelNewPayrolAdd.calc_family_ta3weed());
      


    }
  }

  BindValue() {

    //تهئية عناصر الفورم
    this.Form.reset();

    //حساب التعويض العائلي
  
    
    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.id != null &&
      this.pageService.TBLShamelEmployee.id>0      
    )
      this.Form.controls['id'].setValue(this.pageService.TBLShamelEmployee.id);


   //جلب آخر راتب
    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.TBLShamelSCJobState_Last != null &&
      this.pageService.TBLShamelEmployee.TBLShamelSCJobState_Last.salary != null
    )
      this.Form.controls['salary_last_jobstate'].setValue(this.pageService.TBLShamelEmployee.TBLShamelSCJobState_Last.salary);

      
    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.InsuranceSalary != null &&
      this.pageService.TBLShamelEmployee.InsuranceSalary> 0
    )
      this.Form.controls['InsuranceSalary'].setValue(this.pageService.TBLShamelEmployee.InsuranceSalary);

      
      if (this.pageService.TblShamelNewPayrolAdd != null &&
        this.pageService.TblShamelNewPayrolAdd.InsuranceSalary != null &&
        this.pageService.TblShamelNewPayrolAdd.InsuranceSalary> 0
      )
        this.Form.controls['InsuranceSalary'].setValue(this.pageService.TblShamelNewPayrolAdd.InsuranceSalary);
  

    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.Payrol_ID != null
    )
      this.Form.controls['payrol_id'].setValue(this.pageService.TBLShamelEmployee.Payrol_ID);


    if (this.pageService.TBLShamelEmployee != null &&
      this.pageService.TBLShamelEmployee.Payrol_ID != null
    )
      this.Form.controls['payrol_id'].setValue(this.pageService.TBLShamelEmployee.Payrol_ID);

    if (this.pageService.TblShamelNewPayrolAdd != null) {
      //يحوي بيانات
    
      if (this.pageService.TblShamelNewPayrolAdd.insurance_kind != null)
        this.Form.controls['insurance_kind'].setValue(this.pageService.TblShamelNewPayrolAdd.insurance_kind);

        if (this.pageService.TblShamelNewPayrolAdd.family_ta3weed != null)
        this.Form.controls['family_ta3weed'].setValue(this.pageService.TblShamelNewPayrolAdd.family_ta3weed);

        if (this.pageService.TblShamelNewPayrolAdd.wife != null)
        this.Form.controls['wife'].setValue(this.pageService.TblShamelNewPayrolAdd.wife);


      if (this.pageService.TblShamelNewPayrolAdd.family != null)
      {
        this.Form.controls['family'].setValue(this.pageService.TblShamelNewPayrolAdd.family);
        this.pageService.TblShamelNewPayrolAdd.fill_child_info_from_family();

        if (this.pageService.TblShamelNewPayrolAdd.FirstChild!= null && this.pageService.TblShamelNewPayrolAdd.FirstChild!= undefined)
          this.Form.controls['FirstChild'].setValue(this.pageService.TblShamelNewPayrolAdd.FirstChild);


          if (this.pageService.TblShamelNewPayrolAdd.SecondChild!= null && this.pageService.TblShamelNewPayrolAdd.SecondChild!= undefined)
          this.Form.controls['SecondChild'].setValue(this.pageService.TblShamelNewPayrolAdd.SecondChild);

          if (this.pageService.TblShamelNewPayrolAdd.ThirdChild!= null && this.pageService.TblShamelNewPayrolAdd.ThirdChild!= undefined)
          this.Form.controls['ThirdChild'].setValue(this.pageService.TblShamelNewPayrolAdd.ThirdChild);

          if (this.pageService.TblShamelNewPayrolAdd.FourChild!= null && this.pageService.TblShamelNewPayrolAdd.FourChild!= undefined)
          this.Form.controls['FourChild'].setValue(this.pageService.TblShamelNewPayrolAdd.FourChild);

          if (this.pageService.TblShamelNewPayrolAdd.RestChild!= null && this.pageService.TblShamelNewPayrolAdd.RestChild!= undefined)
          this.Form.controls['FourChild'].setValue(this.pageService.TblShamelNewPayrolAdd.RestChild);
   
      }

   

    } else {
      //لا يحوي بيانات

    }















  }



  taxClicked() {
    if (this.pageService.TBLShamelEmployee != null) {
      const dialogRef = this.dialog.open(TaxDialogComponent, {
        width: '750px',
        data: this.pageService.TBLShamelEmployee.id,
      });

      dialogRef.afterClosed().subscribe(() => {

      });
    }
  }


getValue ()
{
  if (
    this.Form.controls['id'].value != null)
    this.pageService.TblShamelNewPayrolAdd.id = this.Form.controls['id'].value;


  
    
        

  if (
    this.Form.controls['wife'].value != null)
    this.pageService.TblShamelNewPayrolAdd.wife = this.Form.controls['wife'].value;

  let Family: string = '';
  if (
    this.Form.controls['FirstChild'].value != null && this.Form.controls['FirstChild'].value.length > 0)
    Family = this.Form.controls['FirstChild'].value + Family;
  else
    Family = '0' + Family;

  if (
    this.Form.controls['SecondChild'].value != null &&
    this.Form.controls['SecondChild'].value.length > 0)
    Family = this.Form.controls['SecondChild'].value + Family;
  else
    Family = '0' + Family;

  if (
    this.Form.controls['ThirdChild'].value != null &&
    this.Form.controls['ThirdChild'].value.length > 0)
    Family = this.Form.controls['ThirdChild'].value + Family;
  else
    Family = '0' + Family;

  if (
    this.Form.controls['FourChild'].value != null &&
    this.Form.controls['FourChild'].value.length > 0)
    Family = this.Form.controls['FourChild'].value + Family;
  else
    Family = '0' + Family;


    

  if (
    this.Form.controls['RestChild'].value != null &&
    this.Form.controls['RestChild'].value.length > 0)
    Family = this.Form.controls['RestChild'].value + Family;
  else
    Family = '0' + Family;


  this.Form.controls['family'].setValue(Family);


  if (
    this.Form.controls['family_ta3weed'].value != null)
    this.pageService.TblShamelNewPayrolAdd.family_ta3weed = this.Form.controls['family_ta3weed'].value;


  if (
    this.Form.controls['insurance_kind'].value != null)
    this.pageService.TblShamelNewPayrolAdd.insurance_kind = this.Form.controls['insurance_kind'].value;



    if (
      this.Form.controls['InsuranceSalary'].value != null)
      this.pageService.TblShamelNewPayrolAdd.InsuranceSalary = this.Form.controls['InsuranceSalary'].value;

      if (
        this.Form.controls['salary_last_jobstate'].value != null)
        this.pageService.TblShamelNewPayrolAdd.salary_last_jobstate = this.Form.controls['salary_last_jobstate'].value;
    
     

  if (
    this.Form.controls['salary_old'].value != null)
    this.pageService.TblShamelNewPayrolAdd.salary_old = this.Form.controls['salary_old'].value;

  if (
    this.Form.controls['locked'].value != null)
    this.pageService.TblShamelNewPayrolAdd.locked = this.Form.controls['locked'].value;


    let isInputsNull = false;
    console.log('this.pageService.List_ta3weed', this.pageService.List_ta3weed);

    for (let i = 0; i < this.pageService.List_ta3weed.length; i++) {

      if (this.pageService.List_ta3weed[i].ta3weed_active != null && this.pageService.List_ta3weed[i].ta3weed_active == 1 && (this.pageService.List_ta3weed[i].ta3weed_amount == 0 && this.pageService.List_ta3weed[i].ta3weed_percent == 0)) {
        isInputsNull = true;
        this.snackBar.open('يجب ملء حقلي المبلغ والنسبة الموافقين للتعويض المراد إضافته', '', {
          duration: 3000,
        });
      }
    }

    for (let i = 0; i < this.pageService.List_taxtemp.length; i++) {
      if (this.pageService.List_taxtemp[i].taxtemp_active && (this.pageService.List_taxtemp[i].taxtemp_amount == 0 && this.pageService.List_taxtemp[i].taxtemp_percent == 0)) {
        isInputsNull = true;
        this.snackBar.open('يجب ملء حقلي المبلغ والنسبة الموافقين للحسمية المراد إضافتها', '', {
          duration: 3000,
        });
      }
    }

    for (let i = 0; i < this.pageService.List_recurr.length; i++) {
      if (this.pageService.List_recurr[i].taxrecurr_active && (this.pageService.List_recurr[i].taxrecurr_balance == 0 && this.pageService.List_recurr[i].taxrecurr_fee == 0)) {
        isInputsNull = true;
        this.snackBar.open('يجب ملء حقلي المبلغ والنسبة الموافقين للتعويض المراد إضافته', '', {
          duration: 3000,
        });
      }
    }

    if (isInputsNull)
      return;
    // a copy to not affect the original payrolAddDetails, Otherwise the ui rows will change
   

    let TblShamelNewPayrolAddDetails :TblShamelNewPayrolAddDetail []  = [];
    
    this.pageService.List_ta3weed.forEach(listItem => {
      if (listItem.ta3weed_active != null && listItem.ta3weed_active == 1)
        TblShamelNewPayrolAddDetails.push(listItem);
    });

    this.pageService.List_taxtemp.forEach(listItem => {
      if (listItem.taxtemp_active)
        TblShamelNewPayrolAddDetails.push(listItem);
    });

    this.pageService.List_recurr.forEach(listItem => {
      if (listItem.taxrecurr_active)
        TblShamelNewPayrolAddDetails.push(listItem);
    });

    this.pageService.TblShamelNewPayrolAdd.TblShamelNewPayrolAddDetails =TblShamelNewPayrolAddDetails;

}
 


  save() {

    let request: any ={};


    if (this.Form != null) {




      if (
        this.Form.controls['id'].value == null || this.Form.controls['id'].value <0)
        {
          this.snackBar.open('يجب ادخال رقم الإضبارة','موافق');
          return;
        }

        if (
          this.Form.controls['wife'].value == null || this.Form.controls['wife'].value <0)
          {
            this.snackBar.open('يجب ادخال الزوجة','موافق');
            return;
          }
  



          if (
            this.Form.controls['FirstChild'].value == null || this.Form.controls['FirstChild'].value <0)
            {
              this.snackBar.open('يجب ادخال ترميز الاولاد','موافق');
              return;
            }
        
            if (
              this.Form.controls['SecondChild'].value == null || this.Form.controls['SecondChild'].value <0)
              {
                this.snackBar.open('يجب ادخال ترميز الاولاد','موافق');
                return;
              }

              if (
                this.Form.controls['ThirdChild'].value == null || this.Form.controls['ThirdChild'].value <0)
                {
                  this.snackBar.open('يجب ادخال ترميز الاولاد','موافق');
                  return;
                }

                if (
                  this.Form.controls['FourChild'].value == null || this.Form.controls['FourChild'].value <0)
                  {
                    this.snackBar.open('يجب ادخال ترميز الاولاد','موافق');
                    return;
                  }

                  if (
                    this.Form.controls['RestChild'].value == null || this.Form.controls['RestChild'].value <0)
                    {
                      this.snackBar.open('يجب ادخال ترميز الاولاد','موافق');
                      return;
                    }


                    if (
                      this.Form.controls['insurance_kind'].value == null || this.Form.controls['insurance_kind'].value <0)
                      {
                        this.snackBar.open('يجب ادخال نوع التأمين','موافق');
                        return;
                      }


                      if (
                        this.Form.controls['salary_old'].value == null || this.Form.controls['salary_old'].value <0)
                        {
                          this.snackBar.open('يجب ادخال الراتب القديم','موافق');
                          return;
                        }
                        
                        this.getValue();

    

    
      this.tblShamelNewPayrolAddService.Save(this.pageService.TblShamelNewPayrolAdd, this.Fixed_Month.month_id, this.Fixed_Year.year_id).subscribe(res => {
 
        if (res != null )
        {
          this.snackBar.open('تم بنجاح','موافق');
        }
        
      });

    }

  }




  
  bindModelToForm(model: any, form: FormGroup) {
    if (model== null ||  form == null)
    return;
    const keys = Object.keys(form.controls);
    keys.forEach(key => {
      
        form.controls[key].valueChanges.subscribe(
            (newValue) => {
              model[key] = newValue;             
            }
        )
    });
}

}
