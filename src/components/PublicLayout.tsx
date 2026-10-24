import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CursorPetals } from './CursorPetals';
import { ContentStore } from '../lib/contentStore';
import { SiteSettingsData } from '../types';

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    // Record page view in privacy-friendly analytics
    ContentStore.recordPageView(location.pathname);
    // Scroll to top on page navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    ContentStore.getSiteSettings().then(setSettings);
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#DEDEDE] text-[#171717] selection:bg-[#0F0F0F] selection:text-[#FFFFFF]">
      <CursorPetals />
      <Header />
      <main className={`flex-1 w-full ${isHomePage ? '' : 'max-w-6xl mx-auto px-6 py-8 md:py-16'}`}>
        <Outlet />
      </main>
      <Footer
        email={settings?.email}
        githubUrl={settings?.githubUrl}
        linkedinUrl={settings?.linkedinUrl}
      />
    </div>
  );
};
