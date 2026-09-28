import React from 'react';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import { toPersianDigits } from '../utils/persian';
import { NooshCharacter } from './NooshCharacter';

interface CelebrationModalProps {
  amountMl: number;
  isGoalAchieved: boolean;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  amountMl,
  isGoalAchieved,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center">
        <div className="flex justify-center mb-2">
          <NooshCharacter size={90} isCelebrating={true} />
        </div>

        {isGoalAchieved ? (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>هدف روزانه کامل شد!</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1">
              آفرین، فوق‌العاده‌ای! 🎉
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              با نوشیدن {toPersianDigits(amountMl)} میلی‌لیتر دیگر، ۱۰۰٪ هدف آب امروزت تامین شد. بدنت شاداب و سلامتی‌ات تضمین است!
            </p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>یک گام به سوی سلامتی</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1">
              عالیه! به خودت افتخار کن 💙
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {toPersianDigits(amountMl)} میلی‌لیتر آب گوارا با موفقیت ثبت شد. پیوستگی، کلید سلامتی است.
            </p>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-sky-500/25 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>ادامه مسیر</span>
        </button>
      </div>
    </div>
  );
};
