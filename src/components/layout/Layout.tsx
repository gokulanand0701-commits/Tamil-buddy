import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { CozyKidsBackground } from './CozyKidsBackground';
import { ToastContainer } from '../common/Toast';
import { ConfettiCelebration } from '../common/ConfettiCelebration';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative text-slate-900 bg-gradient-to-br from-purple-50/70 via-white to-purple-50/50 selection:bg-purple-200 selection:text-purple-900">
      {/* Cozy Kids Element Background with subtle low opacity */}
      <CozyKidsBackground />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Full-width Responsive Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-28 md:pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation with Exit Button next to Rewards */}
      <BottomNav />
      <ToastContainer />
      <ConfettiCelebration />
    </div>
  );
};
