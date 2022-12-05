import { TBLShamelUser } from './TBLShamelUser';


export interface  TBLShamelPrivilages {
      user_id ?:number ;
      formname?:string ;
      nodetext?:string;
      privilage?:string;
      TBLShamelUser?:TBLShamelUser;

      Addition_permit?:boolean;
      Modification_permit?:boolean;
      entry_permit?:boolean;
      Print_permit?:boolean;      
      Deletion_permit?:boolean;
      
    

  
       
}
