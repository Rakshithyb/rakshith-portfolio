import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Compass, ShieldCheck, Info } from 'lucide-react';
import { ContentStore } from '../../lib/contentStore';
import { AnalyticsSummary } from '../../types';

export const AdminAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ContentStore.getAnalyticsSummary().then((data) => {
      setAnalytics(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-mono text-ink-faint">
        Loading analytics metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-divider pb-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-ink-faint font-semibold">
          Audience Insights
        </span>
        <h1 className="text-2xl font-serif font-bold text-ink">
          Privacy-Conscious Analytics
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Minimal page-view counts and referrer domains. Strictly no raw IP addresses or fingerprinting cookies.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-divider rounded-lg p-5 bg-white space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faint flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Total Views</span>
          </div>
          <div className="text-3xl font-mono font-bold text-ink">
            {analytics?.totalViews || 0}
          </div>
          <div className="text-[11px] text-ink-faint font-mono">
            All-time aggregate requests
          </div>
        </div>

        <div className="border border-divider rounded-lg p-5 bg-white space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faint flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Last 7 Days</span>
          </div>
          <div className="text-3xl font-mono font-bold text-ink">
            {analytics?.viewsLast7Days || 0}
          </div>
          <div className="text-[11px] text-emerald-700 font-mono">
            Recent traffic activity
          </div>
        </div>

        <div className="border border-divider rounded-lg p-5 bg-white space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faint flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Last 30 Days</span>
          </div>
          <div className="text-3xl font-mono font-bold text-ink">
            {analytics?.viewsLast30Days || 0}
          </div>
          <div className="text-[11px] text-ink-muted font-mono">
            Monthly aggregate
          </div>
        </div>
      </div>

      {/* Top Pages and Referrers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="border border-divider rounded-lg p-5 bg-white space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-ink font-semibold">
            Top Visited Routes
          </h2>
          {analytics?.topPages && analytics.topPages.length > 0 ? (
            <div className="space-y-2">
              {analytics.topPages.map((page) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between text-xs font-mono p-2 rounded bg-canvas-subtle"
                >
                  <span className="text-ink font-medium">{page.path}</span>
                  <span className="text-ink-muted">{page.count} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-ink-faint">No route data recorded yet.</p>
          )}
        </div>

        {/* Top Referrers */}
        <div className="border border-divider rounded-lg p-5 bg-white space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-ink font-semibold">
            Referring Domains
          </h2>
          {analytics?.referrers && analytics.referrers.length > 0 ? (
            <div className="space-y-2">
              {analytics.referrers.map((ref) => (
                <div
                  key={ref.domain}
                  className="flex items-center justify-between text-xs font-mono p-2 rounded bg-canvas-subtle"
                >
                  <span className="text-ink font-medium">{ref.domain}</span>
                  <span className="text-ink-muted">{ref.count} visits</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-ink-faint">No referrer data recorded yet.</p>
          )}
        </div>
      </div>

      {/* Privacy Guarantee Compliance */}
      <div className="p-4 rounded-lg border border-divider bg-canvas-subtle space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-ink">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Privacy & GDPR Compliance Notice</span>
        </div>
        <p className="text-xs text-ink-muted leading-relaxed font-sans">
          This system complies strictly with privacy guidelines. Only URL path, referring host domain, and UTC timestamp are logged in the <code>page_views</code> table.
          No IP addresses, cookies, canvas fingerprints, or browser identifiers are collected or persisted. Retention policy defaults to 90 days.
        </p>
      </div>
    </div>
  );
};
