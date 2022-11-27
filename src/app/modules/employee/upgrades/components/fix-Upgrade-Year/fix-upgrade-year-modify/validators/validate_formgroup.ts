import { AsyncValidatorFn,  ValidationErrors, FormGroup, AbstractControl } from "@angular/forms";
import { Observable, map, of } from "rxjs";
import { TblShamelUpgradeYearService } from "src/app/modules/shared/services/employees_department/tbl-shamel-upgrade-year.service";
import { TblShamelBrokerEmployeeService } from "src/app/modules/shared/services/finance_department/broker/tbl-shamel-broker-employee.service";
import { TBLShamelOvertimeEmployeeService } from "src/app/modules/shared/services/finance_department/broker/tblshamel-overtime-employee.service";



export function  Uniqe( tblShamelUpgradeYearService:TblShamelUpgradeYearService ) : AsyncValidatorFn
{
    return (FormAbstract: AbstractControl) :  Observable<ValidationErrors  | null > => 
    {

      var Form = FormAbstract as FormGroup;
      if (Form== null )
      return null;
      if (Form.value != null && Form.value.upgradeYear == null || Form.value.upgradeYear == undefined)
      return of(null);
      if (Form.value != null && Form.value.upgradeYearStart == null || Form.value.upgradeYearStart == undefined)
      return of(null);
      if (Form.value != null && Form.value.upgradeYearEnd == null || Form.value.upgradeYearEnd == undefined)
      return of(null);
      console.log('upgradeYear',Form.value.upgradeYear);

      return tblShamelUpgradeYearService.Validate (
        {"yeaR_ID": Form.value.upgradeYear,
        "upgradeStart": Form.value.upgradeYearStart,
        "upgradeEnd": Form.value.upgradeYearEnd}).
      pipe(map(
        (data:any ) => 
        {           
          return (data && data.length > 0) ? { "UpgradeYear": true } : null;
        }
      ));
   
      
    };
    
}
