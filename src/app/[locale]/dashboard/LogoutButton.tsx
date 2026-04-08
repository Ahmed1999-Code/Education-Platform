"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/en/login' })}
      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-gray-300 hover:text-red-400 group w-full text-left"
    >
      <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
      <span className="font-medium">Logout</span>
    </button>
  );
}
