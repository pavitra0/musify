"use client";

import React from "react";

interface SectionProps {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  actionLabel,
  onActionClick,
  children
}) => {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">
          {title}
        </h2>
        {actionLabel && onActionClick && (
          <button
            onClick={onActionClick}
            className="text-xs md:text-sm font-medium text-purple-300 hover:text-purple-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition"
          >
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
};

export default Section;


