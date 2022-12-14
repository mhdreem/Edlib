import { ITBLShamelSCJobState } from "./ITBLShamelSCJobState";

export interface ViewTBLShamelEmployee {
  fullname?: string;
  id?: number;
  payrol_id?: string;
  computer_id?: number;
  global_id?: string;
  insurance_id?: number;
  fName?: string;
  lname?: string;
  father?: string;
  mother?: string;
  malakstate_name?: string;
  martialstate_name?: string;

  //help Variable متحولات مساعدة للمستقبل ولكن غير موجودة في backend
  accounter_id?: number
  accounterserial?: number
  accounter_name?: number,
  TBLShamelSCJobState_Last?: ITBLShamelSCJobState,
}
