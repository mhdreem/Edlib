import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITBLShamelSCEducation } from 'src/app/modules/shared/models/employees_department/ITBLShamelSCEducation';
import { ITBLShamelSCFreeHoliday } from 'src/app/modules/shared/models/employees_department/ITBLShamelSCFreeHoliday';
import { ITBLShamelSCPunishment } from 'src/app/modules/shared/models/employees_department/ITBLShamelSCPunishment';
import { TBLShamelSCFreeHolidayService } from 'src/app/modules/shared/services/employees_department/tblshamel-scfree-holiday.service';
import { TBLShamelSCPunishmentService } from 'src/app/modules/shared/services/employees_department/tblshamel-scpunishment.service';
import { TblshamelsceducationService } from 'src/app/modules/shared/services/employees_department/tblshamelsceducation.service';
import { TblshamelscjobstateService } from 'src/app/modules/shared/services/employees_department/tblshamelscjobstate.service';


export function Validator_Education(shamelsceducationService: TblshamelsceducationService): AsyncValidatorFn {
    return (control: AbstractControl)
        : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

            console.log('control', control);
        let frmGroup: FormGroup = control as FormGroup;
        if (frmGroup == null ||
            frmGroup.controls == null
        )
        return of(null);

                if (frmGroup.controls['serial'].value == null
        ) {
            return of(null);
        }


        return shamelsceducationService.
            Validate(frmGroup.value).
            pipe(
                map(
                    (emps: ITBLShamelSCEducation) => {
                        return (emps && emps.serial > 0) ? { "mobNumExists": true } : null;
                    }
                ));
    };
}
