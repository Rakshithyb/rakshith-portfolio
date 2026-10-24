import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { Button } from '../../components/Button';
import { SEOHead } from '../../components/SEOHead';

export const AdminLogin: React.FC = () => {
  const { login, isAuthenticated, isSupabaseConnected } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin';

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLocalLogin = async () => {
    setEmail('owner@rakshith.dev');
    const res = await login('owner@rakshith.dev');
    if (!res.error) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <SEOHead title="Admin Authentication — CMS" />

      <div className="max-w-md w-full space-y-8 bg-white border border-divider rounded-xl p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <div className="w-10 h-10 rounded-lg bg-ink text-white font-mono font-bold mx-auto flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-ink-muted">
            Private content-management gateway. No public registration permitted.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-mono font-medium text-ink">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@example.com"
                className="w-full px-3 py-2 pl-9 rounded border border-divider text-xs font-mono focus:border-ink focus:ring-1 focus:ring-ink outline-none transition-colors"
              />
              <Mail className="w-3.5 h-3.5 text-ink-faint absolute left-3 top-3" />
            </div>
          </div>

          {isSupabaseConnected && (
            <div className="space-y-1">
              <label className="block text-xs font-mono font-medium text-ink">
                Master Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 pl-9 rounded border border-divider text-xs font-mono focus:border-ink focus:ring-1 focus:ring-ink outline-none transition-colors"
                />
                <Lock className="w-3.5 h-3.5 text-ink-faint absolute left-3 top-3" />
              </div>
            </div>
          )}

          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-2.5 text-xs font-mono"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </form>

        {!isSupabaseConnected && (
          <div className="pt-4 border-t border-divider space-y-3">
            <div className="p-3 rounded bg-amber-50/60 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <div className="space-y-1">
                <div className="font-semibold text-[11px] font-mono uppercase tracking-wider">
                  Development Mode Active
                </div>
                <div className="text-[11px] leading-relaxed text-amber-800">
                  Supabase keys are not configured yet. You can sign in using simulated mode to test the CMS and draft-publish engine.
                </div>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleQuickLocalLogin}
              className="w-full text-xs font-mono"
            >
              <span>Sign in with Simulated Admin Account</span>
            </Button>
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-[11px] font-mono text-ink-faint">
            Strict Row Level Security enabled at database boundary.
          </p>
        </div>
      </div>
    </div>
  );
};
