// Component Props Interfaces
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export interface AnimatedComponentProps extends BaseComponentProps {
  delay?: number;
  duration?: number;
  easing?: string;
  triggerOnce?: boolean;
  threshold?: number;
}

// Section Component Props
export interface SectionProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  backgroundVariant?: 'primary' | 'secondary' | 'transparent';
  fullHeight?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

// Project Interfaces
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  techStack: string[];
  image: string;
  images?: string[];
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
  completedDate: string;
  status: 'completed' | 'in-progress' | 'planned';
  tags?: string[];
  challenges?: string[];
  achievements?: string[];
  metrics?: {
    performance?: string;
    users?: string;
    engagement?: string;
  };
}

export interface ProjectCardProps extends BaseComponentProps {
  project: Project;
  variant?: 'grid' | 'list' | 'featured';
  showMetrics?: boolean;
  onView?: (project: Project) => void;
}

// Experience Interfaces
export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
  technologies: string[];
  achievements?: string[];
  location?: string;
  type?: 'full-time' | 'part-time' | 'contract' | 'freelance';
}

export interface ExperienceCardProps extends BaseComponentProps {
  experience: Experience;
  variant?: 'timeline' | 'card' | 'compact';
}

// Skill Interfaces
export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'soft-skills';
  proficiency: 1 | 2 | 3 | 4 | 5;
  icon?: string;
  description?: string;
  yearsOfExperience?: number;
  certifications?: string[];
}

export interface SkillCardProps extends BaseComponentProps {
  skill: Skill;
  showProficiency?: boolean;
  variant?: 'card' | 'badge' | 'list';
}

// Navigation Interfaces
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType;
  active?: boolean;
  external?: boolean;
  children?: NavigationItem[];
}

export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[];
  variant?: 'horizontal' | 'vertical' | 'mobile';
  showIcons?: boolean;
  collapsible?: boolean;
}

// Form Interfaces
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  options?: { label: string; value: string }[];
  rows?: number;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
}

export interface ContactFormProps extends BaseComponentProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  isLoading?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

// Performance Interfaces
export interface PerformanceMetrics {
  deviceTier: 'low' | 'medium' | 'high';
  fps: number;
  memoryUsage?: {
    used: number;
    total: number;
    percentage: number;
  };
  networkType?: string;
  isOnline: boolean;
  batteryLevel?: number;
  loadTime: number;
}

export interface PerformanceSettings {
  enableAnimations: boolean;
  enableWebGL: boolean;
  enableParticles: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  animationQuality: 'low' | 'medium' | 'high';
  reducedMotion: boolean;
}

// Theme Interfaces
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
  };
  typography: {
    fontFamily: {
      sans: string[];
      mono: string[];
    };
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, string>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  transitions: Record<string, string>;
}

// Animation Interfaces
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  stagger?: number;
  repeat?: number | boolean;
  yoyo?: boolean;
  from?: Record<string, any>;
  to?: Record<string, any>;
}

export interface ScrollTriggerConfig {
  trigger: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onUpdate?: (progress: number) => void;
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
  error?: string;
}

// API Interfaces
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: Record<string, any>;
}

// Utility Interfaces
export interface Point {
  x: number;
  y: number;
}

export interface Dimension {
  width: number;
  height: number;
}

export interface Rect extends Point, Dimension {}

export interface ViewportInfo extends Dimension {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

// SEO Interfaces
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

// Analytics Interfaces
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParameters?: Record<string, any>;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: Date;
  userAgent: string;
  referrer?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}
