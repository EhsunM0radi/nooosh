export interface ActivityLevelOption {
  id: string;
  titleFa: string;
  descriptionFa: string;
  additionMl: number;
  iconEmoji: string;
}

export interface ClimateOption {
  id: string;
  titleFa: string;
  descriptionFa: string;
  additionMl: number;
  iconEmoji: string;
}

export interface HydrationCalculationResult {
  recommendedGoalMl: number;
  recommendedGlasses: number;
  baselineMl: number;
  activityAdditionMl: number;
  climateAdditionMl: number;
  explanation: string;
}

export const activityOptions: ActivityLevelOption[] = [
  {
    id: 'sedentary',
    titleFa: 'کم‌تحرک',
    descriptionFa: 'کار پشت میز، فعالیت بدنی حداقل',
    additionMl: 0,
    iconEmoji: '🪑',
  },
  {
    id: 'moderate',
    titleFa: 'معتدل',
    descriptionFa: 'پیاده‌روی روزانه یا ورزش سبک ۱ تا ۳ روز در هفته',
    additionMl: 350,
    iconEmoji: '🚶',
  },
  {
    id: 'active',
    titleFa: 'پرتحرک',
    descriptionFa: 'ورزش منظم یا کار با تحرک بدنی بالا',
    additionMl: 700,
    iconEmoji: '🏃',
  },
  {
    id: 'very_active',
    titleFa: 'ورزشکار حرفه‌ای',
    descriptionFa: 'تمرینات شدید روزانه یا کار فیزیکی سنگین',
    additionMl: 1050,
    iconEmoji: '🏋️',
  },
];

export const climateOptions: ClimateOption[] = [
  {
    id: 'cold',
    titleFa: 'سرد / خنک',
    descriptionFa: 'دمای پایین، تعریق ناچیز',
    additionMl: 0,
    iconEmoji: '❄️',
  },
  {
    id: 'temperate',
    titleFa: 'معتدل و مطبوع',
    descriptionFa: 'هوای نرمال بهاری یا تهویه مناسب',
    additionMl: 150,
    iconEmoji: '🌤️',
  },
  {
    id: 'warm_dry',
    titleFa: 'گرم و خشک',
    descriptionFa: 'تبخیر سطحی بالا و نیاز به آبرسانی بیشتر',
    additionMl: 400,
    iconEmoji: '🏜️',
  },
  {
    id: 'hot_humid',
    titleFa: 'بسیار گرم / شرجی',
    descriptionFa: 'تابستان داغ یا محیط مرطوب با تعریق شدید',
    additionMl: 650,
    iconEmoji: '🌴',
  },
];

export const HydrationGoalCalculator = {
  calculate(weightKg: number, activityLevelId: string, climateId: string): HydrationCalculationResult {
    const safeWeight = Math.min(200, Math.max(30, weightKg));
    const baseline = Math.round(safeWeight * 35);

    const selectedActivity = activityOptions.find((a) => a.id.toLowerCase() === activityLevelId.toLowerCase()) || activityOptions[1];
    const selectedClimate = climateOptions.find((c) => c.id.toLowerCase() === climateId.toLowerCase()) || climateOptions[1];

    const rawTotal = baseline + selectedActivity.additionMl + selectedClimate.additionMl;
    const rounded = Math.round((rawTotal + 50) / 100) * 100;
    const clampedGoal = Math.min(4500, Math.max(1200, rounded));
    const glasses = Math.round((clampedGoal + 125) / 250);

    let explanation = `بر اساس وزن ${Math.round(safeWeight)} کیلوگرم، نیاز پایه‌ای بدن شما ${baseline} میلی‌لیتر است. `;
    if (selectedActivity.additionMl > 0) {
      explanation += `برای سطح تحرک «${selectedActivity.titleFa}» (${selectedActivity.additionMl}+ میلی‌لیتر) `;
    }
    if (selectedClimate.additionMl > 0) {
      explanation += `و اقلیم «${selectedClimate.titleFa}» (${selectedClimate.additionMl}+ میلی‌لیتر) به آن افزوده شد.`;
    }

    return {
      recommendedGoalMl: clampedGoal,
      recommendedGlasses: glasses,
      baselineMl: baseline,
      activityAdditionMl: selectedActivity.additionMl,
      climateAdditionMl: selectedClimate.additionMl,
      explanation,
    };
  },
};

export interface AlgorithmCalculationResult {
  dailyWaterGoalMl: number;
  recommendedGlasses: number;
  recommendedIntervalMinutes: number;
  explanation: string;
}

export const WaterCalculationAlgorithm = {
  calculateDailyGoal(
    weightKg: number,
    heightCm: number,
    age: number,
    gender: string,
    wakeUpTime = '08:00',
    sleepTime = '23:00',
    activityLevel = 'moderate',
    climate = 'temperate'
  ): AlgorithmCalculationResult {
    const safeWeight = weightKg <= 0 ? 70 : Math.min(250, Math.max(30, weightKg));
    const safeHeight = heightCm <= 0 ? 170 : Math.min(230, Math.max(100, heightCm));
    const safeAge = age <= 0 ? 25 : Math.min(100, Math.max(10, age));

    let mlPerKg = 35.0;
    if (safeAge < 18) {
      mlPerKg = 35.0;
    } else if (safeAge <= 55) {
      mlPerKg = 35.0;
    } else if (safeAge <= 65) {
      mlPerKg = 32.0;
    } else {
      mlPerKg = 30.0;
    }

    let totalMl = safeWeight * mlPerKg;

    const g = gender.toLowerCase();
    if (g === 'male' || g === 'مرد') {
      totalMl += 250;
    } else if (g === 'female' || g === 'زن') {
      totalMl += 0;
    } else {
      totalMl += 100;
    }

    if (safeHeight > 180) {
      totalMl += 150;
    } else if (safeHeight < 155) {
      totalMl -= 100;
    }

    const activityBonusMap: Record<string, number> = {
      sedentary: 0,
      moderate: 350,
      active: 700,
      very_active: 1050,
    };
    totalMl += activityBonusMap[activityLevel.toLowerCase()] ?? 350;

    const climateBonusMap: Record<string, number> = {
      cold: 0,
      temperate: 150,
      warm_dry: 400,
      hot_humid: 650,
    };
    totalMl += climateBonusMap[climate.toLowerCase()] ?? 150;

    const finalGoalMl = Math.min(4500, Math.max(1200, Math.round(totalMl / 50.0) * 50));
    const glasses = Math.round(finalGoalMl / 250.0);

    const awakeHours = this.calculateAwakeHours(wakeUpTime, sleepTime);
    const calculatedInterval = Math.min(120, Math.max(30, Math.round((awakeHours * 60) / Math.max(1, glasses))));

    const explanation = `بر اساس وزن ${Math.round(safeWeight)} کیلوگرم، قد ${Math.round(safeHeight)} سانتی‌متر، سن ${safeAge} سال، تحرک و اقلیم، مصرف روزانه ${finalGoalMl} میلی‌لیتر (${glasses} لیوان) برای هیدراتاسیون کامل بدن شما پیشنهاد می‌شود.`;

    return {
      dailyWaterGoalMl: finalGoalMl,
      recommendedGlasses: glasses,
      recommendedIntervalMinutes: calculatedInterval,
      explanation,
    };
  },

  calculateAwakeHours(wakeUpTime: string, sleepTime: string): number {
    try {
      const [wH, wM] = wakeUpTime.split(':').map((s) => parseInt(s.trim(), 10));
      const [sH, sM] = sleepTime.split(':').map((s) => parseInt(s.trim(), 10));
      const wakeMinutes = wH * 60 + wM;
      let sleepMinutes = sH * 60 + sM;
      if (sleepMinutes <= wakeMinutes) {
        sleepMinutes += 24 * 60;
      }
      return (sleepMinutes - wakeMinutes) / 60.0;
    } catch {
      return 15.0;
    }
  },
};
