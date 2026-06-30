export type Locale = 'en' | 'he';

export interface SiteContent {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    howItWorks: string;
    features: string;
    benefits: string;
    product: string;
    gallery: string;
    testimonials: string;
    faq: string;
    contact: string;
    requestDemo: string;
    contactSales: string;
  };
  hero: {
    title: string;
    subtitle: string;
    requestDemo: string;
    contactSales: string;
  };
  trusted: {
    title: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: { title: string; description: string }[];
  };
  features: {
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stats: { value: string; label: string }[];
  };
  product: {
    title: string;
    subtitle: string;
    stages: string[];
  };
  gallery: {
    title: string;
    subtitle: string;
    prevSlide: string;
    nextSlide: string;
    goToSlide: string;
    items: { alt: string }[];
  };
  testimonials: {
    title: string;
    items: { quote: string; name: string; role: string; company: string }[];
  };
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    company: string;
    email: string;
    message: string;
    submit: string;
    placeholders: {
      name: string;
      company: string;
      email: string;
      message: string;
    };
  };
  footer: {
    privacy: string;
    terms: string;
    tagline: string;
    rights: string;
  };
}

const en: SiteContent = {
  meta: {
    title: 'PackRecommender — AI Packaging Recommendations for Manufacturers',
    description:
      'Find the best packaging solution in seconds using AI. Reduce costs, improve sustainability, and accelerate product development for manufacturers.',
  },
  nav: {
    howItWorks: 'How it works',
    features: 'Features',
    benefits: 'Benefits',
    product: 'Product',
    gallery: 'Gallery',
    testimonials: 'Testimonials',
    faq: 'FAQ',
    contact: 'Contact',
    requestDemo: 'Request Demo',
    contactSales: 'Contact Sales',
  },
  hero: {
    title: 'AI Packaging Recommendations for Manufacturers',
    subtitle:
      'Find the best packaging solution in seconds using AI. Reduce costs, improve sustainability, and accelerate product development.',
    requestDemo: 'Request Demo',
    contactSales: 'Contact Sales',
  },
  trusted: {
    title: 'Trusted by manufacturers worldwide',
  },
  howItWorks: {
    title: 'How it works',
    subtitle: 'From product data to optimized packaging in three simple steps.',
    steps: [
      {
        title: 'Upload product information',
        description:
          'Enter dimensions, weight, fragility, and logistics requirements through our intuitive interface or API integration.',
      },
      {
        title: 'AI analyzes your requirements',
        description:
          'Our engine evaluates dimensions, weight, fragility, sustainability goals, and logistics constraints in real time.',
      },
      {
        title: 'Receive optimized recommendations',
        description:
          'Get ranked packaging options with cost analysis, sustainability scores, and supplier matches — ready to export.',
      },
    ],
  },
  features: {
    title: 'Everything you need to optimize packaging',
    subtitle: 'Enterprise-grade tools designed for manufacturing teams.',
    items: [
      {
        title: 'AI Recommendation Engine',
        description:
          'Machine learning models trained on thousands of packaging scenarios deliver precise, context-aware suggestions.',
      },
      {
        title: 'Packaging Cost Optimization',
        description:
          'Compare material and logistics costs across options to identify savings without compromising protection.',
      },
      {
        title: 'Sustainability Analysis',
        description:
          'Evaluate carbon footprint, recyclability, and material efficiency for every recommendation.',
      },
      {
        title: 'Material Comparison',
        description:
          'Side-by-side analysis of corrugated, flexible films, rigid plastics, and sustainable alternatives.',
      },
      {
        title: 'Supplier Matching',
        description:
          'Connect with qualified packaging suppliers that match your volume, geography, and certification needs.',
      },
      {
        title: 'Export Reports',
        description:
          'Generate PDF and CSV reports for stakeholders, procurement, and sustainability compliance.',
      },
    ],
  },
  benefits: {
    eyebrow: 'Impact',
    title: 'Measurable impact for your operations',
    subtitle: 'Real results from manufacturers using PackRecommender.',
    stats: [
      { value: '25%', label: 'Reduce packaging cost' },
      { value: '<10s', label: 'Recommendation time' },
      { value: '95%', label: 'Packaging accuracy' },
      { value: '1000+', label: 'Supported packaging types' },
    ],
  },
  product: {
    title: 'See PackRecommender in action',
    subtitle: 'A streamlined workflow from input to actionable insights.',
    stages: [
      'Product Input',
      'AI Engine',
      'Recommended Packaging',
      'Cost Analysis',
      'Sustainability Score',
    ],
  },
  gallery: {
    title: 'Packaging in practice',
    subtitle: 'Real-world packaging solutions across industries and materials.',
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide',
    goToSlide: 'Go to slide',
    items: [
      { alt: 'Custom printed corrugated packaging boxes' },
      { alt: 'Industrial packaging production facility' },
      { alt: 'Sustainable flexible pouch packaging' },
      { alt: 'Retail product packaging display' },
      { alt: 'Corrugated shipping and logistics packaging' },
    ],
  },
  testimonials: {
    title: 'What manufacturers are saying',
    items: [
      {
        quote:
          'PackRecommender cut our packaging evaluation cycle from weeks to minutes. The cost savings alone paid for the platform in the first quarter.',
        name: 'Sarah Chen',
        role: 'VP of Operations',
        company: 'NovaTech Manufacturing',
      },
      {
        quote:
          'The sustainability scoring helped us meet our ESG targets while reducing material waste by 18%. It is now part of our standard product launch process.',
        name: 'Marcus Weber',
        role: 'Head of Sustainability',
        company: 'EuroPack Industries',
      },
      {
        quote:
          'We integrated PackRecommender into our R&D workflow. Our engineers get packaging recommendations before the first prototype is built.',
        name: 'Rachel Okonkwo',
        role: 'Director of Product Development',
        company: 'Precision Components Ltd',
      },
    ],
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        question: 'What types of products does PackRecommender support?',
        answer:
          'PackRecommender supports a wide range of manufactured goods including electronics, food and beverage, pharmaceuticals, consumer goods, and industrial components. Our database covers 1,000+ packaging types.',
      },
      {
        question: 'How accurate are the AI recommendations?',
        answer:
          'Our recommendation engine achieves 95% accuracy based on validation against real-world packaging deployments. Recommendations improve continuously as more data is processed.',
      },
      {
        question: 'Can PackRecommender integrate with our existing systems?',
        answer:
          'Yes. We offer REST API access and integrations with common PLM, ERP, and procurement platforms. Enterprise customers can also use custom webhooks.',
      },
      {
        question: 'Is my product data secure?',
        answer:
          'All data is encrypted in transit and at rest. We are SOC 2 compliant and offer on-premise deployment options for enterprises with strict data residency requirements.',
      },
      {
        question: 'How does pricing work?',
        answer:
          'We offer tiered plans based on recommendation volume and team size. Contact our sales team for a custom quote tailored to your manufacturing scale.',
      },
      {
        question: 'Do you support international shipping requirements?',
        answer:
          'Yes. Our logistics module accounts for international shipping regulations, ISTA standards, and regional sustainability compliance requirements.',
      },
    ],
  },
  contact: {
    title: 'Get in touch',
    subtitle: 'Request a demo or speak with our sales team about your packaging needs.',
    name: 'Name',
    company: 'Company',
    email: 'Email',
    message: 'Message',
    submit: 'Send message',
    placeholders: {
      name: 'Your name',
      company: 'Your company',
      email: 'name@company.com',
      message: 'Tell us about your packaging challenges',
    },
  },
  footer: {
    privacy: 'Privacy',
    terms: 'Terms',
    tagline: 'AI-powered packaging recommendations for modern manufacturers.',
    rights: 'All rights reserved.',
  },
};

const he: SiteContent = {
  meta: {
    title: 'PackRecommender — המלצות אריזה מבוססות AI ליצרנים',
    description:
      'מצאו את פתרון האריזה הטוב ביותר תוך שניות באמצעות AI. הפחיתו עלויות, שפרו קיימות והאיצו פיתוח מוצרים ליצרנים.',
  },
  nav: {
    howItWorks: 'איך זה עובד',
    features: 'יכולות',
    benefits: 'יתרונות',
    product: 'מוצר',
    gallery: 'גלריה',
    testimonials: 'המלצות',
    faq: 'שאלות נפוצות',
    contact: 'צור קשר',
    requestDemo: 'בקש הדגמה',
    contactSales: 'צור קשר עם מכירות',
  },
  hero: {
    title: 'המלצות אריזה מבוססות AI ליצרנים',
    subtitle:
      'מצאו את פתרון האריזה הטוב ביותר תוך שניות באמצעות AI. הפחיתו עלויות, שפרו קיימות והאיצו פיתוח מוצרים.',
    requestDemo: 'בקש הדגמה',
    contactSales: 'צור קשר עם מכירות',
  },
  trusted: {
    title: 'נבחר על ידי יצרנים ברחבי העולם',
  },
  howItWorks: {
    title: 'איך זה עובד',
    subtitle: 'מנתוני מוצר לאריזה מותאמת בשלושה שלבים פשוטים.',
    steps: [
      {
        title: 'העלאת פרטי מוצר',
        description:
          'הזינו מידות, משקל, שבירות ודרישות לוגיסטיות דרך הממשק האינטואיטיבי שלנו או אינטגרציית API.',
      },
      {
        title: 'ה-AI מנתח את הדרישות',
        description:
          'המנוע שלנו מעריך מידות, משקל, שבירות, יעדי קיימות ואילוצי לוגיסטיקה בזמן אמת.',
      },
      {
        title: 'קבלת המלצות מותאמות',
        description:
          'קבלו אפשרויות אריזה מדורגות עם ניתוח עלויות, ציוני קיימות והתאמת ספקים — מוכנות לייצוא.',
      },
    ],
  },
  features: {
    title: 'כל מה שצריך לאופטימיזציה של אריזה',
    subtitle: 'כלים ברמת ארגון שתוכננו לצוותי ייצור.',
    items: [
      {
        title: 'מנוע המלצות AI',
        description:
          'מודלים של למידת מכונה מאומנים על אלפי תרחישי אריזה מספקים הצעות מדויקות ומותאמות להקשר.',
      },
      {
        title: 'אופטימיזציית עלויות אריזה',
        description:
          'השוו עלויות חומרים ולוגיסטיקה בין אפשרויות לזיהוי חיסכון ללא פשרות על ההגנה.',
      },
      {
        title: 'ניתוח קיימות',
        description: 'העריכו טביעת פחמן, יכולת מיחזור ויעילות חומרים בכל המלצה.',
      },
      {
        title: 'השוואת חומרים',
        description: 'ניתוח מקביל של גלופים, סרטים גמישים, פלסטיק קשיח וחלופות ברות קיימא.',
      },
      {
        title: 'התאמת ספקים',
        description:
          'התחברו לספקי אריזה מוסמכים שמתאימים לנפח, גיאוגרפיה ודרישות הסמכה שלכם.',
      },
      {
        title: 'ייצוא דוחות',
        description: 'הפיקו דוחות PDF ו-CSV לבעלי עניין, רכש ותאימות קיימות.',
      },
    ],
  },
  benefits: {
    eyebrow: 'השפעה',
    title: 'השפעה מדידה על התפעול שלכם',
    subtitle: 'תוצאות אמיתיות מיצרנים שמשתמשים ב-PackRecommender.',
    stats: [
      { value: '25%', label: 'הפחתת עלות אריזה' },
      { value: '<10ש׳', label: 'זמן המלצה' },
      { value: '95%', label: 'דיוק אריזה' },
      { value: '1000+', label: 'סוגי אריזה נתמכים' },
    ],
  },
  product: {
    title: 'ראו את PackRecommender בפעולה',
    subtitle: 'תהליך עבודה יעיל מקלט לתובנות מעשיות.',
    stages: [
      'קלט מוצר',
      'מנוע AI',
      'אריזה מומלצת',
      'ניתוח עלויות',
      'ציון קיימות',
    ],
  },
  gallery: {
    title: 'אריזה בשטח',
    subtitle: 'פתרונות אריזה מהעולם האמיתי בתעשיות וחומרים שונים.',
    prevSlide: 'שקופית קודמת',
    nextSlide: 'שקופית הבאה',
    goToSlide: 'עבור לשקופית',
    items: [
      { alt: 'קרטונים מודפסים בהתאמה אישית' },
      { alt: 'מתקן ייצור אריזה תעשייתי' },
      { alt: 'אריזת שקית גמישה בת קיימא' },
      { alt: 'תצוגת אריזת מוצר לקמעונאות' },
      { alt: 'אריזות משלוח ולוגיסטיקה מקרטון' },
    ],
  },
  testimonials: {
    title: 'מה יצרנים אומרים',
    items: [
      {
        quote:
          'PackRecommender קיצר את מחזור הערכת האריזה שלנו משבועות לדקות. החיסכון בעלויות לבדו החזיר את עלות הפלטפורמה ברבעון הראשון.',
        name: 'שרה צ׳ן',
        role: 'סמנכ״ל תפעול',
        company: 'NovaTech Manufacturing',
      },
      {
        quote:
          'ציון הקיימות עזר לנו לעמוד ביעדי ESG תוך הפחתת פסולת חומרים ב-18%. זה כעת חלק מתהליך השקת המוצר הסטנדרטי שלנו.',
        name: 'מרקוס ובר',
        role: 'ראש קיימות',
        company: 'EuroPack Industries',
      },
      {
        quote:
          'שילבנו את PackRecommender בתהליך ה-R&D שלנו. המהנדסים שלנו מקבלים המלצות אריזה לפני שהאב טיפוס הראשון נבנה.',
        name: 'רחל אוקונקו',
        role: 'מנהלת פיתוח מוצר',
        company: 'Precision Components Ltd',
      },
    ],
  },
  faq: {
    title: 'שאלות נפוצות',
    items: [
      {
        question: 'אילו סוגי מוצרים PackRecommender תומך?',
        answer:
          'PackRecommender תומך במגוון רחב של מוצרים מיוצרים כולל אלקטרוניקה, מזון ומשקאות, תרופות, מוצרי צריכה ורכיבים תעשייתיים. מסד הנתונים שלנו מכסה 1,000+ סוגי אריזה.',
      },
      {
        question: 'מה רמת הדיוק של המלצות ה-AI?',
        answer:
          'מנוע ההמלצות שלנו משיג 95% דיוק על בסיס אימות מול פריסות אריזה בעולם האמיתי. ההמלצות משתפרות באופן מתמיד ככל שמעובדים יותר נתונים.',
      },
      {
        question: 'האם PackRecommender יכול להשתלב במערכות הקיימות שלנו?',
        answer:
          'כן. אנו מציעים גישת REST API ואינטגרציות עם פלטפורמות PLM, ERP ורכש נפוצות. לקוחות ארגוניים יכולים גם להשתמש ב-webhooks מותאמים.',
      },
      {
        question: 'האם נתוני המוצר שלי מאובטחים?',
        answer:
          'כל הנתונים מוצפנים בתעבורה ובמנוחה. אנו תואמים SOC 2 ומציעים אפשרויות פריסה מקומית לארגונים עם דרישות מחייבות מיקום נתונים.',
      },
      {
        question: 'איך עובד התמחור?',
        answer:
          'אנו מציעים תוכניות מדורגות לפי נפח המלצות וגודל הצוות. צרו קשר עם צוות המכירות שלנו לקבלת הצעת מחיר מותאמת לקנה המידה של הייצור שלכם.',
      },
      {
        question: 'האם אתם תומכים בדרישות משלוח בינלאומיות?',
        answer:
          'כן. מודול הלוגיסטיקה שלנו לוקח בחשבון תקנות משלוח בינלאומיות, תקני ISTA ודרישות תאימות קיימות אזוריות.',
      },
    ],
  },
  contact: {
    title: 'צרו קשר',
    subtitle: 'בקשו הדגמה או דברו עם צוות המכירות שלנו על צרכי האריזה שלכם.',
    name: 'שם',
    company: 'חברה',
    email: 'אימייל',
    message: 'הודעה',
    submit: 'שלח הודעה',
    placeholders: {
      name: 'השם שלך',
      company: 'שם החברה',
      email: 'name@company.com',
      message: 'ספרו לנו על אתגרי האריזה שלכם',
    },
  },
  footer: {
    privacy: 'פרטיות',
    terms: 'תנאים',
    tagline: 'המלצות אריזה מבוססות AI ליצרנים מודרניים.',
    rights: 'כל הזכויות שמורות.',
  },
};

export const content: Record<Locale, SiteContent> = { en, he };

export function getContent(locale: Locale): SiteContent {
  return content[locale];
}

export function getDir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'he' ? 'rtl' : 'ltr';
}

export function getLocalePath(locale: Locale): string {
  return locale === 'en' ? '/' : `/${locale}`;
}
