import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Map, Gamepad2, BookOpen, BarChart3, Award, LogOut } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuthStore } from '../../store/useAuthStore';
import { ExitModal } from '../common/ExitModal';
import { soundService } from '../../services/soundService';

export const BottomNav: React.FC = () => {
  const { t, isTamil } = useTranslation();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const navItems = [
    {
      to: '/',
      icon: Home,
      labelKey: 'navHome' as const,
    },
    {
      to: '/learn',
      icon: Map,
      labelKey: 'navPath' as const,
    },
    {
      to: '/chat',
      icon: Gamepad2,
      labelKey: 'navChat' as const,
    },
    {
      to: '/stories',
      icon: BookOpen,
      labelKey: 'navStories' as const,
    },
    {
      to: '/progress',
      icon: BarChart3,
      labelKey: 'navReport' as const,
    },
    {
      to: '/rewards',
      icon: Award,
      labelKey: 'navRewards' as const,
    },
  ];

  const handleConfirmExit = () => {
    setIsExitModalOpen(false);
    logout();
    navigate('/auth');
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t-2 border-purple-200/80 shadow-lg px-2 sm:px-4 py-2 transition-all">
        {/* Responsive container: comfortable on desktops, tablets, and mobile */}
        <div className="max-w-3xl mx-auto flex items-center justify-around gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const label = t(item.labelKey);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => soundService.playClick()}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-150 flex-1 max-w-[80px] sm:max-w-[100px] ${
                    isActive
                      ? 'text-purple-700 font-extrabold scale-105'
                      : 'text-slate-500 hover:text-slate-800 font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`p-1.5 rounded-xl transition-colors ${
                        isActive ? 'bg-purple-100 text-purple-700 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="text-[10px] sm:text-xs tracking-tight mt-0.5 truncate w-full text-center">
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Exit Button Placed at the bottom near Rewards */}
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              setIsExitModalOpen(true);
            }}
            title={t('navExit')}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all text-slate-400 hover:text-rose-600 font-medium flex-1 max-w-[80px] sm:max-w-[100px] cursor-pointer group"
          >
            <div className="p-1.5 rounded-xl group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
              <LogOut size={20} strokeWidth={2} />
            </div>
            <span className="text-[10px] sm:text-xs tracking-tight mt-0.5 group-hover:font-bold">
              {t('navExit')}
            </span>
          </button>
        </div>
      </nav>

      {/* Exit Confirmation Dialog */}
      <ExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={handleConfirmExit}
      />
    </>
  );
};
