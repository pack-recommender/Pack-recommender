import { AfterViewInit, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../shared/services/seo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../shared/services/language.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
declare const AOS: any;
declare var bootstrap: any; // Add this if not already declared

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit, AfterViewInit {
  contactForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  constructor(
    public langService: LanguageService,
    private fb: FormBuilder,
    private http: HttpClient,
    private translate: TranslateService,
    private title: Title,
    private meta: Meta,
    private seo: SeoService
    , private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  ngOnInit(): void {
    // SEO: set static title and description for prerender/SSR
    const url = 'https://packrecommender.com/';
    this.seo.updateMeta({
      title: 'PackRecommender — Find the best packs',
      description: 'PackRecommender helps you discover and compare packages to find the right fit.',
      url,
      image: 'https://packrecommender.com/assets/img/logo.png'
    });
    this.seo.addJsonLD({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "PackRecommender",
      "url": url,
      "logo": "https://packrecommender.com/assets/img/logo.png"
    });

    // set per-route meta if provided in route data
    const data = this.route.snapshot.data as any;
    if (data && (data.title || data.description)) {
      this.seo.updateMeta({
        title: data.title || 'PackRecommender',
        description: data.description || '' ,
        url: `https://packrecommender.com${this.route.snapshot.routeConfig?.path ? '/' + this.route.snapshot.routeConfig?.path : ''}`
      });
    }

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['']
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // lazy-load AOS by injecting the UMD bundle at runtime to avoid bundling its CJS deps
      try { AOS.init({ duration: 800 }); } catch {}

      const header = document.querySelector('.navbar') as HTMLElement;
      const headerHeight = header ? header.offsetHeight : 0;

      window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        if (header) {
          if (scrollPos >= headerHeight) {
            header.classList.add('scrolled', 'shadow-sm');
          } else {
            header.classList.remove('scrolled', 'shadow-sm');
          }
        }
      });
    }
  }


  sendMessage(): void {
    if (this.contactForm.invalid) return;

    this.http.post('/.netlify/functions/send-email', this.contactForm.value).subscribe({
      next: () => {
        this.successMessage = this.translate.instant('contact.success');
        this.errorMessage = '';
        this.contactForm.reset();
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = this.translate.instant('contact.error');
      }
    });
  }

    closeNavbar() {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    if (navbarCollapse) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  }
}
