"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-purple-900 text-white flex flex-col">
      {/* TOP SECTION */}
      <div className="p-6">
        <h1 className="text-xl font-bold mb-8">Musify</h1>

        <nav className="space-y-2 text-sm">
          <SidebarLink href="/" label="Home" pathname={pathname} />
          <SidebarLink href="/search" label="Search" pathname={pathname} />
          <SidebarLink href="/liked" label="Liked Songs" pathname={pathname} />
          <SidebarLink href="/playlists" label="Playlists" pathname={pathname} />
          <SidebarLink href="/artists" label="Artists / Albums" pathname={pathname} />
          <SidebarLink href="/recent" label="Recent Plays" pathname={pathname} />
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="mt-auto p-6">
        <SidebarLink href="/settings" label="Settings" pathname={pathname} />
      </div>
    </aside>
  );
}

function SidebarLink({ href, label, pathname }) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md transition-colors
        ${
          isActive
            ? "bg-white/20 font-semibold"
            : "hover:bg-white/10"
        }
      `}
    >
      {label}
    </Link>
  );
}
