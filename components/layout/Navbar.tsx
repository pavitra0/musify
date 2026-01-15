"use client";

import React from "react";
import SearchBar from "../SearchBar";
import { UserCircle2, Menu, X } from "lucide-react";
import { useSidebar } from "./SidebarContext";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  const { toggle, isOpen } = useSidebar();

  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-white/5 bg-gradient-to-b from-neutral-900/80 via-neutral-950/80 to-black/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md bg-neutral-800/80 border border-white/10 text-white/80 hover:bg-neutral-700/80 hover:border-purple-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
        <span className="hidden sm:inline text-xl font-semibold text-white/80">
          Musify
        </span>
      </div>

      <div className="flex-1 max-w-xl">
        <SearchBar />
      </div>

      <button
        className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800/80 border border-white/10 text-white/80 hover:bg-neutral-700/80 hover:border-purple-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition"
        aria-label="Profile"
      >
        <UserCircle2 className="h-6 w-6" />
      </button>
    </header>
  );
};

export default Navbar;
