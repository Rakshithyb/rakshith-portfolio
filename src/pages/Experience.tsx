import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContentStore } from '../lib/contentStore';
import { ExperienceData, PublishedContent } from '../types';
import { SEOHead } from '../components/SEOHead';

export const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<PublishedContent<ExperienceData>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentStore.getPublishedContent<ExperienceData>('experience')
      .then(setExperiences)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <SEOHead
        title="Experience & Background — Rakshith YB"
        description="Software development background and engineering path of Rakshith YB."
      />

      <div className="border-b border-[#D0D0D0] pb-8 space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#717171] font-semibold">
          ✦ Professional Journey ✦
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#171717]">
          Work Experience & Career
        </h1>
        <p className="text-sm text-[#4D4D4D] max-w-2xl font-sans leading-relaxed">
          Engineering milestones, practical application of computer science foundations, and technical focus areas.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#717171]">
          Loading experience records...
        </div>
      ) : experiences.length === 0 ? (
        <div className="border border-[#D0D0D0] rounded-xl p-8 sm:p-12 bg-[#FFFFFF] shadow-2xs text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F5F5F5] border border-[#D0D0D0] flex items-center justify-center mx-auto text-[#171717]">
            <Briefcase className="w-5 h-5 text-[#717171]" />
          </div>
          <h2 className="text-lg font-serif font-bold text-[#171717]">
            Full-Time Undergraduate Scholar
          </h2>
          <p className="text-xs sm:text-sm text-[#4D4D4D] leading-relaxed max-w-lg mx-auto font-sans">
            Currently pursuing B.E. in Computer Science & Engineering at Kalpataru Institute of Technology, Tiptur (CGPA: 8.1/10). Focused on backend development, machine learning models, and hackathons.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0F0F0F] text-[#FFFFFF] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#2B2B2B] transition-colors"
            >
              <span>View Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/achievements"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-[#D0D0D0] text-[#171717] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#F5F5F5] transition-colors"
            >
              <span>Hackathon Honors</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-6 before:w-0.5 before:bg-[#D0D0D0]">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-10 md:pl-16 space-y-3">
              <div className="absolute left-2.5 md:left-4.5 -translate-x-1/2 top-1.5 w-3.5 h-3.5 rounded-full bg-[#FFFFFF] border-2 border-[#0F0F0F]" />

              <div className="border border-[#D0D0D0] rounded-xl p-6 bg-[#FFFFFF] hover:border-[#0F0F0F] transition-all space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#F0F0F0] pb-3">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#171717]">
                      {exp.content_data.role}
                    </h2>
                    <div className="text-sm font-medium text-[#4D4D4D] flex items-center gap-2 mt-0.5">
                      <span>{exp.content_data.organization}</span>
                      {exp.content_data.location && (
                        <>
                          <span>•</span>
                          <span className="text-xs text-[#717171] flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {exp.content_data.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#717171] shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {exp.content_data.startDate} — {exp.content_data.isCurrent ? 'Present' : exp.content_data.endDate || 'Present'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#4D4D4D] leading-relaxed">
                  {exp.content_data.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Experience;
