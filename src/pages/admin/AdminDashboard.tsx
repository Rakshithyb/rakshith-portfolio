import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Cpu,
  Award,
  Briefcase,
  GraduationCap,
  Trophy,
  BookOpen,
  FileText,
  BarChart3,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { ContentStore } from '../../lib/contentStore';
import { ContentType, ContentDraft, PublishedContent, AnalyticsSummary } from '../../types';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Record<string, { drafts: number; published: number }>>({});
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const contentTypes: ContentType[] = [
          'project',
          'skill',
          'certificate',
          'experience',
          'education',
          'achievement',
          'blog_post',
          'resume',
        ];

        const counts: Record<string, { drafts: number; published: number }> = {};

        for (const type of contentTypes) {
          const drafts = await ContentStore.getDrafts(type);
          const published = await ContentStore.getPublishedContent(type);
          counts[type] = {
            drafts: drafts.length,
            published: published.length,
          };
        }

        const analyticsData = await ContentStore.getAnalyticsSummary();
        setStats(counts);
        setAnalytics(analyticsData);
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, []);

  const sections = [
    { type: 'project', title: 'Projects', href: '/admin/projects', icon: FolderGit2 },
    { type: 'skill', title: 'Skills', href: '/admin/skills', icon: Cpu },
    { type: 'certificate', title: 'Certificates', href: '/admin/certificates', icon: Award },
    { type: 'experience', title: 'Experience', href: '/admin/experience', icon: Briefcase },
    { type: 'education', title: 'Education', href: '/admin/education', icon: GraduationCap },
    { type: 'achievement', title: 'Achievements', href: '/admin/achievements', icon: Trophy },
    { type: 'blog_post', title: 'Technical Blog', href: '/admin/blog', icon: BookOpen },
    { type: 'resume', title: 'Resume Document', href: '/admin/resume', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-mono text-ink-faint">
        Loading CMS dashboard overview...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint font-semibold">
            CMS Control Center
          </span>
          <h1 className="text-2xl font-serif font-bold text-ink">
            Editorial Overview
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Manage drafts, private previews, and explicitly published live content.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/preview">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              <Eye className="w-3.5 h-3.5" />
              <span>Private Preview</span>
            </Button>
          </Link>
          <Link to="/admin/export">
            <Button variant="secondary" size="sm" className="font-mono text-xs">
              <span>Backup Content</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Traffic Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-divider rounded-lg p-4 bg-canvas-subtle">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faint font-semibold">
            Total Page Views
          </div>
          <div className="text-2xl font-mono font-bold text-ink mt-2">
            {analytics?.totalViews || 0}
          </div>
          <div className="text-[11px] text-ink-faint font-mono mt-1">
            Privacy-safe (no raw IP storage)
          </div>
        </div>

        <div className="border border-divider rounded-lg p-4 bg-canvas-subtle">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faint font-semibold">
            Views Last 7 Days
          </div>
          <div className="text-2xl font-mono font-bold text-ink mt-2">
            {analytics?.viewsLast7Days || 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-mono mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active visitor telemetry</span>
          </div>
        </div>

        <div className="border border-divider rounded-lg p-4 bg-canvas-subtle">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faint font-semibold">
            Publishing Isolation
          </div>
          <div className="text-2xl font-mono font-bold text-ink mt-2">
            Enforced
          </div>
          <div className="text-[11px] text-ink-muted font-mono mt-1">
            Drafts hidden from public queries
          </div>
        </div>
      </div>

      {/* Content Types Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-serif font-bold text-ink">
          Content Inventories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const count = stats[sec.type] || { drafts: 0, published: 0 };
            const unpublishedDrafts = Math.max(0, count.drafts - count.published);

            return (
              <Link
                key={sec.type}
                to={sec.href}
                className="group border border-divider hover:border-ink rounded-lg p-5 bg-white transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded bg-canvas-subtle border border-divider flex items-center justify-center">
                      <Icon className="w-4 h-4 text-ink" />
                    </div>
                    {unpublishedDrafts > 0 ? (
                      <Badge variant="draft">{unpublishedDrafts} unpublished</Badge>
                    ) : (
                      <Badge variant="published">In Sync</Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-ink group-hover:text-zinc-700 transition-colors">
                      {sec.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-ink-muted mt-1">
                      <span>{count.published} live</span>
                      <span>•</span>
                      <span>{count.drafts} drafts</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-divider-subtle flex items-center justify-between text-xs font-mono text-ink-muted group-hover:text-ink">
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Publishing Rule Notice */}
      <div className="p-4 rounded-lg border border-divider bg-canvas-subtle flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-ink-faint shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-semibold text-ink font-mono">
            Publishing Contract Guarantee
          </div>
          <p className="text-ink-muted leading-relaxed">
            Saving changes writes exclusively to <code className="font-mono text-zinc-900 bg-zinc-200 px-1 py-0.5 rounded text-[11px]">content_drafts</code>.
            Content only transitions to the public website when you explicitly click <strong>"Publish"</strong>.
            You can safely review changes beforehand via the <strong>Private Preview</strong> route.
          </p>
        </div>
      </div>
    </div>
  );
};
