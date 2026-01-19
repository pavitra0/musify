"use client";

import NowPlayingBar from "@/components/NowPlayingBar";
import MainSection from "@/components/MainSection";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

export default function HomePage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-neutral-950 to-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Navbar />
            <MainSection />
          </div>
        </div>
        <NowPlayingBar />
      </div>
    </SidebarProvider>
  );
}


