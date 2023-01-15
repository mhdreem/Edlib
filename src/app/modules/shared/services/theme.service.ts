import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public darkTheme:boolean = false;

  public darkTheme_BehaviorSubject:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  constructor() { }
}
