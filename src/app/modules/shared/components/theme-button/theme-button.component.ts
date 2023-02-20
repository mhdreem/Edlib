import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-button',
  templateUrl: './theme-button.component.html',
  styleUrls: ['./theme-button.component.scss']
})
export class ThemeButtonComponent implements OnInit {

  darkTheme: boolean= false;
  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    if("akramAlshamelTheme" in localStorage) {
      this.darkTheme = JSON.parse(localStorage.getItem("akramAlshamelTheme")!);
      this.themeService.darkTheme_BehaviorSubject.next(this.darkTheme);
      if(this.darkTheme == true)
        ((document.getElementsByClassName('theme__toggle')[0]) as HTMLElement).setAttribute("checked", "true");
    }
  }

  onToggleClick(){
    this.darkTheme= !this.darkTheme;
    // console.log('lightTheme', this.darkTheme);
    this.themeService.darkTheme_BehaviorSubject.next(this.darkTheme);

    localStorage.setItem("akramAlshamelTheme" , JSON.stringify(this.darkTheme))

  }
}
