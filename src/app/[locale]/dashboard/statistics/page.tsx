"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Brain, Clock, Target, Flame } from "lucide-react";
import { useTranslations } from "next-intl";

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

export default function StatisticsPage() {
  const t = useTranslations("Statistics");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">{t("loading")}</p>
      </div>
    );
  }

  if (!data) return null;

  const { weeklyData, subjectData, stats, aiInsight } = data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/10 rounded-xl bg-black/80 backdrop-blur-md">
          <p className="font-semibold text-white mb-1">{label}</p>
          <p className="text-neon-purple text-sm font-medium">
            {payload[0].value}h
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Target className="w-8 h-8 text-accent" />
          {t("title")}
        </h1>
        <p className="text-gray-400">{t("subtitle")}</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <h3 className="font-medium text-gray-400 mb-1">{t("total_hours")}</h3>
          <p className="text-3xl font-bold text-white mb-2">
            {stats.totalHours}<span className="text-sm text-gray-400 font-normal">h</span>
          </p>
          <div className="flex items-center text-sm text-emerald-400">
            <TrendingUpIcon className="w-4 h-4 mr-1" /> {t("real_activity")}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <h3 className="font-medium text-gray-400 mb-1">{t("completion_rate")}</h3>
          <p className="text-3xl font-bold text-white mb-2">
            {stats.completionRate}<span className="text-sm text-gray-400 font-normal">%</span>
          </p>
          <div className="flex items-center text-sm text-neon-pink">
            <Target className="w-4 h-4 mr-1" /> {t("goal_progress")}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <h3 className="font-medium text-gray-400 mb-1">{t("pomodoros_total")}</h3>
          <p className="text-3xl font-bold text-white mb-2">{stats.totalPomodoros}</p>
          <div className="flex items-center text-sm text-neon-purple">
            <Clock className="w-4 h-4 mr-1" /> {t("focus_sessions")}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
          <h3 className="font-medium text-gray-400 mb-1">{t("current_streak")}</h3>
          <p className="text-3xl font-bold text-white mb-2">
            {stats.streak}<span className="text-sm text-gray-400 font-normal"> {t("days")}</span>
          </p>
          <div className="flex items-center text-sm text-orange-400">
            <Flame className="w-4 h-4 mr-1" /> {t("daily_consistency")}
          </div>
        </div>
      </div>

      {/* Chart + AI Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

        <div className="glass-card p-6 rounded-3xl lg:col-span-2 relative">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">{t("weekly_activity")}</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-purple)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--neon-purple)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="var(--neon-purple)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-neon-pink/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-neon-pink" />
            </div>
            <h2 className="text-xl font-bold text-white">{t("ai_analysis")}</h2>
          </div>

          <div className="space-y-6 flex-1 relative z-10">
            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <h4 className="text-sm font-semibold text-neon-pink mb-2 uppercase tracking-wider">{t("insights")}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{aiInsight.warning}</p>
            </div>

            <div className="bg-black/30 rounded-xl p-4 border border-white/5">
              <h4 className="text-sm font-semibold text-neon-blue mb-2 uppercase tracking-wider">{t("recommendations")}</h4>
              <ul className="text-sm text-gray-300 space-y-3">
                {aiInsight.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-blue mt-1.5 shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      {subjectData.length > 0 && (
        <div className="glass-card p-6 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6">{t("subject_progress")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjectData.map((subject: any) => (
              <div key={subject.name} className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-white font-medium truncate">{subject.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{subject.progress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-neon-purple to-neon-blue"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
