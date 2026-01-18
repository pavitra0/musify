"use client";

import React from "react";
import {
  Home,
  Search,
  Heart,
  ListMusic,
  Disc3,
  Mic2,
  History,
  Settings,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Liked Songs", icon: Heart, href: "/liked" },
  { label: "Playlists", icon: ListMusic, href: "/playlists" },
  { label: "Albums", icon: Disc3, href: "/albums" },
  { label: "Artists", icon: Mic2, href: "/artists" },
  { label: "Recent", icon: History, href: "/recent" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  const handleNavigation = (href: string) => {
    router.push(href);
    close(); // Close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-50 flex flex-col w-60 lg:w-64 shrink-0 border-r border-white/5 bg-gradient-to-b from-black/80 via-neutral-950/80 to-neutral-950/95 backdrop-blur-xl px-4 py-5 gap-6 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-2 px-1">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-400 to-cyan-400 flex items-center justify-center text-xs font-bold tracking-wider">
            <Link href="/">
              <Image
                src="/favicon-32x32.png"
                alt="Musify"
                width={32}
                height={32}
                className="text-white cursor-pointer"
              />
            </Link>
          </div>
          <span className="text-xl font-semibold text-white/80">Musify</span>
        </div>

        <nav className="flex-1 space-y-1 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className={`w-full cursor-pointer flex items-center gap-3 px-2 py-2 rounded-md text-left transition ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
