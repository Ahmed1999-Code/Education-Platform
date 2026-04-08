"use client";

import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  const t = useTranslations('Settings');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center">
          <Settings className="w-6 h-6 text-neon-purple" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
          <p className="text-gray-400">{t('description')}</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h2 className="text-xl font-semibold text-white mb-4">{t('language_preferences')}</h2>
        <div className="max-w-xs">
          <LanguageSwitcher />
        </div>
      </motion.div>
    </div>
  );
}
