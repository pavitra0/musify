"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import NowPlayingBar from "@/components/NowPlayingBar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { Settings as SettingsIcon } from "lucide-react";

function SettingsPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-neutral-950 to-black text-white flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center">
                  <SettingsIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Settings</h1>
                  <p className="text-gray-400">Manage your preferences</p>
                </div>
              </div>

              <div className="bg-neutral-900/60 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Dark Mode</span>
                      <span className="text-gray-500 text-sm">Always on</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h2 className="text-xl font-semibold mb-4">Audio</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Audio Quality</span>
                      <span className="text-gray-500 text-sm">High</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <div className="space-y-2 text-gray-400">
                    <p>Musify Music Streaming App</p>
                    <p className="text-sm">Version 1.0.0</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        <NowPlayingBar />
      </div>
    </SidebarProvider>
  );
}

export default SettingsPage;

