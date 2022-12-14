import { ReturnStatement } from "@angular/compiler";
import { AsyncValidatorFn,  ValidationErrors, FormGroup, AbstractControl } from "@angular/forms";
import * as moment from "moment";
import { Observable, map, of } from "rxjs";
import { TBLShamelShatebHealthService } from "src/app/modules/shared/services/finance_department/shatebtax/tblshamel-shateb-health.service";
import { TBLShamelShatebPunishmentService } from "src/app/modules/shared/services/finance_department/shatebtax/tblshamel-shateb-punishment.service";



export function  Uniqe( ShamelShatebPunishmentService: TBLShamelShatebPunishmentService ) : AsyncValidatorFn
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
        



        return  ShamelShatebPunishmentService.isUniqueRecord (
          Form.value.id,
          Form.value.value.documentnum,
          Form.value.startdate,
          moment(Form.value.documentdate_Month+'/'+Form.value.documentdate_Day+'/'+Form.value.documentdate_Year).toDate(),
          Form.value.serial).
        pipe(map(
          (data:any ) => 
          {           
            return (data && data.length > 0) ? { "DecreeDateExists": true } : null;
          }
        ));
   
      
    };
    
}
