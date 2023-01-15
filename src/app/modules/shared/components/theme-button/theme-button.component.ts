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
  }

  onToggleClick(){
    this.darkTheme= !this.darkTheme;
    console.log('lightTheme', this.darkTheme);
    this.themeService.darkTheme_BehaviorSubject.next(this.darkTheme);
  }
}
