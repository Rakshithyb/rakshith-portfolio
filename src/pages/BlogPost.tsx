import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, Share2 } from 'lucide-react';
import { ContentStore } from '../lib/contentStore';
import { BlogPostData, PublishedContent } from '../types';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SEOHead } from '../components/SEOHead';

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PublishedContent<BlogPostData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    ContentStore.getPublishedBySlug<BlogPostData>('blog_post', slug)
      .then(setPost)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">Loading article...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold text-ink">Article Not Found</h1>
        <p className="text-sm text-ink-muted">
          This article is unpublished or does not exist.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-ink text-white text-xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </Link>
      </div>
    );
  }

  const { title, excerpt, contentMarkdown, tags, publishedDate, readTimeMinutes } = post.content_data;

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <SEOHead title={title} description={excerpt} />

      {/* Back button & share */}
      <div className="flex items-center justify-between">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Journal</span>
        </Link>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-ink-muted hover:text-ink transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Link copied!' : 'Share article'}</span>
        </button>
      </div>

      {/* Header */}
      <header className="border-b border-divider pb-8 space-y-4">
        <div className="flex items-center gap-3 text-xs font-mono text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{publishedDate}</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{readTimeMinutes || 5} min read</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">
          {title}
        </h1>

        <p className="text-base sm:text-lg text-ink-muted font-serif italic leading-relaxed pt-2">
          {excerpt}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-[#DEDEDE] text-xs font-mono text-[#171717] border border-[#D0D0D0]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>

      {/* Article Content */}
      <article className="prose-minimal leading-relaxed">
        <MarkdownRenderer content={contentMarkdown} />
      </article>

      {/* Footer Navigation */}
      <div className="border-t border-divider pt-8 flex items-center justify-between">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-ink hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all articles</span>
        </Link>
      </div>
    </div>
  );
};
