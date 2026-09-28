import React, { useState } from 'react';
import { X, Award, Shield, CheckCircle, Lock } from 'lucide-react';
import { UserLevelInfo, GamificationBadge } from '../types';
import { levels } from '../utils/gamification';
import { toPersianDigits } from '../utils/persian';

interface GamificationModalProps {
  levelInfo: UserLevelInfo;
  badges: GamificationBadge[];
  onClose: () => void;
}

export const GamificationModal: React.FC<GamificationModalProps> = ({
  levelInfo,
  badges,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'levels'>('badges');

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">باشگاه افتخارات و سطح کاربری</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                سطح {toPersianDigits(levelInfo.level)}: {levelInfo.titleFa} ({toPersianDigits(levelInfo.totalXp)} XP)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level XP Progress Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent border border-sky-200/80 dark:border-sky-900/40">
          <div className="flex items-center justify-between mb-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <span className="text-lg">{levelInfo.iconEmoji}</span>
              <span>سطح {toPersianDigits(levelInfo.level)}: {levelInfo.titleFa}</span>
            </div>
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {toPersianDigits(levelInfo.currentProgressXp)} / {toPersianDigits(levelInfo.neededXpForNextLevel)} XP
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-400 to-sky-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round(levelInfo.progressPercent * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 text-left" dir="ltr">
            {Math.round(levelInfo.progressPercent * 100)}% to next level
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            نشان‌ها ({toPersianDigits(unlockedCount)} از {toPersianDigits(badges.length)})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('levels')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'levels'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            نقشه سطوح (Roadmap)
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {activeTab === 'badges' ? (
            badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  badge.isUnlocked
                    ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl border ${
                      badge.isUnlocked
                        ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 grayscale'
                    }`}
                  >
                    {badge.iconEmoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">{badge.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold">
                        +{toPersianDigits(badge.xpReward)} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{badge.description}</p>
                  </div>
                </div>
                <div>
                  {badge.isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span>کسب شد</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                      <span>قفل</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-3">
              {levels.map((lvl) => {
                const isCurrent = lvl.level === levelInfo.level;
                const isPast = lvl.level < levelInfo.level;
                return (
                  <div
                    key={lvl.level}
                    className={`p-3 rounded-2xl border flex items-center justify-between ${
                      isCurrent
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                        : isPast
                        ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lvl.iconEmoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                            سطح {toPersianDigits(lvl.level)}: {lvl.titleFa}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-600 text-white font-bold">
                              سطح فعلی
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {toPersianDigits(lvl.minXp)} تا {lvl.maxXp > 10000 ? 'بی‌نهایت' : toPersianDigits(lvl.maxXp)} XP
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
