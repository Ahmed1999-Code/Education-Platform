import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Brain, LayoutDashboard, Clock, BookOpen, BarChart3, Settings, LogOut } from "lucide-react";
import { Link } from '@/i18n/routing';
import LogoutButton from "./LogoutButton";
import { getTranslations } from "next-intl/server";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  const t = await getTranslations('Dashboard');

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-x border-white/5 bg-secondary/30 flex flex-col hidden md:flex backdrop-blur-xl relative z-20" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-neon-purple" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-pink">
              SmartPlanner
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white group">
            <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-neon-blue" />
            <span className="font-medium">{t('nav_dashboard')}</span>
          </Link>
          <Link href="/dashboard/subjects" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white group">
            <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-neon-pink" />
            <span className="font-medium">{t('nav_subjects')}</span>
          </Link>
          <Link href="/dashboard/study" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white group">
            <Clock className="w-5 h-5 text-gray-400 group-hover:text-neon-purple" />
            <span className="font-medium">{t('nav_study')}</span>
          </Link>
          <Link href="/dashboard/statistics" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white group">
            <BarChart3 className="w-5 h-5 text-gray-400 group-hover:text-accent" />
            <span className="font-medium">{t('nav_statistics')}</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-white group">
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-neon-pink" />
            <span className="font-medium">{t('nav_settings')}</span>
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <div className="glass-card p-4 rounded-xl mb-4 bg-gradient-to-br from-secondary to-black flex items-center gap-4">
             <div>
                <p className="text-sm font-semibold text-white truncate max-w-[150px]">{session.user?.name}</p>
                <p className="text-xs text-neon-purple">Lv. {session.user?.level || 1} Scholar</p>
             </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar relative z-10">
          {children}
        </div>
      </main>

    </div>
  );
}
