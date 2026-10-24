import React, { useEffect, useState } from 'react';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import { ContentStore } from '../lib/contentStore';
import { EducationData, PublishedContent } from '../types';
import { SEOHead } from '../components/SEOHead';

export const Education: React.FC = () => {
  const [educations, setEducations] = useState<PublishedContent<EducationData>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentStore.getPublishedContent<EducationData>('education')
      .then(setEducations)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <SEOHead
        title="Education & Academic Background"
        description="Academic degree and relevant engineering coursework of Rakshith YB."
      />

      <div className="border-b border-[#D0D0D0] pb-8 space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#717171] font-semibold">
          ✦ Academic Foundation ✦
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#171717]">
          Education & Milestones
        </h1>
        <p className="text-sm text-[#4D4D4D] max-w-2xl font-sans leading-relaxed">
          Undergraduate degree, university coursework, and technical training in Computer Science & Engineering.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#717171]">
          Loading education history...
        </div>
      ) : educations.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#D0D0D0] rounded-xl p-8 bg-[#FFFFFF]">
          <p className="text-sm text-[#4D4D4D] font-sans">No education records published yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {educations.map((edu) => (
            <div
              key={edu.id}
              className="border border-[#D0D0D0] rounded-xl p-7 bg-[#FFFFFF] hover:border-[#0F0F0F] transition-all shadow-2xs space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#D0D0D0] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#DEDEDE] border border-[#BCBCBC] flex items-center justify-center text-[#171717]">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-[#171717]">
                      {edu.content_data.degree}
                    </h2>
                  </div>
                  <div className="text-sm font-medium text-[#4D4D4D]">
                    {edu.content_data.fieldOfStudy}
                  </div>
                  <div className="text-xs text-[#717171]">
                    {edu.content_data.institution}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 text-xs font-mono text-[#717171]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#717171]" />
                    <span>{edu.content_data.startDate || '2022'} — {edu.content_data.endDate || 'Current'}</span>
                  </span>
                  {edu.content_data.gradeOrGpa && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0F0F0F] text-[#FFFFFF] text-[11px] font-sans font-semibold">
                      {edu.content_data.gradeOrGpa}
                    </span>
                  )}
                </div>
              </div>

              {edu.content_data.details && (
                <p className="text-xs text-[#4D4D4D] leading-relaxed">
                  {edu.content_data.details}
                </p>
              )}

              {edu.content_data.coursework && edu.content_data.coursework.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-sans uppercase tracking-widest text-[#717171] font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-[#717171]" />
                    <span>Core Coursework</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {edu.content_data.coursework.map((course, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-[#DEDEDE] text-[#171717] border border-[#D0D0D0]"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
