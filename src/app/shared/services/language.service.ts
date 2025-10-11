import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface LanguageOption {
    code: string;
    label: string;
}

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    public dir: string = 'ltr';
    private renderer: Renderer2;

    private supportedLanguages: LanguageOption[] = [
        { code: 'en', label: 'English' },
        { code: 'he', label: 'עברית' }
    ];

    private langMap: { [key: string]: string } = {
        'en': 'EN',
        'he': 'עב'
    };
    

    constructor(
        private translate: TranslateService,
        rendererFactory: RendererFactory2,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    // Observable to notify components about language changes
    private langSubject = new BehaviorSubject<string>('en');
    public language$ = this.langSubject.asObservable();

    // Observable that indicates whether language switching is available on this platform
    private canChangeLangSubject = new BehaviorSubject<boolean>(true);
    public canChangeLanguage$ = this.canChangeLangSubject.asObservable();

    initLanguage(): void {
        // Detect whether localStorage is available (works in browser and not in some privacy modes)
        let storageAvailable = false;
        if (isPlatformBrowser(this.platformId)) {
            try {
                localStorage.setItem('__ls_test', '1');
                localStorage.removeItem('__ls_test');
                storageAvailable = true;
            } catch (e) {
                storageAvailable = false;
            }
        }

        if (!storageAvailable) {
            // fallback to English and disable language switching UI
            this.canChangeLangSubject.next(false);
            this.setLanguage('en');
            return;
        }

        // language switching available
        this.canChangeLangSubject.next(true);

        let langToUse = 'en';
        const savedLang = localStorage.getItem('lang');
        const browserLang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.split('-')[0] : undefined;
        if (savedLang) {
            langToUse = savedLang;
        } else if (browserLang && this.isSupported(browserLang)) {
            langToUse = browserLang;
        }

        this.setLanguage(langToUse);
    }

    setLanguage(langCode: string): void {
        // Wait for translations to load before notifying subscribers so UI reflects new labels immediately
        const use$ = this.translate.use(langCode);
        // translate.use may return a string or an Observable
        if (use$ && typeof (use$ as any).subscribe === 'function') {
            (use$ as any).subscribe({
                next: () => this.applyLangChange(langCode),
                error: () => this.applyLangChange(langCode)
            });
        } else {
            // fallback if translate.use is synchronous
            this.applyLangChange(langCode);
        }
    }

    private applyLangChange(langCode: string) {
        // emit language change for subscribers
        try {
            this.langSubject.next(langCode);
        } catch {}

        if (isPlatformBrowser(this.platformId)) {
            try {
                localStorage.setItem('lang', langCode);
            } catch (e) {
                // ignore storage errors in restricted environments
            }

            this.dir = langCode === 'he' ? 'rtl' : 'ltr';
            this.renderer.addClass(document.body, this.dir);
            this.renderer.setAttribute(document.body, 'lang', langCode);
        } else {
            // fallback values for server rendering
            this.dir = langCode === 'he' ? 'rtl' : 'ltr';
        }
    }

    getCurrentLang(): string {
        const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
        if(this.langMap[lang]) {
            return this.langMap[lang];
        }
        return lang;
    }

    /**
     * Return display label for a language code. If no code provided, uses current TranslateService lang.
     */
    getDisplayLang(code?: string): string {
        const lang = code || this.translate.currentLang || this.translate.defaultLang || 'en';
        return this.langMap[lang] || lang;
    }

    getLanguages(): LanguageOption[] {
        return this.supportedLanguages;
    }

    private isSupported(code?: string): boolean {
        if (!code) return false;
        return this.supportedLanguages.some(lang => lang.code === code);
    }
}
