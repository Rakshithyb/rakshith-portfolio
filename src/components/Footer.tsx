import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Linkedin, Mail, Shield } from 'lucide-react';

interface FooterProps {
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  email = 'rakshir585@gmail.com',
  githubUrl = 'https://github.com/Rakshithyb',
  linkedinUrl = 'https://linkedin.com/in/rakshithyb',
}) => {
  return (
    <footer className="bg-[#0F0F0F] text-[#FFFFFF] border-t border-[#363636] relative overflow-hidden">
      {/* Decorative subtle background atmospheric glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2B2B2B]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Editorial Star Ribbon */}
      <div className="border-b border-[#363636] py-4 px-6 text-center">
        <p className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#BCBCBC] flex items-center justify-center gap-3">
          <span className="text-[#979797]">✦</span>
          <span>STRATEGY</span>
          <span className="text-[#717171]">•</span>
          <span>CODE</span>
          <span className="text-[#717171]">•</span>
          <span>ARCHITECTURE</span>
          <span className="text-[#979797]">✦</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded border border-[#363636] flex items-center justify-center bg-[#2B2B2B] text-[#FFFFFF] font-serif text-lg font-bold">
                R/
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg tracking-tight text-[#FFFFFF]">
                  RAKSHITH YB
                </span>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#979797]">
                  Software Engineer
                </span>
              </div>
            </div>
            <p className="text-xs text-[#BCBCBC] leading-relaxed max-w-sm font-sans">
              Computer Science student at Kalpataru Institute of Technology with strong foundations in Python, backend development, REST APIs, and database design.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#717171]">
              Tiptur, Karnataka, India
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#DEDEDE] font-semibold">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link to="/" className="text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors">Home</Link>
              </li>
              <li>
                <a href="/#about" className="text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors">About</a>
              </li>
              <li>
                <Link to="/projects" className="text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors">Projects</Link>
              </li>
              <li>
                <Link to="/skills" className="text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors">Skills</Link>
              </li>
              <li>
                <Link to="/certificates" className="text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors">Certificates</Link>
              </li>
              <li>
                <Link to="/education" className="text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors">Education</Link>
              </li>
              <li>
                <Link to="/achievements" className="text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors">Achievements</Link>
              </li>
              <li>
                <Link to="/resume" className="text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors">Resume</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Competencies / Domains */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#DEDEDE] font-semibold">
              Core Domains
            </h4>
            <ul className="space-y-2 text-xs font-sans text-[#BCBCBC]">
              <li>Python & Backend REST APIs (Flask)</li>
              <li>Database Architecture (MongoDB, SQLite)</li>
              <li>Machine Learning & Explainability (SHAP)</li>
              <li>Cisco Networking & Security (CCNA)</li>
              <li>Core Computer Science (DSA, OOP, DBMS)</li>
            </ul>
          </div>

          {/* Col 4: Contact & Socials */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#DEDEDE] font-semibold">
              Contact & Connect
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors group"
                >
                  <Mail className="w-3.5 h-3.5 text-[#979797]" />
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+918123270425"
                  className="inline-flex items-center gap-2 text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors group"
                >
                  <span className="text-[11px] font-mono text-[#979797]">TEL:</span>
                  <span>+91 81232 70425</span>
                </a>
              </li>
              <li>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors group"
                >
                  <Linkedin className="w-3.5 h-3.5 text-[#979797]" />
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-3 h-3 text-[#717171] group-hover:text-[#FFFFFF] transition-colors" />
                </a>
              </li>
              <li>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors group"
                >
                  <Github className="w-3.5 h-3.5 text-[#979797]" />
                  <span>GitHub (@Rakshithyb)</span>
                  <ArrowUpRight className="w-3 h-3 text-[#717171] group-hover:text-[#FFFFFF] transition-colors" />
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="mailto:rakshir585@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#363636] text-xs font-sans font-medium uppercase tracking-wider text-[#FFFFFF] hover:bg-[#2B2B2B] transition-all"
              >
                <span>SEND DIRECT MESSAGE</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#363636] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#717171]">
          <div>
            © {new Date().getFullYear()} Rakshith YB. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#979797]">React • TypeScript • Supabase</span>
            <span>•</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-[#BCBCBC] hover:text-[#FFFFFF] transition-colors"
            >
              <Shield className="w-3 h-3 text-[#979797]" />
              <span>Admin CMS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
