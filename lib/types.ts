export interface Hero {
  title: string;
  subtitle: string;
  badge: string;
}

export interface Logo {
  url: string | null;
  alt: string;
}

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
  color: "gold" | "blush";
}

export interface Update {
  id: string;
  date: string;
  title: string;
  content: string;
  tag: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  expiry: string;
  active: boolean;
}

export interface Footer {
  tagline: string;
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  legal: string;
}

export interface SiteContent {
  hero: Hero;
  logo: Logo;
  benefits: Benefit[];
  updates: Update[];
  promoCodes: PromoCode[];
  footer: Footer;
}
