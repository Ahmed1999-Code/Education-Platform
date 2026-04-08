"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";

export default function NewSubjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    difficulty: "3",
    totalHoursRequired: "",
    weeklyGoalHours: "",
    priority: "3",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        alert("Failed to create subject.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto pb-10">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-neon-purple" /> Add New Subject
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Define a new course or topic to track your study progress.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Course / Subject Name"
                placeholder="e.g. Advanced Mathematics"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
                Difficulty Level (1-5)
              </label>
              <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setData({ ...data, difficulty: level.toString() })}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      data.difficulty === level.toString()
                        ? "bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5 ml-1">
                Priority (1-5)
              </label>
              <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setData({ ...data, priority: level.toString() })}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                      data.priority === level.toString()
                        ? "bg-accent text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Total Estimate Hours Required"
              type="number"
              min="1"
              step="0.5"
              placeholder="e.g. 40"
              value={data.totalHoursRequired}
              onChange={(e) => setData({ ...data, totalHoursRequired: e.target.value })}
              required
            />

            <Input
              label="Weekly Goal (Hours)"
              type="number"
              min="0.5"
              step="0.5"
              placeholder="e.g. 5"
              value={data.weeklyGoalHours}
              onChange={(e) => setData({ ...data, weeklyGoalHours: e.target.value })}
              required
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" size="lg" isLoading={loading} className="w-full md:w-auto px-10">
              Save Subject
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
