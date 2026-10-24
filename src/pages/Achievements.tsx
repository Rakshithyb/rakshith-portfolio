import React, { useEffect, useState } from 'react';
import { Trophy, Calendar, ExternalLink } from 'lucide-react';
import { ContentStore } from '../lib/contentStore';
import { AchievementData, PublishedContent } from '../types';
import { SEOHead } from '../components/SEOHead';
import { Badge } from '../components/Badge';

export const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<PublishedContent<AchievementData>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentStore.getPublishedContent<AchievementData>('achievement')
      .then(setAchievements)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      <SEOHead
        title="Achievements & Honors"
        description="Hackathons, engineering competitions, and academic recognitions of Rakshith YB."
      />

      <div className="border-b border-[#D0D0D0] pb-8 space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#717171] font-semibold">
          ✦ Honors & Distinctions ✦
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#171717]">
          Achievements & Competitions
        </h1>
        <p className="text-sm text-[#4D4D4D] max-w-2xl font-sans leading-relaxed">
          State and intercollegiate hackathon recognitions, competitive programming awards, and academic honors.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#717171]">
          Loading achievements...
        </div>
      ) : achievements.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#D0D0D0] rounded-xl p-8 bg-[#FFFFFF]">
          <p className="text-sm text-[#4D4D4D] font-sans">No achievements published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="border border-[#D0D0D0] rounded-xl p-7 bg-[#FFFFFF] hover:border-[#0F0F0F] transition-all shadow-2xs flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#DEDEDE] border border-[#BCBCBC] flex items-center justify-center text-[#171717] shrink-0">
                    <Trophy className="w-5 h-5 text-[#717171]" />
                  </div>
                  <div className="flex items-center gap-2">
                    {ach.content_data.badgeLabel && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider bg-[#0F0F0F] text-[#FFFFFF] font-semibold">
                        {ach.content_data.badgeLabel}
                      </span>
                    )}
                    {ach.content_data.date && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#717171]">
                        <Calendar className="w-3 h-3 text-[#717171]" />
                        <span>{ach.content_data.date}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-lg font-serif font-bold text-[#171717]">
                    {ach.content_data.title}
                  </h2>
                  <p className="text-xs font-medium text-[#4D4D4D]">
                    {ach.content_data.eventOrOrganization}
                  </p>
                </div>

                <p className="text-xs text-[#4D4D4D] leading-relaxed">
                  {ach.content_data.summary}
                </p>
              </div>

              {ach.content_data.proofUrl && (
                <div className="mt-6 pt-4 border-t border-[#D0D0D0] flex justify-end">
                  <a
                    href={ach.content_data.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-sans uppercase tracking-wider text-[#0F0F0F] hover:text-[#4D4D4D] transition-colors font-medium"
                  >
                    <span>View Recognition</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
