import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Layers, BarChart as BarIcon, Activity, Droplet } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toPersianDigits } from '../utils/persian';

type ChartType = 'line' | 'area' | 'bar';

export const RechartsTrendScreen: React.FC = () => {
  const { weeklyReport, profile } = useApp();
  const [chartType, setChartType] = useState<ChartType>('line');

  const goalMl = profile.dailyWaterGoalMl || 2000;

  // Transform data for recharts
  const chartData = weeklyReport.days.map((d) => ({
    name: d.dayName,
    fullDate: d.fullDate,
    amountMl: d.amountMl,
    goalMl: d.goalMl,
    isToday: d.isToday,
  }));

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = Math.round((data.amountMl / goalMl) * 100);
      const glasses = (data.amountMl / 250).toFixed(1);
      return (
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl text-center border border-slate-700 text-xs">
          <div className="font-extrabold mb-1 text-slate-200">{data.fullDate}</div>
          <div className="text-sky-400 font-black text-sm">
            💧 {toPersianDigits(data.amountMl)} میلی‌لیتر
          </div>
          <div className="text-slate-400 text-[11px] mt-0.5">
            ({toPersianDigits(glasses)} لیوان)
          </div>
          <div className={`mt-1 font-bold text-[11px] ${pct >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {pct >= 100 ? '✅ تحقق ۱۰۰٪ هدف' : `${toPersianDigits(pct)}٪ از هدف روزانه`}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                روند خطی و پیوسته Recharts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                موتور تحلیلی Recharts با رندر دقیق برداری
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-bold">
            هدف: {toPersianDigits(goalMl)} ml
          </span>
        </div>
      </div>

      {/* Chart Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
        {/* Type Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mb-4 text-xs font-bold">
          <button
            onClick={() => setChartType('line')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              chartType === 'line'
                ? 'bg-sky-600 text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>خطی (Line)</span>
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              chartType === 'area'
                ? 'bg-sky-600 text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>موجی (Area)</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              chartType === 'bar'
                ? 'bg-sky-600 text-white shadow-xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BarIcon className="w-3.5 h-3.5" />
            <span>میله‌ای (Bar)</span>
          </button>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 2800]}
                  tickFormatter={(val) => toPersianDigits(val)}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={goalMl}
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `هدف (${toPersianDigits(goalMl)})`,
                    position: 'insideTopLeft',
                    fill: '#10B981',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amountMl"
                  stroke="#0284C7"
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: '#FFFFFF', stroke: '#0284C7', strokeWidth: 2.5 }}
                  activeDot={{ r: 7, fill: '#0284C7', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </LineChart>
            ) : chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 2800]}
                  tickFormatter={(val) => toPersianDigits(val)}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={goalMl}
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `هدف (${toPersianDigits(goalMl)})`,
                    position: 'insideTopLeft',
                    fill: '#10B981',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amountMl"
                  stroke="#0284C7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#areaFill)"
                />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#0284C7" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 2800]}
                  tickFormatter={(val) => toPersianDigits(val)}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={goalMl}
                  stroke="#10B981"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `هدف (${toPersianDigits(goalMl)})`,
                    position: 'insideTopLeft',
                    fill: '#10B981',
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
                <Bar dataKey="amountMl" fill="url(#barFill)" radius={[8, 8, 0, 0]} maxBarSize={36} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span className="font-semibold">آب مصرفی (میلی‌لیتر)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold">آستانه هدف روزانه</span>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900 flex items-start gap-3">
        <Droplet className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          با لمس هر نقطه یا ستون از نمودار، اطلاعات تفصیلی شامل حجم دقیق، تعداد لیوان و درصد تحقق هدف همان روز را مشاهده نمایید.
        </p>
      </div>
    </div>
  );
};
