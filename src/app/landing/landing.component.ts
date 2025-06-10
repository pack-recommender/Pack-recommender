import { AfterViewInit, Component } from '@angular/core';
declare const AOS: any;

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements AfterViewInit {
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
