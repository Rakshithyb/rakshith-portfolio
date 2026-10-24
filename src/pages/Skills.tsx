import React, { useEffect, useState } from 'react';
import { ContentStore } from '../lib/contentStore';
import { SkillData, PublishedContent, SkillCategory } from '../types';
import { SEOHead } from '../components/SEOHead';
import { Badge } from '../components/Badge';

export const Skills: React.FC = () => {
  const [skills, setSkills] = useState<PublishedContent<SkillData>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentStore.getPublishedContent<SkillData>('skill')
      .then(setSkills)
      .finally(() => setLoading(false));
  }, []);

  const categoryDefinitions: { key: SkillCategory; title: string; desc: string }[] = [
    { key: 'languages', title: 'Programming Languages', desc: 'Core languages for algorithmic problem solving and system development.' },
    { key: 'backend', title: 'Frameworks & Backend Architecture', desc: 'REST API design, routing, request validation, and server logic.' },
    { key: 'databases', title: 'Databases & Storage', desc: 'Document stores and relational schemas for persistent, structured data.' },
    { key: 'tools', title: 'ML Libraries & Developer Platforms', desc: 'Predictive modeling, model explainability (SHAP), version control, and Linux tooling.' },
    { key: 'other', title: 'Core Computer Science Concepts', desc: 'Data structures, object-oriented design, algorithmic complexity, and DBMS principles.' },
    { key: 'methodologies', title: 'Methodologies & Quality Assurance', desc: 'Agile development cycles, system validation, debugging, and test architecture.' },
  ];

  return (
    <div className="space-y-12">
      <SEOHead
        title="Technical Skills & Matrix"
        description="Core technical proficiencies, frameworks, and engineering competencies of Rakshith YB."
      />

      <div className="border-b border-[#D0D0D0] pb-8 space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#717171] font-semibold">
          ✦ Core Competencies ✦
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#171717]">
          Technical Skills & Foundations
        </h1>
        <p className="text-sm text-[#4D4D4D] max-w-2xl font-sans leading-relaxed">
          Structured overview of programming languages, backend frameworks, database systems, machine learning libraries, and core Computer Science disciplines.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#717171]">
          Loading skill matrix...
        </div>
      ) : (
        <div className="space-y-14">
          {categoryDefinitions.map((cat) => {
            const catSkills = skills.filter((s) => s.content_data.category === cat.key);
            if (catSkills.length === 0) return null;

            return (
              <section key={cat.key} className="space-y-5">
                <div className="border-b border-[#D0D0D0] pb-3">
                  <h2 className="text-xl font-serif font-bold text-[#171717]">
                    {cat.title}
                  </h2>
                  <p className="text-xs text-[#4D4D4D] font-sans">
                    {cat.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="border border-[#D0D0D0] rounded-xl p-5 bg-[#FFFFFF] hover:border-[#0F0F0F] transition-all shadow-2xs flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#171717] font-mono">
                            {skill.content_data.name}
                          </span>
                          {skill.content_data.highlighted && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider bg-[#0F0F0F] text-[#FFFFFF] font-semibold">
                              Core
                            </span>
                          )}
                        </div>
                        {skill.content_data.context && (
                          <p className="text-xs text-[#4D4D4D] leading-relaxed">
                            {skill.content_data.context}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Verified Resume Extra Sections: Areas of Interest & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#D0D0D0]">
            {/* Areas of Interest */}
            <div className="border border-[#D0D0D0] rounded-xl p-6 bg-[#FFFFFF] shadow-2xs space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#717171] font-semibold">
                Domain Passions
              </span>
              <h3 className="text-lg font-serif font-bold text-[#171717]">
                Areas of Interest
              </h3>
              <p className="text-xs sm:text-sm text-[#4D4D4D] leading-relaxed">
                Passionate about Cybersecurity and Ethical hacking, ML/AI engineering, competitive programming, and building scalable real-world software solutions.
              </p>
            </div>

            {/* Spoken Languages */}
            <div className="border border-[#D0D0D0] rounded-xl p-6 bg-[#FFFFFF] shadow-2xs space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#717171] font-semibold">
                Communication
              </span>
              <h3 className="text-lg font-serif font-bold text-[#171717]">
                Languages Known
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-[#F0F0F0] pb-1.5">
                  <span className="font-bold text-[#171717]">Kannada</span>
                  <span className="text-[#717171]">Native</span>
                </div>
                <div className="flex justify-between border-b border-[#F0F0F0] pb-1.5">
                  <span className="font-bold text-[#171717]">English</span>
                  <span className="text-[#717171]">Professional Working Proficiency</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[#171717]">Hindi</span>
                  <span className="text-[#717171]">Elementary Proficiency</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
