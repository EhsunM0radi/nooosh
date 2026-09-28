import React, { useState } from 'react';
import {
  User,
  Settings,
  Calculator,
  Shield,
  RefreshCw,
  Calendar,
  Volume2,
  Vibrate,
  Award,
  LogOut,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils/persian';
import { HydrationCalculatorModal } from '../components/HydrationCalculatorModal';
import { NavScreen } from '../components/BottomNav';

interface ProfileSettingsScreenProps {
  onNavigate: (screen: NavScreen) => void;
  onOpenMonthlyReport: () => void;
  onOpenOnboarding: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  onNavigate,
  onOpenMonthlyReport,
  onOpenOnboarding,
}) => {
  const {
    profile,
    updateProfile,
    updateDailyGoal,
    syncNow,
    syncStatus,
    toggleThemeMode,
  } = useApp();

  const [showCalculator, setShowCalculator] = useState(false);
  const [name, setName] = useState(profile.name);
  const [goal, setGoal] = useState(profile.dailyWaterGoalMl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || profile.name,
      dailyWaterGoalMl: goal,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              تنظیمات و مشخصات کاربر
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مدیریت اهداف هیدراتاسیون، اطلاعات بدنی و همگام‌سازی
            </p>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-600 text-white flex items-center justify-center text-xl font-black shadow-sm">
            {profile.name.charAt(0) || 'ک'}
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
              {profile.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5" dir="ltr">
              {profile.email || 'user@noosh.app'}
            </p>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>حساب فعال و همگام با حافظه محلی</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 underline cursor-pointer"
        >
          راه‌اندازی مجدد
        </button>
      </div>

      {/* Monthly Report Quick Nav Card */}
      <div
        onClick={onOpenMonthlyReport}
        className="w-full bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent border border-sky-200/80 dark:border-sky-900/40 rounded-2xl p-4 shadow-xs cursor-pointer hover:border-sky-300 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-sky-900 flex items-center justify-center text-sky-600 shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
              گزارش جامع ماهانه (ماه جاری)
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              بررسی روند ۳۰ روزه، بهترین روزها و نرخ پاسخ به یادآورها
            </div>
          </div>
        </div>
        <ChevronLeft className="w-4 h-4 text-sky-600 dark:text-sky-400" />
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
            مشخصات فردی و هدف مصرف آب
          </span>
          <button
            type="button"
            onClick={() => setShowCalculator(true)}
            className="flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>محاسبه‌گر علمی</span>
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
            نام نمایشی:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
              هدف مصرف آب روزانه:
            </label>
            <span className="text-xs font-black text-sky-600 dark:text-sky-400">
              {toPersianDigits(goal)} میلی‌لیتر ({toPersianDigits(Math.round(goal / 250))} لیوان)
            </span>
          </div>
          <input
            type="range"
            min="1200"
            max="4500"
            step="50"
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
        </div>

        {/* Biometrics Display */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-center text-xs">
          <div>
            <div className="text-slate-400 text-[10px]">وزن</div>
            <div className="font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
              {toPersianDigits(profile.weightKg)} kg
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">قد</div>
            <div className="font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
              {toPersianDigits(profile.heightCm)} cm
            </div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">سن</div>
            <div className="font-extrabold text-slate-700 dark:text-slate-300 mt-0.5">
              {toPersianDigits(profile.age)} سال
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : null}
          <span>{savedSuccess ? 'اطلاعات ذخیره شد ✓' : 'ذخیره تغییرات'}</span>
        </button>
      </form>

      {/* App Preferences */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
          تنظیمات برنامه
        </h3>

        {/* Grace day toggle */}
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
              روز بخشش زنجیره (Grace Day)
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              اگر یک روز هدف کامل نشد، زنجیره بلافاصله صفر نشود
            </div>
          </div>
          <input
            type="checkbox"
            checked={profile.graceDayEnabled}
            onChange={(e) => updateProfile({ graceDayEnabled: e.target.checked })}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
          />
        </div>

        {/* Sound toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <div>
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                پخش صدای اعلان
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                صدای زنگ ملایم هنگام یادآوری
              </div>
            </div>
          </div>
          <input
            type="checkbox"
            checked={profile.soundEnabled}
            onChange={(e) => updateProfile({ soundEnabled: e.target.checked })}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
          />
        </div>

        {/* Theme mode */}
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
              حالت شب (تاریک)
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              طراحی بهینه برای محیط‌های کم‌نور
            </div>
          </div>
          <button
            onClick={toggleThemeMode}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold cursor-pointer"
          >
            {profile.themeMode === 'dark' ? 'روشن است (Dark)' : 'خاموش است (Light)'}
          </button>
        </div>
      </div>

      {/* Sync and Backup */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
              وضعیت همگام‌سازی ابری
            </h3>
          </div>
          <button
            onClick={syncNow}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>همگام‌سازی دستی</span>
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {syncStatus}
        </p>
      </div>

      {/* Hydration Calculator Modal */}
      {showCalculator && (
        <HydrationCalculatorModal
          initialWeightKg={profile.weightKg}
          initialActivityLevel={profile.activityLevel}
          initialClimate={profile.climate}
          onApply={(newGoal, weight, activity, climate) => {
            updateDailyGoal(newGoal);
            updateProfile({ weightKg: weight, activityLevel: activity, climate });
            setGoal(newGoal);
          }}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </div>
  );
};
