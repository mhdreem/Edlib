import { ITBLShamelClass } from "../ITBLShamelClass";
import { ITBLShamelJobName } from "../ITBLShamelJobName";

export interface GenerateEmployeeQararRequest
{
    list_tblshameljobName?:ITBLShamelJobName[];
    year_id?:number;
    tblShamelClass?: ITBLShamelClass,
    blocked?:number;
    qarar_num?:number;
    qarar_date?:Date;
}