import React from 'react';
import { Home, BarChart2, TrendingUp, Heart, Bell, User } from 'lucide-react';

export type NavScreen = 'dashboard' | 'weekly' | 'recharts_trend' | 'companion' | 'reminders' | 'profile';

interface BottomNavProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const items: { key: NavScreen; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'خانه', icon: <Home className="w-5 h-5" /> },
    { key: 'weekly', label: 'هفتگی', icon: <BarChart2 className="w-5 h-5" /> },
    { key: 'recharts_trend', label: 'نمودار', icon: <TrendingUp className="w-5 h-5" /> },
    { key: 'companion', label: 'همراه', icon: <Heart className="w-5 h-5" /> },
    { key: 'reminders', label: 'یادآورها', icon: <Bell className="w-5 h-5" /> },
    { key: 'profile', label: 'پروفایل', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {items.map((item) => {
          const isActive = currentScreen === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-extrabold scale-105'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-sky-600 dark:bg-sky-400 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
