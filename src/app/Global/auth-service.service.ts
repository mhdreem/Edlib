import { Injectable } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { TBLShamelUserService } from '../modules/shared/services/employees_department/tblshamel-user.service';

@Injectable({ 
  providedIn: 'root' 
})


export class AuthServiceService {
  constructor(public jwtHelper: JwtHelperService,
    private userService:TBLShamelUserService) {}  // ...

  public isAuthenticated(): boolean { 

    if (this.userService!= null &&
      (this.userService.Login_User== null || 
       this.userService.Login_User.user_id == null 
      )
      )
      return false;


      if (localStorage.getItem('User')== null )        
        return false;

      
    let token:string ;
  
     token = localStorage.getItem('token') || '';    // Check whether the token is expired and return
    
    
    return !this.jwtHelper.isTokenExpired(token);
  }
}
