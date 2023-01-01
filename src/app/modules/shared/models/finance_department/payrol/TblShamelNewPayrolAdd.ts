import { TBLShamelEmployee } from "../../employees_department/TBLShamelEmployee";
import { TblShamelNewPayrolAddDetail } from "./TblShamelNewPayrolAddDetail";

export class TblShamelNewPayrolAdd
{

    id ?:number;

  wife ?:string;

  family ?:string;

 family_ta3weed ?:number;

  insurance_kind ?:number;

  locked ?:number;

 salary_old ?:number;
 salary ?:number;

 
InsuranceSalary ?:number;

 TblShamelNewPayrolAddDetails?: TblShamelNewPayrolAddDetail[]; 

 TBLShamelEmployee?: TBLShamelEmployee; 

 salary_last_jobstate?:number;
  FirstChild?:number;
  SecondChild ?:number;
  ThirdChild ?:number;
  FourChild ?:number;
  RestChild ?:number;


  constructor()
  {
   this.id= 0;

   this.wife ='0';
 
   this.family ='0000';
 
   this.family_ta3weed =0;
 
   this.insurance_kind =0;
 
   this.locked =0;
 
   this.salary_old =0;
   this.salary =0;
  }
  public Clone(obj:any)
  {
   if (obj!= null )
   {
      if (obj.id != null)
         this.id = obj.id;

         if (obj.insurance_kind != null)
         this.insurance_kind = obj.insurance_kind;

         if (obj.FirstChild != null)
         this.FirstChild = obj.FirstChild;

         if (obj.FourChild != null)
         this.FourChild = obj.FourChild;


         if (obj.RestChild != null)
         this.RestChild = obj.RestChild;


         if (obj.SecondChild != null)
         this.SecondChild = obj.SecondChild;


         if (obj.TBLShamelEmployee != null)
         this.TBLShamelEmployee = obj.TBLShamelEmployee;


         if (obj.salary_last_jobstate != null)
         this.salary_last_jobstate = obj.salary_last_jobstate;

         if (obj.TblShamelNewPayrolAddDetails != null)
         this.TblShamelNewPayrolAddDetails = obj.TblShamelNewPayrolAddDetails;


         if (obj.ThirdChild != null)
         this.ThirdChild = obj.ThirdChild;


         if (obj.family != null)
         this.family = obj.family;

         if (obj.family_ta3weed != null)
         this.family_ta3weed = obj.family_ta3weed;

         if (obj.id != null)
         this.id = obj.id;


         if (obj.insurance_kind != null)
         this.insurance_kind = obj.insurance_kind;

         if (obj.locked != null)
         this.locked= obj.locked;


         if (obj.salary != null)
         this.salary= obj.salary;


         if (obj.wife != null)
         this.wife= obj.wife;


   }
  }
  public Get_Last_Salary_From_JobState () :number
  {
      this.salary = 0;
      if (this.TBLShamelEmployee != null &&
       this.TBLShamelEmployee.TBLShamelSCJobState_Last!= null &&
       this.TBLShamelEmployee.TBLShamelSCJobState_Last.salary!= null
       )
          this.salary = this.TBLShamelEmployee.TBLShamelSCJobState_Last.salary;

       return this.salary;
  }

 public fill_child_info_from_family () 
 {
   
       if (this.family == null || this.family  == undefined)
       this.family ='';

    this.family = this.family.padEnd(5,'0');

   

    this.FirstChild = this.family[this.family.length-1] == '1' ? 1 :0 ;

    this.SecondChild = this.family[this.family.length-2] == '1' ? 1 :0 ;
    this.ThirdChild = this.family[this.family.length-3] == '1' ? 1 :0 ;
    this.FourChild = this.family[this.family.length-4] == '1' ? 1 :0 ;
    this.RestChild = this.family[this.family.length-5] == '1' ? 1 :0 ;
    this.calc_family_ta3weed();



 }

 public calc_family_ta3weed () 
 {
    let result =0;

if (this.FirstChild>0)
 result= result+1500;

 if (this.SecondChild>0)
 result= result+1000;

 if (this.ThirdChild>0)
 result= result+750;

 if (this.FourChild>0)
 result= result+25;

 /*
 if (this.RestChild>0)
 result= result+25;
*/

 if(this.wife != null && this.wife =='1')
 {
    result= result+3500;
 }
   this.family_ta3weed = result;
 return result;

 }

}