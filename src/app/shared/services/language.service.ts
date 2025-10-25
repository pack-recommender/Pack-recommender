import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
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
        rendererFactory: RendererFactory2,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document
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
        // determine language preferring the first path segment (e.g. /he/...),
        // then fall back to the document lang (set by server prerender), then 'en'
        try {
            let langToUse: string | undefined;
            if (isPlatformBrowser(this.platformId) && typeof location !== 'undefined' && location.pathname) {
                const seg = location.pathname.replace(/^\/+|\/+$/g, '').split('/')[0];
                if (this.isSupported(seg)) {
                    langToUse = seg;
                }
            }
            if (!langToUse) {
                const urlLang = (this.document && this.document.documentElement && this.document.documentElement.lang) ? this.document.documentElement.lang : undefined;
                if (this.isSupported(urlLang)) langToUse = urlLang as string;
            }
            if (!langToUse) langToUse = 'en';
            this.canChangeLangSubject.next(true);
            this.applyLangChange(langToUse);
        } catch {
            this.applyLangChange('en');
        }
    }

    // Runtime switching is no longer required when using AOT per-locale builds.
    setLanguage(langCode: string): void {
        this.applyLangChange(langCode);
    }

    private applyLangChange(langCode: string) {
        // emit language change for subscribers
        try {
            this.langSubject.next(langCode);
        } catch {}

        if (isPlatformBrowser(this.platformId)) {
            this.dir = langCode === 'he' ? 'rtl' : 'ltr';
            // use injected document reference instead of global
            try {
                this.renderer.addClass(this.document.body, this.dir);
                this.renderer.setAttribute(this.document.body, 'lang', langCode);
            } catch {}
        } else {
            // server rendering: documentElement lang/dir is set in APP_INITIALIZER
            this.dir = langCode === 'he' ? 'rtl' : 'ltr';
        }
    }

    getCurrentLang(): string {
        const lang = (this.document && this.document.documentElement && this.document.documentElement.lang) ? this.document.documentElement.lang : 'en';
        if(this.langMap[lang]) {
            return this.langMap[lang];
        }
        return lang;
    }

    /**
     * Return display label for a language code. If no code provided, uses current TranslateService lang.
     */
    getDisplayLang(code?: string): string {
        // Prefer explicit code, fallback to document lang or 'en'
        const lang = code || ((this.document && this.document.documentElement && this.document.documentElement.lang) ? this.document.documentElement.lang : 'en');
        return this.langMap[lang] || lang;
    }

    getLanguages(): LanguageOption[] {
        return this.supportedLanguages;
    }

    /**
     * Return the current language code (e.g. 'en' or 'he').
     */
    getLangCode(): string {
        const lang = (this.document && this.document.documentElement && this.document.documentElement.lang) ? this.document.documentElement.lang : 'en';
        return this.isSupported(lang) ? lang : 'en';
    }

    private isSupported(code?: string): boolean {
        if (!code) return false;
        return this.supportedLanguages.some(lang => lang.code === code);
    }
}
