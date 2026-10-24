import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ABOUT', href: '/#about' },
    { label: 'PROJECTS', href: '/projects' },
    { label: 'SKILLS', href: '/skills' },
    { label: 'CERTIFICATES', href: '/certificates' },
    { label: 'EDUCATION', href: '/education' },
    { label: 'ACHIEVEMENTS', href: '/achievements' },
    { label: 'RESUME', href: '/resume' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && !path.startsWith('/#') && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#DEDEDE]/90 backdrop-blur-md border-b border-[#D0D0D0] transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Monogram Mark (Monochrome Architectural Style) */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 rounded border border-[#363636]/30 flex items-center justify-center bg-[#FFFFFF] text-[#171717] font-serif text-xl font-bold transition-all duration-300 group-hover:bg-[#0F0F0F] group-hover:text-[#FFFFFF] group-hover:border-[#0F0F0F] shadow-2xs">
            R/
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base tracking-tight text-[#171717] group-hover:text-[#4D4D4D] transition-colors leading-tight">
              RAKSHITH YB
            </span>
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#717171]">
              Software Engineer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isAnchor = link.href.startsWith('/#');
            if (isAnchor) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[11px] xl:text-xs font-sans font-medium tracking-[0.14em] text-[#4D4D4D] hover:text-[#171717] transition-colors"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-[11px] xl:text-xs font-sans font-medium tracking-[0.14em] transition-all relative py-1 ${
                  isActive(link.href)
                    ? 'text-[#171717] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#171717]'
                    : 'text-[#4D4D4D] hover:text-[#171717]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & High-Contrast Black Pill CTA */}
        <div className="flex items-center gap-3 xl:gap-4">
          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D0D0D0] text-[11px] font-mono text-[#4D4D4D] hover:text-[#171717] hover:border-[#171717] transition-colors"
            title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
          >
            <Shield className="w-3 h-3 text-[#717171]" />
            <span>{isAuthenticated ? 'Dashboard' : 'CMS'}</span>
          </Link>

          <a
            href="mailto:rakshir585@gmail.com"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F0F0F] text-[#FFFFFF] text-xs font-sans font-semibold uppercase tracking-[0.15em] hover:bg-[#2B2B2B] active:scale-95 transition-all shadow-sm"
          >
            <span>LET'S TALK</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#171717] hover:text-[#4D4D4D] focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#D0D0D0] bg-[#DEDEDE] px-6 py-5 animate-in fade-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-3" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith('/#');
              if (isAnchor) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm py-1.5 tracking-[0.1em] text-[#4D4D4D] hover:text-[#171717]"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-1.5 tracking-[0.1em] transition-colors ${
                    isActive(link.href)
                      ? 'text-[#171717] font-bold'
                      : 'text-[#4D4D4D] hover:text-[#171717]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-[#D0D0D0] flex items-center justify-between">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#4D4D4D]"
              >
                <Shield className="w-3.5 h-3.5 text-[#717171]" />
                <span>{isAuthenticated ? 'CMS Dashboard' : 'Admin CMS'}</span>
              </Link>
              <a
                href="mailto:rakshir585@gmail.com"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0F0F0F] text-[#FFFFFF] text-xs font-sans font-medium uppercase tracking-wider hover:bg-[#2B2B2B]"
              >
                <span>LET'S TALK</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
