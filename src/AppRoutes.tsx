
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import BusinessIdeaGeneratorPage from '@/pages/BusinessIdeaGenerator';
import NotFound from '@/pages/NotFound';

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import EducationManagement from '@/pages/admin/EducationManagement';
import CommunityManagement from '@/pages/admin/CommunityManagement';
import Settings from '@/pages/admin/Settings';
import Analytics from '@/pages/admin/Analytics';
import BehavioralAnalysis from '@/pages/admin/BehavioralAnalysis';
import AdminLayout from '@/components/admin/AdminLayout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:postId" element={<BlogPost />} />
      <Route path="/business-idea-generator" element={<BusinessIdeaGeneratorPage />} />
      
      {/* Admin Routes - Moved to regular routes since there's no auth */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="behavior" element={<BehavioralAnalysis />} />
        <Route path="education" element={<EducationManagement />} />
        <Route path="community" element={<CommunityManagement />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="security" element={<NotFound />} />
        <Route path="database" element={<NotFound />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
