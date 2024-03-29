import { Component, Inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TBLShamelArea } from 'src/app/modules/shared/models/employees_department/TBLShamelArea';
import { TBLShamelEmployee } from 'src/app/modules/shared/models/employees_department/TBLShamelEmployee';
import { TBLShamelMartialState } from 'src/app/modules/shared/models/employees_department/TBLShamelMartialState';
import { TBLShamelMiniArea } from 'src/app/modules/shared/models/employees_department/TBLShamelMiniArea';
import { TBLShamelNationality } from 'src/app/modules/shared/models/employees_department/TBLShamelNationality';
import { TBLShamelSex } from 'src/app/modules/shared/models/employees_department/TBLShamelSex';
import { TBLShamelStreetOrVillage } from 'src/app/modules/shared/models/employees_department/TBLShamelStreetOrVillage';
import { EmployeeServiceService } from 'src/app/modules/shared/services/employees_department/employee-service.service';
import { IGlobalEmployeeList } from 'src/app/modules/shared/services/employees_department/IGlobalEmployeeList';
import { TBLShamelAreaService } from 'src/app/modules/shared/services/employees_department/tblshamel-area.service';
import { TBLShamelMartialStateService } from 'src/app/modules/shared/services/employees_department/tblshamel-martial-state.service';
import { TBLShamelMiniAreaService } from 'src/app/modules/shared/services/employees_department/tblshamel-mini-area.service';
import { TBLShamelNationalityService } from 'src/app/modules/shared/services/employees_department/tblshamel-nationality.service';
import { TBLShamelSexService } from 'src/app/modules/shared/services/employees_department/tblshamel-sex.service';
import { TBLShamelStreetOrVillageService } from 'src/app/modules/shared/services/employees_department/tblshamel-street-or-village.service';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';

const moment = _moment;

@Component({
  selector: 'app-edit-employee-card',
  templateUrl: './edit-employee-card.component.html',
  styleUrls: ['./edit-employee-card.component.scss']
})
export class EditEmployeeCardComponent implements OnInit {

  formname:string = 'ManageEmployeeDataCardFrame1';
  
       @Input() SelectedEmp : TBLShamelEmployee;

       // Access To Element in Form
       Form: UntypedFormGroup ;
       input_id   = new UntypedFormControl();
       input_Payrol_ID = new UntypedFormControl();
       input_Computer_ID = new UntypedFormControl();
       input_Global_ID = new UntypedFormControl();
       input_Insurance_ID = new UntypedFormControl();
       input_FName = new UntypedFormControl();
       input_LName = new UntypedFormControl();
       input_Father = new UntypedFormControl();
       input_Mother = new UntypedFormControl();
       input_Birth_Place = new UntypedFormControl();
       input_BirthDate = new UntypedFormControl();
       input_Kayd_Place = new UntypedFormControl();
       input_Sex_ID = new UntypedFormControl();
       input_Nationality_ID = new UntypedFormControl();
       input_Area_ID = new UntypedFormControl();
       input_MiniArea_ID = new UntypedFormControl();
       input_StreetOrVillage_ID = new UntypedFormControl();
       input_Accounter_ID = new UntypedFormControl();
       input_Certificate_Name = new UntypedFormControl();
       input_Specification_Name  = new UntypedFormControl();
       input_JobName_Name = new UntypedFormControl();
       input_class_Name  = new UntypedFormControl();
       input_Salary  = new UntypedFormControl();
       input_BeginDate   = new UntypedFormControl();
       input_ChangeReason_Name    = new UntypedFormControl();
       input_QararDate    = new UntypedFormControl();
       input_Qarar_Num     = new UntypedFormControl();
       input_Rem1    = new UntypedFormControl();
       input_Rem2    = new UntypedFormControl();
       input_Rem3    = new UntypedFormControl();
       input_malakstate_name    = new UntypedFormControl();
       input_PhoneNum     = new UntypedFormControl();
       input_MartialState_ID      = new UntypedFormControl();
       input_ManualAddress      = new UntypedFormControl();
       input_City_ID      = new UntypedFormControl();
       input_Emp_IN_Military_Service      = new UntypedFormControl();
       input_ID_Number = new UntypedFormControl();

       //Array Of AutoComplere With Filter
       
       TBLShamelStreetOrVillage_List :TBLShamelStreetOrVillage[]=[];
       filtered_TBLShamelStreetOrVillage_Options: Observable<TBLShamelStreetOrVillage[]>;  
     
       TBLShamelSex_List :TBLShamelSex[]=[];
       filtered_TBLShamelSex_Options: Observable<TBLShamelSex[]>;
     
       TBLShamelMiniArea_List :TBLShamelMiniArea[]=[];
       filtered_TBLShamelMiniArea_Options: Observable<TBLShamelMiniArea[]>;
     
       TBLShamelMartialState_List :TBLShamelMartialState[]=[];
       filtered_TBLShamelMartialState_Options: Observable<TBLShamelMartialState[]>;
     
       TBLShamelArea_List :TBLShamelArea[]=[];
       filtered_TBLShamelArea_Options: Observable<TBLShamelArea[]>;
       
       TBLShamelNationality_List :TBLShamelNationality[]=[];
       filtered_TBLShamelNationality_Options: Observable<TBLShamelNationality[]>;

       darkTheme: boolean;

       constructor( private fb: UntypedFormBuilder,
         public restApi:EmployeeServiceService,
     
         public TBLShamelSex_Service:TBLShamelSexService,
         public TBLShamelArea_Service:TBLShamelAreaService,
         public TBLShamelMiniArea_Service:TBLShamelMiniAreaService,
         public TBLShamelStreetOrVillage_Service:TBLShamelStreetOrVillageService,
         public TBLShamelMartialState_Service:TBLShamelMartialStateService,
         public TBLShamelNationality_Service:TBLShamelNationalityService,
         public GlobalEmployeeList : IGlobalEmployeeList  ,
         @Inject(MAT_DIALOG_DATA) public data: {dataEmp: TBLShamelEmployee},
         private themeService: ThemeService) {

          console.log("inside construnctor");
         console.log(this.data.dataEmp);
         this.SelectedEmp = this.data.dataEmp;
         console.log(this.SelectedEmp);
         if (IGlobalEmployeeList.TBLShamelSexList  && IGlobalEmployeeList.TBLShamelSexList.length>0)
         {
           this.TBLShamelSex_List = IGlobalEmployeeList.TBLShamelSexList;
         }
     
         if (IGlobalEmployeeList.TBLShamelAreaList  && IGlobalEmployeeList.TBLShamelAreaList.length>0)
         {
           this.TBLShamelArea_List = IGlobalEmployeeList.TBLShamelAreaList;
         }
     
         if (IGlobalEmployeeList.TBLShamelMiniAreaList && IGlobalEmployeeList.TBLShamelMiniAreaList.length>0)
         {
           this.TBLShamelMiniArea_List = IGlobalEmployeeList.TBLShamelMiniAreaList;
         }
     
         if (IGlobalEmployeeList.TBLShamelStreetOrVillageList && IGlobalEmployeeList.TBLShamelStreetOrVillageList.length>0)
         {
           this.TBLShamelStreetOrVillage_List = IGlobalEmployeeList.TBLShamelStreetOrVillageList;
         }
     
         if (IGlobalEmployeeList.TBLShamelMartialStateList && IGlobalEmployeeList.TBLShamelMartialStateList.length>0)
         {
           this.TBLShamelMartialState_List = IGlobalEmployeeList.TBLShamelMartialStateList;
         }

         if (IGlobalEmployeeList.TBLShamelNationalityList && IGlobalEmployeeList.TBLShamelNationalityList.length>0)
         {
           this.TBLShamelNationality_List = IGlobalEmployeeList.TBLShamelNationalityList;
         }
     

         console.log('Constructor FillArrayUsingService');

         this.FillArrayUsingService();

         this.BuildForm();
         this.SetValue()
     
        }
     
        public async FillArrayUsingService()
        {

          console.log('Begin FillArrayUsingService');
          try{
     
            if (!this.TBLShamelNationality_List || this.TBLShamelNationality_List.length<=0)
            {
              
             this.TBLShamelNationality_Service.list().subscribe(
               (data:any)=> {
                 
                 this.TBLShamelNationality_List=data;      
               });
     
     
           
            }
            
            this.filtered_TBLShamelNationality_Options = this.input_Nationality_ID.valueChanges
            .pipe(
              startWith(''),        
              map(value => value   && typeof value === 'string'  ? this._filtered_TBLShamelNationality_Options_Func(value) : this.TBLShamelNationality_List.slice() )
            );  
          
          }catch(Exception : any)
          {console.log(Exception);}



          try{
     
            if (!this.TBLShamelArea_List || this.TBLShamelArea_List.length<=0)
            {
              
             this.TBLShamelArea_Service.list().subscribe(
               (data:any)=> {
                 
                 this.TBLShamelArea_List=data;      
               });
     
     
           
            }
            
            this.filtered_TBLShamelArea_Options = this.input_Area_ID.valueChanges
            .pipe(
              startWith(''),        
              map(value => value   && typeof value === 'string'  ? this._filtered_TBLShamelArea_Options_Func(value) : this.TBLShamelArea_List.slice() )
            );  
          
          }catch(Exception : any)
          {console.log(Exception);}
     
  
          try{
           if (!this.TBLShamelMiniArea_List || this.TBLShamelMiniArea_List.length<=0)
           {        
            this.TBLShamelMiniArea_Service.list().subscribe(
              (data:any)=> {
                console.log('TBLShamelMiniArea');
                console.log(data.length);
                if (data && data.length>0)
                  this.TBLShamelMiniArea_List=data;      
                else
                  this.TBLShamelMiniArea_List=[];
              });
          
           }      
           this.filtered_TBLShamelMiniArea_Options = this.input_MiniArea_ID.valueChanges
           .pipe(
             startWith(''),        
             map(value => value   && typeof value === 'string'  ? this._filtered_TBLShamelMiniArea_Options_Func(value) : this.TBLShamelMiniArea_List.slice() )
           );      
         }catch(Exception : any)
         {console.log(Exception);}
 


         try{
           if (!this.TBLShamelSex_List || this.TBLShamelSex_List.length<=0)
           {        
            this.TBLShamelSex_Service.list().subscribe(
              (data:any)=> {
                this.TBLShamelSex_List=data;      
              });
          
           }      
           this.filtered_TBLShamelSex_Options = this.input_Sex_ID.valueChanges
           .pipe(
             startWith(''),        
             map(value => value   && typeof value === 'string'  ? this._filtered_TBLShamelSex_Options_Func(value) : this.TBLShamelSex_List.slice() )
           );      
         }catch(Exception : any)
         {console.log(Exception);}
     
     
         try{
           if (!this.TBLShamelStreetOrVillage_List || this.TBLShamelStreetOrVillage_List.length<=0)
           {        
            this.TBLShamelStreetOrVillage_Service.list().subscribe(
              (data:any)=> {
                this.TBLShamelStreetOrVillage_List=data;      
              });
          
           }      
           this.filtered_TBLShamelStreetOrVillage_Options = this.input_StreetOrVillage_ID.valueChanges
           .pipe(
             startWith(''),        
             map(value => value   && typeof value === 'string'  ? this._filtered_TBLShamelStreetOrVillage_Options_Func(value) : this.TBLShamelStreetOrVillage_List.slice() )
           );      
         }catch(Exception : any)
         {console.log(Exception);}
   
     
         try{
           if (!this.TBLShamelMartialState_List || this.TBLShamelMartialState_List.length<=0)
           {        
            this.TBLShamelMartialState_Service.list().subscribe(
              (data:any)=> {
                this.TBLShamelMartialState_List=data;      
              });
          
           }      
           this.filtered_TBLShamelMartialState_Options = this.input_MartialState_ID.valueChanges
           .pipe(
             startWith(''),        
             map(value => value   && typeof value === 'string'  ? this._filtered_TBLShamelMartialState_Options_Func(value) : this.TBLShamelMartialState_List.slice() )
           );      
         }catch(Exception : any)
         {console.log(Exception);}
     

         console.log('End FillArrayUsingService');

        }
        
        private _filtered_TBLShamelMiniArea_Options_Func(value: string): TBLShamelMiniArea[] 
        {    
     
         if (value)
         {
           const filterValue = value ;
           return this.TBLShamelMiniArea_List.filter(obj => obj.MiniArea_Name.includes(filterValue) );
     
         }
         return this.TBLShamelMiniArea_List.slice();
       }
     
        private _filtered_TBLShamelSex_Options_Func(value: string): TBLShamelSex[] 
        {    
     
         if (value)
         {
           const filterValue = value ;
           return this.TBLShamelSex_List.filter(obj => obj.Sex_Name.includes(filterValue) );
     
         }
         return this.TBLShamelSex_List.slice();
       }
     
       private _filtered_TBLShamelStreetOrVillage_Options_Func(value: string): TBLShamelStreetOrVillage[] 
        {    
     
         if (value)
         {
           const filterValue = value ;
           return this.TBLShamelStreetOrVillage_List.filter(obj => obj.StreetOrVillage_Name.includes(filterValue) );
     
         }
         return this.TBLShamelStreetOrVillage_List.slice();
       }
     
       private _filtered_TBLShamelMartialState_Options_Func(value: string): TBLShamelMartialState[] 
       {    
     console.log(value);
        if (value)
        {
          const filterValue = value ;
          return this.TBLShamelMartialState_List.filter(obj => obj.MartialState_Name.includes(filterValue) );
     
        }
        return this.TBLShamelMartialState_List.slice();
      }
     
     
        private _filtered_TBLShamelArea_Options_Func(value: string): TBLShamelArea[] 
        {    
     
         if (value)
         {
           const filterValue = value ;
           return this.TBLShamelArea_List.filter(obj => obj.area_name.includes(filterValue) );
     
         }
         return this.TBLShamelArea_List.slice();
       }
     
     

       private _filtered_TBLShamelNationality_Options_Func(value: string): TBLShamelNationality[] 
        {    
     
          
         if (value)
         {

           const filterValue = value ;
           return this.TBLShamelNationality_List.filter(obj => obj.Nationality_Name.includes(filterValue) );
     
         }
         return this.TBLShamelNationality_List.slice();
       }

        public BuildForm()
        {

          console.log("BuildForm Begin");

          try{    
         if (this.SelectedEmp && this.SelectedEmp.id>0)
         {
            this.input_id   = new UntypedFormControl({value: this.SelectedEmp.id, enabled: false});
            this.input_Payrol_ID = new UntypedFormControl({value: this.SelectedEmp.Payrol_ID, enabled: false});
            this.input_Computer_ID = new UntypedFormControl({value: this.SelectedEmp.Computer_ID, enabled: false});
            this.input_Global_ID = new UntypedFormControl({value: this.SelectedEmp.Global_ID, enabled: false});
            this.input_Insurance_ID =new UntypedFormControl({value: this.SelectedEmp.Insurance_ID, enabled: false});
            this.input_FName =new UntypedFormControl({value: this.SelectedEmp.FName, enabled: false});
            this.input_LName =new UntypedFormControl({value: this.SelectedEmp.LName, enabled: false});
            this.input_Father =new UntypedFormControl({value: this.SelectedEmp.Father, enabled: false});
            this.input_Mother =new UntypedFormControl({value: this.SelectedEmp.Mother, enabled: false});
            this.input_Birth_Place = new UntypedFormControl({value: this.SelectedEmp.Birth_Place, enabled: false});
            this.input_BirthDate = new UntypedFormControl({value: this.SelectedEmp.BirthDate, enabled: false});
            this.input_Kayd_Place =new UntypedFormControl({value: this.SelectedEmp.Kayd_Place, enabled: false});
            this.input_Sex_ID = new UntypedFormControl({value: this.SelectedEmp.Sex_Name, enabled: false});
            this.input_Nationality_ID = new UntypedFormControl({value: this.SelectedEmp.Nationality_Name, enabled: false});
            this.input_Area_ID = new UntypedFormControl({value: this.SelectedEmp.Area_Name, enabled: false});
            this.input_MiniArea_ID = new UntypedFormControl({value: this.SelectedEmp.MiniArea_Name, enabled: false});
            this.input_StreetOrVillage_ID = new UntypedFormControl({value: this.SelectedEmp.StreetOrVillage_Name, enabled: false});
            this.input_Accounter_ID = new UntypedFormControl({value: this.SelectedEmp.id, enabled: false});
            this.input_Certificate_Name = new UntypedFormControl({value: this.SelectedEmp.Certificate_Name, enabled: false});
            this.input_Specification_Name  = new UntypedFormControl({value: this.SelectedEmp.Specification_Name, enabled: false});
            this.input_JobName_Name = new UntypedFormControl({value: this.SelectedEmp.JobName_Name, enabled: false});
            this.input_class_Name  =new UntypedFormControl({value: this.SelectedEmp.Class_Name, enabled: false});
            this.input_Salary  = new UntypedFormControl({value: this.SelectedEmp.Salary, enabled: false});
            this.input_BeginDate   = new UntypedFormControl({value: this.SelectedEmp.BeginDate, enabled: false});
            this.input_ChangeReason_Name    = new UntypedFormControl({value: this.SelectedEmp.ChangeReason_Name, enabled: false});
            this.input_QararDate    = new UntypedFormControl({value: this.SelectedEmp.QararDate, enabled: false});
            this.input_Qarar_Num     = new UntypedFormControl({value: this.SelectedEmp.Qarar_Num, enabled: false});
            this.input_Rem1    = new UntypedFormControl({value: this.SelectedEmp.Rem1, enabled: false});
            this.input_Rem2    = new UntypedFormControl({value: this.SelectedEmp.Rem2, enabled: false});
            this.input_Rem3    = new UntypedFormControl({value: this.SelectedEmp.Rem3, enabled: false});
            this.input_malakstate_name    = new UntypedFormControl({value: this.SelectedEmp.MalakState_Name, enabled: false});
            this.input_PhoneNum     = new UntypedFormControl({value: this.SelectedEmp.PhoneNum, enabled: false});
            this.input_MartialState_ID      = new UntypedFormControl({value: this.SelectedEmp.MartialState_Name, enabled: false});
            this.input_ManualAddress      = new UntypedFormControl({value: this.SelectedEmp.ManualAddress, enabled: false});
            this.input_City_ID      = new UntypedFormControl({value: this.SelectedEmp.City_Name, enabled: false});
            this.input_Emp_IN_Military_Service = new UntypedFormControl({value: this.SelectedEmp.Emp_IN_Military_Service >0 ? true : false, enabled: false});
            this.input_ID_Number = new UntypedFormControl({value: this.SelectedEmp && this.SelectedEmp.ID_Number ?  this.SelectedEmp.ID_Number : '', enabled: false});

      
            
         }else
         {
           console.log();
          this.input_id   = new UntypedFormControl();
          this.input_Payrol_ID = new UntypedFormControl( );
          this.input_Computer_ID = new UntypedFormControl( );
          this.input_Global_ID = new UntypedFormControl( );
          this.input_Insurance_ID =new UntypedFormControl( );
          this.input_FName =new UntypedFormControl( );
          this.input_LName =new UntypedFormControl( );
          this.input_Father =new UntypedFormControl( );
          this.input_Mother =new UntypedFormControl( );
          this.input_Birth_Place = new UntypedFormControl( );
          this.input_BirthDate = new UntypedFormControl( );
          this.input_Kayd_Place =new UntypedFormControl( );
          this.input_Sex_ID = new UntypedFormControl( );
          this.input_Nationality_ID = new UntypedFormControl( );
          this.input_Area_ID = new UntypedFormControl( );
          this.input_MiniArea_ID = new UntypedFormControl( );
          this.input_StreetOrVillage_ID = new UntypedFormControl( );
          this.input_Accounter_ID = new UntypedFormControl( );
          this.input_Certificate_Name = new UntypedFormControl( );
          this.input_Specification_Name  = new UntypedFormControl( );
          this.input_JobName_Name = new UntypedFormControl( );
          this.input_class_Name  =new UntypedFormControl( );
          this.input_Salary  = new UntypedFormControl( );
          this.input_BeginDate   = new UntypedFormControl( );
          this.input_ChangeReason_Name    = new UntypedFormControl( );
          this.input_QararDate    = new UntypedFormControl( );
          this.input_Qarar_Num     = new UntypedFormControl( );
          this.input_Rem1    = new UntypedFormControl( );
          this.input_Rem2    = new UntypedFormControl( );
          this.input_Rem3    = new UntypedFormControl( );
          this.input_malakstate_name    = new UntypedFormControl( );
          this.input_PhoneNum     = new UntypedFormControl( );
          this.input_MartialState_ID      = new UntypedFormControl( );
          this.input_ManualAddress      = new UntypedFormControl( );
          this.input_City_ID      = new UntypedFormControl( );
          this.input_Emp_IN_Military_Service = new UntypedFormControl();       

          this.input_ID_Number = new UntypedFormControl();       


          
         }
      
           this.Form = this.fb.group({
             });
             
             this.Form .addControl('input_id',this.input_id);        
             this.Form .addControl('input_Accounter_ID',this.input_Accounter_ID);
             this.Form .addControl('input_Area_ID',this.input_Area_ID);                         
             this.Form .addControl('input_City_ID',this.input_City_ID);                 
             this.Form .addControl('input_MiniArea_ID',this.input_MiniArea_ID);    
             this.Form .addControl('input_Nationality_ID',this.input_Nationality_ID);                              
             this.Form .addControl('input_StreetOrVillage_ID',this.input_StreetOrVillage_ID);          
             this.Form .addControl('input_Birth_Place',this.input_Birth_Place);    
             this.Form .addControl('input_BirthDate',this.input_BirthDate);    
             this.Form .addControl('input_Computer_ID',this.input_Computer_ID);    
             this.Form .addControl('input_Father',this.input_Father);    
             this.Form .addControl('input_FName',this.input_FName);    
             this.Form .addControl('input_Global_ID',this.input_Global_ID);                  
             this.Form .addControl('input_Insurance_ID',this.input_Insurance_ID);    
             this.Form .addControl('input_Kayd_Place',this.input_Kayd_Place);    
             this.Form .addControl('input_LName',this.input_LName);    
             this.Form .addControl('input_ManualAddress',this.input_ManualAddress);    
             this.Form .addControl('input_MartialState_ID',this.input_MartialState_ID);    
             this.Form .addControl('input_Mother',this.input_Mother);    
             this.Form .addControl('input_PhoneNum',this.input_PhoneNum);    
             this.Form .addControl('input_QararDate',this.input_QararDate);    
             this.Form .addControl('input_Rem1',this.input_Rem1);    
             this.Form .addControl('input_Rem2',this.input_Rem2);    
             this.Form .addControl('input_Rem3',this.input_Rem3);    
             this.Form .addControl('input_Emp_IN_Military_Service',this.input_Emp_IN_Military_Service);  
             this.Form .addControl('input_ID_Number',this.input_ID_Number); 
             this.Form .addControl('input_Nationality_ID',this.input_Nationality_ID); 


             console.log("BuildForm end");
           }catch(Exception:any){
             console.log(Exception);
           }
        }
        
       ngOnInit(): void {
        this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
          this.darkTheme= res;
        })
       }
     
     
     
       
       //#region SetValue And GetValue Function
       public SetValue()
       {
         try{
     
     if (this.SelectedEmp &&  this.SelectedEmp .id>0)
     {
       
     this.Form.patchValue(
       {
         
         id:this.SelectedEmp.id,
         input_Computer_ID:this.SelectedEmp.Computer_ID,
         input_Insurance_ID:this.SelectedEmp.Insurance_ID,
         input_Kayd_Place:this.SelectedEmp.Kayd_Place,
         input_MiniArea_ID:this.SelectedEmp.MiniArea_ID,
         input_Area_ID:this.SelectedEmp.Area_ID,
         input_StreetOrVillage_ID:this.SelectedEmp.StreetOrVillage_ID,
         input_FName:this.SelectedEmp.FName,
         input_Father:this.SelectedEmp.Father,
         input_Mother:this.SelectedEmp.Mother,
         input_LName:this.SelectedEmp.LName,
         input_EMP_IN_MILITARY_SERVICE:this.SelectedEmp.Emp_IN_Military_Service,
         input_PhoneNum:this.SelectedEmp.PhoneNum,
         input_Qarar_Num:this.SelectedEmp.Qarar_Num,
         input_Rem1:this.SelectedEmp.Rem1,
         input_Rem2:this.SelectedEmp.Rem2,
         input_Rem3:this.SelectedEmp.Rem3,
         input_Sex_ID:this.SelectedEmp.Sex_ID,    
         input_Nationality_ID:this.SelectedEmp.Nationality_ID

       });
     }else
     {
      this.input_id.setValue(this.SelectedEmp.id>0?this.SelectedEmp.id:'');
      this.input_Payrol_ID.setValue(this.SelectedEmp.Payrol_ID.length  >0 ? this.SelectedEmp.Payrol_ID:'');
      this.input_Computer_ID.setValue( this.SelectedEmp.Computer_ID >0 ? this.SelectedEmp.Computer_ID : '');
      this.input_Global_ID.setValue( this.SelectedEmp.Global_ID.length >0 ? this.SelectedEmp.Global_ID : '');
      this.input_Insurance_ID.setValue( this.SelectedEmp.Insurance_ID >0 ? this.SelectedEmp.Insurance_ID : '');
      this.input_FName.setValue( this.SelectedEmp.FName );
      this.input_LName.setValue( this.SelectedEmp.LName );
      this.input_Father.setValue( this.SelectedEmp.Father );
      this.input_Mother.setValue( this.SelectedEmp.Mother );
      this.input_Birth_Place.setValue( this.SelectedEmp.Birth_Place );
      this.input_BirthDate .setValue( this.SelectedEmp.BirthDate );
      this.input_Kayd_Place .setValue( this.SelectedEmp.Kayd_Place );
      this.input_Sex_ID .setValue( this.SelectedEmp.Sex_Name );
      this.input_Nationality_ID .setValue( this.SelectedEmp.Nationality_Name );
      this.input_Area_ID .setValue( this.SelectedEmp.Area_Name );
      this.input_MiniArea_ID .setValue( this.SelectedEmp.MiniArea_Name );
      this.input_StreetOrVillage_ID .setValue( this.SelectedEmp.StreetOrVillage_Name );
      this.input_Accounter_ID .setValue(  this.SelectedEmp.Accounter_ID >0 ? this.SelectedEmp.Accounter_ID: '');       
      this.input_Rem1   .setValue(  this.SelectedEmp.Rem1);
      this.input_Rem2    .setValue(  this.SelectedEmp.Rem2);
      this.input_Rem3    .setValue(  this.SelectedEmp.Rem3);
      this.input_malakstate_name    .setValue(  this.SelectedEmp.MalakState_Name);
      this.input_PhoneNum     .setValue(  this.SelectedEmp.PhoneNum);
      this.input_MartialState_ID      .setValue(  this.SelectedEmp.MartialState_Name );
      this.input_ManualAddress      .setValue(  this.SelectedEmp.ManualAddress );
      this.input_City_ID      .setValue(  this.SelectedEmp.City_Name );



     }
     
     
     
       }catch(ex: any)
       {
         console.log(ex);
     
       }
       
       }
     
       public getValue()
       {
         try{
     
     if (this.SelectedEmp )
     {
      
       this.SelectedEmp.id = this.input_id.value;
         this.SelectedEmp.Sex_ID= this.input_Sex_ID.value;
         this.SelectedEmp.LName = this.input_LName.value;
         this.SelectedEmp.Father =this.input_FName.value;
         this.SelectedEmp.Mother = this.input_Mother.value;
         this.SelectedEmp.Nationality_ID = this.input_Nationality_ID.value;        
         this.SelectedEmp.Sex_ID = this.input_Sex_ID .value;
         this.SelectedEmp.MartialState_ID = this.input_MartialState_ID.value;
         
         
       }
       }catch(ex: any)
       {
     
       }
       
       }
     //#endregion
     
      
     
       //#region OnSelect Function
     
       public OnSelectSexChange(event: MatAutocompleteSelectedEvent) {
         if (event  && this.SelectedEmp )
           this.SelectedEmp.Sex_ID = event.option.value;  
       }
     
       public OnSelectAreaChange(event: MatAutocompleteSelectedEvent) {
         if (event  && this.SelectedEmp )
           this.SelectedEmp.Area_ID = event.option.value;  
       }
     
       public OnSelectMiniAreaChange(event: MatAutocompleteSelectedEvent) {
         if (event  && this.SelectedEmp )
           this.SelectedEmp.MiniArea_ID = event.option.value;  
       }
     
       public OnSelectStreetOrVillageChange(event: MatAutocompleteSelectedEvent) {
         if (event  && this.SelectedEmp )
           this.SelectedEmp.StreetOrVillage_ID = event.option.value;  
       }

       public OnSelectNationalityChange(event: MatAutocompleteSelectedEvent) {
        if (event  && this.SelectedEmp )
          this.SelectedEmp.Nationality_ID = event.option.value;  
      }

     
       public OnSelectMartialStateChange(event: MatAutocompleteSelectedEvent) {
         if (event  && this.SelectedEmp )
           this.SelectedEmp.MartialState_ID = event.option.value;  
       }


       //#region  Display Display Member
      public displayAreaProperty(value:string):string  {
        if (value && this.TBLShamelArea_List){     
          let area:any = this.TBLShamelArea_List.find(area => area.area_id.toString() == value) ;
          if (area )
          return area.Area_Name;
        }
        return '';
      }

      public displayMiniAreaProperty(value:string):string  {
        if (value && this.TBLShamelMiniArea_List){     
          
          let areaMini:any = this.TBLShamelMiniArea_List.find(area => area.MiniArea_ID.toString() == value) ;
          if (areaMini )
          return areaMini.Area_Name;
        }
        return '';
      }

      
      public displayStreetOrVillageProperty(value:string):string  {
        if (value && this.TBLShamelStreetOrVillage_List){     
          
          let StreetOrVillage:any = this.TBLShamelStreetOrVillage_List.find(street => street.StreetOrVillage_ID.toString() == value) ;
          if (StreetOrVillage )
          return StreetOrVillage.StreetOrVillage_Name;
        }
        return '';
      }

      public displaySexProperty(value:string):string  {
        if (value && this.TBLShamelSex_List){               
          let Sex_Name:any = this.TBLShamelSex_List.find(street => street.Sex_ID.toString() == value) ;
          if (Sex_Name )
          return Sex_Name.Sex_Name;
        }
        return '';
      }

      public displayMartialStateProperty(value:string):string  {
        if (value && this.TBLShamelMartialState_List){  
          console.log(value);             
          console.log(this.TBLShamelMartialState_List);             
          let MartialState:any = this.TBLShamelMartialState_List.find(street => street.MartialState_ID.toString() == value) ;
          if (MartialState )
          return MartialState.MartialState_Name;
        }
        return '';
      }

      public displayNationalityProperty(value:string):string  {
        if (value && this.TBLShamelNationality_List){               
          let Nationlity:any = this.TBLShamelNationality_List.find(street => street.Nationality_ID.toString() == value) ;
          if (Nationlity )
          return Nationlity.Nationality_Name;
        }
        return '';
      }
      
      

      addQararDateEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        let  changedate: Moment = this.  input_QararDate.value;
        this.SelectedEmp. QararDate = moment(event.value).toDate();
      }
      
      Save()
      {

       

   
        console.log("this.Form.invalid"+this.Form.errors);
    
   
        this.getValue();
    
        if (this.SelectedEmp  &&
          this.SelectedEmp.id<=0)
          {
    


      }
       else if (this.SelectedEmp  &&
        this.SelectedEmp.id>0)
                 {
    
      }


      }

      onReset()
      {
        
        this.Form.reset();
      }

}
