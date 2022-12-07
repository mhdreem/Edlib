import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessControlDirective } from './directives/accesscontroldirective';
import { OnReturnDirective } from './directives/OnReturnDirective';



@NgModule({
  declarations: [
    AccessControlDirective,
    OnReturnDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[AccessControlDirective,OnReturnDirective]
})
export class CommonmoduleModule { }
