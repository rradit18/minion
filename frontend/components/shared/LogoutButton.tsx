"use client";

import { useRouter } from "next/navigation";
import { clearSession } from "@/src/lib/localStorage";

interface LogoutButtonProps {
  variant?: "light" | "dark";
}

export default function LogoutButton({ variant = "light" }: LogoutButtonProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  const base = "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors";
  const styles = {
    light: `${base} text-gray-500 hover:text-red-500 hover:bg-red-50`,
    dark:  `${base} text-gray-400 hover:text-white hover:bg-white/10`,
  };

  return (
    <button onClick={handleLogout} className={styles[variant]} aria-label="Keluar">
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span className="hidden sm:inline">Keluar</span>
    </button>
  );
}
