import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const NotFound: React.FC = () => {
  return (
    <div className="py-24 text-center max-w-md mx-auto space-y-6">
      <SEOHead title="404 — Page Not Found" />
      <span className="text-4xl font-mono font-bold text-ink">404</span>
      <h1 className="text-2xl font-serif font-bold text-ink">Page Not Found</h1>
      <p className="text-xs text-ink-muted leading-relaxed font-sans">
        The requested resource does not exist or has been unpublished by the administrator.
      </p>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-ink text-white text-xs font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};
