"use client";

import {
  Brain,
  BookOpen,
  Sparkles,
  Settings,
  Bot,
  Menu,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

const navItems = [
  { label: "Check-In", icon: <Brain className="w-5 h-5" />, path: "/check-in" },
  {
    label: "Journal",
    icon: <BookOpen className="w-5 h-5" />,
    path: "/journal",
  },
  {
    label: "Sync Session",
    icon: <Sparkles className="w-5 h-5" />,
    path: "/sync",
  },
  {
    label: "Chat",
    icon: <Bot className="w-6 h-6" />,
    path: "/chat",
  },
];

export default function TopBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;
  };

  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 bg-white shadow-sm flex items-center justify-between">
      {/* Logo */}
      <Link href="/insights" className="text-2xl font-bold text-purple-600">
        SoulSync
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className={clsx(
              "flex items-center gap-1 text-lg font-semibold transition",
              pathname === item.path
                ? "text-purple-600"
                : "hover:text-purple-600"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <Link href="/settings">
            <Settings className="w-6 h-6 text-gray-700" />
          </Link>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition text-red-700 font-semibold"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden md:block text-sm font-medium">Logout</span>
        </button>
        {/* Mobile Menu Button */}
        <button
          className="block md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <Menu className="w-7 h-7 text-gray-700" />
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-start px-6 py-4 space-y-4 md:hidden z-50">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={clsx(
                "flex items-center gap-2 text-lg font-medium w-full",
                pathname === item.path
                  ? "text-purple-600"
                  : "text-gray-700 hover:text-purple-600"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
