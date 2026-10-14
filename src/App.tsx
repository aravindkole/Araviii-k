import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { TimetablePage } from './pages/TimetablePage';
import { ExamsPage } from './pages/ExamsPage';
import { NotesPage } from './pages/NotesPage';
import { FocusTimerPage } from './pages/FocusTimerPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { HelpAboutPage } from './pages/HelpAboutPage';
import { AIAssistantPage } from './pages/AIAssistantPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated / Demo Student Workspace */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="timetable" element={<TimetablePage />} />
            <Route path="exams" element={<ExamsPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="focus" element={<FocusTimerPage />} />
            <Route path="study-planner" element={<StudyPlannerPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="ai" element={<AIAssistantPage />} />
            <Route path="profile" element={<ProfileSettingsPage />} />
            <Route path="help" element={<HelpAboutPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
