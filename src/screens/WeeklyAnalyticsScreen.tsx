import React from 'react';
import { BarChart2, TrendingUp, Droplet, ArrowUpRight, Award, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils/persian';
import { NavScreen } from '../components/BottomNav';

interface WeeklyAnalyticsScreenProps {
  onNavigate: (screen: NavScreen) => void;
}

export const WeeklyAnalyticsScreen: React.FC<WeeklyAnalyticsScreenProps> = ({ onNavigate }) => {
  const { weeklyReport, profile } = useApp();
  const goalMl = profile.dailyWaterGoalMl;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-sky-500" />
            <span>گزارش هفتگی مصرف آب</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            تحلیل پیوستگی و حجم مصرف در ۷ روز گذشته
          </p>
        </div>

        <button
          onClick={() => onNavigate('recharts_trend')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 transition-colors cursor-pointer"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>نمودار Recharts</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">میانگین روزانه</div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {toPersianDigits(weeklyReport.dailyAverageMl)}
            <span className="text-xs font-normal text-slate-400 mr-1">ml</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{toPersianDigits(weeklyReport.trendVsLastWeekPercent)}٪ رشد نسبت به هفته قبل</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">کل حجم ۷ روز</div>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400">
            {toPersianDigits((weeklyReport.totalAmountMl / 1000).toFixed(1))}
            <span className="text-xs font-normal text-slate-400 mr-1">لیتر</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
            {toPersianDigits(weeklyReport.goalCompletionPercentage)}٪ تحقق هدف هفتگی
          </div>
        </div>
      </div>

      {/* Motivational Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200/80 dark:border-emerald-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
            💧
          </div>
          <div>
            <div className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
              عالی پیش می‌ری!
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              میانگین مصرف شما نزدیک به حد استاندارد سلامت است
            </div>
          </div>
        </div>
        <Award className="w-5 h-5 text-emerald-500" />
      </div>

      {/* Weekly Simple Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">نمای میله‌ای ۷ روز هفته</span>
          <span className="text-[11px] text-emerald-600 font-bold">
            خط هدف: {toPersianDigits(goalMl)} ml
          </span>
        </div>

        <div className="h-44 flex items-end justify-between gap-2 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 relative">
          {/* Target line */}
          <div className="absolute inset-x-0 top-12 border-b-2 border-dashed border-emerald-400/50 pointer-events-none" />

          {weeklyReport.days.map((day, idx) => {
            const maxVal = 2600;
            const barHeightPct = Math.min(100, Math.round((day.amountMl / maxVal) * 100));
            const isReached = day.amountMl >= goalMl;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] text-slate-400 group-hover:text-sky-600 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {toPersianDigits(day.amountMl)}
                </span>
                <div className="w-full max-w-[28px] h-32 flex items-end justify-center">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      day.isToday
                        ? 'bg-gradient-to-t from-sky-600 to-sky-400 ring-2 ring-sky-400/40'
                        : isReached
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                        : 'bg-gradient-to-t from-sky-400 to-sky-300 opacity-80'
                    }`}
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>
                <span
                  className={`text-[11px] mt-2 font-bold ${
                    day.isToday ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {day.dayName}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>تحقق کامل هدف</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>نزدیک به هدف</span>
          </div>
        </div>
      </div>

      {/* Days List Table */}
      <div className="space-y-2">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 px-1">
          جزئیات روزانه این هفته
        </h3>
        {weeklyReport.days.map((day, idx) => {
          const isReached = day.amountMl >= goalMl;
          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border flex items-center justify-between ${
                day.isToday
                  ? 'border-sky-300 dark:border-sky-800 bg-sky-50/40 dark:bg-sky-950/20'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                    day.isToday
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {day.dayName}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {day.fullDate}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {toPersianDigits((day.amountMl / 250).toFixed(1))} لیوان آب
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-black text-sm text-slate-800 dark:text-slate-200">
                  {toPersianDigits(day.amountMl)} ml
                </span>
                <div
                  className={`text-[11px] font-bold ${
                    isReached ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {isReached ? '✓ کامل شد' : `${toPersianDigits(Math.round((day.amountMl / goalMl) * 100))}٪`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
