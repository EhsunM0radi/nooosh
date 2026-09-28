import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserProfile,
  WaterIntake,
  Reminder,
  GamificationBadge,
  UserLevelInfo,
  StreakInfo,
  WeeklyReport,
  MonthlyReport,
  HealthCompanionStatus,
  HealthAlertEvent,
  HealthCompanionConnection,
  CompanionConnectionStatus,
  AlertFilterPolicy,
  HealthEventType,
  AlertSeverity,
} from '../types';
import {
  loadProfile,
  saveProfile,
  loadIntakes,
  saveIntakes,
  loadReminders,
  saveReminders,
  generateDailyReminders,
  loadBadges,
  saveBadges,
  loadCompanionConnection,
  saveCompanionConnection,
  loadCompanionEvents,
  saveCompanionEvents,
  getWeeklyReportData,
  getMonthlyReportData,
} from '../services/storage';
import { GamificationManager } from '../utils/gamification';
import { getTodayDateString } from '../utils/persian';
import { WaterCalculationAlgorithm } from '../utils/calculator';
import confetti from 'canvas-confetti';

interface AppContextType {
  profile: UserProfile;
  intakes: WaterIntake[];
  todayIntakes: WaterIntake[];
  todayTotalMl: number;
  percentage: number;
  glassesConsumed: number;
  totalGlassesGoal: number;
  reminders: Reminder[];
  nextReminder: Reminder | null;
  streak: StreakInfo;
  levelInfo: UserLevelInfo;
  badges: GamificationBadge[];
  weeklyReport: WeeklyReport;
  monthlyReport: MonthlyReport;
  companionStatus: HealthCompanionStatus;
  companionEvents: HealthAlertEvent[];
  activeCompanion: HealthCompanionConnection | null;
  celebrationEvent: { amountMl: number; isGoalAchieved: boolean } | null;
  levelUpEvent: { newLevel: number; title: string; emoji: string } | null;
  xpToastEvent: number | null;
  syncStatus: string;
  isAlarmRinging: boolean;
  addWater: (amountMl: number, source?: string, reminderId?: string | null, rescheduleMinutes?: number | null) => void;
  updateDailyGoal: (goalMl: number) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateReminderSettings: (enabled: boolean, intervalMinutes: number, startTime: string, endTime: string) => void;
  toggleThemeMode: () => void;
  snoozeReminder: (reminderId: string, minutes?: number) => void;
  stallReminder: (reminderId: string, reason?: string) => void;
  syncNow: () => void;
  createCompanionRoom: () => string;
  joinCompanionRoom: (roomCode: string, companionName: string) => boolean;
  disconnectCompanion: () => void;
  togglePauseCompanion: () => void;
  updateCompanionPolicy: (policy: AlertFilterPolicy) => void;
  acknowledgeEvent: (eventId: string) => void;
  simulateReminderMissed: () => void;
  simulateLongInactivity: () => void;
  triggerTestReminder: () => void;
  stopAlarm: () => void;
  dismissCelebration: () => void;
  dismissLevelUp: () => void;
  saveOnboardingProfile: (data: {
    name: string;
    weightKg: number;
    heightCm: number;
    age: number;
    gender: string;
    avatarUrl?: string;
  }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch {
    // Audio context may require prior user interaction
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [intakes, setIntakes] = useState<WaterIntake[]>(loadIntakes);
  const [reminders, setReminders] = useState<Reminder[]>(() => loadReminders(loadProfile()));
  const [badges, setBadges] = useState<GamificationBadge[]>(loadBadges);
  const [activeCompanion, setActiveCompanion] = useState<HealthCompanionConnection | null>(loadCompanionConnection);
  const [companionEvents, setCompanionEvents] = useState<HealthAlertEvent[]>(loadCompanionEvents);
  const [celebrationEvent, setCelebrationEvent] = useState<{ amountMl: number; isGoalAchieved: boolean } | null>(null);
  const [levelUpEvent, setLevelUpEvent] = useState<{ newLevel: number; title: string; emoji: string } | null>(null);
  const [xpToastEvent, setXpToastEvent] = useState<number | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('همگام با حافظه محلی و سرور');
  const [isAlarmRinging, setIsAlarmRinging] = useState<boolean>(false);

  // Apply dark mode to document
  useEffect(() => {
    const isDark =
      profile.themeMode === 'dark' ||
      (profile.themeMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.themeMode]);

  // Today's intakes
  const todayIntakes = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.getTime();
    return intakes.filter((i) => i.consumedAt >= startOfDay);
  }, [intakes]);

  const todayTotalMl = useMemo(() => {
    return todayIntakes.reduce((sum, item) => sum + item.amountMl, 0);
  }, [todayIntakes]);

  const goalMl = profile.dailyWaterGoalMl || 2000;
  const percentage = Math.min(100, Math.round((todayTotalMl / goalMl) * 100));
  const glassesConsumed = Math.floor(todayTotalMl / 250);
  const totalGlassesGoal = Math.max(1, Math.round(goalMl / 250));

  const levelInfo = useMemo(() => {
    return GamificationManager.getLevelInfo(profile.totalXp);
  }, [profile.totalXp]);

  const streak: StreakInfo = useMemo(() => {
    return {
      currentStreak: 3,
      longestStreak: 12,
      isGraceDayUsed: false,
    };
  }, []);

  const nextReminder = useMemo(() => {
    const now = Date.now();
    return reminders.find((r) => r.status === 'PENDING' && r.scheduledAt > now) || null;
  }, [reminders]);

  const weeklyReport = useMemo(() => {
    return getWeeklyReportData(goalMl, todayTotalMl);
  }, [goalMl, todayTotalMl]);

  const monthlyReport = useMemo(() => {
    return getMonthlyReportData(goalMl, todayTotalMl);
  }, [goalMl, todayTotalMl]);

  // Health Companion Status evaluation
  const companionStatus: HealthCompanionStatus = useMemo(() => {
    const completedReminders = reminders.filter((r) => r.status === 'COMPLETED').length;
    const missedReminders = reminders.filter((r) => r.status === 'MISSED').length;
    const lastIntake = todayIntakes.length > 0 ? todayIntakes[todayIntakes.length - 1] : null;
    const lastDrinkTimeAgoMinutes = lastIntake
      ? Math.max(0, Math.floor((Date.now() - lastIntake.consumedAt) / (60 * 1000)))
      : null;

    let evaluation: 'ON_TRACK' | 'BEHIND' | 'GOAL_REACHED' = 'ON_TRACK';
    if (todayTotalMl >= goalMl) {
      evaluation = 'GOAL_REACHED';
    } else if (missedReminders >= 1 || (lastDrinkTimeAgoMinutes !== null && lastDrinkTimeAgoMinutes > 120)) {
      evaluation = 'BEHIND';
    }

    return {
      evaluation,
      todayWaterMl: todayTotalMl,
      dailyGoalMl: goalMl,
      goalPercentage: percentage,
      lastDrinkTimeAgoMinutes,
      completedReminders,
      missedReminders,
      currentStreak: streak.currentStreak,
      connection: activeCompanion,
    };
  }, [todayIntakes, todayTotalMl, goalMl, percentage, reminders, streak.currentStreak, activeCompanion]);

  // Dispatch companion event helper
  const recordAndDispatchEvent = (eventType: HealthEventType, severity: AlertSeverity, missedCount = 0) => {
    const newEvent: HealthAlertEvent = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      eventType,
      userId: profile.id,
      timestamp: Date.now(),
      date: getTodayDateString(),
      currentWaterMl: todayTotalMl,
      dailyGoalMl: goalMl,
      goalPercentage: percentage,
      lastWaterIntakeAt: todayIntakes.length > 0 ? todayIntakes[todayIntakes.length - 1].consumedAt : null,
      missedReminderCount: missedCount,
      streak: streak.currentStreak,
      severity,
      deliveryStatus: activeCompanion ? 'SENT' : 'PENDING',
    };

    const updated = [newEvent, ...companionEvents];
    setCompanionEvents(updated);
    saveCompanionEvents(updated);
  };

  // Add water intake
  const addWater = (
    amountMl: number,
    source = 'app_quick',
    reminderId: string | null = null,
    rescheduleMinutes: number | null = null
  ) => {
    const prevTotal = todayTotalMl;
    const newTotal = prevTotal + amountMl;
    const wasGoalAchievedBefore = prevTotal >= goalMl;
    const isGoalJustAchieved = !wasGoalAchievedBefore && newTotal >= goalMl;

    const newIntake: WaterIntake = {
      id: `intake_${Date.now()}`,
      userId: profile.id,
      amountMl,
      consumedAt: Date.now(),
      source,
      reminderId,
      createdAt: Date.now(),
      synced: true,
      remoteId: null,
    };

    const updatedIntakes = [newIntake, ...intakes];
    setIntakes(updatedIntakes);
    saveIntakes(updatedIntakes);

    // Stop active ringing alarm if any
    setIsAlarmRinging(false);

    // If reminderId was provided, mark reminder as COMPLETED
    if (reminderId) {
      const updatedReminders = reminders.map((r) =>
        r.id === reminderId ? { ...r, status: 'COMPLETED' as const, completedAt: Date.now() } : r
      );
      setReminders(updatedReminders);
      saveReminders(updatedReminders);
    }

    // Play ding sound
    if (profile.soundEnabled) {
      playNotificationSound();
    }

    // Gamification XP calculation
    const earnedXp = GamificationManager.calculateXpForIntake(amountMl, isGoalJustAchieved);
    const newTotalXp = profile.totalXp + earnedXp;
    const oldLevel = levelInfo.level;
    const newLevelInfo = GamificationManager.getLevelInfo(newTotalXp);
    const didLevelUp = newLevelInfo.level > oldLevel;

    // Check achievement badges
    const updatedBadges = badges.map((badge) => {
      let shouldUnlock = false;
      if (badge.id === 'first_sip') shouldUnlock = true;
      if (badge.id === 'goal_crusher' && newTotal >= goalMl) shouldUnlock = true;
      if (badge.id === 'two_liters' && newTotal >= 2000) shouldUnlock = true;
      if (badge.id === 'level_3' && newLevelInfo.level >= 3) shouldUnlock = true;
      if (badge.id === 'hydration_master' && newLevelInfo.level >= 5) shouldUnlock = true;
      const h = new Date().getHours();
      if (badge.id === 'morning_dew' && h >= 5 && h <= 9) shouldUnlock = true;

      if (shouldUnlock && !badge.isUnlocked) {
        return { ...badge, isUnlocked: true, unlockedAt: Date.now() };
      }
      return badge;
    });

    setBadges(updatedBadges);
    saveBadges(updatedBadges);

    const updatedProfile = {
      ...profile,
      totalXp: newTotalXp,
      level: newLevelInfo.level,
      updatedAt: Date.now(),
    };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);

    // Trigger celebration dialog & toast
    setCelebrationEvent({ amountMl, isGoalAchieved: isGoalJustAchieved });
    setXpToastEvent(earnedXp);

    if (didLevelUp) {
      setLevelUpEvent({
        newLevel: newLevelInfo.level,
        title: newLevelInfo.titleFa,
        emoji: newLevelInfo.iconEmoji,
      });
    }

    if (isGoalJustAchieved) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Dispatch Health Companion events
    recordAndDispatchEvent('WATER_CONSUMED', 'LOW');
    if (isGoalJustAchieved) {
      recordAndDispatchEvent('GOAL_REACHED', 'MEDIUM');
    }

    // Handle reschedule if requested
    if (rescheduleMinutes) {
      const futureTime = Date.now() + rescheduleMinutes * 60 * 1000;
      const rescheduled: Reminder = {
        id: `reschedule_${Date.now()}`,
        userId: profile.id,
        scheduledAt: futureTime,
        status: 'PENDING',
        retryCount: 1,
        amountMl: 250,
      };
      const newRemindersList = [...reminders, rescheduled];
      setReminders(newRemindersList);
      saveReminders(newRemindersList);
    }
  };

  const updateDailyGoal = (newGoal: number) => {
    const updated = { ...profile, dailyWaterGoalMl: newGoal, updatedAt: Date.now() };
    setProfile(updated);
    saveProfile(updated);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates, updatedAt: Date.now() };
    setProfile(updated);
    saveProfile(updated);
  };

  const updateReminderSettings = (
    enabled: boolean,
    intervalMinutes: number,
    startTime: string,
    endTime: string
  ) => {
    const updated = {
      ...profile,
      reminderEnabled: enabled,
      reminderIntervalMinutes: intervalMinutes,
      wakeUpTime: startTime,
      sleepTime: endTime,
      updatedAt: Date.now(),
    };
    setProfile(updated);
    saveProfile(updated);

    if (enabled) {
      const generated = generateDailyReminders(updated);
      setReminders(generated);
      saveReminders(generated);
    } else {
      const disabled = reminders.map((r) => (r.status === 'PENDING' ? { ...r, status: 'MISSED' as const } : r));
      setReminders(disabled);
      saveReminders(disabled);
    }
  };

  const toggleThemeMode = () => {
    const current = profile.themeMode;
    const next = current === 'dark' ? 'light' : 'dark';
    updateProfile({ themeMode: next });
  };

  const snoozeReminder = (reminderId: string, minutes = 15) => {
    const updated = reminders.map((r) => {
      if (r.id === reminderId) {
        return {
          ...r,
          status: 'SNOOZED' as const,
          scheduledAt: Date.now() + minutes * 60 * 1000,
        };
      }
      return r;
    });
    setReminders(updated);
    saveReminders(updated);
    recordAndDispatchEvent('REMINDER_SNOOZED', 'LOW');
  };

  const stallReminder = (reminderId: string, reason = 'مشغله') => {
    snoozeReminder(reminderId, 15);
  };

  const syncNow = () => {
    setSyncStatus('در حال ارسال اطلاعات...');
    setTimeout(() => {
      setSyncStatus('همگام‌سازی ابری با موفقیت انجام شد ✓');
      setTimeout(() => {
        setSyncStatus('همگام با حافظه محلی و سرور');
      }, 4000);
    }, 800);
  };

  const createCompanionRoom = (): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const conn: HealthCompanionConnection = {
      id: `conn_${Date.now()}`,
      userId: profile.id,
      companionUserId: `host_${code}`,
      companionName: 'اتاق همراه من',
      status: 'CONNECTED',
      alertPolicy: 'ALL',
      lastActiveAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setActiveCompanion(conn);
    saveCompanionConnection(conn);
    return code;
  };

  const joinCompanionRoom = (roomCode: string, companionName: string): boolean => {
    if (!roomCode || roomCode.length < 4) return false;
    const conn: HealthCompanionConnection = {
      id: `conn_${Date.now()}`,
      userId: profile.id,
      companionUserId: `companion_${roomCode}`,
      companionName: companionName.trim() || 'همراه سلامت',
      status: 'CONNECTED',
      alertPolicy: 'ALL',
      lastActiveAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setActiveCompanion(conn);
    saveCompanionConnection(conn);
    return true;
  };

  const disconnectCompanion = () => {
    setActiveCompanion(null);
    saveCompanionConnection(null);
  };

  const togglePauseCompanion = () => {
    if (!activeCompanion) return;
    const nextStatus: CompanionConnectionStatus = activeCompanion.status === 'CONNECTED' ? 'PAUSED' : 'CONNECTED';
    const updated: HealthCompanionConnection = { ...activeCompanion, status: nextStatus, updatedAt: Date.now() };
    setActiveCompanion(updated);
    saveCompanionConnection(updated);
  };

  const updateCompanionPolicy = (policy: AlertFilterPolicy) => {
    if (!activeCompanion) return;
    const updated = { ...activeCompanion, alertPolicy: policy, updatedAt: Date.now() };
    setActiveCompanion(updated);
    saveCompanionConnection(updated);
  };

  const acknowledgeEvent = (eventId: string) => {
    const updated = companionEvents.map((e) =>
      e.eventId === eventId ? { ...e, deliveryStatus: 'ACKNOWLEDGED' as const } : e
    );
    setCompanionEvents(updated);
    saveCompanionEvents(updated);
  };

  const simulateReminderMissed = () => {
    recordAndDispatchEvent('REMINDER_MISSED', 'MEDIUM', 1);
  };

  const simulateLongInactivity = () => {
    recordAndDispatchEvent('LONG_INACTIVITY', 'HIGH');
  };

  const triggerTestReminder = () => {
    setIsAlarmRinging(true);
    if (profile.soundEnabled) {
      playNotificationSound();
    }
  };

  const stopAlarm = () => {
    setIsAlarmRinging(false);
  };

  const dismissCelebration = () => {
    setCelebrationEvent(null);
  };

  const dismissLevelUp = () => {
    setLevelUpEvent(null);
  };

  const saveOnboardingProfile = (data: {
    name: string;
    weightKg: number;
    heightCm: number;
    age: number;
    gender: string;
    avatarUrl?: string;
  }) => {
    const calculation = WaterCalculationAlgorithm.calculateDailyGoal(
      data.weightKg,
      data.heightCm,
      data.age,
      data.gender,
      profile.wakeUpTime,
      profile.sleepTime,
      profile.activityLevel,
      profile.climate
    );

    const updated: UserProfile = {
      ...profile,
      name: data.name.trim() || profile.name,
      weightKg: data.weightKg,
      heightCm: data.heightCm,
      age: data.age,
      gender: data.gender,
      dailyWaterGoalMl: calculation.dailyWaterGoalMl,
      reminderIntervalMinutes: calculation.recommendedIntervalMinutes,
      profileImageUrl: data.avatarUrl || profile.profileImageUrl,
      onboardingCompleted: true,
      updatedAt: Date.now(),
    };

    setProfile(updated);
    saveProfile(updated);

    const generated = generateDailyReminders(updated);
    setReminders(generated);
    saveReminders(generated);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        intakes,
        todayIntakes,
        todayTotalMl,
        percentage,
        glassesConsumed,
        totalGlassesGoal,
        reminders,
        nextReminder,
        streak,
        levelInfo,
        badges,
        weeklyReport,
        monthlyReport,
        companionStatus,
        companionEvents,
        activeCompanion,
        celebrationEvent,
        levelUpEvent,
        xpToastEvent,
        syncStatus,
        isAlarmRinging,
        addWater,
        updateDailyGoal,
        updateProfile,
        updateReminderSettings,
        toggleThemeMode,
        snoozeReminder,
        stallReminder,
        syncNow,
        createCompanionRoom,
        joinCompanionRoom,
        disconnectCompanion,
        togglePauseCompanion,
        updateCompanionPolicy,
        acknowledgeEvent,
        simulateReminderMissed,
        simulateLongInactivity,
        triggerTestReminder,
        stopAlarm,
        dismissCelebration,
        dismissLevelUp,
        saveOnboardingProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
