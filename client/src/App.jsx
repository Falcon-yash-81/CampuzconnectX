import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import ProfilePage from './pages/ProfilePage';
import SkillDirectoryPage from './pages/SkillDirectoryPage';
import HelpRequestsPage from './pages/HelpRequestsPage';
import CreateHelpRequestPage from './pages/CreateHelpRequestPage';
import HelpRequestDetailPage from './pages/HelpRequestDetailPage';
import ConnectionsPage from './pages/ConnectionsPage';
import CampusIssuesPage from './pages/CampusIssuesPage';
import CreateIssuePage from './pages/CreateIssuePage';
import IssueDetailPage from './pages/IssueDetailPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminIssuesPage from './pages/admin/AdminIssuesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminHelpRequestsPage from './pages/admin/AdminHelpRequestsPage';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Student Protected Pages */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/skills"
                  element={
                    <ProtectedRoute>
                      <SkillDirectoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <ProtectedRoute>
                      <HelpRequestsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/help/create"
                  element={
                    <ProtectedRoute>
                      <CreateHelpRequestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/help/:id"
                  element={
                    <ProtectedRoute>
                      <HelpRequestDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/connections"
                  element={
                    <ProtectedRoute>
                      <ConnectionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issues"
                  element={
                    <ProtectedRoute>
                      <CampusIssuesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issues/create"
                  element={
                    <ProtectedRoute>
                      <CreateIssuePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issues/:id"
                  element={
                    <ProtectedRoute>
                      <IssueDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Administrator Protected Pages */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/issues"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminIssuesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/help-requests"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminHelpRequestsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
