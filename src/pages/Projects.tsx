import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Github, ExternalLink, Filter } from 'lucide-react';
import { ContentStore } from '../lib/contentStore';
import { ProjectData, PublishedContent } from '../types';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<PublishedContent<ProjectData>[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentStore.getPublishedContent<ProjectData>('project')
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.content_data.category)))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.content_data.category === selectedCategory);

  return (
    <div className="space-y-12">
      <SEOHead
        title="Projects & Engineering Work"
        description="Software engineering projects, AI-based disaster prediction, online judging platforms, and algorithmic tools by Rakshith YB."
      />

      <div className="border-b border-[#D0D0D0] pb-8 space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#717171] font-semibold">
          ✦ Selected Engineering Portfolio ✦
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#171717]">
          Projects & Architecture
        </h1>
        <p className="text-sm text-[#4D4D4D] max-w-2xl font-sans leading-relaxed">
          AI-powered platforms, predictive machine learning models, custom online judging systems, and competitive programming progress trackers engineered with Python, Flask, MongoDB, and scikit-learn.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-[#717171] mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-sans uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? 'bg-[#0F0F0F] text-[#FFFFFF] font-semibold shadow-xs'
                : 'bg-[#FFFFFF] text-[#4D4D4D] hover:bg-[#DEDEDE] hover:text-[#171717] border border-[#D0D0D0]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#717171]">
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#D0D0D0] rounded-xl p-8 bg-[#FFFFFF]">
          <p className="text-sm text-[#4D4D4D] font-sans">No projects found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <article
              key={proj.id}
              className="group border border-[#D0D0D0] hover:border-[#0F0F0F] rounded-xl p-7 bg-[#FFFFFF] transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-sans uppercase tracking-[0.16em] text-[#717171] font-medium">
                    {proj.content_data.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {proj.content_data.completionDate && (
                      <span className="text-[11px] font-mono text-[#717171]">
                        {proj.content_data.completionDate}
                      </span>
                    )}
                    {proj.content_data.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-sans uppercase tracking-wider bg-[#0F0F0F] text-[#FFFFFF] font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#171717] group-hover:text-[#4D4D4D] transition-colors">
                    <Link to={`/projects/${proj.slug}`}>
                      {proj.content_data.title}
                    </Link>
                  </h2>
                  <p className="text-xs font-medium text-[#171717]/80">
                    {proj.content_data.tagline}
                  </p>
                  <p className="text-xs text-[#4D4D4D] leading-relaxed line-clamp-3">
                    {proj.content_data.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.content_data.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded text-[11px] font-mono bg-[#DEDEDE] text-[#171717] border border-[#D0D0D0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-[#D0D0D0] flex items-center justify-between">
                <Link
                  to={`/projects/${proj.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-[#0F0F0F] hover:text-[#4D4D4D] font-semibold"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-3">
                  {proj.content_data.githubUrl && (
                    <a
                      href={proj.content_data.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-sans text-[#4D4D4D] hover:text-[#171717] transition-colors"
                      title="GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                  {proj.content_data.liveDemoUrl && (
                    <a
                      href={proj.content_data.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-sans text-[#4D4D4D] hover:text-[#171717] transition-colors"
                      title="Live Demonstration"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
