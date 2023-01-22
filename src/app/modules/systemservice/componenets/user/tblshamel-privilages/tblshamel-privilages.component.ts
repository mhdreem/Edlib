
import { MatRadioButton, MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource, MatTreeNode} from '@angular/material/tree';

import { BreakpointObserver } from '@angular/cdk/layout';
import { TBLShamelPrivilages } from 'src/app/modules/shared/models/employees_department/TBLShamelPrivilages';
import { TBLShamelUser } from 'src/app/modules/shared/models/employees_department/TBLShamelUser';
import { TBLShamelPrivilageServiceService } from 'src/app/modules/shared/services/employees_department/tblshamel-privilage-service.service';
import { TBLShamelUserService } from 'src/app/modules/shared/services/employees_department/tblshamel-user.service';
import { SubscriptionLike } from 'subsink/dist/subsink';
import { TBLShamelProgramTreeService } from 'src/app/modules/shared/services/systemservice/tblshamel-program-tree.service';
import { TBLShamelProgramTree } from 'src/app/modules/shared/models/systemservice/TBLShamelProgramTree';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from 'src/app/modules/shared/services/theme.service';





@Component({
  selector: 'app-tblshamel-privilages',
  templateUrl: './tblshamel-privilages.component.html',
  styleUrls: ['./tblshamel-privilages.component.scss']
})
export class TBLShamelPrivilagesComponent implements OnInit {
  formname1:string = 'صلاحيات الدخول';
  @ViewChildren(MatTreeNode, { read: ElementRef }) treeNodes: ElementRef[];




  

  Form:FormGroup;
  user_id : FormControl<number|undefined>;
  daera_name : FormControl<string|undefined>;
  formname: FormControl<string|undefined>;
  nodetext: FormControl<string|undefined>;
  privilage:FormControl<string|undefined>;    
  privilageInput:FormControl<boolean|null>; 
  privilageUpdate:FormControl<boolean|null>; 
  privilageDisplay:FormControl<boolean|null>; 
  privilagePrint:FormControl<boolean|null>; 
  privilageDelete:FormControl<boolean|null>; 
  privilageEntry:FormControl<boolean|null>; 
  FormType:FormControl<number|null>; 


  PrivilageTreeControl = new NestedTreeControl<TBLShamelProgramTree>(node => node.tBLShamelProgramTrees_Children);


  dataSource = new MatTreeNestedDataSource<TBLShamelProgramTree>();

  hasChild = (_: number, node: TBLShamelProgramTree) => !!node.tBLShamelProgramTrees_Children && node.tBLShamelProgramTrees_Children.length > 0;


  User_List :TBLShamelUser[]=[];
  filteredUserOptions: Observable<TBLShamelUser[]>;  
  Selected_User : TBLShamelUser;
  Selected_TBLShamelProgramTree : TBLShamelProgramTree;


  Selected_User_Form_Privilage:TBLShamelPrivilages;

  Subscription:Subscription = new Subscription ();

  darkTheme: boolean;

  constructor(
    public UserService:TBLShamelUserService,
    public PrivilageService:TBLShamelPrivilageServiceService, 
    public ShamelProgramTreeService:TBLShamelProgramTreeService, 
     private fb: FormBuilder,
     private snackBar: MatSnackBar,
     private themeService: ThemeService) {
   
    this.BuildForm();
    this.LoadData();  
   }

   ngOnInit(): void {
    this.themeService.darkTheme_BehaviorSubject.subscribe(res =>{
      this.darkTheme= res;
    })
  }


   
   public BuildForm()
   {
     try{  
      this.Form = this.fb.group({
        'user_id':this.user_id = new FormControl<number | null>(null),
        'daera_name':this.daera_name= new FormControl<string | null>(null),
        'formname':this.daera_name= new FormControl<string | null>(null),
        'nodetext':this.daera_name= new FormControl<string | null>(null),
        'privilage':this.daera_name= new FormControl<string | null>(null),
        'privilageInput': this.privilageInput =new FormControl<boolean | null>(null),
        'privilageUpdate': this.privilageUpdate= new FormControl<boolean | null>(null),
        'privilageDisplay':this.privilageDisplay= new FormControl<boolean | null>(null),
        'privilagePrint':  this.privilagePrint= new FormControl<boolean | null>(null),
        'privilageDelete': this.privilageDelete= new FormControl<boolean | null>(null),
        'privilageEntry' : this.privilageEntry= new FormControl<boolean | null>(null),
        'FormType':this.FormType= new FormControl<number| null>(null),

      });
      
      }catch(Exception:any){
        console.log(Exception);
      }
   }
   

   LoadFormName() :  Observable<TBLShamelProgramTree[]>
   {
    if (this.ShamelProgramTreeService.List_TBLShamelProgramTree != null &&
      this.ShamelProgramTreeService.List_TBLShamelProgramTree.length>0)
      return of (this.ShamelProgramTreeService.List_TBLShamelProgramTree);
      return this.ShamelProgramTreeService.BuildTree();
   }



   LoadUser() : Observable<TBLShamelUser[]> 
   {
    if (this.UserService.Users_List != null &&
      this.UserService.Users_List.length>0)
      return of (this.UserService.Users_List);
      return this.UserService.list();
   }


  LoadData()
  {
    this.Subscription.add(    
    forkJoin(
      [this.LoadUser(),
      this.LoadFormName()]      
    ).subscribe
    (
      res=>
      {
        if (res!= null && res.length>0 )
        {
          this.User_List=res[0];
          this.UserService.Users_List =   res[0];
          this.UserService.Users_List_BehavourSubject.next(this.User_List);

          //after FillData
          this.filteredUserOptions = this.user_id.valueChanges
          .pipe(
            startWith(''),        
            map(value => value   && typeof value === 'string'  ? this._filteredUser(value) : this.User_List.slice() )
          );  

          this.dataSource.data = res[1];
          this.ShamelProgramTreeService.List_TBLShamelProgramTree= res[1];
          this.ShamelProgramTreeService.List_TBLShamelProgramTree_BehaviorSubject.next(res[1])  ;

        }
      }
    )
    );
  }

  ////////////////////////
  ////// For AutoComplete
  ////////////////////////


  public displayUSerProperty(value:string):string  {

    if (value!= null && this.User_List!= null && this.User_List.length>0){
     
      let User:TBLShamelUser = this.User_List.find(obj => obj.user_id.toString() == value) ;
      if (User!= null && User.fullname != null && User.user_id!= null)
        return User.fullname;
    }
    return '';

  }  

  public OnSelectUserChange(event: MatAutocompleteSelectedEvent) {
   
    if ( event != null   )
    {    
      let Id:Number= event.option.value as Number;

      var Result = this.User_List.find(x => x.user_id === Id);
      if (Result!= null && Result.user_id!= null &&  Result.user_id>-1)
      {
          this.Selected_User = Result;
          this.daera_name.setValue(this.Selected_User.TBLShamelDaera.daera_name);          
      }      
    }
      
  }


  
  
 
  private _filteredUser(value: string): TBLShamelUser[] {   
    if (value!= null )
    {
      const filterValue = value ;
      return this.User_List.filter(obj => obj.fullname.includes(filterValue) );
    }
    return this.User_List.slice();
  }


  /////////////////////////////////
  /////
  //////////////////////////////////

  
  public DisplayPrivilage()
  {
      try{

         
          const usingArrayFrom = Array.from(this.Selected_User_Form_Privilage.privilage);
          if (usingArrayFrom && usingArrayFrom .length>0)
          {
            if (this.Selected_TBLShamelProgramTree && this.Selected_TBLShamelProgramTree.formtype ==1)
            {
              let Result :boolean = false;

              Result=(usingArrayFrom[2] == '1')?true : false ;              
              this.privilageEntry.setValue(Result);

            } else if (this.Selected_TBLShamelProgramTree && this.Selected_TBLShamelProgramTree.formtype ==2)
            {
              usingArrayFrom.forEach((currentValue, index) => {

                let Result :boolean = false ;
                Result = (currentValue=='0')?false : true ;

                switch(index)
                {
                  case 0:
                    this.privilageInput.setValue(Result);
                    break;
                  case 1:
                    this.privilageUpdate.setValue(Result);
                    break;
                  case 2:
                    this.privilageDisplay.setValue(Result);
                    break;
                  case 3:
                    this.privilagePrint.setValue(Result);
                    break;
                  case 4:
                    this.privilageDelete.setValue(Result);
                    break;
                 
                }
  
                
              });
            }
          
            
             
          }            
      }
      catch(ex)
      {

      }

     
  

 
  }

  public GetInputPrivilage(index:number):boolean
  {
      try{
          console.log('dsdsds');
          console.log(this.Selected_User_Form_Privilage. privilage);
          console.log('dsdsds');
          const usingArrayFrom = Array.from(this.Selected_User_Form_Privilage.privilage);
          if (usingArrayFrom && usingArrayFrom .length>0)
          {

              let result :string ="";
              result  = usingArrayFrom[index];

              return  Boolean(JSON.parse(result));
          }            
      }
      catch(ex)
      {

      }

      return false;
  
 
  }

  


  public GetPrivilageFromServer()
  {
    console.log("GetPrivilage");



    if (this.Selected_User && 
      this.Selected_User.user_id>-1 &&
      this.Selected_TBLShamelProgramTree!= null &&
       this.Selected_TBLShamelProgramTree.formname!= null)
    {
        this.PrivilageService.GetByUserAndForm(this.Selected_User .user_id,this.Selected_TBLShamelProgramTree.formname).subscribe(res =>
          {           
            this.Selected_User_Form_Privilage = res as TBLShamelPrivilages;        
            if (this.Selected_User_Form_Privilage != null && 
              this.Selected_User_Form_Privilage.privilage!= null)
              {
                this.DisplayPrivilage();                
              }
          }
          );
    }
    
  }
 




  ClickNode(node:TBLShamelProgramTree){

   this.privilageDelete.setValue(false);
   this.privilageDisplay.setValue(false);
   this.privilageEntry.setValue(false);
   this.privilageInput.setValue(false);
   this.privilageInput.setValue(false);
   this.privilageUpdate.setValue(false);

    this.Selected_TBLShamelProgramTree =node;
    


  if (this.Selected_User && this.Selected_User.user_id >-1)
  {
   
    this.GetPrivilageFromServer();
  
  }
    

    
    
  }


  

  public Save ()
  {
    if (this.Selected_User== null ||
      this.Selected_User== undefined ||
      this.Selected_User.user_id == null 
      )
      {
        this.snackBar.open('تم التعديل بنجاحيجب اختيار اسم المستخدم', '', {
          duration: 3000,
        });
        return;
      }

      if (this.Selected_TBLShamelProgramTree== null ||
        this.Selected_TBLShamelProgramTree== undefined ||
        this.Selected_TBLShamelProgramTree.formname == null 
        )
        {
          this.snackBar.open('يجب اختيار اسم الواجهه', '', {
            duration: 3000,
          });
          //اظهار رسالة خطا
          return;
        }

    if (this.Selected_User_Form_Privilage == null ||
      this.Selected_User_Form_Privilage == undefined

      )
      {
        this.Selected_User_Form_Privilage= {};
      }

      this.Selected_User_Form_Privilage.user_id = this.Selected_User.user_id;
      this.Selected_User_Form_Privilage.formname = this.Selected_TBLShamelProgramTree.formname;


    let strPrivilage:string  ='';
console.log(this.Selected_TBLShamelProgramTree);
     if (this.Selected_TBLShamelProgramTree &&
        this.Selected_TBLShamelProgramTree.formtype==1)
        {
         
          if (this.privilageEntry.value == true)

          strPrivilage = '00100';
        else 
        strPrivilage = '00000';
        }else if (this.Selected_TBLShamelProgramTree!=null &&
          this.Selected_TBLShamelProgramTree.formtype==2)
          {
            console.log(this.privilageInput.value);
            if (this.privilageInput.value == true)
              strPrivilage = strPrivilage +'1';
            else 
              strPrivilage = strPrivilage +'0';
    
    
              console.log(this.privilageUpdate.value);
    
              if (this.privilageUpdate.value == true)
              strPrivilage = strPrivilage +'1';
            else 
              strPrivilage = strPrivilage +'0';
              
              console.log(this.privilageDisplay.value);
    
              if (this.privilageDisplay.value == true)
              strPrivilage = strPrivilage +'1';
            else 
              strPrivilage = strPrivilage +'0';
    
              console.log(this.privilagePrint.value);
    
              if (this.privilagePrint.value == true)
              strPrivilage = strPrivilage +'1';
            else 
              strPrivilage = strPrivilage +'0';
    
    
              console.log(this.privilageDelete.value);
    
    
              if (this.privilageDelete.value == true)
              strPrivilage = strPrivilage +'1';
            else 
              strPrivilage = strPrivilage +'0';
    
    
              console.log(strPrivilage);
    
          }

        

        this.Selected_User_Form_Privilage.formname = this.Selected_TBLShamelProgramTree.formname;
        this.Selected_User_Form_Privilage.user_id = this.Selected_User.user_id;
        this.Selected_User_Form_Privilage.privilage  = strPrivilage;

        console.log(this.Selected_User_Form_Privilage);

        this.PrivilageService.InsertIfNew(this.Selected_User_Form_Privilage).subscribe
        (res => 
          {
            if (res!= null && res>0)
            {
              console.log('inside syn');
              console.log(res);
              this.snackBar.open('تم الحفظ بنجاح', '', {
                duration: 3000,
              });
            }


          }
          

          );
        console.log('end update');
          



  }

  
  setAll(completed: boolean) {
    
    
    
  }


}
