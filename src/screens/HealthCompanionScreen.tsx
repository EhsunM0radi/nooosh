import React, { useState } from 'react';
import {
  Heart,
  Shield,
  Copy,
  Check,
  Pause,
  Play,
  UserPlus,
  AlertTriangle,
  Clock,
  Radio,
  X,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toPersianDigits, formatTime } from '../utils/persian';
import { AlertFilterPolicy, HealthEventType, AlertSeverity } from '../types';

export const HealthCompanionScreen: React.FC = () => {
  const {
    companionStatus,
    companionEvents,
    activeCompanion,
    createCompanionRoom,
    joinCompanionRoom,
    disconnectCompanion,
    togglePauseCompanion,
    updateCompanionPolicy,
    acknowledgeEvent,
    simulateReminderMissed,
    simulateLongInactivity,
  } = useApp();

  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>('');
  const [joinName, setJoinName] = useState<string>('');
  const [joinError, setJoinError] = useState<string>('');

  const handleCreateRoom = () => {
    const code = createCompanionRoom();
    setGeneratedCode(code);
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode || joinCode.length < 4) {
      setJoinError('لطفاً کد معتبر حداقل ۴ رقمی را وارد کنید');
      return;
    }
    const success = joinCompanionRoom(joinCode, joinName);
    if (success) {
      setShowJoinModal(false);
      setJoinCode('');
      setJoinName('');
      setJoinError('');
    } else {
      setJoinError('اتصال به اتاق ناموفق بود. مجدداً بررسی کنید.');
    }
  };

  const getEvaluationBadge = () => {
    switch (companionStatus.evaluation) {
      case 'GOAL_REACHED':
        return {
          title: 'هدف روزانه محقق شد',
          color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
        };
      case 'BEHIND':
        return {
          title: 'عقب‌تر از برنامه مصرف',
          color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
        };
      default:
        return {
          title: 'وضعیت مطلوب و منظم',
          color: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400',
        };
    }
  };

  const evalBadge = getEvaluationBadge();

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Screen Title */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              همراه سلامت و اتاق مراقبت
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              اشتراک وضعیت هیدراتاسیون با همراه یا خانواده از طریق اتاق امن
            </p>
          </div>
        </div>
      </div>

      {/* Health Status Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
            خلاصه سلامت هیدراتاسیون شما
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${evalBadge.color}`}>
            {evalBadge.title}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">مصرف امروز</div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
              {toPersianDigits(companionStatus.todayWaterMl)} / {toPersianDigits(companionStatus.dailyGoalMl)} ml
            </div>
            <div className="text-[10px] text-sky-600 dark:text-sky-400 font-bold mt-0.5">
              {toPersianDigits(companionStatus.goalPercentage)}٪ از هدف کل
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">آخرین مصرف آب</div>
            <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">
              {companionStatus.lastDrinkTimeAgoMinutes !== null
                ? `${toPersianDigits(companionStatus.lastDrinkTimeAgoMinutes)} دقیقه پیش`
                : 'هنوز ثبت نشده'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">
              {companionStatus.missedReminders > 0
                ? `${toPersianDigits(companionStatus.missedReminders)} یادآور پاسخ‌داده‌نشده`
                : 'همه یادآورها به موقع'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span>پاسخ به یادآورها: {toPersianDigits(companionStatus.completedReminders)} مورد</span>
          <span>زنجیره پیوسته: {toPersianDigits(companionStatus.currentStreak)} روز</span>
        </div>
      </div>

      {/* Room Creation & Care Circle */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-1">
          اتاق همراه سلامت و کد دعوت
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          می‌توانید برای همراه خود یک اتاق بسازید و کد ۶ رقمی را ارسال کنید، یا با داشتن کد دعوت به اتاق همراه ملحق شوید.
        </p>

        {activeCompanion ? (
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-black text-xs text-slate-800 dark:text-slate-200">
                  متصل به «{activeCompanion.companionName}»
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeCompanion.status === 'CONNECTED'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {activeCompanion.status === 'CONNECTED' ? 'ارسال فعال' : 'متوقف'}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={togglePauseCompanion}
                className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {activeCompanion.status === 'CONNECTED' ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-600" />
                    <span>توقف هشدارها</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ادامه ارسال</span>
                  </>
                )}
              </button>

              <button
                onClick={disconnectCompanion}
                className="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-600 hover:bg-rose-100 cursor-pointer"
              >
                قطع ارتباط
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCreateRoom}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Radio className="w-4 h-4" />
                <span>ساخت اتاق همراه</span>
              </button>

              <button
                onClick={() => setShowJoinModal(true)}
                className="py-3 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200 font-extrabold text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4 text-sky-500" />
                <span>ورود با کد دعوت</span>
              </button>
            </div>

            {generatedCode && (
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    کد دعوت ۶ رقمی اتاق شما:
                  </div>
                  <div className="text-xl font-black text-sky-600 dark:text-sky-400 tracking-wider mt-0.5" dir="ltr">
                    {generatedCode}
                  </div>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 text-sky-600 cursor-pointer hover:bg-sky-50"
                  title="کپی کد دعوت"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Policy Selector if companion connected */}
        {activeCompanion && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              سیاست ارسال هشدارها به همراه:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              {[
                { id: 'ALL', label: 'همه وقایع' },
                { id: 'MEDIUM_AND_HIGH', label: 'متوسط و فوری' },
                { id: 'HIGH_ONLY', label: 'فقط فوری' },
              ].map((p) => {
                const isSelected = activeCompanion.alertPolicy === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => updateCompanionPolicy(p.id as AlertFilterPolicy)}
                    className={`py-1.5 px-2 rounded-xl border font-bold transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Simulation / Testing Tools for Reliability Check */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
            آزمایش و شبیه‌سازی هشدارهای همراه
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          برای سنجش سازوکار اعلان و بازبینی لاگ رویدادها، سناریوهای زیر را تست نمایید:
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={simulateReminderMissed}
            className="py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer text-center"
          >
            فراموشی یادآور (متوسط)
          </button>
          <button
            onClick={simulateLongInactivity}
            className="py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-300 cursor-pointer text-center"
          >
            عدم تحرک ۲ ساعته (فوری)
          </button>
        </div>
      </div>

      {/* Event Audit Log */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-500" />
            <span>تاریخچه رویدادها و هشدارهای همراه</span>
          </h3>
          <span className="text-xs text-slate-400">
            {toPersianDigits(companionEvents.length)} رویداد
          </span>
        </div>

        {companionEvents.length === 0 ? (
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            هنوز رویدادی ثبت نشده است
          </div>
        ) : (
          companionEvents.map((evt) => {
            const isAck = evt.deliveryStatus === 'ACKNOWLEDGED';
            const isHigh = evt.severity === 'HIGH';
            const isMedium = evt.severity === 'MEDIUM';

            return (
              <div
                key={evt.eventId}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          : isMedium
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                          : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400'
                      }`}
                    >
                      {evt.eventType === 'WATER_CONSUMED'
                        ? 'نوشیدن آب'
                        : evt.eventType === 'GOAL_REACHED'
                        ? 'تحقق هدف'
                        : evt.eventType === 'REMINDER_MISSED'
                        ? 'فراموشی یادآور'
                        : evt.eventType === 'LONG_INACTIVITY'
                        ? 'عدم نوشیدن طولانی'
                        : 'تعویق یادآور'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      ساعت {formatTime(evt.timestamp)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-1">
                    حجم: {toPersianDigits(evt.currentWaterMl)} ml ({toPersianDigits(evt.goalPercentage)}٪)
                  </div>
                </div>

                <div>
                  {isAck ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تأیید شد</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => acknowledgeEvent(evt.eventId)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      تأیید رسید
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                پیوستن به اتاق همراه
              </h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  کد ۶ رقمی اتاق:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="مثلاً: 489201"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-black text-lg tracking-widest outline-none focus:border-sky-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  نام همراه یا نقش (اختیاری):
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: دکتر امینی یا علی"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-sky-500"
                />
              </div>

              {joinError && (
                <div className="text-xs font-bold text-rose-500 text-center">
                  {joinError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm shadow-md cursor-pointer transition-all"
              >
                تأیید و اتصال به اتاق
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
