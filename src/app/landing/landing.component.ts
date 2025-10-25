import { AfterViewInit, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { SeoService } from '../shared/services/seo.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser, DOCUMENT as NG_DOCUMENT } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
declare const AOS: any;
declare var bootstrap: any; // Add this if not already declared

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,   
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit, AfterViewInit {
  contactForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  // current document direction (set from server-rendered <html> dir)
  dir: string = 'ltr';
  // compatibility shim for templates expecting langService.dir
  get langService(): { dir: string } {
    return { dir: this.dir };
  }
  constructor(
    
    private fb: FormBuilder,
    private http: HttpClient,
    private title: Title,
    private meta: Meta,
    private seo: SeoService
    , private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(NG_DOCUMENT) private document: Document
  ) {

  }

  ngOnInit(): void {
    // SEO: set static title and description for prerender/SSR
    const url = 'https://packrecommender.com/';
    // set base SEO; language-specific values added below
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
    // Per-locale SEO: detect current document language (set on server via APP_INITIALIZER)
    const lang = (this.document && this.document.documentElement && this.document.documentElement.lang) ? this.document.documentElement.lang : 'en';
    const path = this.route.snapshot.routeConfig?.path ? '/' + this.route.snapshot.routeConfig?.path : '';
    const localizedUrl = `https://packrecommender.com${lang === 'he' ? '/he' : ''}${path}`;
    const data = this.route.snapshot.data as any;
    if (data && (data.title || data.description)) {
      this.seo.updateMeta({
        title: data.title || 'PackRecommender',
        description: data.description || '' ,
        url: localizedUrl
      });
    } else {
      // update canonical/localized url and hreflangs
      this.seo.setHreflangs([
        { href: `https://packrecommender.com${path}`, hreflang: 'en' },
        { href: `https://packrecommender.com/he${path}`, hreflang: 'he' }
      ]);
      this.seo.setCanonical(localizedUrl);
    }

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['']
    });
    // set component dir for templates (read from server-rendered html lang/dir)
    try {
      const htmlDir = (this.document && this.document.documentElement && this.document.documentElement.dir) ? this.document.documentElement.dir : 'ltr';
      (this as any).dir = htmlDir;
    } catch {}
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // dynamically load AOS from CDN to avoid bundling it in main.js
      try {
        const loadAOS = () => {
          try {
            if (typeof window !== 'undefined' && !(window as any).AOS) {
              const scriptId = 'aos-cdn';
              if (!document.getElementById(scriptId)) {
                const s = document.createElement('script');
                s.id = scriptId;
                s.src = 'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js';
                s.async = true;
                s.onload = () => { try { (window as any).AOS.init({ duration: 800 }); } catch {} };
                document.head.appendChild(s);
              } else {
                const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
                if (existing) {
                  existing.addEventListener('load', () => { try { (window as any).AOS.init({ duration: 800 }); } catch {} }, { once: true });
                }
              }
            } else {
              try { (window as any).AOS.init({ duration: 800 }); } catch {}
            }
          } catch {}
        };
        loadAOS();
      } catch {}

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

      // ensure critical JS is executed early and defer image background loading
      // add modulepreload for main script if available
      try {
        const scripts = Array.from(document.querySelectorAll('script'));
        // nothing to do here in runtime; critical script loading is handled by build preloads
      } catch {}

      // Lazy-init backgrounds after main script executed
      const initLazyMedia = () => {
        try {
          const bgEls = Array.from(document.querySelectorAll('[data-bg]')) as HTMLElement[];
          bgEls.forEach((el) => {
            const src = el.getAttribute('data-bg');
            if (src) {
              if (el.tagName.toLowerCase() === 'img') {
                (el as HTMLImageElement).src = src;
              } else {
                el.style.backgroundImage = `url(${src})`;
              }
            }
          });
          // lazy logos and hero picture sources
          const lazyLogos = Array.from(document.querySelectorAll('img.lazy-logo')) as HTMLImageElement[];
          lazyLogos.forEach(img => { const s = img.getAttribute('data-src'); if (s) img.src = s; });
          const lazyHeroImgs = Array.from(document.querySelectorAll('img.lazy-hero')) as HTMLImageElement[];
          lazyHeroImgs.forEach(img => { const s = img.getAttribute('data-src'); if (s) img.src = s; });
          // picture sources
          const pictureSources = Array.from(document.querySelectorAll('picture source')) as HTMLSourceElement[];
          pictureSources.forEach(srcEl => {
            const s = srcEl.getAttribute('data-srcset');
            if (s) srcEl.setAttribute('srcset', s);
          });
        } catch {}
      };
      // Prefer to initialize lazy media after the main module script has loaded so LCP waits for main
      try {
        const moduleScripts = Array.from(document.querySelectorAll('script[type="module"]'));
        const mainModule = moduleScripts.find(s => (s.getAttribute('src') || '').includes('main-')) as HTMLScriptElement | undefined;
        if (mainModule) {
          // if already loaded
          if ((mainModule as any).readyState === 'complete') {
            initLazyMedia();
          } else {
            mainModule.addEventListener('load', () => initLazyMedia(), { once: true });
            // fallback in case load doesn't fire
            setTimeout(initLazyMedia, 2000);
          }
        } else {
          // no module script found — fallback to short delay
          setTimeout(initLazyMedia, 50);
        }
      } catch (e) {
        setTimeout(initLazyMedia, 50);
      }
    }
  }


  sendMessage(): void {
    if (this.contactForm.invalid) return;

    this.http.post('/.netlify/functions/send-email', this.contactForm.value).subscribe({
      next: () => {
        this.successMessage = 'Message sent successfully!';
        this.errorMessage = '';
        this.contactForm.reset();
      },
      error: () => {
        this.successMessage = '';
        this.errorMessage = 'There was an error sending your message.';
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
