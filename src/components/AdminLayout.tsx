import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  Award,
  Briefcase,
  GraduationCap,
  Trophy,
  BookOpen,
  FileText,
  Image,
  Sliders,
  BarChart3,
  Download,
  LogOut,
  ExternalLink,
  Shield,
  Eye,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export const AdminLayout: React.FC = () => {
  const { userEmail, isSupabaseConnected, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
    { label: 'Skills', href: '/admin/skills', icon: Cpu },
    { label: 'Certificates', href: '/admin/certificates', icon: Award },
    { label: 'Experience', href: '/admin/experience', icon: Briefcase },
    { label: 'Education', href: '/admin/education', icon: GraduationCap },
    { label: 'Achievements', href: '/admin/achievements', icon: Trophy },
    { label: 'Blog Posts', href: '/admin/blog', icon: BookOpen },
    { label: 'Resume', href: '/admin/resume', icon: FileText },
    { label: 'Media Library', href: '/admin/media', icon: Image },
    { label: 'Site Settings', href: '/admin/settings', icon: Sliders },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Backup & Export', href: '/admin/export', icon: Download },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-canvas-subtle text-ink flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-divider px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-ink text-white font-mono font-bold text-xs flex items-center justify-center">
              CMS
            </span>
            <span className="font-semibold text-sm tracking-tight text-ink">
              Portfolio CMS
            </span>
          </Link>
          <span className="hidden sm:inline-block text-divider-strong">/</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border border-divider text-ink-muted">
            <Shield className="w-3 h-3 text-ink-faint" />
            {isSupabaseConnected ? (
              <span className="text-emerald-700 font-medium">Supabase Connected</span>
            ) : (
              <span className="text-amber-700 font-medium">Local Development Mode</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink font-mono"
            title="Open Public Site in New Tab"
          >
            <span>Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="h-4 w-px bg-divider hidden sm:block" />

          <div className="text-right hidden md:block">
            <div className="text-xs font-medium text-ink truncate max-w-[180px]">
              {userEmail}
            </div>
            <div className="text-[10px] font-mono text-ink-faint">Authorized Admin</div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-divider text-xs text-ink-muted hover:text-ink hover:border-ink transition-colors font-mono"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-60 flex-shrink-0">
          <div className="bg-white rounded-lg border border-divider p-3 sticky top-24">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-ink-faint font-semibold">
              Content Sections
            </div>
            <nav className="space-y-0.5" aria-label="CMS Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                      active
                        ? 'bg-ink text-white font-semibold'
                        : 'text-ink-muted hover:text-ink hover:bg-canvas-subtle'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-ink-faint'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 pt-3 border-t border-divider">
              <Link
                to="/preview"
                className="flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium text-indigo-900 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <Eye className="w-4 h-4 text-indigo-700" />
                <span>Private Preview</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Dynamic Admin Body */}
        <main className="flex-1 min-w-0 bg-white rounded-lg border border-divider p-6 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
