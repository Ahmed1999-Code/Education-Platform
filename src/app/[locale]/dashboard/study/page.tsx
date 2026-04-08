"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Play, Pause, RotateCcw, Brain, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function StudyPage() {
  const t = useTranslations("Study");
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [sessionSaved, setSessionSaved] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/subjects");
        if (response.ok) {
          const data = await response.json();
          setSubjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = async () => {
    setIsActive(false);

    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play();
    } catch (e) {
      console.error(e);
    }

    if (!isBreak) {
      setPomodorosCompleted((p) => p + 1);
      setTimeLeft(BREAK_TIME);
      setIsBreak(true);

      if (selectedSubject) {
        try {
          const res = await fetch("/api/study", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subjectId: selectedSubject,
              durationMinutes: 25,
              pomodoroCount: 1,
            }),
          });
          if (res.ok) {
            setSessionSaved(true);
            setTimeout(() => setSessionSaved(false), 3000);
          }
        } catch (error) {
          console.error("Failed to save study session:", error);
        }
      }
    } else {
      setTimeLeft(WORK_TIME);
      setIsBreak(false);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(WORK_TIME);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = isBreak
    ? ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100
    : ((WORK_TIME - timeLeft) / WORK_TIME) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">

      {/* Subject Selector */}
      <div className="w-full max-w-md mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">{t("subject_label")}</label>
        <select
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:ring-2 focus:ring-neon-purple focus:outline-none"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">{t("subject_placeholder")}</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        {!selectedSubject && (
          <p className="text-xs text-gray-500 mt-2">{t("select_subject_hint")}</p>
        )}
      </div>

      {/* Session Saved Toast */}
      {sessionSaved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-sm font-medium flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" /> {t("session_saved")}
        </motion.div>
      )}

      {/* Timer Ring */}
      <motion.div
        className="relative w-72 h-72 md:w-96 md:h-96 rounded-full flex items-center justify-center"
        animate={{ scale: isActive ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 -z-10 ${isBreak ? "bg-neon-blue" : "bg-neon-purple"}`} />

        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle cx="50%" cy="50%" r="48%" className="stroke-white/5 fill-none" strokeWidth="4" />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            className={`fill-none ${isBreak ? "stroke-neon-blue" : "stroke-neon-purple"}`}
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ strokeDasharray: "300%", strokeDashoffset: "300%" }}
            animate={{ strokeDashoffset: `${300 - progress * 3}%` }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        <div className="text-center z-10 glass-card w-full h-full rounded-full flex flex-col items-center justify-center border-4 border-white/5">
          <p className={`text-sm font-semibold tracking-wider uppercase mb-2 ${isBreak ? "text-neon-blue" : "text-neon-purple"}`}>
            {isBreak ? t("break_title") : t("title")}
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-4">
            {formatTime(timeLeft)}
          </h1>

          <div className="flex gap-4">
            <Button
              variant={isActive ? "secondary" : "primary"}
              className={`w-14 h-14 rounded-full p-0 flex items-center justify-center ${!isActive && !isBreak && "bg-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.4)]"} ${!isActive && isBreak && "bg-neon-blue shadow-[0_0_20px_rgba(59,130,246,0.4)]"}`}
              onClick={toggleTimer}
            >
              {isActive ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
            </Button>

            <Button
              variant="outline"
              className="w-14 h-14 rounded-full p-0 flex items-center justify-center border-white/10 hover:bg-white/5"
              onClick={resetTimer}
            >
              <RotateCcw className="w-5 h-5 text-gray-300" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <div className="mt-12 flex items-center gap-6 glass-card px-8 py-4 rounded-full border-white/10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-neon-pink" />
          <span className="text-gray-300 font-medium">
            {t("pomodoros_label")}: <span className="text-white font-bold">{pomodorosCompleted}</span>
          </span>
        </div>
        <div className="w-px h-6 bg-white/10" />
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-neon-purple" />
          <span className="text-gray-300 font-medium">
            {t("xp_label")}: <span className="text-white font-bold">+{pomodorosCompleted * 50}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
