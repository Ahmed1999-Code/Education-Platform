import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { startOfDay, subDays, format, isSameDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // 1. Fetch user data for streak and XP
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studySubjects: {
          include: {
            studySessions: true
          }
        },
        studySessions: true
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // 2. Calculate Weekly Activity (Last 7 Days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: startOfDay(date),
        name: format(date, 'eee'),
        hours: 0
      };
    });

    user.studySessions.forEach(session => {
      const sessionDate = startOfDay(new Date(session.date));
      const dayData = last7Days.find(d => isSameDay(d.date, sessionDate));
      if (dayData) {
        dayData.hours += session.durationMinutes / 60;
      }
    });

    const weeklyData = last7Days.map(d => ({
      name: d.name,
      hours: parseFloat(d.hours.toFixed(1))
    }));

    // 3. Calculate Subject Data (Progress)
    const subjectData = user.studySubjects
      .map(subject => {
        const totalMinutes = subject.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
        const progress = subject.weeklyGoalHours > 0 
          ? Math.min(Math.round((totalMinutes / 60 / subject.weeklyGoalHours) * 100), 100)
          : 0;
        
        return {
          name: subject.name,
          progress,
          difficulty: subject.difficulty,
          totalHours: parseFloat((totalMinutes / 60).toFixed(1))
        };
      })
      .filter(s => s.totalHours > 0); // Only subjects with real study sessions

    // 4. Calculate Top Stats
    const totalMinutes = user.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalPomodoros = user.studySessions.reduce((acc, s) => acc + s.pomodoroCount, 0);
    
    // Simple completion rate: subjects that hit >50% of weekly goal
    const completedSubjects = subjectData.filter(s => s.progress >= 50).length;
    const completionRate = user.studySubjects.length > 0 
      ? Math.round((completedSubjects / user.studySubjects.length) * 100)
      : 0;

    // 5. AI Insights (Basic Logic)
    let aiInsight = {
      warning: "You're off to a great start!",
      recommendations: ["Keep consistent with your daily goals."]
    };

    const lowProgressSubject = user.studySubjects
      .map(subject => {
        const totalMinutes = subject.studySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
        const progress = subject.weeklyGoalHours > 0 
          ? (totalMinutes / 60 / subject.weeklyGoalHours) * 100
          : 0;
        return { ...subject, progress };
      })
      .find(s => s.progress < 30 && s.difficulty >= 4);

    if (lowProgressSubject) {
      aiInsight = {
        warning: `You've only completed ${Math.round(lowProgressSubject.progress)}% of your ${lowProgressSubject.name} goal, but it's a high-difficulty subject.`,
        recommendations: [
          `Do 2 Pomodoros of ${lowProgressSubject.name} before taking a break.`,
          `Focus on ${lowProgressSubject.name} while your energy is highest.`
        ]
      };
    }

    return NextResponse.json({
      weeklyData,
      subjectData,
      stats: {
        totalHours: parseFloat((totalMinutes / 60).toFixed(1)),
        completionRate,
        totalPomodoros,
        streak: user.currentStreak
      },
      aiInsight
    });

  } catch (error) {
    console.error("STATS_API_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
