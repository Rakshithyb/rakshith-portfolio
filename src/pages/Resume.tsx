import React, { useEffect, useState } from 'react';
import { Download, Printer, FileText, Calendar, Mail, MapPin, ExternalLink, Github, Linkedin, Phone, Trophy, Award, BookOpen, Globe } from 'lucide-react';
import { ContentStore } from '../lib/contentStore';
import { ResumeData, SiteSettingsData, PublishedContent, SkillData, EducationData, ProjectData, AchievementData, CertificateData } from '../types';
import { SEOHead } from '../components/SEOHead';
import { Button } from '../components/Button';

export const Resume: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [skills, setSkills] = useState<PublishedContent<SkillData>[]>([]);
  const [education, setEducation] = useState<PublishedContent<EducationData>[]>([]);
  const [projects, setProjects] = useState<PublishedContent<ProjectData>[]>([]);
  const [achievements, setAchievements] = useState<PublishedContent<AchievementData>[]>([]);
  const [certificates, setCertificates] = useState<PublishedContent<CertificateData>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        const [pubResume, setts, sks, edu, prj, ach, certs] = await Promise.all([
          ContentStore.getPublishedBySlug<ResumeData>('resume', 'resume'),
          ContentStore.getSiteSettings(),
          ContentStore.getPublishedContent<SkillData>('skill'),
          ContentStore.getPublishedContent<EducationData>('education'),
          ContentStore.getPublishedContent<ProjectData>('project'),
          ContentStore.getPublishedContent<AchievementData>('achievement'),
          ContentStore.getPublishedContent<CertificateData>('certificate'),
        ]);

        if (pubResume) {
          setResumeData(pubResume.content_data);
        }
        setSettings(setts);
        setSkills(sks);
        setEducation(edu);
        setProjects(prj);
        setAchievements(ach);
        setCertificates(certs);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/documents/professional Resume Rakshith YB.pdf';
    link.download = 'professional Resume Rakshith YB.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <SEOHead
        title="Resume & Curriculum Vitae — Rakshith YB"
        description="Official Software Engineering resume of Rakshith YB. Computer Science student at Kalpataru Institute of Technology."
      />

      {/* Header controls (hidden when printing) */}
      <div className="no-print border-b border-[#D0D0D0] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#717171] font-semibold">
            ✦ Curriculum Vitae ✦
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#171717]">
            Resume & Credentials
          </h1>
          <p className="text-xs text-[#717171] font-mono mt-1">
            Verified Document • Kalpataru Institute of Technology | Tiptur
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="font-mono text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            className="font-mono text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Printable Resume Document */}
      <div className="border border-[#D0D0D0] rounded-xl p-8 sm:p-12 bg-white shadow-sm space-y-8 print:border-none print:p-0 print:shadow-none text-[#171717]">
        {/* Document Header */}
        <div className="border-b border-[#D0D0D0] pb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#171717] tracking-tight uppercase">
              RAKSHITH YB
            </h2>
            <div className="flex flex-wrap items-center gap-3.5 text-xs font-mono text-[#4D4D4D]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#717171]" />
                <span>Tiptur, Karnataka, India</span>
              </span>
              <a href="mailto:rakshir585@gmail.com" className="flex items-center gap-1 hover:text-[#0F0F0F] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#717171]" />
                <span>rakshir585@gmail.com</span>
              </a>
              <a href="tel:+918123270425" className="flex items-center gap-1 hover:text-[#0F0F0F] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#717171]" />
                <span>+91 81232 70425</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#717171]">
            <a href="https://github.com/Rakshithyb" target="_blank" rel="noopener noreferrer" className="hover:text-[#0F0F0F] transition-colors">
              github.com/Rakshithyb
            </a>
            <span>•</span>
            <a href="https://linkedin.com/in/rakshithyb" target="_blank" rel="noopener noreferrer" className="hover:text-[#0F0F0F] transition-colors">
              linkedin.com/in/rakshithyb
            </a>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#0F0F0F] font-bold border-b border-[#E0E0E0] pb-1">
            PROFESSIONAL SUMMARY
          </h3>
          <p className="text-xs sm:text-[13px] text-[#4D4D4D] leading-relaxed font-sans">
            Computer Science student with strong foundations in Python, backend development, REST APIs, and database design. Developed AI-powered platforms and competitive programming tools using Flask, MongoDB, and scikit-learn. Proven track record in hackathons with a systematic, data-driven approach to engineering problems.
          </p>
        </div>

        {/* Technical Skills */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#0F0F0F] font-bold border-b border-[#E0E0E0] pb-1">
            TECHNICAL SKILLS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
            <div>
              <span className="font-mono font-bold text-[#171717]">Languages: </span>
              <span className="text-[#4D4D4D]">Python, C++, Java, JavaScript, C</span>
            </div>
            <div>
              <span className="font-mono font-bold text-[#171717]">Frameworks & Backend: </span>
              <span className="text-[#4D4D4D]">Flask, REST APIs</span>
            </div>
            <div>
              <span className="font-mono font-bold text-[#171717]">Databases: </span>
              <span className="text-[#4D4D4D]">MongoDB, SQL (SQLite)</span>
            </div>
            <div>
              <span className="font-mono font-bold text-[#171717]">ML / AI Libraries: </span>
              <span className="text-[#4D4D4D]">scikit-learn, SHAP, NumPy, Pandas</span>
            </div>
            <div>
              <span className="font-mono font-bold text-[#171717]">Tools & Platforms: </span>
              <span className="text-[#4D4D4D]">Git, GitHub, VS Code, Linux</span>
            </div>
            <div>
              <span className="font-mono font-bold text-[#171717]">Core CS Concepts: </span>
              <span className="text-[#4D4D4D]">DSA, OOP, Time & Space Complexity, DBMS</span>
            </div>
            <div className="sm:col-span-2">
              <span className="font-mono font-bold text-[#171717]">Methodologies: </span>
              <span className="text-[#4D4D4D]">Agile, System Testing, Debugging, Test Plan Design</span>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#0F0F0F] font-bold border-b border-[#E0E0E0] pb-1">
            PROJECTS
          </h3>

          <div className="space-y-4">
            {/* Project 1 */}
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                <span className="font-serif font-bold text-sm text-[#0F0F0F]">
                  DISASTERLENS — AI-BASED NATURAL DISASTER PREDICTION
                </span>
                <span className="font-mono text-[#717171] text-[11px]">2025</span>
              </div>
              <div className="text-[11px] font-mono text-[#717171]">
                Python, Flask, SQLite, scikit-learn, SHAP
              </div>
              <ul className="list-disc list-outside ml-4 text-xs text-[#4D4D4D] space-y-1 pt-1 leading-relaxed">
                <li>Developed and trained scikit-learn machine learning models to predict natural disasters, deployed through a Flask REST API.</li>
                <li>Integrated real-time Weather API and News API to enhance predictions with live environmental and disaster-related data.</li>
                <li>Optimized model deployment by serializing trained models as pickle (.pkl) files for fast and consistent inference.</li>
                <li>Built REST API endpoints, evaluated model performance, and managed model versioning and data storage using SQLite.</li>
              </ul>
            </div>

            {/* Project 2 */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                <span className="font-serif font-bold text-sm text-[#0F0F0F]">
                  SMART STUDENT ASSISTANT — AI LEARNING PLATFORM
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#717171]">
                Flask, MongoDB, REST APIs, Python
              </div>
              <p className="text-xs text-[#4D4D4D] leading-relaxed pt-0.5">
                AI learning platform built with Flask and MongoDB, providing responsive REST APIs for student productivity and intelligent learning workflows.
              </p>
            </div>

            {/* Project 3 */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                <span className="font-serif font-bold text-sm text-[#0F0F0F]">
                  CUSTOM ONLINE JUDGE
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#717171]">
                Flask, Python, MongoDB, REST APIs
              </div>
              <p className="text-xs text-[#4D4D4D] leading-relaxed pt-0.5">
                Custom online judge platform for automated code compilation, test-case evaluation, and submission verdict generation using Flask and MongoDB.
              </p>
            </div>

            {/* Project 4 */}
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                <span className="font-serif font-bold text-sm text-[#0F0F0F]">
                  COMPETITIVE PROGRAMMING PROGRESS TRACKER
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#717171]">
                Python, HashMaps, Priority Logic, Data Aggregation
              </div>
              <p className="text-xs text-[#4D4D4D] leading-relaxed pt-0.5">
                Algorithmic tracking system utilizing Python, HashMaps, priority logic, and aggregation routines to analyze competitive programming metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#0F0F0F] font-bold border-b border-[#E0E0E0] pb-1">
            EDUCATION
          </h3>
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
              <span className="font-serif font-bold text-sm text-[#0F0F0F]">
                Kalpataru Institute of Technology │ Tiptur
              </span>
              <span className="font-mono text-[#717171] text-[11px]">Current</span>
            </div>
            <div className="text-xs text-[#4D4D4D] font-medium">
              B.E. in Computer Science and Engineering
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#717171] pt-0.5">
              <span className="font-semibold text-[#0F0F0F]">CGPA: 8.1 / 10 (current)</span>
              <span>•</span>
              <span>10th Standard: 75%</span>
              <span>•</span>
              <span>12th Standard: 70%</span>
            </div>
          </div>
        </div>

        {/* Certifications & Coursework */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#0F0F0F] font-bold border-b border-[#E0E0E0] pb-1">
            CERTIFICATIONS & COURSEWORK
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-mono font-bold text-[#171717]">Cisco Networking Academy (CCNA): </span>
              <span className="text-[#4D4D4D]">
                Introduction to Networks, Switching, Routing & Wireless Essentials, Enterprise Networking, Security & Automation.
              </span>
            </div>
            <div>
              <span className="font-mono font-bold text-[#171717]">Cisco Additional Courses: </span>
              <span className="text-[#4D4D4D]">
                Python Essentials 1 & 2, Cybersecurity Essentials, Introduction to Data Science, Apply AI: Analyze Customer Reviews, Cisco Packet Tracer.
              </span>
            </div>
          </div>
        </div>

        {/* Hackathon Achievements & Participation */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#0F0F0F] font-bold border-b border-[#E0E0E0] pb-1">
            ACHIEVEMENTS & HACKATHONS
          </h3>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-mono font-bold text-[#171717]">• MIT Mysore Hackathon — </span>
              <span className="text-[#0F0F0F] font-semibold">2nd Runner-Up</span>
            </div>
            <div className="pt-1">
              <span className="font-mono text-[#717171] uppercase tracking-wider text-[11px] block mb-1">
                Hackathons Participated:
              </span>
              <ul className="list-disc list-outside ml-4 text-[#4D4D4D] space-y-0.5 text-xs">
                <li>Intercollege Hackathon — Participant (Acharya Institute of Technology)</li>
                <li>Intercollege Hackathon — Participant (Maharaja Institute of Technology)</li>
                <li>State Level Hackathon — Participant (SJBIT College of Engineering)</li>
                <li>National Level Hackathon — Participant (Global Academy of Technology)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Areas of Interest */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#0F0F0F] font-bold border-b border-[#E0E0E0] pb-1">
            AREAS OF INTEREST
          </h3>
          <p className="text-xs text-[#4D4D4D] leading-relaxed">
            Passionate about Cybersecurity and Ethical hacking, ML/AI engineering, competitive programming, and building scalable real-world software solutions.
          </p>
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#0F0F0F] font-bold border-b border-[#E0E0E0] pb-1">
            LANGUAGES
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#4D4D4D]">
            <span><strong className="text-[#171717]">Kannada</strong> — Native</span>
            <span>•</span>
            <span><strong className="text-[#171717]">English</strong> — Professional Working Proficiency</span>
            <span>•</span>
            <span><strong className="text-[#171717]">Hindi</strong> — Elementary Proficiency</span>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Resume;
