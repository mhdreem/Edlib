import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";
import { Observable, map, of, forkJoin } from "rxjs";
import { ITBLShamelSCHealthHoliday } from "src/app/modules/shared/models/employees_department/ITBLShamelSCHealthHoliday";
import { TBLShamelSCHealthHolidayService } from "src/app/modules/shared/services/employees_department/tblshamel-schealth-holiday.service";

export function ValidateForm(ShamelHealthHolidayService: TBLShamelSCHealthHolidayService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        //هنا الكونترول هو FormGroup
        let formGroup: FormGroup = control as FormGroup;
        if (formGroup == null)
            return of(null);

        if (formGroup.controls == null)
            return of(null);
        if (formGroup.controls['id'].value == null ||
            formGroup.controls['startdate'].value == null ||
            formGroup.controls['enddate'].value == null
        ) {
            return of(null);
        }




        return ShamelHealthHolidayService.Validate(formGroup.value).pipe(map(
            (HealthHolidaies: ITBLShamelSCHealthHoliday[]) => {
                return (HealthHolidaies && HealthHolidaies.length > 0) ? { "HealthHoliday_Not_Valida": true } : null;
            }
        ));

    };



}
