import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface SeoMetaInput {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private renderer: Renderer2;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  updateMeta(input: SeoMetaInput) {
    if (input.title) this.titleService.setTitle(input.title);
    if (input.description) {
      this.metaService.updateTag({ name: 'description', content: input.description });
    }

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: input.title || '' });
    this.metaService.updateTag({ property: 'og:description', content: input.description || '' });
    this.metaService.updateTag({ property: 'og:type', content: input.type || 'website' });
    if (input.url) this.metaService.updateTag({ property: 'og:url', content: input.url });
    if (input.image) this.metaService.updateTag({ property: 'og:image', content: input.image });

    // Twitter
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    if (input.title) this.metaService.updateTag({ name: 'twitter:title', content: input.title });
    if (input.description) this.metaService.updateTag({ name: 'twitter:description', content: input.description });
    if (input.image) this.metaService.updateTag({ name: 'twitter:image', content: input.image });

    if (input.url) this.setCanonical(input.url);
  }

  setCanonical(url: string) {
    if (!url) return;
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.appendChild(this.doc.head, link);
    }
    this.renderer.setAttribute(link, 'href', url);
  }

  addJsonLD(json: object) {
    if (!json) return;
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    script.text = JSON.stringify(json);
    this.renderer.appendChild(this.doc.head, script);
  }

  setHreflangs(entries: { href: string; hreflang: string }[]) {
    if (!entries || !entries.length) return;
    // remove existing hreflang links we manage
    entries.forEach(e => {
      const link = this.doc.createElement('link') as HTMLLinkElement;
      this.renderer.setAttribute(link, 'rel', 'alternate');
      this.renderer.setAttribute(link, 'hreflang', e.hreflang);
      this.renderer.setAttribute(link, 'href', e.href);
      this.renderer.appendChild(this.doc.head, link);
    });
  }
}


