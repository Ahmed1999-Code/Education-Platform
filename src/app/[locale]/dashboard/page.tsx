import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { Plus, Flame, Clock, Target, Calendar, BookOpen, Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  // Fetch user stats and subjects with their sessions
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      studySubjects: {
        include: {
          studySessions: true
        }
      },
      studySessions: {
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)) // Today's sessions
          }
        }
      }
    }
  });

  const subjects = user?.studySubjects || [];
  const todaySessions = user?.studySessions || [];
  
  // Calculate today's stats
  const totalMinutesToday = todaySessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalPomodorosToday = todaySessions.reduce((acc, curr) => acc + curr.pomodoroCount, 0);
  
  const hours = Math.floor(totalMinutesToday / 60);
  const minutes = totalMinutesToday % 60;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {session?.user?.name?.split(' ')[0]}</h1>
          <p className="text-gray-400">Here's your study overview for today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass-card px-4 py-2 flex items-center gap-2 rounded-xl border-orange-500/20">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-orange-400">{user?.currentStreak || 0} Day Streak</span>
          </div>
          <Link href="/dashboard/study">
            <Button className="h-10 px-6 bg-neon-purple hover:bg-neon-purple/90 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              Start Studying
            </Button>
          </Link>
        </div>
      </div>

      {/* Daily Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue/10 rounded-full blur-xl -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-medium text-gray-400">Today's Study Time</h3>
            <Clock className="w-5 h-5 text-neon-blue" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-white mb-1">
            {hours}h {minutes}m
          </p>
          <p className="text-sm text-neon-blue/80 flex items-center gap-1">
             <Target className="w-4 h-4"/> Daily goal: 3h 0m
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-pink/10 rounded-full blur-xl -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-medium text-gray-400">Pomodoros Completed</h3>
            <Target className="w-5 h-5 text-neon-pink" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-white mb-1">
            {totalPomodorosToday}
          </p>
          <p className="text-sm text-neon-pink/80 flex items-center gap-1">
            Sessions today
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-xl -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-medium text-gray-400">Total XP</h3>
            <Flame className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold tracking-tight text-white mb-1">
            {user?.xp || 0}
          </p>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
            <div className="bg-accent h-1.5 rounded-full" style={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">Next level: {((Math.floor((user?.xp || 0)/1000) + 1) * 1000) - (user?.xp || 0)} XP</p>
        </div>
      </div>

      {/* Subjects Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Subjects</h2>
          <Link href="/dashboard/subjects/new">
            <Button variant="outline" size="sm" className="hidden border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10 md:flex">
              <Plus className="w-4 h-4 mr-2" /> Add Subject
            </Button>
          </Link>
        </div>

        {subjects.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-2 border-white/20">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">No subjects added yet</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">Create your first subject to start tracking your syllabus and managing your study goals.</p>
            <Link href="/dashboard/subjects/new">
              <Button>Add Your First Subject</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              // Calculate real progress based on sessions
              const totalMinutes = subject.studySessions.reduce((acc: number, s: any) => acc + s.durationMinutes, 0);
              const progress = subject.weeklyGoalHours > 0 
                ? Math.min(Math.round((totalMinutes / 60 / subject.weeklyGoalHours) * 100), 100)
                : 0;
              
              return (
                <div key={subject.id} className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                  <div className="absolute top-0 right-0 p-4">
                     <span className="text-xs font-semibold px-2 py-1 rounded bg-black/40 border border-white/10 text-gray-300">
                        Priority: {subject.priority}
                     </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 pr-16">{subject.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-1"><Target className="w-4 h-4"/> {subject.weeklyGoalHours}h / week</span>
                    <span className="flex items-center gap-1"><Brain className="w-4 h-4"/> Diff: {subject.difficulty}/5</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Weekly Progress</span>
                      <span className="font-medium text-white">{progress}%</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/5">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-pink" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
