import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";
import { Observable, map, of, forkJoin } from "rxjs";
import { ITBLShamelSCCourse } from "src/app/modules/shared/models/employees_department/ITBLShamelSCCourse";
import { TblshamelsccourseService } from "src/app/modules/shared/services/employees_department/tblshamelsccourse.service";

export function ValidateForm(tblshamelsccourseservice: TblshamelsccourseService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        //هنا الكونترول هو FormGroup
        let formGroup: FormGroup = control as FormGroup;
        console.log('1');
        if (formGroup == null)
            return of(null);
console.log('2');
        if (formGroup.controls == null)
            return of(null);
            console.log('3');
        if (formGroup.controls['course_id'].value == null ||
            formGroup.controls['startdate'].value == null ||
            formGroup.controls['enddate'].value == null
        ) {
            return of(null);
        }
        console.log('4');

console.log('aaa',formGroup.value );


        return tblshamelsccourseservice.Validate(formGroup.value).pipe(map(
            (courses: ITBLShamelSCCourse[]) => {
                console.log('courses', courses);
                return (courses && courses.length > 0) ? { "Course_Not_Valida": true } : null;
            }
        ));

    };



}
