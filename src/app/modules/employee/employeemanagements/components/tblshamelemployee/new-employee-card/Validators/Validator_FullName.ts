import { FormControl, FormGroup } from '@angular/forms';
import {AbstractControl,AsyncValidatorFn,ValidationErrors,} from '@angular/forms';
import { Observable, debounceTime } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { EmployeeServiceService } from 'src/app/modules/shared/services/employees_department/employee-service.service';
import { EmployeePageService } from '../../../employee-page-service';
export function Validator_FullName( empService:EmployeeServiceService,                                    
                                    emp:TBLShamelEmployee) : AsyncValidatorFn
        {

          console.log("alsdj")

        return (frmGroup: AbstractControl)
            : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {

                let  formgroup : FormGroup= frmGroup as FormGroup;
                if (formgroup == null )
                {
                    return new Promise(
                        resolve => {
                            null
                        });
                }
                if (formgroup.controls== null )
                {
                    return new Promise(
                        resolve => {
                            null
                        });
                }
                if (
                    formgroup.controls['id'] == null ||formgroup.controls['id'].value == null || formgroup.controls['id'].value.length==0 ||
                    formgroup.controls['FName'] == null ||formgroup.controls['FName'].value == null || formgroup.controls['FName'].value.length==0 ||
                    formgroup.controls['LName'] == null ||formgroup.controls['LName'].value == null || formgroup.controls['LName'].value.length==0 ||
                    formgroup.controls['Father'] == null ||formgroup.controls['Father'].value == null || formgroup.controls['Father'].value.length==0 ||
                    formgroup.controls['Mother'] == null ||formgroup.controls['Mother'].value == null || formgroup.controls['Mother'].value.length==0 

                )
                {
                    return new Promise(
                        resolve => {
                            null
                        });

                }

                let emp : TBLShamelEmployee = frmGroup.value as TBLShamelEmployee; 
              
            return empService.
            Check_FullName(emp, emp.id).
                pipe(
                    map(
                        (emp: TBLShamelEmployee) => {
                            return (emp!= null && emp.id!= null && emp.id>0) ? { "mobNumExists": true } : null;
                        }
                    ));
        };
    }
