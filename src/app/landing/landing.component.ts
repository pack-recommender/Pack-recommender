import { AfterViewInit, Component } from '@angular/core';
import { LanguageService } from '../shared/services/language.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
declare const AOS: any;

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements AfterViewInit {
  constructor(public langService: LanguageService) {

  }
  ngAfterViewInit(): void {
    AOS.init({ duration: 800 });

    const header = document.querySelector('.navbar') as HTMLElement;
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      if (scrollPos >= headerHeight) {
        header.classList.add('scrolled', 'shadow-sm');
      } else {
        header.classList.remove('scrolled', 'shadow-sm');
      }
    });
  }
}
