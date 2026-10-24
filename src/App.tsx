import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Layout & Pages
import { PublicLayout } from './components/PublicLayout';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Skills } from './pages/Skills';
import { Certificates } from './pages/Certificates';
import { Experience } from './pages/Experience';
import { Education } from './pages/Education';
import { Achievements } from './pages/Achievements';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Resume } from './pages/Resume';
import { NotFound } from './pages/NotFound';

// Admin Layout & Pages
import { AdminLayout } from './components/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminContentManager } from './pages/admin/AdminContentManager';
import { AdminMedia } from './pages/admin/AdminMedia';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminExport } from './pages/admin/AdminExport';
import { AdminPreview } from './pages/admin/AdminPreview';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/404" element={<NotFound />} />
          </Route>

          {/* Admin Authentication Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Private Preview Route (Protected) */}
          <Route
            path="/preview"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminPreview />} />
          </Route>

          {/* Admin CMS Routes (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route
              path="projects"
              element={
                <AdminContentManager
                  type="project"
                  title="Projects"
                  description="Manage project showcases, tech tags, case studies, and live links."
                />
              }
            />
            <Route
              path="skills"
              element={
                <AdminContentManager
                  type="skill"
                  title="Skills"
                  description="Manage technical competencies across categories with practical contexts."
                />
              }
            />
            <Route
              path="certificates"
              element={
                <AdminContentManager
                  type="certificate"
                  title="Certificates"
                  description="Manage accredited course certificates and verification credentials."
                />
              }
            />
            <Route
              path="experience"
              element={
                <AdminContentManager
                  type="experience"
                  title="Experience"
                  description="Manage engineering internships, roles, and technical contributions."
                />
              }
            />
            <Route
              path="education"
              element={
                <AdminContentManager
                  type="education"
                  title="Education"
                  description="Manage degree details, coursework, and academic milestones."
                />
              }
            />
            <Route
              path="achievements"
              element={
                <AdminContentManager
                  type="achievement"
                  title="Achievements"
                  description="Manage hackathon honors, competition results, and awards."
                />
              }
            />
            <Route
              path="blog"
              element={
                <AdminContentManager
                  type="blog_post"
                  title="Technical Blog"
                  description="Manage engineering journals, architectural reflections, and tutorials."
                />
              }
            />
            <Route
              path="resume"
              element={
                <AdminContentManager
                  type="resume"
                  title="Resume Document"
                  description="Manage resume versioning, professional summary, and PDF attachments."
                />
              }
            />
            <Route path="media" element={<AdminMedia />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="export" element={<AdminExport />} />
          </Route>

          {/* Catch-all Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
