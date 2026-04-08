"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BookOpen, TrendingUp, Clock, Brain } from "lucide-react";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const t = useTranslations('Landing');

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 relative w-full overflow-hidden">
      {/* Header with Switcher */}
      <div className="w-full flex justify-end mb-16 relative z-20">
         <LanguageSwitcher />
      </div>

      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-blue/20 rounded-full blur-[100px] -z-10" />
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl w-full z-10"
      >
        <motion.div variants={item} className="mb-6 mx-auto w-fit flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <Brain className="w-5 h-5 text-neon-pink" />
          <span className="text-sm font-medium text-gray-200">{t('badge')}</span>
        </motion.div>

        <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-center">
          {t('title_start')} <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-[var(--primary-gradient)]">
            {t('title_highlight')}
          </span>
        </motion.h1>

        <motion.p variants={item} className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto text-center">
          {t('subtitle')}
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-14 text-lg px-8">
              {t('cta_start')}
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 text-lg px-8">
              {t('cta_login')}
            </Button>
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
          
          <motion.div variants={item} className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center mb-4 text-neon-purple">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t('feature_1_title')}</h3>
            <p className="text-gray-400">{t('feature_1_desc')}</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center mb-4 text-neon-pink">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t('feature_2_title')}</h3>
            <p className="text-gray-400">{t('feature_2_desc')}</p>
          </motion.div>

          <motion.div variants={item} className="glass-card p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center mb-4 text-neon-blue">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t('feature_3_title')}</h3>
            <p className="text-gray-400">{t('feature_3_desc')}</p>
          </motion.div>

        </motion.div>
      </motion.div>
    </main>
  );
}
