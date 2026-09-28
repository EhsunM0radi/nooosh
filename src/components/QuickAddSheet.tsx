import React, { useState } from 'react';
import { X, Droplet, Clock } from 'lucide-react';
import { toPersianDigits } from '../utils/persian';

interface QuickAddSheetProps {
  onClose: () => void;
  onAddWater: (amountMl: number, rescheduleMinutes: number | null) => void;
}

export const QuickAddSheet: React.FC<QuickAddSheetProps> = ({ onClose, onAddWater }) => {
  const [selectedPreset, setSelectedPreset] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<number>(250);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [rescheduleMinutes, setRescheduleMinutes] = useState<number | null>(null);

  const presets = [
    { ml: 150, title: '۱۵۰ میلی‌لیتر', desc: 'نصف لیوان', icon: '☕' },
    { ml: 250, title: '۲۵۰ میلی‌لیتر', desc: 'یک لیوان استاندارد', icon: '🥛' },
    { ml: 350, title: '۳۵۰ میلی‌لیتر', desc: 'یک ماگ بزرگ', icon: '🫖' },
    { ml: 500, title: '۵۰۰ میلی‌لیتر', desc: 'بطری نیم‌لیتری', icon: '🧴' },
  ];

  const handleConfirm = () => {
    const finalAmount = isCustom ? customAmount : selectedPreset;
    onAddWater(finalAmount, rescheduleMinutes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">ثبت سریع مصرف آب</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">مقدار آب مصرف شده را انتخاب یا وارد کنید</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-2 gap-3 my-4">
          {presets.map((p) => {
            const isSelected = !isCustom && selectedPreset === p.ml;
            return (
              <button
                key={p.ml}
                type="button"
                onClick={() => {
                  setSelectedPreset(p.ml);
                  setIsCustom(false);
                }}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 text-sky-950 dark:text-sky-200 ring-2 ring-sky-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{p.icon}</span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`}>
                    {toPersianDigits(p.ml)} ml
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{p.title}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{p.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Custom Amount Toggle & Slider */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={isCustom}
                onChange={(e) => setIsCustom(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <span>تعیین مقدار دلخواه</span>
            </label>
            <span className="font-black text-sky-600 dark:text-sky-400 text-sm">
              {toPersianDigits(isCustom ? customAmount : selectedPreset)} میلی‌لیتر
            </span>
          </div>
          {isCustom && (
            <div className="mt-3">
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={customAmount}
                onChange={(e) => setCustomAmount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>{toPersianDigits(50)} ml</span>
                <span>{toPersianDigits(500)} ml</span>
                <span>{toPersianDigits(1000)} ml</span>
              </div>
            </div>
          )}
        </div>

        {/* Smart Reschedule Picker */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>یادآوری بعدی چه زمانی باشد؟</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { val: null, label: 'عادی' },
              { val: 30, label: '۳۰ د' },
              { val: 60, label: '۶۰ د' },
              { val: 90, label: '۹۰ د' },
            ].map((opt, i) => {
              const active = rescheduleMinutes === opt.val;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRescheduleMinutes(opt.val)}
                  className={`py-2 px-1 text-xs rounded-xl font-bold border transition-colors cursor-pointer text-center ${
                    active
                      ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleConfirm}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-black text-sm shadow-md shadow-sky-500/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Droplet className="w-4 h-4 fill-current" />
          <span>ثبت {toPersianDigits(isCustom ? customAmount : selectedPreset)} میلی‌لیتر آب</span>
        </button>
      </div>
    </div>
  );
};
