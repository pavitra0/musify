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
    <header className="relative flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-white/5 bg-linear-to-b from-neutral-900/80 via-neutral-950/80 to-black/80 backdrop-blur-md z-40">
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="md:hidden inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800/80 border border-white/10 text-white/80 hover:bg-neutral-700/80 hover:border-purple-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 max-w-xl">
        <SearchBar />
      </div>
    </header>
  );
};

export default Navbar;
