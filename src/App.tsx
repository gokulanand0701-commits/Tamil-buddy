import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './pages/AuthPage';
import { HomeDashboard } from './pages/HomeDashboard';
import { LearningPath } from './pages/LearningPath';
import { LessonPlayer } from './pages/LessonPlayer';
import { AIConversation } from './pages/AIConversation';
import { StoryTime } from './pages/StoryTime';
import { ProgressReport } from './pages/ProgressReport';
import { ParentDashboard } from './pages/ParentDashboard';
import { Rewards } from './pages/Rewards';
import { useAuthStore } from './store/useAuthStore';
import { ConfettiCelebration } from './components/common/ConfettiCelebration';
import { ToastContainer } from './components/common/Toast';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication: Responsive Login & Register Screen */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        {/* Dedicated Focused View for Lesson Player */}
        <Route
          path="/lesson/:id"
          element={
            <div className="min-h-screen bg-amber-50/40 p-4 md:p-6 flex flex-col justify-between">
              <LessonPlayer />
              <ConfettiCelebration />
              <ToastContainer />
            </div>
          }
        />

        {/* Standard App Layout with Navbar & Bottom Nav - Opens directly on Home page */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/learn" element={<LearningPath />} />
          <Route path="/chat" element={<AIConversation />} />
          <Route path="/stories" element={<StoryTime />} />
          <Route path="/progress" element={<ProgressReport />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/rewards" element={<Rewards />} />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
