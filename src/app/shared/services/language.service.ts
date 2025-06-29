import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
        rendererFactory: RendererFactory2
    ) {
        this.renderer = rendererFactory.createRenderer(null, null);
    }

    initLanguage(): void {
        const savedLang = localStorage.getItem('lang');
        const browserLang = navigator.language.split('-')[0];
        const langToUse = savedLang || (this.isSupported(browserLang) ? browserLang : 'en');
        this.setLanguage(langToUse);
    }

    setLanguage(langCode: string): void {
        this.translate.use(langCode);
        localStorage.setItem('lang', langCode);

        this.dir = langCode === 'he' ? 'rtl' : 'ltr';
        this.renderer.addClass(document.body, this.dir);
        this.renderer.setAttribute(document.body, 'lang', langCode);
    }

    getCurrentLang(): string {
        const lang = this.translate.currentLang || this.translate.defaultLang || 'en';
        if(this.langMap[lang]) {
            return this.langMap[lang];
        }
        return lang;
    }

    getLanguages(): LanguageOption[] {
        return this.supportedLanguages;
    }

    private isSupported(code: string): boolean {
        return this.supportedLanguages.some(lang => lang.code === code);
    }
}
