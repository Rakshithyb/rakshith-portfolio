import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Tag, BookOpen } from 'lucide-react';
import { ContentStore } from '../lib/contentStore';
import { BlogPostData, PublishedContent } from '../types';
import { SEOHead } from '../components/SEOHead';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<PublishedContent<BlogPostData>[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentStore.getPublishedContent<BlogPostData>('blog_post')
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const allTags = ['All', ...Array.from(new Set(posts.flatMap((p) => p.content_data.tags)))];

  const filteredPosts = selectedTag === 'All'
    ? posts
    : posts.filter((p) => p.content_data.tags.includes(selectedTag));

  return (
    <div className="space-y-12">
      <SEOHead
        title="Technical Journal & Notes — Rakshith YB"
        description="Technical writing and project insights by Rakshith YB."
      />

      <div className="border-b border-[#D0D0D0] pb-8 space-y-3">
        <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-[#717171] font-semibold">
          ✦ Writing & Notes ✦
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#171717]">
          Technical Journal & Notes
        </h1>
        <p className="text-sm text-[#4D4D4D] max-w-2xl font-sans leading-relaxed">
          Technical insights on Python backends, machine learning pipelines, and database architecture.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-[#717171]">
          Loading articles...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="border border-[#D0D0D0] rounded-xl p-8 sm:p-12 bg-[#FFFFFF] shadow-2xs text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F5F5F5] border border-[#D0D0D0] flex items-center justify-center mx-auto text-[#171717]">
            <BookOpen className="w-5 h-5 text-[#717171]" />
          </div>
          <h2 className="text-lg font-serif font-bold text-[#171717]">
            Articles In Progress
          </h2>
          <p className="text-xs sm:text-sm text-[#4D4D4D] leading-relaxed max-w-lg mx-auto font-sans">
            Technical writing is currently focused on detailed project case studies. Check out the verified architectural writeups in the Projects section.
          </p>
          <div className="pt-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0F0F0F] text-[#FFFFFF] text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#2B2B2B] transition-colors"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="border border-[#D0D0D0] hover:border-[#0F0F0F] rounded-xl p-6 sm:p-8 bg-[#FFFFFF] transition-all flex flex-col sm:flex-row sm:items-baseline justify-between gap-6 shadow-2xs"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3 text-[11px] font-mono text-[#717171]">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.content_data.publishedDate}</span>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.content_data.readTimeMinutes || 5} min read</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#171717] hover:text-[#4D4D4D] transition-colors">
                  <Link to={`/blog/${post.slug}`}>
                    {post.content_data.title}
                  </Link>
                </h2>

                <p className="text-sm text-[#4D4D4D] leading-relaxed font-sans">
                  {post.content_data.excerpt}
                </p>
              </div>

              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-[#0F0F0F] hover:text-[#4D4D4D] transition-colors font-medium shrink-0"
              >
                <span>Read article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
export default Blog;
