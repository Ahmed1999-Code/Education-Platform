import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay } from "date-fns";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subjectId, durationMinutes, pomodoroCount } = body;

    if (!subjectId || !durationMinutes || pomodoroCount === undefined) {
      return new NextResponse("Missing Information", { status: 400 });
    }

    const userId = session.user.id as string;

    // 1. Create the Study Session
    const studySession = await prisma.studySession.create({
      data: {
        userId,
        subjectId,
        durationMinutes,
        pomodoroCount,
      }
    });

    // 2. Fetch current user data for XP and Streak calculations
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // 3. Calculate updates
    const xpGained = pomodoroCount * 50; // 50 XP per Pomodoro
    const newXp = (user.xp || 0) + xpGained;
    const newLevel = Math.floor(newXp / 1000) + 1;

    let newStreak = user.currentStreak || 0;
    const today = startOfDay(new Date());
    const lastStudy = user.lastStudyDate ? startOfDay(user.lastStudyDate) : null;

    if (!lastStudy) {
      newStreak = 1; // First time studying
    } else {
      const diffTime = Math.abs(today.getTime() - lastStudy.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        newStreak += 1; // Studied yesterday, increment streak
      } else if (diffDays > 1) {
        newStreak = 1; // Streak broken, restart at 1
      }
      // If diffDays === 0, they already studied today, keep streak the same
    }

    // 4. Update the User
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel,
        currentStreak: newStreak,
        lastStudyDate: new Date()
      }
    });

    return NextResponse.json(studySession);
    
  } catch (error: any) {
    console.error("STUDY_SESSION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
