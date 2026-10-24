import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Code2,
  Server,
  Database,
  Sparkles,
  Award,
  Trophy,
  Clock,
  Rocket,
  GraduationCap,
  ChevronDown,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ContentStore } from '../lib/contentStore';
import {
  ProjectData,
  SkillData,
  SiteSettingsData,
  PublishedContent,
  AchievementData,
  EducationData,
} from '../types';
import { SEOHead } from '../components/SEOHead';
import { DeveloperIdCard } from '../components/DeveloperIdCard';

export const Home: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);
  const [projects, setProjects] = useState<PublishedContent<ProjectData>[]>([]);
  const [skills, setSkills] = useState<PublishedContent<SkillData>[]>([]);
  const [achievements, setAchievements] = useState<PublishedContent<AchievementData>[]>([]);
  const [education, setEducation] = useState<PublishedContent<EducationData>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          loadedSettings,
          loadedProjects,
          loadedSkills,
          loadedAchievements,
          loadedEducation,
        ] = await Promise.all([
          ContentStore.getSiteSettings(),
          ContentStore.getPublishedContent<ProjectData>('project'),
          ContentStore.getPublishedContent<SkillData>('skill'),
          ContentStore.getPublishedContent<AchievementData>('achievement'),
          ContentStore.getPublishedContent<EducationData>('education'),
        ]);

        setSettings(loadedSettings);
        // Take top 4 projects for the showcase
        setProjects(loadedProjects.slice(0, 4));
        setSkills(loadedSkills.slice(0, 8));
        setAchievements(loadedAchievements.slice(0, 4));
        setEducation(loadedEducation.slice(0, 1));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4 min-h-[70vh] bg-[#DEDEDE]">
        <div className="w-8 h-8 border-2 border-[#0F0F0F] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#717171]">
          Loading portfolio...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FFFFFF] text-[#171717] overflow-hidden">
      <SEOHead
        title={settings?.seoTitle || 'Rakshith YB | Software Engineer'}
        description={
          settings?.seoDescription ||
          'Personal portfolio of Rakshith YB — Software Engineer & Computer Science student.'
        }
      />      {/* ========================================================================= */}
      {/* 1. LANDING PAGE — FIRST SCREEN (Hero Content & Expertise Strip)            */}
      {/* ========================================================================= */}
      <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-[#FFFFFF]">
        
        {/* 1A. Hero Section (Headline, Bio, Portrait & Circular Name Badge) */}
        <section className="relative w-full flex-1 flex items-center py-10 sm:py-14 lg:py-16 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
            
            {/* Left Column: Headline & Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6 sm:space-y-7 z-10"
            >
              {/* Small Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F5] border border-[#D0D0D0] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#717171]" />
                <span className="text-xs font-sans font-semibold uppercase tracking-[0.22em] text-[#171717]">
                  HI, I'M RAKSHITH YB
                </span>
              </div>

              {/* Main Headline with Proportionate 3-Line Composition (Pure Monochrome) */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.65rem] xl:text-[4.1rem] font-serif font-bold text-[#171717] leading-[1.08] tracking-tight">
                <span className="block">Designing Systems</span>
                <span className="block">That Leave</span>
                <span className="font-serif italic font-normal text-[#2B2B2B] block text-[0.93em] tracking-[-0.01em] mt-0.5 sm:mt-1">
                  A Lasting Impression.
                </span>
              </h1>

              {/* Subheading / Description (Thunder #4D4D4D) */}
              <p className="text-sm sm:text-base text-[#4D4D4D] leading-relaxed max-w-lg lg:max-w-xl font-sans font-normal">
                {settings?.subheadline ||
                  'Computer Science student with strong foundations in Python, backend development, REST APIs, and database design. Developed AI-powered platforms and competitive programming tools using Flask, MongoDB, and scikit-learn.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0F0F0F] text-[#FFFFFF] text-xs font-sans font-semibold uppercase tracking-[0.16em] hover:bg-[#2B2B2B] active:scale-95 transition-all shadow-sm group"
                >
                  <span>VIEW MY WORK</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#171717]/40 text-[#171717] text-xs font-sans font-semibold uppercase tracking-[0.16em] hover:bg-[#F5F5F5] hover:border-[#171717] active:scale-95 transition-all shadow-2xs"
                >
                  <span>ABOUT ME</span>
                </a>
              </div>

              {/* Scroll Down Indicator */}
              <div className="pt-4 sm:pt-6 flex items-center gap-2 text-[#717171]">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-medium">
                  SCROLL DOWN
                </span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce text-[#171717]" />
              </div>
            </motion.div>

            {/* Right Column: Monochrome Circular Portrait + Circular Stamp Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 relative flex items-center justify-center lg:justify-end"
            >
              {/* Background Dot Matrix Accent (Restrained Charcoal Dots) */}
              <div
                className="absolute -right-4 -bottom-4 w-40 h-40 opacity-20 pointer-events-none hidden sm:block"
                style={{
                  backgroundImage: 'radial-gradient(#2B2B2B 1.5px, transparent 1.5px)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Portrait Wrapper: anchors both circular portal and decorative badge together */}
              <div className="relative">
                {/* Rotating Stamp Badge at Top-Right Perimeter (Monochrome Chaos Black & Crisp White) */}
                <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-3 lg:-top-5 lg:-right-4 w-[92px] h-[92px] sm:w-[104px] sm:h-[104px] lg:w-[115px] lg:h-[115px] z-30 pointer-events-none">
                  <div className="relative w-full h-full flex items-center justify-center rounded-full bg-[#0F0F0F]/95 backdrop-blur-md border border-[#363636] shadow-xl p-1">
                    {/* Subtle Inner Decorative Ring */}
                    <div className="absolute inset-1 sm:inset-1.5 rounded-full border border-[#717171]/40 pointer-events-none" />

                    {/* Rotating Circular Text in Brilliant White */}
                    <svg
                      className="w-full h-full animate-spin-slow text-white"
                      viewBox="0 0 120 120"
                    >
                      <path
                        id="heroBadgePath"
                        d="M 60, 60 m -46, 0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
                        fill="none"
                      />
                      <text
                        className="font-sans font-semibold uppercase fill-white select-none"
                        style={{ fontSize: '8.5px', letterSpacing: '0.19em' }}
                      >
                        <textPath href="#heroBadgePath" startOffset="0%">
                          ✦ RAKSHITH YB ✦ SOFTWARE ENGINEER ✦
                        </textPath>
                      </text>
                    </svg>

                    {/* Name in center with enhanced legibility and comfortable breathing room */}
                    <span className="absolute text-[11px] sm:text-xs font-sans font-bold tracking-[0.14em] text-white select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center px-1">
                      Rakshith
                    </span>
                  </div>
                </div>

                {/* Circular Portal Backdrop in Chaos Black / Charcoal (#0F0F0F / #2B2B2B) */}
                <div className="relative w-[280px] sm:w-[350px] lg:w-[390px] xl:w-[420px] aspect-square rounded-full bg-gradient-to-tr from-[#0F0F0F] via-[#2B2B2B] to-[#0F0F0F] shadow-xl flex items-end justify-center overflow-hidden border border-[#363636] group">
                  {/* Subtle Ambient Ring */}
                  <div className="absolute inset-2 rounded-full border border-[#717171]/25 pointer-events-none" />

                  {/* High-Aesthetic Portrait Image */}
                  <img
                    src="/image-Photoroom.png"
                    alt="Rakshith YB"
                    className="w-full h-full object-cover object-top scale-[1.02] transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/landing-page-image.png';
                    }}
                  />

                  {/* Bottom Subtle Gradient Fade */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0F0F0F]/80 to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* 1B. Services & Competencies 4-Column Bar (Expertise Strip Anchored at Base of Landing Page) */}
        <section className="w-full bg-[#FFFFFF] border-t border-[#D0D0D0] py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-[#D0D0D0]">
              
              {/* Card 1: Python & Backend */}
              <div className="flex flex-col justify-start space-y-3.5 lg:px-6 xl:px-8 first:lg:pl-0 group">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] border border-[#D0D0D0] flex items-center justify-center text-[#171717] shadow-2xs group-hover:bg-[#0F0F0F] group-hover:text-[#FFFFFF] transition-colors">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#171717] leading-snug">
                  PYTHON & BACKEND DEV
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4D4D4D] leading-relaxed font-sans">
                  Building backend services, robust REST APIs, and clean data architectures using Python, Flask, and SQLite.
                </p>
              </div>

              {/* Card 2: Database Architecture */}
              <div className="flex flex-col justify-start space-y-3.5 lg:px-6 xl:px-8 group">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] border border-[#D0D0D0] flex items-center justify-center text-[#171717] shadow-2xs group-hover:bg-[#0F0F0F] group-hover:text-[#FFFFFF] transition-colors">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#171717] leading-snug">
                  DATABASE ARCHITECTURE
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4D4D4D] leading-relaxed font-sans">
                  Designing structured relational schemas and document models with SQL (SQLite) and MongoDB for reliable persistence.
                </p>
              </div>

              {/* Card 3: Machine Learning & SHAP */}
              <div className="flex flex-col justify-start space-y-3.5 lg:px-6 xl:px-8 group">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] border border-[#D0D0D0] flex items-center justify-center text-[#171717] shadow-2xs group-hover:bg-[#0F0F0F] group-hover:text-[#FFFFFF] transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#171717] leading-snug">
                  AI & ML ENGINEERING
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4D4D4D] leading-relaxed font-sans">
                  Training predictive models with scikit-learn, serialized .pkl inference, and SHAP model explainability.
                </p>
              </div>

              {/* Card 4: Core CS & Problem Solving */}
              <div className="flex flex-col justify-start space-y-3.5 lg:px-6 xl:px-8 last:lg:pr-0 group">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] border border-[#D0D0D0] flex items-center justify-center text-[#171717] shadow-2xs group-hover:bg-[#0F0F0F] group-hover:text-[#FFFFFF] transition-colors">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#171717] leading-snug">
                  CORE CS & TESTING
                </h3>
                <p className="text-xs sm:text-[13px] text-[#4D4D4D] leading-relaxed font-sans">
                  Strong foundations in DSA, OOP, Time & Space Complexity, Agile workflows, System Testing, and Debugging.
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>

      {/* ========================================================================= */}
      {/* 2. FULL-VIEWPORT ABOUT ME SECTION (Chaos Black #0F0F0F Surface)           */}
      {/* ========================================================================= */}
      <section
        id="about"
        className="relative w-full bg-[#0F0F0F] text-[#FFFFFF] min-h-[100svh] lg:min-h-[calc(100svh-5rem)] flex flex-col justify-start border-t border-[#363636] pt-0 pb-16 sm:pb-20 lg:pb-24"
      >
        {/* Subtle Atmospheric Light (Contained so it never overflows) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2B2B2B]/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2B2B2B]/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-start pt-0">
            
            {/* Left Column — Personal Introduction */}
            <div className="md:col-span-1 lg:col-span-5 pt-10 sm:pt-12 lg:pt-16 xl:pt-20 space-y-6 sm:space-y-7">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-[0.24em] text-[#979797]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFFFFF]" />
                <span>ABOUT ME / ENGINEERING PHILOSOPHY</span>
              </div>

              {/* Large Editorial Serif Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-[3.25rem] font-serif font-bold text-[#FFFFFF] leading-[1.12] tracking-tight">
                Design is not just what it looks like. It's how it works.
              </h2>

              {/* Verified Engineering Biography */}
              <p className="text-sm sm:text-base text-[#BCBCBC] leading-relaxed font-sans max-w-lg font-normal">
                {settings?.bioSummary ||
                  'Computer Science student with strong foundations in Python, backend development, REST APIs, and database design. Developed AI-powered platforms and competitive programming tools using Flask, MongoDB, and scikit-learn. Proven track record in hackathons with a systematic, data-driven approach to engineering problems.'}
              </p>

              {/* Authentic Script Signature & Location */}
              <div className="pt-2 flex flex-col gap-1">
                <div className="font-script text-4xl sm:text-5xl lg:text-[3.4rem] text-[#FFFFFF] leading-none">
                  Rakshith YB
                </div>
                <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#979797] font-medium pt-1">
                  Tiptur, Karnataka, India
                </span>
              </div>

              {/* Download CV Button */}
              <div className="pt-2 sm:pt-3">
                <a
                  href="/documents/professional Resume Rakshith YB.pdf"
                  download
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-[#FFFFFF] text-[#FFFFFF] text-xs font-sans font-semibold uppercase tracking-[0.16em] hover:bg-[#FFFFFF] hover:text-[#0F0F0F] active:scale-95 transition-all shadow-md group"
                >
                  <span>DOWNLOAD CV</span>
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Center Column — Interactive Developer ID Card (Suspended from top boundary) */}
            <div className="md:col-span-1 lg:col-span-4 flex justify-center pt-0 relative z-20">
              <DeveloperIdCard
                githubUrl={settings?.githubUrl || 'https://github.com/Rakshithyb'}
                portraitSrc="/id-card-photo.png"
              />
            </div>

            {/* Right Column — Compact Verified Highlights */}
            <div className="md:col-span-2 lg:col-span-3 pt-6 md:pt-8 lg:pt-16 xl:pt-20 space-y-3.5">
              <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#979797] font-semibold mb-2 block">
                VERIFIED HIGHLIGHTS
              </div>

              {/* Grid on tablet: 2x2, on desktop: single column */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                
                {/* Highlight 1: Academic CGPA */}
                <div className="p-4 sm:p-4.5 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] hover:border-[#717171] hover:bg-[#242424] transition-all flex items-start gap-3.5 shadow-sm group">
                  <div className="w-10 h-10 rounded-lg bg-[#0F0F0F] border border-[#333333] flex items-center justify-center text-[#FFFFFF] group-hover:scale-105 transition-transform shrink-0">
                    <GraduationCap className="w-5 h-5 text-[#FFFFFF]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-lg sm:text-xl font-serif font-bold text-[#FFFFFF] leading-tight">
                      8.1 / 10
                    </div>
                    <div className="text-[10px] font-sans uppercase tracking-[0.16em] text-[#BCBCBC] font-semibold mt-0.5">
                      ACADEMIC CGPA
                    </div>
                    <div className="text-[10px] font-sans text-[#717171] mt-0.5 truncate">
                      B.E. Computer Science • KIT Tiptur
                    </div>
                  </div>
                </div>

                {/* Highlight 2: Hackathon Achievement */}
                <div className="p-4 sm:p-4.5 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] hover:border-[#717171] hover:bg-[#242424] transition-all flex items-start gap-3.5 shadow-sm group">
                  <div className="w-10 h-10 rounded-lg bg-[#0F0F0F] border border-[#333333] flex items-center justify-center text-[#FFFFFF] group-hover:scale-105 transition-transform shrink-0">
                    <Trophy className="w-5 h-5 text-[#FFFFFF]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-base sm:text-lg font-serif font-bold text-[#FFFFFF] leading-tight">
                      Second Runner-Up
                    </div>
                    <div className="text-[10px] font-sans uppercase tracking-[0.16em] text-[#BCBCBC] font-semibold mt-0.5">
                      MIT MYSORE HACKATHON
                    </div>
                    <div className="text-[10px] font-sans text-[#717171] mt-0.5 truncate">
                      Intercollegiate Engineering Event
                    </div>
                  </div>
                </div>

                {/* Highlight 3: Backend Engineering */}
                <div className="p-4 sm:p-4.5 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] hover:border-[#717171] hover:bg-[#242424] transition-all flex items-start gap-3.5 shadow-sm group">
                  <div className="w-10 h-10 rounded-lg bg-[#0F0F0F] border border-[#333333] flex items-center justify-center text-[#FFFFFF] group-hover:scale-105 transition-transform shrink-0">
                    <Server className="w-5 h-5 text-[#FFFFFF]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-base sm:text-lg font-serif font-bold text-[#FFFFFF] leading-tight">
                      Python + Flask
                    </div>
                    <div className="text-[10px] font-sans uppercase tracking-[0.16em] text-[#BCBCBC] font-semibold mt-0.5">
                      BACKEND & REST APIS
                    </div>
                    <div className="text-[10px] font-sans text-[#717171] mt-0.5 truncate">
                      REST APIs, Services & SQL
                    </div>
                  </div>
                </div>

                {/* Highlight 4: AI/ML Engineering */}
                <div className="p-4 sm:p-4.5 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] hover:border-[#717171] hover:bg-[#242424] transition-all flex items-start gap-3.5 shadow-sm group">
                  <div className="w-10 h-10 rounded-lg bg-[#0F0F0F] border border-[#333333] flex items-center justify-center text-[#FFFFFF] group-hover:scale-105 transition-transform shrink-0">
                    <Sparkles className="w-5 h-5 text-[#FFFFFF]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-base sm:text-lg font-serif font-bold text-[#FFFFFF] leading-tight">
                      scikit-learn & SHAP
                    </div>
                    <div className="text-[10px] font-sans uppercase tracking-[0.16em] text-[#BCBCBC] font-semibold mt-0.5">
                      AI / ML & EVALUATION
                    </div>
                    <div className="text-[10px] font-sans text-[#717171] mt-0.5 truncate">
                      Model Evaluation & Interpretability
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SELECTED PROJECTS SHOWCASE (Pure White Surface, Clean Monochrome Grid) */}
      {/* ========================================================================= */}
      <section id="projects" className="w-full bg-[#FFFFFF] text-[#171717] py-20 sm:py-28 lg:py-32 border-t border-[#D0D0D0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 space-y-10 sm:space-y-12">
          
          {/* Header Row (Intentional Spacing & Clear Visual Hierarchy) */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D0D0D0] pb-6 sm:pb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-[#717171]">
                <span>✦</span>
                <span>FEATURED WORK</span>
                <span>✦</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#171717] tracking-tight">
                Selected Projects
              </h2>
            </div>
            
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.16em] text-[#171717] hover:text-[#4D4D4D] transition-colors group font-semibold"
            >
              <span>VIEW ALL PROJECTS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4-Card Project Showcase Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((proj, idx) => (
              <motion.article
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group bg-[#FFFFFF] border border-[#D0D0D0] rounded-xl overflow-hidden hover:border-[#0F0F0F] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Mockup Container */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-[#F8F8F8] to-[#EDEDED] p-5 flex flex-col justify-between overflow-hidden border-b border-[#D0D0D0]">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#717171]">
                    <span>0{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded bg-[#0F0F0F] text-[#FFFFFF] border border-[#0F0F0F]">
                      {proj.content_data.category}
                    </span>
                  </div>

                  {/* Aesthetic Project Monogram / Preview Graphic */}
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-14 h-14 rounded-full border border-[#D0D0D0] flex items-center justify-center text-[#171717] group-hover:scale-110 group-hover:border-[#0F0F0F] group-hover:bg-[#0F0F0F] group-hover:text-[#FFFFFF] transition-all bg-[#FFFFFF] shadow-2xs">
                      <Code2 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-[#717171] truncate">
                    {proj.content_data.completionDate || '2025 - Present'}
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-lg text-[#171717] group-hover:text-[#0F0F0F] transition-colors leading-snug line-clamp-2">
                      <Link to={`/projects/${proj.slug}`}>
                        {proj.content_data.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#4D4D4D] line-clamp-3 leading-relaxed">
                      {proj.content_data.description}
                    </p>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.content_data.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#F5F5F5] text-[#171717] border border-[#D0D0D0]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="pt-3 border-t border-[#D0D0D0] flex items-center justify-between">
                    <Link
                      to={`/projects/${proj.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-[#171717] group-hover:text-[#0F0F0F] transition-colors font-semibold"
                    >
                      <span>Case Study</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {proj.content_data.githubUrl && (
                      <a
                        href={proj.content_data.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#717171] hover:text-[#0F0F0F] transition-colors"
                        title="View Source Code"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CALL TO ACTION BANNER (Soft White & Chaos Black Button Banner)          */}
      {/* ========================================================================= */}
      <section id="contact" className="w-full py-20 sm:py-28 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-[#FFFFFF] border border-[#D0D0D0] p-8 sm:p-14 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8 overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#BCBCBC]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10 max-w-xl">
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.22em] text-[#717171]">
              HAVE A PROJECT OR ROLE IN MIND?
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#171717] leading-tight">
              Let's Create Something Amazing Together.
            </h2>
            <p className="text-xs sm:text-sm text-[#4D4D4D]">
              I am actively open to software engineering internships, graduate roles, and technical collaborations.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <a
              href={`mailto:${settings?.email || 'rakshir585@gmail.com'}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0F0F0F] text-[#FFFFFF] text-xs font-sans font-semibold uppercase tracking-[0.16em] hover:bg-[#2B2B2B] active:scale-95 transition-all shadow-md group"
            >
              <span>LET'S WORK TOGETHER</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

