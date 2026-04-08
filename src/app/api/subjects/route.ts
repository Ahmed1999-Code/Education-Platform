import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, difficulty, totalHoursRequired, weeklyGoalHours, priority } = body;

    if (!name || difficulty === undefined || !totalHoursRequired || !weeklyGoalHours || priority === undefined) {
      return new NextResponse("Missing Info", { status: 400 });
    }

    const subject = await prisma.subject.create({
      data: {
        userId: session.user.id as string,
        name,
        difficulty: parseInt(difficulty),
        totalHoursRequired: parseFloat(totalHoursRequired),
        weeklyGoalHours: parseFloat(weeklyGoalHours),
        priority: parseInt(priority)
      }
    });

    return NextResponse.json(subject);
    
  } catch (error: any) {
    console.error("SUBJECT_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subjects = await prisma.subject.findMany({
      where: { userId: session.user.id as string }
    });

    return NextResponse.json(subjects);
    
  } catch (error: any) {
    console.error("SUBJECT_GET_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
