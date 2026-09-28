export type ReminderStatus = 'PENDING' | 'NOTIFIED' | 'SNOOZED' | 'COMPLETED' | 'MISSED';

export interface Reminder {
  id: string;
  userId: string;
  scheduledAt: number;
  triggeredAt?: number | null;
  completedAt?: number | null;
  status: ReminderStatus;
  retryCount: number;
  nextReminderAt?: number | null;
  amountMl: number;
}

export interface WaterIntake {
  id: string;
  userId: string;
  amountMl: number;
  consumedAt: number;
  source: string;
  reminderId?: string | null;
  createdAt: number;
  synced: boolean;
  remoteId?: string | null;
}

export interface UserProfile {
  id: string;
  clerkUserId: string;
  name: string;
  email: string;
  profileImageUrl?: string | null;
  dailyWaterGoalMl: number;
  reminderIntervalMinutes: number;
  reminderEnabled: boolean;
  wakeUpTime: string;
  sleepTime: string;
  createdAt: number;
  updatedAt: number;
  graceDayEnabled: boolean;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  inactivityThresholdMinutes: number;
  weightKg: number;
  heightCm: number;
  age: number;
  gender: string; // 'male' | 'female' | 'other'
  activityLevel: string; // 'sedentary' | 'moderate' | 'active' | 'very_active'
  climate: string; // 'cold' | 'temperate' | 'warm_dry' | 'hot_humid'
  onboardingCompleted: boolean;
  totalXp: number;
  level: number;
  themeMode: 'light' | 'dark' | 'system';
}

export interface DayIntake {
  dayName: string;
  fullDate: string;
  date: string;
  amountMl: number;
  goalMl: number;
  isToday: boolean;
}

export interface WeeklyReport {
  days: DayIntake[];
  totalAmountMl: number;
  dailyAverageMl: number;
  goalCompletionPercentage: number;
  trendVsLastWeekPercent: number;
}

export interface MonthlyReport {
  monthTitle: string;
  totalConsumedMl: number;
  dailyAverageMl: number;
  goalCompletionRate: number;
  bestDayDate: string;
  bestDayAmountMl: number;
  lowestDayDate: string;
  lowestDayAmountMl: number;
  completedReminders: number;
  missedReminders: number;
  currentStreakDays: number;
  longestStreakDays: number;
  comparisonWithPrevMonthPercent: number;
  dailyIntakes: { day: number; amountMl: number; goalMl: number }[];
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  isGraceDayUsed: boolean;
}

export interface GamificationBadge {
  id: string;
  title: string;
  description: string;
  iconEmoji: string;
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: number | null;
  category: 'milestone' | 'habit' | 'achievement' | 'volume' | 'streak' | 'level' | 'general';
}

export interface UserLevelInfo {
  level: number;
  titleFa: string;
  iconEmoji: string;
  currentLevelMinXp: number;
  nextLevelTargetXp: number;
  currentProgressXp: number;
  neededXpForNextLevel: number;
  progressPercent: number;
  totalXp: number;
}

export type HealthEventType =
  | 'WATER_CONSUMED'
  | 'GOAL_REACHED'
  | 'REMINDER_MISSED'
  | 'LONG_INACTIVITY'
  | 'REMINDER_SNOOZED';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH';
export type EventDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED' | 'ACKNOWLEDGED';
export type CompanionConnectionStatus = 'CONNECTED' | 'PAUSED' | 'DISCONNECTED';
export type AlertFilterPolicy = 'ALL' | 'MEDIUM_AND_HIGH' | 'HIGH_ONLY';

export interface HealthAlertEvent {
  eventId: string;
  eventType: HealthEventType;
  userId: string;
  timestamp: number;
  date: string;
  currentWaterMl: number;
  dailyGoalMl: number;
  goalPercentage: number;
  lastWaterIntakeAt?: number | null;
  missedReminderCount: number;
  streak: number;
  severity: AlertSeverity;
  deliveryStatus: EventDeliveryStatus;
}

export interface HealthCompanionConnection {
  id: string;
  userId: string;
  companionUserId: string;
  companionName: string;
  status: CompanionConnectionStatus;
  alertPolicy: AlertFilterPolicy;
  lastActiveAt: number;
  createdAt: number;
  updatedAt: number;
}

export type HealthStatusEvaluation = 'ON_TRACK' | 'BEHIND' | 'GOAL_REACHED';

export interface HealthCompanionStatus {
  evaluation: HealthStatusEvaluation;
  todayWaterMl: number;
  dailyGoalMl: number;
  goalPercentage: number;
  lastDrinkTimeAgoMinutes?: number | null;
  completedReminders: number;
  missedReminders: number;
  currentStreak: number;
  connection?: HealthCompanionConnection | null;
}
