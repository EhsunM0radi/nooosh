import React from 'react';
import { BellRing, Droplet, Clock, X } from 'lucide-react';
import { NooshCharacter } from './NooshCharacter';

interface AlarmRingingBannerProps {
  personName: string;
  onDrink: () => void;
  onSnooze: () => void;
  onDismiss: () => void;
}

export const AlarmRingingBanner: React.FC<AlarmRingingBannerProps> = ({
  personName,
  onDrink,
  onSnooze,
  onDismiss,
}) => {
  return (
    <div className="fixed inset-x-0 top-0 z-50 p-4 flex justify-center animate-in slide-in-from-top duration-300">
      <div className="w-full max-w-md bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 text-white rounded-3xl p-5 shadow-2xl border border-sky-400/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="flex items-start justify-between relative z-10 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center animate-pulse">
              <BellRing className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-sky-200 font-bold">
                <span>💧 وقت نوشیدن آب فرا رسیده!</span>
              </div>
              <h4 className="text-base font-black text-white">
                {personName} عزیز، یک لیوان آب بنوش 💙
              </h4>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 rounded-full text-sky-200 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-sky-100/90 leading-relaxed mb-4 relative z-10">
          برای حفظ تمرکز، رفع خستگی و شادابی بافت‌های بدن، همین حالا ۲۵۰ میلی‌لیتر آب بنوشید.
        </p>

        <div className="grid grid-cols-2 gap-2 relative z-10">
          <button
            onClick={onDrink}
            className="py-2.5 px-3 rounded-xl bg-white text-sky-800 hover:bg-sky-50 font-black text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Droplet className="w-4 h-4 fill-current text-sky-600" />
            <span>یک لیوان نوشیدم (۲۵۰ml)</span>
          </button>
          <button
            onClick={onSnooze}
            className="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-xs border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Clock className="w-4 h-4" />
            <span>۱۵ دقیقه دیگر یادآوری کن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
