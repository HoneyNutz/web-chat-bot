// Navigation types
export interface NavItem {
  id: number;
  url: string;
  label: string;
}

export type NavItems = NavItem[];

// Banner types
export interface BannerData {
  HEADING: string;
  SUBHEADING: string;
  DESCRIPTION: string;
  LOGO: string;
}

// About types
export interface AboutData {
  HEADING: string;
  NAME: string;
  TITLE: string;
  IMG: string;
  COMPANY: string;
  ADDRESS: string;
  CITY: string;
  STATE: string;
  ZIP: string;
  DESCRIPTION: string;
  QUALIFICATIONS: string[];
}

// Service types
export interface ServiceItem {
  LABEL: string;
  ID: string;
  DESCRIPTION: string;
  IMG: string;
}

export interface ServiceData {
  HEADING: string;
  SUBHEADING: string;
  ID: string;
  SERVICE_LIST: ServiceItem[];
}

// Testimonial types
export interface Testimonial {
  DESCRIPTION: string;
  NAME: string;
  TITLE: string;
  COMPANY: string;
  IMG: string;
}

export interface TestimonialData {
  HEADING: string;
  TESTIMONIAL_LIST: Testimonial[];
}

// Contact types
export interface ContactInfo {
  ICON: string;
  TITLE: string;
  DESCRIPTION: string;
  URL?: string;
}

export interface ContactData {
  HEADING: string;
  SUBHEADING: string;
  BUTTON_TEXT: string;
  CONTACT_INFO: ContactInfo[];
}

// Resume types
export interface ResumeItem {
  TITLE: string;
  COMPANY: string;
  PERIOD: string;
  DESCRIPTION: string[];
}

export interface ResumeSection {
  TITLE: string;
  ITEMS: ResumeItem[];
}

export interface ResumeData {
  HEADING: string;
  SUBHEADING: string;
  SECTIONS: ResumeSection[];
}

// Social types
export interface SocialItem {
  LABEL: string;
  URL: string;
  IMG: string;
}

export interface SocialData {
  HEADING: string;
  SOCIALMEDIA: SocialItem[];
}

// Footer types
export interface FooterData {
  DESCRIPTION: string;
  CONTACT_DETAILS: {
    HEADING: string;
    ADDRESS: string;
    MOBILE: string;
    EMAIL: string;
  };
  SUBSCRIBE_NEWSLETTER: string;
  SUBSCRIBE: string;
}

// Main data export
export interface SiteData {
  NAVBAR_DATA: NavItem[];
  BANNER_DATA: BannerData;
  ABOUT_DATA: AboutData;
  SERVICE_DATA: ServiceData;
  TESTIMONIAL_DATA?: TestimonialData;
  CONTACT_DATA?: ContactData;
  RESUME_DATA?: ResumeData;
  SOCIAL_DATA: SocialData;
  FOOTER_DATA: FooterData;
}
