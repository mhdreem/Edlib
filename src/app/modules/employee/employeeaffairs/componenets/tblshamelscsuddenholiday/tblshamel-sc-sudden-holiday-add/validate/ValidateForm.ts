import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";
import { Observable, map, of, forkJoin } from "rxjs";
import { ITBLShamelSCHealthHoliday } from "src/app/modules/shared/models/employees_department/ITBLShamelSCHealthHoliday";
import { TBLShamelSCLegalHoliday } from "src/app/modules/shared/models/employees_department/TBLShamelSCLegalHoliday";
import { TBLShamelSCLEgalHolidayService } from "src/app/modules/shared/services/employees_department/tblshamel-sc-legal-holiday.service";
import { TBLShamelSCSuddenHolidayService } from "src/app/modules/shared/services/employees_department/tblshamel-sc-sudden-holiday.service";
import { TBLShamelSCHealthHolidayService } from "src/app/modules/shared/services/employees_department/tblshamel-schealth-holiday.service";

export function ValidateForm(ShamelSCSuddenHolidayService: TBLShamelSCSuddenHolidayService): AsyncValidatorFn {
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




        return ShamelSCSuddenHolidayService.Validate(formGroup.value).pipe(map(
            (SuddenHolidaies: TBLShamelSCLegalHoliday[]) => {
                return (SuddenHolidaies && SuddenHolidaies.length > 0) ? { "SuddenHoliday_Not_Valid": true } : null;
            }
        ));

    };



}
