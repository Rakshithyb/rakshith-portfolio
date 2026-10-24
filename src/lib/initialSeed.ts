import {
  SiteSettingsData,
  ProjectData,
  SkillData,
  CertificateData,
  ExperienceData,
  EducationData,
  AchievementData,
  BlogPostData,
  ResumeData,
  ContentDraft,
  PublishedContent,
} from '../types';

export const initialSiteSettings: SiteSettingsData = {
  ownerName: 'Rakshith YB',
  roleTitle: 'Computer Science Student',
  educationHeadline: 'B.E. Computer Science and Engineering | Kalpataru Institute of Technology, Tiptur',
  headline: 'Building scalable real-world software solutions.',
  subheadline: 'Computer Science student with strong foundations in Python, backend development, REST APIs, and database design.',
  bioSummary: 'Computer Science student with strong foundations in Python, backend development, REST APIs, and database design. Developed AI-powered platforms and competitive programming tools using Flask, MongoDB, and scikit-learn. Proven track record in hackathons with a systematic, data-driven approach to engineering problems.',
  email: 'rakshir585@gmail.com',
  phone: '+91 81232 70425',
  location: 'Tiptur, Karnataka, India',
  linkedinUrl: 'https://linkedin.com/in/rakshithyb',
  githubUrl: 'https://github.com/Rakshithyb',
  seoTitle: 'Rakshith YB | Computer Science Student & Software Engineer',
  seoDescription: 'Personal portfolio of Rakshith YB — Computer Science student specializing in Python, backend development, REST APIs, ML/AI, and database design.',
  sectionsVisibility: {
    projects: true,
    skills: true,
    certificates: true,
    experience: false,
    education: true,
    achievements: true,
    blog: false,
    resume: true,
  },
};

export const initialProjects: { draft: ContentDraft<ProjectData>; published?: PublishedContent<ProjectData> }[] = [
  {
    draft: {
      id: 'proj-1',
      content_type: 'project',
      slug: 'disasterlens',
      sort_order: 1,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'DISASTERLENS — AI-BASED NATURAL DISASTER PREDICTION',
        tagline: 'AI-Based Natural Disaster Prediction Platform',
        description: 'Developed and trained scikit-learn machine learning models to predict natural disasters, deployed through a Flask REST API with real-time environmental data integrations.',
        category: 'AI / Machine Learning',
        tags: ['Python', 'Flask', 'SQLite', 'scikit-learn', 'SHAP'],
        featured: true,
        githubUrl: 'https://github.com/Rakshithyb',
        liveDemoUrl: '',
        completionDate: '2025',
        caseStudyMarkdown: `### Project Architecture & Implementation\n- Developed and trained scikit-learn machine learning models to predict natural disasters, deployed through a Flask REST API.\n- Integrated real-time Weather API and News API to enhance predictions with live environmental and disaster-related data.\n- Optimized model deployment by serializing trained models as pickle (.pkl) files for fast and consistent inference.\n- Built REST API endpoints, evaluated model performance, and managed model versioning and data storage using SQLite.`
      }
    }
  },
  {
    draft: {
      id: 'proj-2',
      content_type: 'project',
      slug: 'smart-student-assistant',
      sort_order: 2,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'SMART STUDENT ASSISTANT — AI LEARNING PLATFORM',
        tagline: 'Intelligent Academic Learning Platform',
        description: 'AI learning platform engineered with Flask and MongoDB, providing responsive REST APIs for student productivity and intelligent learning workflows.',
        category: 'AI / Full-Stack Web',
        tags: ['Flask', 'MongoDB', 'REST APIs', 'Python'],
        featured: true,
        githubUrl: 'https://github.com/Rakshithyb',
        liveDemoUrl: '',
        completionDate: '2025',
        caseStudyMarkdown: `### Project Highlights\n- Built an intelligent student learning and academic assistant platform utilizing Python and Flask.\n- Implemented MongoDB document schemas for flexible storage of learning assets, study materials, and user interactions.\n- Engineered secure REST API endpoints connecting frontend components with backend inference and data retrieval services.`
      }
    }
  },
  {
    draft: {
      id: 'proj-3',
      content_type: 'project',
      slug: 'custom-online-judge',
      sort_order: 3,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'CUSTOM ONLINE JUDGE',
        tagline: 'Automated Code Evaluation & Testing Engine',
        description: 'Custom online code judging platform developed with Flask, Python, and MongoDB for automated execution, test-case evaluation, and verdict generation.',
        category: 'Backend & Systems',
        tags: ['Flask', 'Python', 'MongoDB', 'REST APIs'],
        featured: false,
        githubUrl: 'https://github.com/Rakshithyb',
        liveDemoUrl: '',
        completionDate: '2025',
        caseStudyMarkdown: `### Project Highlights\n- Designed and implemented a custom online judge platform for automated code compilation and execution testing.\n- Created backend evaluation pipelines using Flask and Python to validate test case correctness and runtime constraints.\n- Utilized MongoDB to store problem specifications, user submissions, runtime statistics, and verdict logs via REST APIs.`
      }
    }
  },
  {
    draft: {
      id: 'proj-4',
      content_type: 'project',
      slug: 'competitive-programming-tracker',
      sort_order: 4,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'COMPETITIVE PROGRAMMING PROGRESS TRACKER',
        tagline: 'Algorithmic Performance & Practice Tracker',
        description: 'Progress tracking utility utilizing Python, HashMaps, priority logic, and aggregation pipelines to evaluate competitive programming metrics.',
        category: 'Algorithms & Tools',
        tags: ['Python', 'HashMaps', 'Priority Logic', 'Data Aggregation'],
        featured: false,
        githubUrl: 'https://github.com/Rakshithyb',
        liveDemoUrl: '',
        completionDate: '2025',
        caseStudyMarkdown: `### Project Highlights\n- Developed a competitive programming progress tracker using Python to analyze algorithmic problem-solving trends.\n- Implemented HashMaps and priority logic structures to sort, prioritize, and monitor problem topic proficiencies.\n- Built data aggregation routines to summarize submission speed, difficulty tiers, and consistency across practice sessions.`
      }
    }
  }
];

export const initialSkills: { draft: ContentDraft<SkillData>; published?: PublishedContent<SkillData> }[] = [
  // Programming Languages
  { draft: { id: 'skill-1', content_type: 'skill', slug: 'python', sort_order: 1, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'Python', category: 'languages', context: 'Primary Language • Backend & ML', highlighted: true } } },
  { draft: { id: 'skill-2', content_type: 'skill', slug: 'cpp', sort_order: 2, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'C++', category: 'languages', context: 'Data Structures & Algorithms', highlighted: true } } },
  { draft: { id: 'skill-3', content_type: 'skill', slug: 'java', sort_order: 3, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'Java', category: 'languages', context: 'OOP & Core CS Foundations', highlighted: true } } },
  { draft: { id: 'skill-4', content_type: 'skill', slug: 'javascript', sort_order: 4, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'JavaScript', category: 'languages', context: 'Web Development & Scripting', highlighted: true } } },
  { draft: { id: 'skill-5', content_type: 'skill', slug: 'c', sort_order: 5, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'C', category: 'languages', context: 'Systems & Memory Fundamentals', highlighted: false } } },

  // Frameworks & Backend
  { draft: { id: 'skill-6', content_type: 'skill', slug: 'flask', sort_order: 6, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'Flask', category: 'backend', context: 'REST APIs & Microservices', highlighted: true } } },
  { draft: { id: 'skill-7', content_type: 'skill', slug: 'rest-apis', sort_order: 7, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'REST APIs', category: 'backend', context: 'Endpoint Design & Integration', highlighted: true } } },

  // Databases
  { draft: { id: 'skill-8', content_type: 'skill', slug: 'mongodb', sort_order: 8, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'MongoDB', category: 'databases', context: 'NoSQL & Document Modeling', highlighted: true } } },
  { draft: { id: 'skill-9', content_type: 'skill', slug: 'sql-sqlite', sort_order: 9, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'SQL (SQLite)', category: 'databases', context: 'Relational Schemas & Queries', highlighted: true } } },

  // ML / AI Libraries
  { draft: { id: 'skill-10', content_type: 'skill', slug: 'scikit-learn', sort_order: 10, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'scikit-learn', category: 'tools', context: 'ML Model Training & Evaluation', highlighted: true } } },
  { draft: { id: 'skill-11', content_type: 'skill', slug: 'shap', sort_order: 11, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'SHAP', category: 'tools', context: 'Model Explainability & Interpretability', highlighted: true } } },
  { draft: { id: 'skill-12', content_type: 'skill', slug: 'numpy', sort_order: 12, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'NumPy', category: 'tools', context: 'Numerical Computation & Arrays', highlighted: false } } },
  { draft: { id: 'skill-13', content_type: 'skill', slug: 'pandas', sort_order: 13, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'Pandas', category: 'tools', context: 'Data Wrangling & Analysis', highlighted: true } } },

  // Tools & Platforms
  { draft: { id: 'skill-14', content_type: 'skill', slug: 'git', sort_order: 14, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'Git', category: 'tools', context: 'Version Control & Branching', highlighted: true } } },
  { draft: { id: 'skill-15', content_type: 'skill', slug: 'github', sort_order: 15, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'GitHub', category: 'tools', context: 'Collaboration & Repository Management', highlighted: true } } },
  { draft: { id: 'skill-16', content_type: 'skill', slug: 'vs-code', sort_order: 16, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'VS Code', category: 'tools', context: 'Development Environment & Tooling', highlighted: false } } },
  { draft: { id: 'skill-17', content_type: 'skill', slug: 'linux', sort_order: 17, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'Linux', category: 'tools', context: 'CLI, Shell & Environment', highlighted: true } } },

  // Core CS Concepts
  { draft: { id: 'skill-18', content_type: 'skill', slug: 'dsa', sort_order: 18, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'DSA (Data Structures & Algorithms)', category: 'other', context: 'Algorithm Design & Problem Solving', highlighted: true } } },
  { draft: { id: 'skill-19', content_type: 'skill', slug: 'oop', sort_order: 19, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'OOP (Object-Oriented Programming)', category: 'other', context: 'Encapsulation, Polymorphism & Design', highlighted: true } } },
  { draft: { id: 'skill-20', content_type: 'skill', slug: 'time-space-complexity', sort_order: 20, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'Time & Space Complexity', category: 'other', context: 'Asymptotic Analysis (Big-O)', highlighted: true } } },
  { draft: { id: 'skill-21', content_type: 'skill', slug: 'dbms', sort_order: 21, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'DBMS (Database Management Systems)', category: 'other', context: 'ACID, Normalization & Indexing', highlighted: true } } },

  // Methodologies
  { draft: { id: 'skill-22', content_type: 'skill', slug: 'agile', sort_order: 22, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'Agile Methodology', category: 'methodologies', context: 'Iterative Development & Planning', highlighted: false } } },
  { draft: { id: 'skill-23', content_type: 'skill', slug: 'system-testing', sort_order: 23, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'System Testing', category: 'methodologies', context: 'Verification & End-to-End Validation', highlighted: true } } },
  { draft: { id: 'skill-24', content_type: 'skill', slug: 'debugging', sort_order: 24, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'Debugging', category: 'methodologies', context: 'Root-Cause Analysis & Fixes', highlighted: true } } },
  { draft: { id: 'skill-25', content_type: 'skill', slug: 'test-plan-design', sort_order: 25, version: 1, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), draft_data: { name: 'Test Plan Design', category: 'methodologies', context: 'Comprehensive Test Architecture', highlighted: false } } },
];

export const initialCertificates: { draft: ContentDraft<CertificateData>; published?: PublishedContent<CertificateData> }[] = [
  {
    draft: {
      id: 'cert-1',
      content_type: 'certificate',
      slug: 'cisco-ccna',
      sort_order: 1,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'Cisco Networking Academy (CCNA)',
        issuer: 'Cisco Networking Academy',
        issueDate: 'Certified',
        credentialId: 'CCNA: Intro to Networks, Switching, Routing, Wireless & Security',
        verificationUrl: '',
      }
    }
  },
  {
    draft: {
      id: 'cert-2',
      content_type: 'certificate',
      slug: 'cisco-additional-courses',
      sort_order: 2,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'Cisco Additional Technical Courses',
        issuer: 'Cisco',
        issueDate: 'Certified',
        credentialId: 'Python Essentials 1 & 2, Cybersecurity Essentials, Data Science, Apply AI, Cisco Packet Tracer',
        verificationUrl: '',
      }
    }
  }
];

export const initialExperience: { draft: ContentDraft<ExperienceData>; published?: PublishedContent<ExperienceData> }[] = [];

export const initialEducation: { draft: ContentDraft<EducationData>; published?: PublishedContent<EducationData> }[] = [
  {
    draft: {
      id: 'edu-1',
      content_type: 'education',
      slug: 'be-computer-science',
      sort_order: 1,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        degree: 'B.E. in Computer Science and Engineering',
        institution: 'Kalpataru Institute of Technology | Tiptur',
        fieldOfStudy: 'Computer Science and Engineering',
        startDate: '2022',
        endDate: 'Current',
        gradeOrGpa: 'CGPA: 8.1 / 10 (current)',
        coursework: ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Time & Space Complexity', 'Computer Networks (CCNA)', 'Python Essentials'],
        details: '10th Standard: 75% | 12th Standard: 70%'
      }
    }
  }
];

export const initialAchievements: { draft: ContentDraft<AchievementData>; published?: PublishedContent<AchievementData> }[] = [
  {
    draft: {
      id: 'ach-1',
      content_type: 'achievement',
      slug: 'mit-mysore-hackathon',
      sort_order: 1,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'MIT Mysore Hackathon — 2nd Runner-Up',
        eventOrOrganization: 'MIT Mysore',
        date: 'Hackathon Award',
        summary: 'Secured 2nd Runner-Up position in intercollegiate hackathon engineering competition.',
        badgeLabel: '2nd Runner-Up'
      }
    }
  },
  {
    draft: {
      id: 'ach-2',
      content_type: 'achievement',
      slug: 'intercollege-hackathon-acharya',
      sort_order: 2,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'Intercollege Hackathon — Participant',
        eventOrOrganization: 'Acharya Institute of Technology',
        date: 'Hackathon Participation',
        summary: 'Participated in intercollegiate technical hackathon representing Kalpataru Institute of Technology.',
        badgeLabel: 'Participant'
      }
    }
  },
  {
    draft: {
      id: 'ach-3',
      content_type: 'achievement',
      slug: 'intercollege-hackathon-maharaja',
      sort_order: 3,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'Intercollege Hackathon — Participant',
        eventOrOrganization: 'Maharaja Institute of Technology',
        date: 'Hackathon Participation',
        summary: 'Participated in intercollegiate hackathon developing competitive technological solutions.',
        badgeLabel: 'Participant'
      }
    }
  },
  {
    draft: {
      id: 'ach-4',
      content_type: 'achievement',
      slug: 'state-level-hackathon-sjbit',
      sort_order: 4,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'State Level Hackathon — Participant',
        eventOrOrganization: 'SJBIT College of Engineering',
        date: 'State-Level Hackathon',
        summary: 'Competed in state-level engineering hackathon on real-world engineering problem statements.',
        badgeLabel: 'State-Level Participant'
      }
    }
  },
  {
    draft: {
      id: 'ach-5',
      content_type: 'achievement',
      slug: 'national-level-hackathon-global',
      sort_order: 5,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      draft_data: {
        title: 'National Level Hackathon — Participant',
        eventOrOrganization: 'Global Academy of Technology',
        date: 'National-Level Hackathon',
        summary: 'Participated in national-level innovation hackathon presenting scalable software architecture.',
        badgeLabel: 'National-Level Participant'
      }
    }
  }
];

export const initialBlogPosts: { draft: ContentDraft<BlogPostData>; published?: PublishedContent<BlogPostData> }[] = [];

export const initialResume: ResumeData = {
  title: 'Rakshith YB — Resume',
  version: '2026.1',
  lastUpdated: 'October 2026',
  summary: 'Computer Science student with strong foundations in Python, backend development, REST APIs, and database design. Developed AI-powered platforms and competitive programming tools using Flask, MongoDB, and scikit-learn. Proven track record in hackathons with a systematic, data-driven approach to engineering problems.',
  downloadFilename: 'professional Resume Rakshith YB.pdf',
  fileStoragePath: '/documents/professional Resume Rakshith YB.pdf'
};
