// Data fetching utilities for portfolio data
import projectsData from './projects.json';
import achievementsData from './achievements.json';
import skillsData from './skills.json';
import experienceData from './experience.json';
import navigationData from './navigation.json';
import aboutData from './about.json';

// Type definitions
export interface Project {
  id: number;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  implementation: string[];
  liveLink?: string;
  githubLink?: string;
  image: string;
  featured?: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  category: string;
  description: string;
  details: string;
  date: string;
  organization?: string;
  link?: string;
  image: string;
  badge?: string;
  impact: string[];
  featured?: boolean;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  image: string;
  skills: string[];
}

export interface Award {
  id: number;
  title: string;
  event: string;
  position: string;
  year: string;
  description: string;
  image: string;
}

export interface Skill {
  category: string;
  technologies: string[];
  level: number;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Interest {
  title: string;
  description: string;
  icon: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface ExperienceItem {
  id: number;
  position: string;
  company: string;
  year: string;
  duration: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  logo?: string;
}

export interface CareerHighlight {
  number: string;
  label: string;
  description: string;
  icon: string;
}

export interface TechnologyEra {
  period: string;
  title: string;
  description: string;
  technologies: string[];
  color: string;
}

export interface NavigationLink {
  href: string;
  label: string;
}

export interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface AboutSection {
  title: string;
  content: string[];
}

export interface AboutData {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    profileImage: string;
    profileAlt: string;
    profileCaption: string;
  };
  aboutSections: AboutSection[];
  stats: Array<{
    number: string;
    label: string;
  }>;
}

// Data fetching functions
export const getProjects = (): Project[] => {
  return projectsData.projects;
};

export const getFeaturedProjects = (): Project[] => {
  return projectsData.projects.filter(project => project.featured);
};

export const getProjectById = (id: number): Project | undefined => {
  return projectsData.projects.find(project => project.id === id);
};

export const getAchievements = (): Achievement[] => {
  return achievementsData.achievements;
};

export const getFeaturedAchievements = (): Achievement[] => {
  return achievementsData.achievements.filter(achievement => achievement.featured);
};

export const getCertifications = (): Certification[] => {
  return achievementsData.certifications;
};

export const getAwards = (): Award[] => {
  return achievementsData.awards;
};

export const getSkills = (): Skill[] => {
  return skillsData.skills;
};

export const getSkillGroups = (): SkillGroup[] => {
  return skillsData.skillGroups;
};

export const getInterests = (): Interest[] => {
  return skillsData.interests;
};

export const getTimeline = (): TimelineItem[] => {
  return skillsData.timeline;
};

export const getExperienceData = (): ExperienceItem[] => {
  return experienceData.experienceData;
};

export const getCoreSkills = (): string[] => {
  return experienceData.coreSkills;
};

export const getCareerHighlights = (): CareerHighlight[] => {
  return experienceData.highlights;
};

export const getTechnologyEvolution = (): TechnologyEra[] => {
  return experienceData.technologyEvolution;
};

export const getNavigationLinks = (): NavigationLink[] => {
  return navigationData.navigation.links;
};

export const getFooterNavigationSections = (): FooterSection[] => {
  return navigationData.footer.navigationSections;
};

export const getSocialLinks = (): SocialLink[] => {
  return navigationData.footer.socialLinks;
};

export const getAboutData = (): AboutData => {
  return aboutData;
};

// Utility functions for filtering and searching
export const searchProjects = (query: string): Project[] => {
  const lowercaseQuery = query.toLowerCase();
  return projectsData.projects.filter(project => 
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.category.toLowerCase().includes(lowercaseQuery) ||
    project.techStack.some(tech => tech.toLowerCase().includes(lowercaseQuery))
  );
};

export const getProjectsByCategory = (category: string): Project[] => {
  return projectsData.projects.filter(project => 
    project.category.toLowerCase().includes(category.toLowerCase())
  );
};

export const getAchievementsByCategory = (category: string): Achievement[] => {
  return achievementsData.achievements.filter(achievement => 
    achievement.category.toLowerCase().includes(category.toLowerCase())
  );
};

export const getSkillsByCategory = (category: string): Skill | undefined => {
  return skillsData.skills.find(skill => 
    skill.category.toLowerCase().includes(category.toLowerCase())
  );
};

export const getExperienceByCompany = (company: string): ExperienceItem | undefined => {
  return experienceData.experienceData.find(experience => 
    experience.company.toLowerCase().includes(company.toLowerCase())
  );
};
