import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
@Directive({
    selector: '[onReturn]'
})
export class OnReturnDirective {    
    private el: ElementRef;   
    @Input() onReturn: string;
    constructor(private _el: ElementRef,public renderer: Renderer2) {
        this.el = this._el;
    }  
    @HostListener('keydown', ['$event']) onKeyDown(e:any) {
        if ((e.which == 13 || e.keyCode == 13)) {
            e.preventDefault();
            if (e.srcElement.nextElementSibling) {
                e.srcElement.nextElementSibling.focus();
            }
            else{
                console.log('close keyboard');
            }
            return;
                
        }
    } 
}