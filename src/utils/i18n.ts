export type Locale = 'en';

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
    sending: string;
    success: string;
    error: string;
    captcha: string;
    captchaError: string;
    placeholders: {
      name: string;
      company: string;
      email: string;
      message: string;
      captcha: string;
    };
  };
  footer: {
    privacy: string;
    terms: string;
    tagline: string;
    rights: string;
  };
  maintenance: {
    pageTitle: string;
    heading: string;
    imageAlt: string;
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
    sending: 'Sending…',
    success: 'Thank you! Your message has been sent. We will be in touch soon.',
    error: 'Something went wrong. Please try again or email us directly.',
    captcha: 'Security check',
    captchaError: 'Please check "I\'m not a robot" and try again.',
    placeholders: {
      name: 'Your name',
      company: 'Your company',
      email: 'name@company.com',
      message: 'Tell us about your packaging challenges',
      captcha: 'Your answer',
    },
  },
  footer: {
    privacy: 'Privacy',
    terms: 'Terms',
    tagline: 'AI-powered packaging recommendations for modern manufacturers.',
    rights: 'All rights reserved.',
  },
  maintenance: {
    pageTitle: 'Under Maintenance — PackRecommender',
    heading: 'We are fastening some screws!',
    imageAlt: 'Under maintenance',
  },
};

export const content: SiteContent = en;

export function getContent(): SiteContent {
  return content;
}
