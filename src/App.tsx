import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { BottomNav, NavScreen } from './components/BottomNav';
import { DashboardScreen } from './screens/DashboardScreen';
import { WeeklyAnalyticsScreen } from './screens/WeeklyAnalyticsScreen';
import { RechartsTrendScreen } from './screens/RechartsTrendScreen';
import { HealthCompanionScreen } from './screens/HealthCompanionScreen';
import { RemindersScreen } from './screens/RemindersScreen';
import { ProfileSettingsScreen } from './screens/ProfileSettingsScreen';
import { MonthlyReportScreen } from './screens/MonthlyReportScreen';
import { OnboardingWizardScreen } from './screens/OnboardingWizardScreen';
import { AlarmRingingBanner } from './components/AlarmRingingBanner';
import { toPersianDigits } from './utils/persian';

export const MainApp: React.FC = () => {
  const {
    profile,
    isAlarmRinging,
    stopAlarm,
    addWater,
    snoozeReminder,
    xpToastEvent,
  } = useApp();

  const [currentScreen, setCurrentScreen] = useState<NavScreen>('dashboard');
  const [showMonthly, setShowMonthly] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!profile.onboardingCompleted);

  if (showOnboarding) {
    return <OnboardingWizardScreen onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Active Alarm Banner if triggered */}
      {isAlarmRinging && (
        <AlarmRingingBanner
          personName={profile.name}
          onDrink={() => {
            addWater(250, 'alarm');
            stopAlarm();
          }}
          onSnooze={() => {
            stopAlarm();
          }}
          onDismiss={stopAlarm}
        />
      )}

      {/* Floating XP Toast */}
      {xpToastEvent && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-amber-500 text-white font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-1.5 border border-amber-300">
            <span>✨</span>
            <span>+{toPersianDigits(xpToastEvent)} XP دریافت شد!</span>
          </div>
        </div>
      )}

      {/* Screen Views */}
      <main className="flex-1 overflow-x-hidden">
        {showMonthly ? (
          <MonthlyReportScreen onBack={() => setShowMonthly(false)} />
        ) : (
          <>
            {currentScreen === 'dashboard' && (
              <DashboardScreen onNavigate={setCurrentScreen} />
            )}
            {currentScreen === 'weekly' && (
              <WeeklyAnalyticsScreen onNavigate={setCurrentScreen} />
            )}
            {currentScreen === 'recharts_trend' && (
              <RechartsTrendScreen />
            )}
            {currentScreen === 'companion' && (
              <HealthCompanionScreen />
            )}
            {currentScreen === 'reminders' && (
              <RemindersScreen />
            )}
            {currentScreen === 'profile' && (
              <ProfileSettingsScreen
                onNavigate={setCurrentScreen}
                onOpenMonthlyReport={() => setShowMonthly(true)}
                onOpenOnboarding={() => setShowOnboarding(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setShowMonthly(false);
          setCurrentScreen(screen);
        }}
      />
    </div>
  );
};
