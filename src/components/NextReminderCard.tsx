import React from 'react';
import { Bell, Clock, ChevronRight } from 'lucide-react';
import { Reminder } from '../types';
import { toPersianDigits, formatTime } from '../utils/persian';

interface NextReminderCardProps {
  nextReminder: Reminder | null;
  onSnooze: (reminderId: string) => void;
  onViewReminders: () => void;
}

export const NextReminderCard: React.FC<NextReminderCardProps> = ({
  nextReminder,
  onSnooze,
  onViewReminders,
}) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">یادآور بعدی نوشیدن آب</div>
          <div className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mt-0.5">
            {nextReminder ? `ساعت ${formatTime(nextReminder.scheduledAt)}` : 'امروز یادآور دیگری باقی نمانده'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {nextReminder && (
          <button
            onClick={() => onSnooze(nextReminder.id)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            ۱۵ دقیقه بعد
          </button>
        )}
        <button
          onClick={onViewReminders}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          title="مشاهده همه یادآورها"
        >
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};
