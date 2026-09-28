import React from 'react';
import { ArrowRight, Calendar, Award, Droplet, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils/persian';

interface MonthlyReportScreenProps {
  onBack: () => void;
}

export const MonthlyReportScreen: React.FC<MonthlyReportScreenProps> = ({ onBack }) => {
  const { monthlyReport, profile } = useApp();

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
        >
          <ArrowRight className="w-5 h-5 rtl:rotate-0" />
        </button>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-sky-500" />
            <span>گزارش ماهانه: {monthlyReport.monthTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            تحلیل جامع روند و شاخص‌های ۳۰ روز گذشته
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">کل حجم مصرفی</div>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400">
            {toPersianDigits((monthlyReport.totalConsumedMl / 1000).toFixed(1))}
            <span className="text-xs font-normal text-slate-400 mr-1">لیتر</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {toPersianDigits(monthlyReport.comparisonWithPrevMonthPercent)}٪ بیشتر از ماه قبل
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-1">میانگین روزانه</div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {toPersianDigits(monthlyReport.dailyAverageMl)}
            <span className="text-xs font-normal text-slate-400 mr-1">ml</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            {toPersianDigits(monthlyReport.goalCompletionRate)}٪ تحقق هدف کلی
          </div>
        </div>
      </div>

      {/* Best & Lowest Day */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-3xl p-4">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 font-bold mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>بهترین روز ماه</span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100">
            {monthlyReport.bestDayDate}
          </div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {toPersianDigits(monthlyReport.bestDayAmountMl)} میلی‌لیتر
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-3xl p-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>کم‌ترین روز ماه</span>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-slate-100">
            {monthlyReport.lowestDayDate}
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
            {toPersianDigits(monthlyReport.lowestDayAmountMl)} میلی‌لیتر
          </div>
        </div>
      </div>

      {/* Reminders Discipline & Streak */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
          انضباط مصرف و زنجیره موفقیت
        </h3>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">یادآورهای پاسخ داده شده:</span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
            {toPersianDigits(monthlyReport.completedReminders)} بار
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">یادآورهای فراموش شده:</span>
          <span className="font-extrabold text-rose-500">
            {toPersianDigits(monthlyReport.missedReminders)} بار
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">طولانی‌ترین زنجیره ثبت شده:</span>
          <span className="font-extrabold text-amber-500">
            {toPersianDigits(monthlyReport.longestStreakDays)} روز متوالی
          </span>
        </div>
      </div>

      {/* 30-Day Heatmap / Mini Bar Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
            نمای مصرف ۳۰ روز ماه
          </span>
          <span className="text-[11px] text-slate-400">
            هدف: {toPersianDigits(profile.dailyWaterGoalMl)} ml
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {monthlyReport.dailyIntakes.map((item) => {
            const isReached = item.amountMl >= item.goalMl;
            return (
              <div
                key={item.day}
                className={`p-2 rounded-xl border text-center transition-all ${
                  isReached
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-bold">
                  {toPersianDigits(item.day)}
                </div>
                <div className={`text-xs font-black mt-0.5 ${isReached ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {toPersianDigits(Math.round(item.amountMl / 100) / 10)}L
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
