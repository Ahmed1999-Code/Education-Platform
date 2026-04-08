"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";

export default function Login() {
  const router = useRouter();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (response?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -ml-10 -mt-10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-neon-blue/20 rounded-full blur-3xl -mr-10 -mb-10" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-neon-purple">
              Welcome Back
            </h1>
            <p className="text-zinc-400 mt-2">Login to your Smart Study Planner</p>
          </div>

          <form onSubmit={loginUser} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />

            {error && (
              <p className="text-red-400 text-sm font-medium text-center bg-red-500/10 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-6" isLoading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-neon-blue hover:text-neon-purple transition-colors duration-200">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
