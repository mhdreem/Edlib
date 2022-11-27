import { AsyncValidatorFn,  ValidationErrors, FormGroup, AbstractControl } from "@angular/forms";
import * as moment from "moment";
import { Observable, map, of } from "rxjs";
import { TblShamelBrokerEmployeeService } from "src/app/modules/shared/services/finance_department/broker/tbl-shamel-broker-employee.service";
import { TBLShamelOvertimeEmployeeService } from "src/app/modules/shared/services/finance_department/broker/tblshamel-overtime-employee.service";



export function  Uniqe( tblShamelBrokerEmployeeService:TblShamelBrokerEmployeeService ) : AsyncValidatorFn
{
    return (FormAbstract: AbstractControl) :  Observable<ValidationErrors  | null > => 
    {

      var Form = FormAbstract as FormGroup;
      if (Form== null )
      return null;
        if (Form.value != null && Form.value.id == null || Form.value.id == undefined)
        return of(null);
        if (Form.value != null && Form.value.documentnum == null || Form.value.documentnum == undefined)
        return of(null);
        if (Form.value != null && Form.value.startdate == null || Form.value.startdate == undefined)
        return of(null);

        return tblShamelBrokerEmployeeService.isUniqueRecord ({
          serial: Form.value.serail,
          fname: Form.value.fname,
          lname: Form.value.lname,
          father: Form.value.father,
          mother: Form.value.mother,
          birthdate: moment(Form.value.birthdateMonth+'/'+Form.value.birthdateDay+'/'+Form.value.birthdateYear).toDate(),
          sex_name: Form.value.sex_name,
          servicedayes: Form.value.servicedayes	
        }).
        pipe(map(
          (data:any ) => 
          {           
            return (data && data.length > 0) ? { "OverTimeEmployee": true } : null;
          }
        ));
   
      
    };
    
}
