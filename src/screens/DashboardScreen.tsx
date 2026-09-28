import React, { useState } from 'react';
import {
  Flame,
  Sun,
  Moon,
  Plus,
  Droplet,
  History,
  Award,
  Sparkles,
  ChevronLeft,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toPersianDigits, formatTime } from '../utils/persian';
import { CircularWaterProgress } from '../components/CircularWaterProgress';
import { GlassRowIndicator } from '../components/GlassRowIndicator';
import { NextReminderCard } from '../components/NextReminderCard';
import { QuickAddSheet } from '../components/QuickAddSheet';
import { CelebrationModal } from '../components/CelebrationModal';
import { LevelUpModal } from '../components/LevelUpModal';
import { GamificationModal } from '../components/GamificationModal';
import { NavScreen } from '../components/BottomNav';

interface DashboardScreenProps {
  onNavigate: (screen: NavScreen) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const {
    profile,
    todayTotalMl,
    percentage,
    glassesConsumed,
    totalGlassesGoal,
    nextReminder,
    streak,
    levelInfo,
    badges,
    todayIntakes,
    celebrationEvent,
    levelUpEvent,
    xpToastEvent,
    syncStatus,
    addWater,
    snoozeReminder,
    toggleThemeMode,
    dismissCelebration,
    dismissLevelUp,
  } = useApp();

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showGamification, setShowGamification] = useState(false);

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <span>سلام، {profile.name}</span>
            <span className="text-lg">👋</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            آب خوردن یادت نره 💙
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleThemeMode}
            className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-amber-400 shadow-xs cursor-pointer hover:bg-slate-50 transition-colors"
            title="تغییر تم شب و روز"
          >
            {profile.themeMode === 'dark' ? <Moon className="w-4 h-4 fill-current" /> : <Sun className="w-4 h-4 text-amber-500 fill-current" />}
          </button>

          {/* Streak Badge */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 text-amber-700 dark:text-amber-300">
            <Flame className="w-4 h-4 text-amber-500 fill-current" />
            <span className="font-extrabold text-xs">
              {toPersianDigits(streak.currentStreak)} روز
            </span>
          </div>
        </div>
      </div>

      {/* Gamification Level Progress Card */}
      <div
        onClick={() => setShowGamification(true)}
        className="w-full bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-white dark:to-slate-900 border border-sky-200/80 dark:border-sky-900/40 rounded-2xl p-3.5 shadow-xs cursor-pointer hover:border-sky-300 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-sky-900 flex items-center justify-center text-2xl shadow-xs">
            {levelInfo.iconEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-slate-800 dark:text-slate-200">
                سطح {toPersianDigits(levelInfo.level)}: {levelInfo.titleFa}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                {toPersianDigits(levelInfo.totalXp)} XP
              </span>
            </div>
            {/* Tiny progress bar */}
            <div className="w-32 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full"
                style={{ width: `${Math.round(levelInfo.progressPercent * 100)}%` }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400 font-bold">
          <span>باشگاه نشان‌ها</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Circular Progress Ring */}
      <div className="flex justify-center py-2">
        <CircularWaterProgress
          percentage={percentage}
          consumedMl={todayTotalMl}
          goalMl={profile.dailyWaterGoalMl}
          size={230}
        />
      </div>

      {/* Glass Row Indicator */}
      <GlassRowIndicator
        consumedGlasses={glassesConsumed}
        totalGoalGlasses={totalGlassesGoal}
        onGlassClick={() => addWater(250, 'app_quick')}
      />

      {/* Next Reminder Card */}
      <NextReminderCard
        nextReminder={nextReminder}
        onSnooze={(id) => snoozeReminder(id, 15)}
        onViewReminders={() => onNavigate('reminders')}
      />

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => addWater(250, 'app_quick')}
          className="h-13 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold text-sm shadow-md shadow-sky-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Droplet className="w-5 h-5 fill-current" />
          <span>+۱ لیوان آب (۲۵۰ml)</span>
        </button>

        <button
          onClick={() => setShowQuickAdd(true)}
          className="h-13 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-sm shadow-xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 text-sky-500" />
          <span>+ ثبت مقدار دلخواه</span>
        </button>
      </div>

      {/* Today's Activity Log */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800 dark:text-slate-200">
            <History className="w-4 h-4 text-sky-500" />
            <span>تاریخچه مصرف‌های امروز</span>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {toPersianDigits(todayIntakes.length)} نوبت ثبت شده
          </span>
        </div>

        {todayIntakes.length === 0 ? (
          <div className="w-full bg-slate-50/80 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-1.5">💧</div>
            <div className="font-bold text-xs text-slate-700 dark:text-slate-300">
              هنوز برای امروز آبی ثبت نشده است
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              با نوشیدن اولین لیوان آب، روزتان را با نشاط آغاز کنید
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {todayIntakes.map((intake) => (
              <div
                key={intake.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Droplet className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="font-black text-sm text-slate-800 dark:text-slate-200">
                      {toPersianDigits(intake.amountMl)} میلی‌لیتر
                    </span>
                    <div className="text-[11px] text-slate-400">
                      {intake.source === 'app_quick' ? 'ثبت سریع (یک لیوان)' : 'ثبت با مقدار انتخابی'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    ساعت {formatTime(intake.consumedAt)}
                  </span>
                  <div className="flex items-center gap-1 justify-end text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>همگام</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sync Footer notice */}
      <div className="text-center pt-2">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          {syncStatus}
        </span>
      </div>

      {/* Modals & Sheets */}
      {showQuickAdd && (
        <QuickAddSheet
          onClose={() => setShowQuickAdd(false)}
          onAddWater={(amount, reschedule) => addWater(amount, 'app_custom', null, reschedule)}
        />
      )}

      {celebrationEvent && (
        <CelebrationModal
          amountMl={celebrationEvent.amountMl}
          isGoalAchieved={celebrationEvent.isGoalAchieved}
          onClose={dismissCelebration}
        />
      )}

      {levelUpEvent && (
        <LevelUpModal
          newLevel={levelUpEvent.newLevel}
          levelTitle={levelUpEvent.title}
          levelEmoji={levelUpEvent.emoji}
          onClose={dismissLevelUp}
        />
      )}

      {showGamification && (
        <GamificationModal
          levelInfo={levelInfo}
          badges={badges}
          onClose={() => setShowGamification(false)}
        />
      )}
    </div>
  );
};
