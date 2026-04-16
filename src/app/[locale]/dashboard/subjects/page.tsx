import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { Plus, BookOpen, Clock, Target, BarChart, Settings, Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Next.js Server Component
export default async function SubjectsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return <div>Unauthorized</div>;
  }

  const subjects = await prisma.subject.findMany({
    where: { userId: session.user.id },
    include: {
      studySessions: true,
    },
    orderBy: { priority: 'desc' }
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subject Management</h1>
          <p className="text-gray-400">Organize your study topics, set goals, and track your progress.</p>
        </div>
        
        <Link href="/dashboard/subjects/new">
          <Button className="h-10 px-6 bg-neon-purple hover:bg-neon-purple/90 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Plus className="w-5 h-5 mr-2" />
            Add New Subject
          </Button>
        </Link>
      </div>

      {subjects.length === 0 ? (
        <div className="glass-card p-16 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-2 border-white/20 mt-8">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
            <BookOpen className="w-10 h-10 text-neon-purple" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white">Your Syllabus is Empty</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-8 text-lg">
            Create your first subject to start organizing your study materials and tracking your progress.
          </p>
          <Link href="/dashboard/subjects/new">
            <Button size="lg" className="px-8 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Plus className="w-5 h-5 mr-2" />
              Create First Subject
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {subjects.map((subject) => {
            const totalMinutes = subject.studySessions.reduce((acc, session) => acc + session.durationMinutes, 0);
            const totalHours = totalMinutes / 60;
            
            const progressPercentage = subject.weeklyGoalHours > 0 
              ? Math.min(Math.round((totalHours / subject.weeklyGoalHours) * 100), 100) 
              : 0;
            
            return (
              <div 
                key={subject.id} 
                className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(168,85,247,0.2)] transition-all duration-300 border border-white/10"
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 transition-opacity group-hover:opacity-40"
                  style={{ backgroundColor: subject.color || '#a855f7' }}
                />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: `${subject.color || '#a855f7'}20`, color: subject.color || '#a855f7' }}
                  >
                    <BookOpen className="w-6 h-6" />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-black/40 border border-white/10 text-gray-300">
                      Pri: {subject.priority}
                    </span>
                    <button className="p-2 bg-black/20 hover:bg-black/40 rounded-lg text-gray-400 hover:text-white transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">{subject.name}</h3>
                
                <div className="flex flex-wrap gap-3 mb-6 relative z-10">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-secondary/50 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <Brain className="w-3.5 h-3.5 text-neon-blue" />
                    <span>Diff: {subject.difficulty}/5</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-secondary/50 px-2.5 py-1.5 rounded-lg border border-white/5">
                    <Target className="w-3.5 h-3.5 text-neon-pink" />
                    <span>{subject.weeklyGoalHours}h / wk</span>
                  </div>
                </div>
                
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Total Studied
                    </span>
                    <span className="font-medium text-white">{totalHours.toFixed(1)}h</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Weekly Progress</span>
                      <span className="font-medium text-white">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden border border-white/5">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out relative"
                        style={{ 
                          width: `${progressPercentage}%`,
                          backgroundColor: subject.color || '#a855f7',
                          boxShadow: `0 0 10px ${subject.color || '#a855f7'}` 
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
