import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewContainerRef
  } from '@angular/core';
import { TBLShamelUser } from '../../shared/models/employees_department/TBLShamelUser';
import { TBLShamelUserService } from '../../shared/services/employees_department/tblshamel-user.service';
  
  @Directive({ selector: '[accessControl]' })
  export class AccessControlDirective  implements OnInit {

    _SelectedUser:TBLShamelUser;
    _FormName:string;
    _CheckedPrivilige :string;
    

    @Input('SelectedUser') set SelectedUser(obj:TBLShamelUser){
        this._SelectedUser = obj;
    }
    get SelectedUser():TBLShamelUser{return this._SelectedUser}

    @Input('FormName') set FormName(formname:string)
    {    this._FormName = formname;  }
    get FormName():string{return this._FormName}


    @Input('CheckedPrivilige') set CheckedPrivilige(privilige:string)
    {        this. _CheckedPrivilige = privilige;    } 
    get CheckedPrivilige():string{return this._CheckedPrivilige}

    condition: boolean;

    constructor(
      private elementRef: ElementRef,
      private userService: TBLShamelUserService,  
      private renderer: Renderer2    
    ) {
      this.load_User();
    }

    load_User()
    {
      if (this.userService.Login_User != null &&
        this.userService.Login_User.user_id!= null &&
        this.userService.Login_User.user_id>=-1)
        {
          this.SelectedUser = this.userService .Login_User;
          return;
        }

      
          var token = localStorage.getItem('token');
          var User =  localStorage.getItem('User') as TBLShamelUser;  
          if (User!= null &&
              User.user_id!= null &&
              User.user_id>-1)
          {
            this.userService .Login_User = User;
            this.userService .Login_User_BehavourSubject.next(User);
            this.SelectedUser = this.userService .Login_User;
          }        
        
    }
  
  check() :boolean
  {
    if (this.FormName!= null &&
        this.FormName.length>0 &&
        this.CheckedPrivilige!= null &&
        this.CheckedPrivilige.length>0 &&
        this.SelectedUser!= null &&
        this.SelectedUser.TBLShamelPrivilages != null &&
        this.SelectedUser.TBLShamelPrivilages .length >0 )
    {
      if (this.SelectedUser.enabled == 0)
      return false;
      

        var Priviliges = this.SelectedUser.TBLShamelPrivilages.filter(x=>x.formname==this.FormName);
        if (Priviliges!= null && Priviliges.length > 0 )
        {
            var User_Privilige_Granted =Priviliges[0];
            var Forbidden = false;
            if (User_Privilige_Granted.privilage!= null )
            {
                User_Privilige_Granted.privilage.padEnd(5,'0');
                this.CheckedPrivilige.padEnd(5,'0');
                for(var i=0;i<5;i++)
                {
                    if ( this.CheckedPrivilige[i] ==  '1'  && 
                         User_Privilige_Granted.privilage[i]=='0')
                    {
                        Forbidden = true;
                    }
                }
            }
        
            var Result = !(Forbidden);
       
            return Result;

                   
           
        }

    }else 
    {
        return  true;
    }
    return  true;
  }
  
  
    ngOnInit() {
        this.elementRef.nativeElement.style.display = "none";       
        this.elementRef.nativeElement.style.display = this.check()==true ? "inline-block" : "none";
          
    }
  
  }