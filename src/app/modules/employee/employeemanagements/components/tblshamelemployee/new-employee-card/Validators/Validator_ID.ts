import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { EmployeeServiceService } from 'src/app/modules/shared/services/employees_department/employee-service.service';
import { EmployeePageService } from '../../../employee-page-service';
export function Validator_ID( empService:EmployeeServiceService,
                                    id:number|undefined,
                                    pageEmployee:EmployeePageService) : AsyncValidatorFn
{
        return (control: AbstractControl)
            : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

            let value_From_Control: string = control.value;
            if (!value_From_Control ||
                value_From_Control.length == 0
            )
                return of(null);


                    if (pageEmployee.Selected_TBLShamelEmployee != null &&
                        pageEmployee.Selected_TBLShamelEmployee != undefined)
                           id = pageEmployee.Selected_TBLShamelEmployee.id;

                console.log('Validate ID');
                console.log(pageEmployee.Selected_TBLShamelEmployee);
                console.log(pageEmployee.Selected_TBLShamelEmployee);
                console.log('Validate ID');



            return empService.
            Check_ID(value_From_Control, id).
                pipe(
                    map(
                        (emp: TBLShamelEmployee) => {
                            return (emp && emp.id) ? { "mobNumExists": true } : null;
                        }
                    ));
        };
    }
