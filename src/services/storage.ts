import {
  UserProfile,
  WaterIntake,
  Reminder,
  GamificationBadge,
  HealthAlertEvent,
  HealthCompanionConnection,
  StreakInfo,
  WeeklyReport,
  MonthlyReport,
} from '../types';
import { defaultBadges } from '../utils/gamification';
import { getTodayDateString, PERSIAN_WEEK_DAYS } from '../utils/persian';

const STORAGE_KEYS = {
  PROFILE: 'noosh_profile_v1',
  INTAKES: 'noosh_intakes_v1',
  REMINDERS: 'noosh_reminders_v1',
  BADGES: 'noosh_badges_v1',
  COMPANION_CONN: 'noosh_companion_conn_v1',
  COMPANION_EVENTS: 'noosh_companion_events_v1',
  STREAK: 'noosh_streak_v1',
  ONBOARDING_DONE: 'noosh_onboarding_done_v1',
};

export const defaultProfile: UserProfile = {
  id: 'user_default',
  clerkUserId: '',
  name: 'کاربر گرامی',
  email: 'user@noosh.app',
  profileImageUrl: null,
  dailyWaterGoalMl: 2000,
  reminderIntervalMinutes: 60,
  reminderEnabled: true,
  wakeUpTime: '08:00',
  sleepTime: '23:00',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  graceDayEnabled: true,
  soundEnabled: true,
  vibrateEnabled: true,
  inactivityThresholdMinutes: 120,
  weightKg: 70,
  heightCm: 170,
  age: 25,
  gender: 'male',
  activityLevel: 'moderate',
  climate: 'temperate',
  onboardingCompleted: true,
  totalXp: 65,
  level: 1,
  themeMode: 'system',
};

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return { ...defaultProfile, ...JSON.parse(raw) };
  } catch (e) {
    console.error(e);
  }
  return defaultProfile;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error(e);
  }
}

export function loadIntakes(): WaterIntake[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INTAKES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  // Initial seed with two intakes earlier today
  const now = Date.now();
  const twoHoursAgo = now - 2 * 60 * 60 * 1000;
  const fourHoursAgo = now - 4.5 * 60 * 60 * 1000;
  const initial: WaterIntake[] = [
    {
      id: 'intake_seed_1',
      userId: 'user_default',
      amountMl: 250,
      consumedAt: fourHoursAgo,
      source: 'app_quick',
      reminderId: null,
      createdAt: fourHoursAgo,
      synced: true,
      remoteId: null,
    },
    {
      id: 'intake_seed_2',
      userId: 'user_default',
      amountMl: 350,
      consumedAt: twoHoursAgo,
      source: 'app_custom',
      reminderId: null,
      createdAt: twoHoursAgo,
      synced: true,
      remoteId: null,
    },
  ];
  saveIntakes(initial);
  return initial;
}

export function saveIntakes(intakes: WaterIntake[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INTAKES, JSON.stringify(intakes));
  } catch (e) {
    console.error(e);
  }
}

export function loadReminders(profile: UserProfile): Reminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return generateDailyReminders(profile);
}

export function saveReminders(reminders: Reminder[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  } catch (e) {
    console.error(e);
  }
}

export function generateDailyReminders(profile: UserProfile): Reminder[] {
  const reminders: Reminder[] = [];
  try {
    const [wH, wM] = profile.wakeUpTime.split(':').map((s) => parseInt(s, 10));
    const [sH, sM] = profile.sleepTime.split(':').map((s) => parseInt(s, 10));
    const intervalMinutes = profile.reminderIntervalMinutes || 60;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const wakeTime = today.getTime() + (wH * 60 + wM) * 60 * 1000;
    const sleepTime = today.getTime() + (sH * 60 + sM) * 60 * 1000;

    let current = wakeTime + intervalMinutes * 60 * 1000;
    let idx = 1;
    const now = Date.now();

    while (current <= sleepTime) {
      reminders.push({
        id: `reminder_${idx++}`,
        userId: profile.id,
        scheduledAt: current,
        triggeredAt: current < now ? current : null,
        completedAt: current < now - 3600000 ? current : null,
        status: current < now - 3600000 ? 'COMPLETED' : current < now ? 'NOTIFIED' : 'PENDING',
        retryCount: 0,
        nextReminderAt: null,
        amountMl: 250,
      });
      current += intervalMinutes * 60 * 1000;
    }
  } catch (e) {
    console.error(e);
  }
  return reminders;
}

export function loadBadges(): GamificationBadge[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  // Initially unlock first_sip badge
  const initial = defaultBadges.map((b) => (b.id === 'first_sip' ? { ...b, isUnlocked: true, unlockedAt: Date.now() - 86400000 } : b));
  saveBadges(initial);
  return initial;
}

export function saveBadges(badges: GamificationBadge[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  } catch (e) {
    console.error(e);
  }
}

export function loadCompanionConnection(): HealthCompanionConnection | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANION_CONN);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return null;
}

export function saveCompanionConnection(conn: HealthCompanionConnection | null): void {
  try {
    if (!conn) {
      localStorage.removeItem(STORAGE_KEYS.COMPANION_CONN);
    } else {
      localStorage.setItem(STORAGE_KEYS.COMPANION_CONN, JSON.stringify(conn));
    }
  } catch (e) {
    console.error(e);
  }
}

export function loadCompanionEvents(): HealthAlertEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANION_EVENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  // Initial seed events
  const now = Date.now();
  const seed: HealthAlertEvent[] = [
    {
      eventId: 'evt_init_1',
      eventType: 'WATER_CONSUMED',
      userId: 'user_default',
      timestamp: now - 3600000 * 2,
      date: getTodayDateString(),
      currentWaterMl: 600,
      dailyGoalMl: 2000,
      goalPercentage: 30,
      lastWaterIntakeAt: now - 3600000 * 2,
      missedReminderCount: 0,
      streak: 3,
      severity: 'LOW',
      deliveryStatus: 'ACKNOWLEDGED',
    },
    {
      eventId: 'evt_init_2',
      eventType: 'REMINDER_MISSED',
      userId: 'user_default',
      timestamp: now - 3600000 * 5,
      date: getTodayDateString(),
      currentWaterMl: 250,
      dailyGoalMl: 2000,
      goalPercentage: 12,
      lastWaterIntakeAt: now - 3600000 * 5,
      missedReminderCount: 1,
      streak: 3,
      severity: 'MEDIUM',
      deliveryStatus: 'SENT',
    },
  ];
  return seed;
}

export function saveCompanionEvents(events: HealthAlertEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPANION_EVENTS, JSON.stringify(events.slice(0, 50)));
  } catch (e) {
    console.error(e);
  }
}

export function getWeeklyReportData(goalMl: number, todayConsumedMl: number): WeeklyReport {
  const days = [
    { dayName: 'ش', fullDate: 'شنبه', date: '1403-07-01', amountMl: 1850, goalMl, isToday: false },
    { dayName: 'ی', fullDate: 'یکشنبه', date: '1403-07-02', amountMl: 2100, goalMl, isToday: false },
    { dayName: 'د', fullDate: 'دوشنبه', date: '1403-07-03', amountMl: 1950, goalMl, isToday: false },
    { dayName: 'س', fullDate: 'سه‌شنبه', date: '1403-07-04', amountMl: 2350, goalMl, isToday: false },
    { dayName: 'چ', fullDate: 'چهارشنبه', date: '1403-07-05', amountMl: 2200, goalMl, isToday: false },
    { dayName: 'پ', fullDate: 'پنج‌شنبه', date: '1403-07-06', amountMl: 1800, goalMl, isToday: false },
    { dayName: 'ج', fullDate: 'جمعه (امروز)', date: '1403-07-07', amountMl: todayConsumedMl || 1400, goalMl, isToday: true },
  ];

  const totalAmountMl = days.reduce((sum, d) => sum + d.amountMl, 0);
  const dailyAverageMl = Math.round(totalAmountMl / days.length);
  const goalCompletionPercentage = Math.round((dailyAverageMl / goalMl) * 100);

  return {
    days,
    totalAmountMl,
    dailyAverageMl,
    goalCompletionPercentage,
    trendVsLastWeekPercent: 12,
  };
}

export function getMonthlyReportData(goalMl: number, todayConsumedMl: number): MonthlyReport {
  const dailyIntakes = Array.from({ length: 30 }, (_, i) => {
    const isToday = i === 24;
    const base = isToday ? todayConsumedMl : 1600 + Math.floor(Math.sin(i * 0.8) * 550 + 200);
    return {
      day: i + 1,
      amountMl: Math.max(1200, Math.min(2700, base)),
      goalMl,
    };
  });

  const totalConsumedMl = dailyIntakes.reduce((sum, d) => sum + d.amountMl, 0);
  const dailyAverageMl = Math.round(totalConsumedMl / dailyIntakes.length);
  const goalCompletionRate = Math.round((dailyAverageMl / goalMl) * 100);

  return {
    monthTitle: 'مهر ماه ۱۴۰۳',
    totalConsumedMl,
    dailyAverageMl,
    goalCompletionRate,
    bestDayDate: '۱۸ مهر',
    bestDayAmountMl: 2650,
    lowestDayDate: '۵ مهر',
    lowestDayAmountMl: 1400,
    completedReminders: 78,
    missedReminders: 4,
    currentStreakDays: 3,
    longestStreakDays: 14,
    comparisonWithPrevMonthPercent: 15,
    dailyIntakes,
  };
}
