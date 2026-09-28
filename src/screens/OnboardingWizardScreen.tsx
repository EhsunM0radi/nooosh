import React, { useState } from 'react';
import { Sparkles, ArrowLeft, ArrowRight, Check, Droplet, User, Scale, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WaterCalculationAlgorithm } from '../utils/calculator';
import { toPersianDigits } from '../utils/persian';
import { NooshCharacter } from '../components/NooshCharacter';

interface OnboardingWizardScreenProps {
  onComplete: () => void;
}

export const OnboardingWizardScreen: React.FC<OnboardingWizardScreenProps> = ({ onComplete }) => {
  const { profile, saveOnboardingProfile } = useApp();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>(profile.name || '');
  const [weightKg, setWeightKg] = useState<number>(profile.weightKg || 70);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm || 170);
  const [age, setAge] = useState<number>(profile.age || 25);
  const [gender, setGender] = useState<string>(profile.gender || 'male');

  const calculation = WaterCalculationAlgorithm.calculateDailyGoal(
    weightKg,
    heightCm,
    age,
    gender,
    profile.wakeUpTime,
    profile.sleepTime,
    profile.activityLevel,
    profile.climate
  );

  const handleFinish = () => {
    saveOnboardingProfile({
      name: name.trim() || 'کاربر گرامی',
      weightKg,
      heightCm,
      age,
      gender,
    });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <NooshCharacter size={34} />
            <span className="font-black text-sm text-slate-800 dark:text-slate-200">
              راه‌اندازی هوشمند نوش
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600">
            <span>مرحله {toPersianDigits(step)} از ۳</span>
          </div>
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-3xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center text-3xl mb-3 shadow-xs">
                👋
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                خوش آمدید به نوش!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                دوست داریم شما را با چه نامی صدا بزنیم؟
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                نام یا نام مستعار شما:
              </label>
              <input
                type="text"
                placeholder="مثلاً: سارا، رضا، پارسا..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                جنسیت:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'male', label: 'مرد 👨' },
                  { id: 'female', label: 'زن 👩' },
                ].map((g) => {
                  const selected = gender === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id)}
                      className={`py-2.5 rounded-xl border text-xs font-extrabold cursor-pointer transition-all ${
                        selected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm shadow-md shadow-sky-500/25 cursor-pointer flex items-center justify-center gap-2 mt-4"
            >
              <span>مرحله بعد: مشخصات بدنی</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
            </button>
          </div>
        )}

        {/* Step 2: Biometrics */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center py-2">
              <div className="w-16 h-16 rounded-3xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center text-3xl mb-2 shadow-xs">
                ⚖️
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                مشخصات فیزیولوژیک بدن
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                برای تنظیم دقیق‌ترین نیاز روزانه به آب
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">وزن:</span>
                <span className="text-sky-600 dark:text-sky-400">{toPersianDigits(weightKg)} کیلوگرم</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={weightKg}
                onChange={(e) => setWeightKg(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">قد:</span>
                <span className="text-sky-600 dark:text-sky-400">{toPersianDigits(heightCm)} سانتی‌متر</span>
              </div>
              <input
                type="range"
                min="130"
                max="210"
                value={heightCm}
                onChange={(e) => setHeightCm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">سن:</span>
                <span className="text-sky-600 dark:text-sky-400">{toPersianDigits(age)} سال</span>
              </div>
              <input
                type="range"
                min="14"
                max="90"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer"
              >
                بازگشت
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm shadow-md shadow-sky-500/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>محاسبه هوشمند نیاز آب</span>
                <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result & Start */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center py-2">
              <div className="flex justify-center mb-2">
                <NooshCharacter size={70} isCelebrating={true} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                برنامه اختصاصی هیدراتاسیون شما
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                تطبیق یافته با مشخصات بیومتریک و ساعات روزانه
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">هدف پیشنهادی روزانه:</span>
                <span className="text-xl font-black text-sky-600 dark:text-sky-400">
                  {toPersianDigits(calculation.dailyWaterGoalMl)} ml
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">تعداد لیوان آب استاندارد:</span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {toPersianDigits(calculation.recommendedGlasses)} لیوان در روز
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">فاصله بهینه هر یادآور:</span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  هر {toPersianDigits(calculation.recommendedIntervalMinutes)} دقیقه
                </span>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-sky-200/60 dark:border-sky-800 leading-relaxed">
                {calculation.explanation}
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-black text-base shadow-lg shadow-sky-500/30 cursor-pointer flex items-center justify-center gap-2"
            >
              <Droplet className="w-5 h-5 fill-current" />
              <span>شروع برنامه نوشیدن آب 💧</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
