import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Github, ExternalLink, Calendar, Tag } from 'lucide-react';
import { ContentStore } from '../lib/contentStore';
import { ProjectData, PublishedContent } from '../types';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { Badge } from '../components/Badge';
import { SEOHead } from '../components/SEOHead';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PublishedContent<ProjectData> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    ContentStore.getPublishedBySlug<ProjectData>('project', slug)
      .then((data) => {
        setProject(data);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">Loading case study...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-ink">Project Not Found</h1>
        <p className="text-sm text-ink-muted">
          The requested project is either in draft status or has not been published.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-ink text-white text-xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
      </div>
    );
  }

  const { title, tagline, description, tags, category, completionDate, githubUrl, liveDemoUrl, caseStudyMarkdown } =
    project.content_data;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <SEOHead title={`${title} — Case Study`} description={description} />

      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Projects</span>
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-divider pb-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">{category}</Badge>
          {completionDate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-ink-faint">
              <Calendar className="w-3 h-3" />
              <span>{completionDate}</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-ink-muted font-sans max-w-3xl">
          {tagline}
        </p>

        {/* Action links */}
        <div className="flex flex-wrap items-center gap-3 pt-4">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#0F0F0F] text-[#FFFFFF] text-xs font-mono tracking-tight hover:bg-[#2B2B2B] transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Source Code</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
          {liveDemoUrl && (
            <a
              href={liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded border border-[#D0D0D0] text-[#171717] text-xs font-mono tracking-tight hover:border-[#171717] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#717171]" />
              <span>Live Deployment</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </header>

      {/* Technology Stack Tags */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#717171] font-semibold flex items-center gap-1">
          <Tag className="w-3 h-3" />
          <span>Technologies & Architecture</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded bg-[#DEDEDE] text-xs font-mono text-[#171717] border border-[#D0D0D0]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Project Overview */}
      <div className="bg-[#FFFFFF] border border-[#D0D0D0] rounded-lg p-6 space-y-2">
        <h2 className="text-xs font-mono uppercase tracking-widest text-ink font-semibold">
          Executive Summary
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed font-sans">
          {description}
        </p>
      </div>

      {/* Case Study Content */}
      {caseStudyMarkdown && (
        <article className="pt-4 border-t border-divider">
          <MarkdownRenderer content={caseStudyMarkdown} />
        </article>
      )}
    </div>
  );
};
