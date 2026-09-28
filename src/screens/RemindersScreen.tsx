import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sliders,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toPersianDigits, formatTime } from '../utils/persian';

export const RemindersScreen: React.FC = () => {
  const {
    profile,
    reminders,
    updateReminderSettings,
    snoozeReminder,
    addWater,
    triggerTestReminder,
  } = useApp();

  const [enabled, setEnabled] = useState(profile.reminderEnabled);
  const [interval, setInterval] = useState(profile.reminderIntervalMinutes);
  const [wakeUp, setWakeUp] = useState(profile.wakeUpTime);
  const [sleep, setSleep] = useState(profile.sleepTime);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateReminderSettings(enabled, interval, wakeUp, sleep);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          label: 'نوشیده شد',
          color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
        };
      case 'SNOOZED':
        return {
          label: 'به تعویق افتاده',
          color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
        };
      case 'MISSED':
        return {
          label: 'پاسخ داده نشده',
          color: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400',
        };
      case 'NOTIFIED':
        return {
          label: 'در انتظار پاسخ',
          color: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400',
        };
      default:
        return {
          label: 'در صف زمان‌بندی',
          color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
        };
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              یادآورها و زمان‌بندی هوشمند
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              تنظیم ساعات بیداری و فواصل منظم نوشیدن آب
            </p>
          </div>
        </div>
      </div>

      {/* Reminder Config Form Card */}
      <form
        onSubmit={handleSaveSettings}
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-500" />
            <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
              برنامه روزانه یادآوری
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
          </label>
        </div>

        {/* Wake and Sleep times */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              زمان شروع (بیداری):
            </label>
            <input
              type="time"
              value={wakeUp}
              onChange={(e) => setWakeUp(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              زمان پایان (خواب):
            </label>
            <input
              type="time"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
            />
          </div>
        </div>

        {/* Interval Select */}
        <div>
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1.5">
            فاصله زمانی یادآوری:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[30, 45, 60, 90].map((mins) => {
              const selected = interval === mins;
              return (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setInterval(mins)}
                  className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer text-center ${
                    selected
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {toPersianDigits(mins)} دقیقه
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button and Test Reminder */}
        <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            {savedNotice ? <Check className="w-4 h-4 text-emerald-300" /> : null}
            <span>{savedNotice ? 'تغییرات ذخیره شد' : 'ذخیره تنظیمات'}</span>
          </button>

          <button
            type="button"
            onClick={triggerTestReminder}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Volume2 className="w-4 h-4 text-sky-500" />
            <span>تست زنگ هشدار</span>
          </button>
        </div>
      </form>

      {/* Timetable of Today's Reminders */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-500" />
            <span>جدول زمان‌بندی یادآورهای امروز</span>
          </h3>
          <span className="text-xs text-slate-400">
            {toPersianDigits(reminders.length)} نوبت در طول روز
          </span>
        </div>

        <div className="space-y-2">
          {reminders.map((reminder, idx) => {
            const badge = getStatusBadge(reminder.status);
            const isCompleted = reminder.status === 'COMPLETED';
            return (
              <div
                key={reminder.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs flex items-center justify-center">
                    {toPersianDigits(idx + 1)}
                  </div>
                  <div>
                    <div className="font-black text-sm text-slate-800 dark:text-slate-200">
                      ساعت {formatTime(reminder.scheduledAt)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      حجم هدف: {toPersianDigits(reminder.amountMl)} میلی‌لیتر
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
                    {badge.label}
                  </span>

                  {!isCompleted && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => addWater(250, 'reminder', reminder.id)}
                        className="px-2 py-1 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[11px] font-bold cursor-pointer"
                        title="ثبت نوشیدن"
                      >
                        نوشیدم
                      </button>
                      <button
                        onClick={() => snoozeReminder(reminder.id, 15)}
                        className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold cursor-pointer"
                        title="۱۵ دقیقه بعد"
                      >
                        تعویق
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
