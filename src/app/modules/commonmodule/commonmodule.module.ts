import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlDirective } from './directives/accesscontroldirective';



@NgModule({
  declarations: [
    AccessControlDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[AccessControlDirective]
})
export class CommonmoduleModule { }
