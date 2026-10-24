export type ContentType =
  | 'project'
  | 'skill'
  | 'certificate'
  | 'experience'
  | 'education'
  | 'achievement'
  | 'blog_post'
  | 'site_section'
  | 'site_settings'
  | 'resume';

export type SkillCategory = 'languages' | 'frontend' | 'backend' | 'databases' | 'tools' | 'other' | 'methodologies';

export interface ProjectData {
  title: string;
  tagline: string;
  description: string;
  caseStudyMarkdown?: string;
  category: string;
  tags: string[];
  featured: boolean;
  githubUrl?: string;
  liveDemoUrl?: string;
  imagePath?: string;
  completionDate?: string;
}

export interface SkillData {
  name: string;
  category: SkillCategory;
  context?: string;
  highlighted?: boolean;
}

export interface CertificateData {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  mediaPath?: string;
}

export interface ExperienceData {
  role: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
}

export interface EducationData {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gradeOrGpa?: string;
  coursework?: string[];
  details?: string;
}

export interface AchievementData {
  title: string;
  eventOrOrganization: string;
  date: string;
  summary: string;
  proofUrl?: string;
  badgeLabel?: string;
}

export interface BlogPostData {
  title: string;
  excerpt: string;
  contentMarkdown: string;
  tags: string[];
  publishedDate: string;
  readTimeMinutes?: number;
  coverImagePath?: string;
}

export interface ResumeData {
  title: string;
  version: string;
  lastUpdated: string;
  summary: string;
  fileStoragePath?: string;
  downloadFilename?: string;
}

export interface SectionVisibilityMap {
  projects: boolean;
  skills: boolean;
  certificates: boolean;
  experience: boolean;
  education: boolean;
  achievements: boolean;
  blog: boolean;
  resume: boolean;
}

export interface SiteSettingsData {
  ownerName: string;
  roleTitle: string;
  educationHeadline: string;
  headline: string;
  subheadline: string;
  bioSummary: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl: string;
  githubUrl: string;
  seoTitle: string;
  seoDescription: string;
  openGraphImage?: string;
  sectionsVisibility: SectionVisibilityMap;
}

export interface ContentDraft<T = unknown> {
  id: string;
  content_type: ContentType;
  slug: string;
  draft_data: T;
  sort_order: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface PublishedContent<T = unknown> {
  id: string;
  content_type: ContentType;
  slug: string;
  content_data: T;
  sort_order: number;
  published_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  bucket: 'portfolio-private' | 'portfolio-public';
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  visibility: 'private' | 'public';
  created_at: string;
}

export interface PageView {
  id: string;
  page_path: string;
  referrer_domain?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  created_at: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  viewsLast7Days: number;
  viewsLast30Days: number;
  topPages: { path: string; count: number }[];
  referrers: { domain: string; count: number }[];
}
