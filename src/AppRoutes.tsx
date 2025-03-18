
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Profile from '@/pages/Profile';
import Pricing from '@/pages/Pricing';
import Payment from '@/pages/Payment';
import Subscription from '@/pages/Subscription';
import Education from '@/pages/Education';
import Community from '@/pages/Community';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Journey from '@/pages/Journey';
import JourneyDetails from '@/pages/JourneyDetails';
import StepDetailsPage from '@/pages/StepDetailsPage';
import TaskDetailPage from '@/components/journey/TaskDetailPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
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
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:postId" element={<BlogPost />} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
      <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/journey" element={<ProtectedRoute><Journey /></ProtectedRoute>} />
      <Route path="/journey-details/:journeyId" element={<ProtectedRoute><JourneyDetails /></ProtectedRoute>} />
      <Route path="/journey-details/:journeyId/step/:stepId" element={<ProtectedRoute><StepDetailsPage /></ProtectedRoute>} />
      <Route path="/task/:taskId" element={<ProtectedRoute><TaskDetailPage /></ProtectedRoute>} />

      {/* Admin Routes - Wrapped in AdminLayout */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
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
