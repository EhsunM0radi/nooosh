import React, { useState, useMemo } from 'react';
import { X, Calculator, Check, Info } from 'lucide-react';
import { activityOptions, climateOptions, HydrationGoalCalculator } from '../utils/calculator';
import { toPersianDigits } from '../utils/persian';

interface HydrationCalculatorModalProps {
  initialWeightKg: number;
  initialActivityLevel: string;
  initialClimate: string;
  onApply: (newGoalMl: number, weightKg: number, activityLevel: string, climate: string) => void;
  onClose: () => void;
}

export const HydrationCalculatorModal: React.FC<HydrationCalculatorModalProps> = ({
  initialWeightKg,
  initialActivityLevel,
  initialClimate,
  onApply,
  onClose,
}) => {
  const [weightKg, setWeightKg] = useState<number>(initialWeightKg || 70);
  const [activityId, setActivityId] = useState<string>(initialActivityLevel || 'moderate');
  const [climateId, setClimateId] = useState<string>(initialClimate || 'temperate');

  const result = useMemo(() => {
    return HydrationGoalCalculator.calculate(weightKg, activityId, climateId);
  }, [weightKg, activityId, climateId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">محاسبه‌گر علمی هدف آب</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">محاسبه دقیق نیاز فیزیولوژیک بر اساس مشخصات بدنی</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weight Selector */}
        <div className="my-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">وزن بدن شما:</span>
            <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">
              {toPersianDigits(weightKg)} کیلوگرم
            </span>
          </div>
          <input
            type="range"
            min="35"
            max="160"
            step="1"
            value={weightKg}
            onChange={(e) => setWeightKg(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>{toPersianDigits(35)} kg</span>
            <span>{toPersianDigits(70)} kg</span>
            <span>{toPersianDigits(100)} kg</span>
            <span>{toPersianDigits(160)} kg</span>
          </div>
        </div>

        {/* Activity Level */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">سطح فعالیت روزانه:</label>
          <div className="grid grid-cols-2 gap-2">
            {activityOptions.map((opt) => {
              const selected = activityId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setActivityId(opt.id)}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    selected
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-950 dark:text-sky-200 ring-2 ring-sky-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span>{opt.iconEmoji}</span>
                    <span className="font-bold text-xs">{opt.titleFa}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{opt.descriptionFa}</div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 font-bold mt-1">
                    {opt.additionMl > 0 ? `+${toPersianDigits(opt.additionMl)} ml` : 'پایه'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Climate */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">اقلیم و شرایط محیطی:</label>
          <div className="grid grid-cols-2 gap-2">
            {climateOptions.map((c) => {
              const selected = climateId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setClimateId(c.id)}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    selected
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-950 dark:text-sky-200 ring-2 ring-sky-500/20 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span>{c.iconEmoji}</span>
                    <span className="font-bold text-xs">{c.titleFa}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{c.descriptionFa}</div>
                  <div className="text-[10px] text-sky-600 dark:text-sky-400 font-bold mt-1">
                    {c.additionMl > 0 ? `+${toPersianDigits(c.additionMl)} ml` : 'بدون اضافه'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculation Result Box */}
        <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">پیشنهاد علمی برای شما:</span>
            <span className="text-lg font-black text-sky-600 dark:text-sky-400">
              {toPersianDigits(result.recommendedGoalMl)} میلی‌لیتر
            </span>
          </div>
          <div className="text-xs text-sky-700 dark:text-sky-300 font-bold mb-2">
            معادل تقریباً {toPersianDigits(result.recommendedGlasses)} لیوان استاندارد در روز
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
            <span>{result.explanation}</span>
          </p>
        </div>

        {/* Apply Button */}
        <button
          onClick={() => {
            onApply(result.recommendedGoalMl, weightKg, activityId, climateId);
            onClose();
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold text-sm shadow-md shadow-sky-500/25 cursor-pointer flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>اعمال {toPersianDigits(result.recommendedGoalMl)} میلی‌لیتر به عنوان هدف جدید</span>
        </button>
      </div>
    </div>
  );
};
