import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { toPersianDigits } from '../utils/persian';

interface LevelUpModalProps {
  newLevel: number;
  levelTitle: string;
  levelEmoji: string;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  levelTitle,
  levelEmoji,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-center">
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30 mb-4 animate-bounce">
          <span className="text-5xl">{levelEmoji}</span>
          <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-black border border-white">
            سطح {toPersianDigits(newLevel)}
          </span>
        </div>

        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>ارتقای سطح کاربری!</span>
        </div>

        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">
          {levelTitle}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          تبریک! با نوشیدن منظم و پیوسته آب، امتیاز تجربه (XP) شما افزایش یافت و به سطح جدید راه پیدا کردید.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-amber-500/25 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>دریافت نشان و ادامه</span>
        </button>
      </div>
    </div>
  );
};
