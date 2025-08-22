export interface Location {
  address?: string;
  postalCode?: string;
  city: string;
  countryCode: string;
  region: string;
}

export interface Profile {
  network: string;
  username: string;
  url: string;
}

export interface WorkExperience {
  name: string;
  location: string;
  description: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  highlights: string[];
}

export interface Education {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  courses: string[];
}

export interface Skill {
  name: string;
  level: string;
  keywords: string[];
}

export interface Project {
  name: string;
  description: string;
  keywords: string[];
  type?: string;
  url?: string;
  roles?: string[];
  startDate?: string;
  entity?: string;
  highlights?: string[];
}

export interface ResumeData {
  basics: {
    name: string;
    label: string;
    image: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    yearsOfExperience: number;
    location: Location;
    profiles: Profile[];
  };
  work: WorkExperience[];
  education: Education[];
  skills: {
    name: string;
    level: string;
    keywords: string[];
  }[];
  projects: Project[];
  volunteer: any[]; // Define more specifically if needed
}
