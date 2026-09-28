import { GamificationBadge, UserLevelInfo } from '../types';

export interface LevelThreshold {
  level: number;
  titleFa: string;
  iconEmoji: string;
  minXp: number;
  maxXp: number;
}

export const levels: LevelThreshold[] = [
  { level: 1, titleFa: 'قطره تازه', iconEmoji: '💧', minXp: 0, maxXp: 199 },
  { level: 2, titleFa: 'جویبار پویا', iconEmoji: '🏞️', minXp: 200, maxXp: 499 },
  { level: 3, titleFa: 'رود پرآب', iconEmoji: '🌊', minXp: 500, maxXp: 999 },
  { level: 4, titleFa: 'چشمه زلال', iconEmoji: '⛲', minXp: 1000, maxXp: 1799 },
  { level: 5, titleFa: 'آبشار خروشان', iconEmoji: '🏔️', minXp: 1800, maxXp: 2999 },
  { level: 6, titleFa: 'دریای آبی', iconEmoji: '⛵', minXp: 3000, maxXp: 4999 },
  { level: 7, titleFa: 'اقیانوس حیات', iconEmoji: '🐋', minXp: 5000, maxXp: 9999999 },
];

export const defaultBadges: GamificationBadge[] = [
  {
    id: 'first_sip',
    title: 'جرعه اول',
    description: 'ثبت اولین لیوان آب در برنامه و آغاز مسیر سلامت',
    iconEmoji: '💧',
    xpReward: 20,
    isUnlocked: false,
    category: 'milestone',
  },
  {
    id: 'morning_dew',
    title: 'شبنم صبحگاهی',
    description: 'نوشیدن آب تازه بین ساعت ۵ تا ۹ صبح برای بیداری شاداب بدن',
    iconEmoji: '🌅',
    xpReward: 30,
    isUnlocked: false,
    category: 'habit',
  },
  {
    id: 'goal_crusher',
    title: 'قهرمان هیدراتاسیون',
    description: 'تکمیل ۱۰۰٪ هدف مصرف روزانه آب و رسیدن به سطح ایده‌آل',
    iconEmoji: '🏆',
    xpReward: 50,
    isUnlocked: false,
    category: 'achievement',
  },
  {
    id: 'two_liters',
    title: 'باشگاه ۲ لیتری‌ها',
    description: 'ثبت حداقل ۲۰۰۰ میلی‌لیتر آب خالص در یک روز',
    iconEmoji: '🥛',
    xpReward: 40,
    isUnlocked: false,
    category: 'volume',
  },
  {
    id: 'streak_3',
    title: 'پایداری ۳ روزه',
    description: '۳ روز متوالی دستیابی به هدف مصرف آب روزانه',
    iconEmoji: '🔥',
    xpReward: 60,
    isUnlocked: false,
    category: 'streak',
  },
  {
    id: 'streak_7',
    title: 'استاد هفتگی',
    description: 'یک هفته کامل همراهی منظم و نوشیدن کافی آب',
    iconEmoji: '👑',
    xpReward: 100,
    isUnlocked: false,
    category: 'streak',
  },
  {
    id: 'level_3',
    title: 'کاشف امواج',
    description: 'ارتقای سطح کاربری به سطح ۳ (رود پرآب)',
    iconEmoji: '🌊',
    xpReward: 80,
    isUnlocked: false,
    category: 'level',
  },
  {
    id: 'hydration_master',
    title: 'استاد اقیانوس',
    description: 'ارتقا به سطح ۵ و تبدیل شدن به قهرمان پایداری نوشیدن آب',
    iconEmoji: '🐋',
    xpReward: 150,
    isUnlocked: false,
    category: 'level',
  },
];

export const GamificationManager = {
  calculateXpForIntake(
    amountMl: number,
    isGoalAchieved: boolean,
    hourOfDay = new Date().getHours()
  ): number {
    let xp = Math.max(10, Math.floor(amountMl / 10));
    // Morning hydration bonus (5:00 - 9:59)
    if (hourOfDay >= 5 && hourOfDay <= 9) {
      xp += 15;
    }
    // Daily goal achievement bonus
    if (isGoalAchieved) {
      xp += 50;
    }
    return xp;
  },

  getLevelInfo(totalXp: number): UserLevelInfo {
    const safeXp = Math.max(0, totalXp);
    const currentLevel = levels.find((l) => safeXp >= l.minXp && safeXp <= l.maxXp) || levels[levels.length - 1];
    const nextLevel = levels.find((l) => l.level === currentLevel.level + 1);

    const minXp = currentLevel.minXp;
    const targetXp = nextLevel ? nextLevel.minXp : currentLevel.minXp + 1000;
    const currentProgress = Math.max(0, safeXp - minXp);
    const neededXp = Math.max(1, targetXp - minXp);
    const progressPercent = nextLevel ? Math.min(1, Math.max(0, currentProgress / neededXp)) : 1;

    return {
      level: currentLevel.level,
      titleFa: currentLevel.titleFa,
      iconEmoji: currentLevel.iconEmoji,
      currentLevelMinXp: minXp,
      nextLevelTargetXp: targetXp,
      currentProgressXp: currentProgress,
      neededXpForNextLevel: neededXp,
      progressPercent,
      totalXp: safeXp,
    };
  },
};
